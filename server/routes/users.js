import { Router } from "express";
import { supabase, generateId } from "../supabase.js";
import { requireAuth } from "../middleware/auth.js";
import multer from "multer";

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."));
    }
  }
});

const EDITABLE_FIELDS = [
  "fullName", "phone", "address", "bio", "area", "hourlyRate", "yearsExperience",
  "bankName", "accountNumber", "accountName",
];

router.patch("/me", requireAuth, async (req, res) => {
  try {
    const updates = {};
    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (Object.keys(updates).length === 0) {
      const { data: user, error } = await supabase.from("users").select("*").eq("id", req.auth.id).single();
      if (error || !user) return res.status(404).json({ error: "User not found" });
      const { password, ...rest } = user;
      return res.json({ user: rest });
    }

    const { data: user, error: updateError } = await supabase.from("users").update(updates).eq("id", req.auth.id).select().single();
    if (updateError || !user) return res.status(404).json({ error: "User not found or update failed" });

    const { password, ...rest } = user;
    res.json({ user: rest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/avatar", requireAuth, upload.single("avatar"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided", code: "VALIDATION_ERROR" });
  }

  try {
    const fileExt = req.file.mimetype.split("/")[1];
    const fileName = `${req.auth.id}/${generateId()}.${fileExt}`;
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error("Avatar upload error:", uploadError);
      return res.status(500).json({ error: "Failed to upload avatar", code: "UPLOAD_FAILED" });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
    const avatarUrl = publicUrlData.publicUrl;

    // Update user record
    const { data: user, error: updateError } = await supabase
      .from("users")
      .update({ avatarUrl })
      .eq("id", req.auth.id)
      .select()
      .single();

    if (updateError) throw updateError;

    const { password, ...rest } = user;
    res.json({ user: rest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during avatar upload", code: "SERVER_ERROR" });
  }
});

export default router;
