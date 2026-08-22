import { Router } from "express";
import { supabase, generateId } from "../supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

const EDITABLE_FIELDS = [
  "fullName", "phone", "address", "bio", "area", "trade", "hourlyRate", "yearsExperience",
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

// Issues a short-lived signed upload URL for the artisan's avatar. The
// browser uploads the image directly to Supabase Storage using this URL
// — the file never passes through our server, so Vercel's 4.5MB body
// limit never applies.
router.post("/avatar/upload-url", requireAuth, async (req, res) => {
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    return res.status(400).json({ error: "fileName and fileType are required" });
  }
  if (!ALLOWED_AVATAR_TYPES.includes(fileType)) {
    return res.status(400).json({ error: "Only JPEG, PNG, and WebP are allowed" });
  }

  try {
    const fileExt = fileType.split("/")[1];
    const path = `${req.auth.id}/${generateId()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .createSignedUploadUrl(path);

    if (error) throw error;

    res.json({ path, signedUrl: data.signedUrl, token: data.token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to create upload URL" });
  }
});

// After the browser uploads the avatar directly to Supabase Storage using
// the signed URL above, it calls this with the resulting path so we can
// save the public avatar URL against the user's record.
router.post("/avatar/confirm", requireAuth, async (req, res) => {
  const { path } = req.body;

  if (!path) {
    return res.status(400).json({ error: "path is required", code: "VALIDATION_ERROR" });
  }

  try {
    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = publicUrlData.publicUrl;

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
    res.status(500).json({ error: "Server error while confirming avatar upload", code: "SERVER_ERROR" });
  }
});

export default router;