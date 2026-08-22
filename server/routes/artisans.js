import { Router } from "express";
import { supabase, generateId } from "../supabase.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

const ALLOWED_PORTFOLIO_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

// Issues a short-lived signed upload URL for one portfolio image, scoped
// to the artisan's own folder. The browser uploads directly to Supabase
// Storage using this URL — the file never passes through our server, so
// Vercel's 4.5MB body limit never applies.
router.post("/portfolio/upload-url", requireAuth, requireRole("artisan"), async (req, res) => {
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    return res.status(400).json({ error: "fileName and fileType are required" });
  }
  if (!ALLOWED_PORTFOLIO_TYPES.includes(fileType)) {
    return res.status(400).json({ error: "Only JPEG, PNG, and WebP are allowed" });
  }

  try {
    const fileExt = fileType.split("/")[1];
    const imageId = generateId();
    const path = `${req.auth.id}/${imageId}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("portfolios")
      .createSignedUploadUrl(path);

    if (error) throw error;

    res.json({ path, imageId, signedUrl: data.signedUrl, token: data.token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to create upload URL" });
  }
});

// After the browser has uploaded files directly to Supabase Storage using
// the signed URLs above, it calls this with the resulting paths so we can
// record them as portfolio_images rows.
router.post("/portfolio/confirm", requireAuth, requireRole("artisan"), async (req, res) => {
  const { images } = req.body; // [{ path, imageId }]

  if (!Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: "No images to confirm", code: "VALIDATION_ERROR" });
  }

  const uploadedRecords = [];

  try {
    for (const { path, imageId } of images) {
      const { data: publicUrlData } = supabase.storage.from("portfolios").getPublicUrl(path);
      const url = publicUrlData.publicUrl;

      const { data: record, error: dbError } = await supabase
        .from("portfolio_images")
        .insert([{ id: imageId || generateId(), artisanId: req.auth.id, url }])
        .select()
        .single();

      if (!dbError && record) {
        uploadedRecords.push(record);
      }
    }

    res.json({ uploaded: uploadedRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while confirming portfolio images", code: "SERVER_ERROR" });
  }
});

export default router;