import { Router } from "express";
import { supabase, generateId } from "../supabase.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import multer from "multer";

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // 5MB limit, up to 5 files
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."));
    }
  }
});

function publicArtisan(u) {
  const { password, ...rest } = u;
  return rest;
}

// GET /api/artisans?trade=Electrician&area=Lekki&verified=true&minRating=4
router.get("/", async (req, res) => {
  const { trade, area, verified, minRating, q } = req.query;
  
  try {
    let query = supabase.from("users").select("*, portfolio_images(id, url)").eq("role", "artisan");

    if (trade) query = query.ilike("trade", trade);
    if (area) query = query.ilike("area", `%${area}%`);
    if (verified === "true") query = query.eq("verified", true);
    if (minRating) query = query.gte("rating", Number(minRating));
    
    if (q) {
      const needle = `%${q}%`;
      query = query.or(`fullName.ilike.${needle},trade.ilike.${needle},area.ilike.${needle}`);
    }

    const { data: artisans, error } = await query;
    if (error) throw error;

    const withPortfolios = artisans.map(a => ({
      ...publicArtisan(a),
      portfolio: a.portfolio_images || []
    }));
    withPortfolios.forEach(a => delete a.portfolio_images);

    res.json({ artisans: withPortfolios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { data: artisan, error } = await supabase
      .from("users")
      .select("*, portfolio_images(id, url)")
      .eq("id", req.params.id)
      .eq("role", "artisan")
      .single();

    if (error || !artisan) return res.status(404).json({ error: "Artisan not found" });
    
    const formatted = {
      ...publicArtisan(artisan),
      portfolio: artisan.portfolio_images || []
    };
    delete formatted.portfolio_images;

    res.json({ artisan: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/portfolio", requireAuth, requireRole("artisan"), upload.array("images", 5), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No image files provided", code: "VALIDATION_ERROR" });
  }

  const uploadedRecords = [];

  try {
    for (const file of req.files) {
      const fileExt = file.mimetype.split("/")[1];
      const imageId = generateId();
      const fileName = `${req.auth.id}/${imageId}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("portfolios")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (uploadError) {
        console.error("Portfolio image upload error:", uploadError);
        continue;
      }

      const { data: publicUrlData } = supabase.storage.from("portfolios").getPublicUrl(fileName);
      const url = publicUrlData.publicUrl;

      const { data: record, error: dbError } = await supabase
        .from("portfolio_images")
        .insert([{ id: imageId, artisanId: req.auth.id, url }])
        .select()
        .single();
        
      if (!dbError && record) {
        uploadedRecords.push(record);
      }
    }

    res.json({ uploaded: uploadedRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during portfolio upload", code: "SERVER_ERROR" });
  }
});

export default router;
