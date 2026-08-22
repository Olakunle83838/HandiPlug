import { Router } from "express";
import { supabase, generateId } from "../supabase.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

// Issues a short-lived signed upload URL for a single file, scoped to the
// authenticated artisan's own folder. The browser uploads the file
// directly to Supabase Storage using this URL — the file never passes
// through our server, so Vercel's 4.5MB body limit never applies.
// Security is enforced here (requireAuth/requireRole), not via Supabase
// RLS, since our users aren't Supabase Auth sessions.
router.post("/upload-url", requireAuth, requireRole("artisan"), async (req, res) => {
  const { fileName, fileType, kind } = req.body;

  if (!fileName || !fileType) {
    return res.status(400).json({ error: "fileName and fileType are required" });
  }
  if (!ALLOWED_TYPES.includes(fileType)) {
    return res.status(400).json({ error: "Only PNG, JPG or PDF files are allowed" });
  }
  if (!["document", "selfie"].includes(kind)) {
    return res.status(400).json({ error: "kind must be 'document' or 'selfie'" });
  }

  try {
    const cleanName = fileName.replace(/\s+/g, "_");
    const path = `${req.auth.id}/${kind}-${Date.now()}-${cleanName}`;

    const { data, error } = await supabase.storage
      .from("kyc-documents")
      .createSignedUploadUrl(path);

    if (error) throw error;

    res.json({ path, signedUrl: data.signedUrl, token: data.token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to create upload URL" });
  }
});

// Artisan uploads KYC documents directly to Supabase Storage from the
// browser (bypassing our server, since Vercel serverless functions cap
// request bodies at 4.5MB). This route just records the resulting
// storage paths + guarantor info against the artisan's submission.
router.post("/submit", requireAuth, requireRole("artisan"), async (req, res) => {
  const {
    documentType,
    documentPath,
    documentOriginalName,
    ninNumber,
    selfiePath,
    guarantor1Name,
    guarantor1Phone,
    guarantor2Name,
    guarantor2Phone,
  } = req.body;

  if (!documentPath) {
    return res.status(400).json({ error: "No ID document uploaded" });
  }

  if (!guarantor1Name || !guarantor1Phone || !guarantor2Name || !guarantor2Phone) {
    return res.status(400).json({ error: "Both guarantors' name and phone are required" });
  }

  try {
    const submissionId = generateId();
    const submission = {
      id: submissionId,
      artisanId: req.auth.id,
      documentType: documentType || "Unspecified",
      fileName: documentPath,
      originalName: documentOriginalName || documentPath,
      ninNumber: ninNumber || null,
      selfieFileName: selfiePath || null,
      guarantors: [
        { name: guarantor1Name, phone: guarantor1Phone },
        { name: guarantor2Name, phone: guarantor2Phone },
      ],
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    const { error: insertError } = await supabase.from("kycSubmissions").insert([submission]);
    if (insertError) throw insertError;

    res.status(201).json({ submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

router.get("/mine", requireAuth, requireRole("artisan"), async (req, res) => {
  try {
    const { data: submissions, error } = await supabase
      .from("kycSubmissions")
      .select("*")
      .eq("artisanId", req.auth.id);

    if (error) throw error;
    res.json({ submissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;