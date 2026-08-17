import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { supabase, generateId } from "../supabase.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ["image/png", "image/jpeg", "application/pdf"].includes(file.mimetype);
    cb(ok ? null : new Error("Only PNG, JPG or PDF files are allowed"), ok);
  },
});

const router = Router();

// Artisan uploads KYC documents: ID document + selfie for facial verification,
// plus 2 guarantors — matches the PRD's "NIN + facial verification + 2
// guarantors per artisan" requirement.
router.post(
  "/submit",
  requireAuth,
  requireRole("artisan"),
  upload.fields([{ name: "document", maxCount: 1 }, { name: "selfie", maxCount: 1 }]),
  async (req, res) => {
    const documentFile = req.files?.document?.[0];
    if (!documentFile) return res.status(400).json({ error: "No ID document uploaded" });

    const {
      documentType,
      ninNumber,
      guarantor1Name,
      guarantor1Phone,
      guarantor2Name,
      guarantor2Phone,
    } = req.body;

    if (!guarantor1Name || !guarantor1Phone || !guarantor2Name || !guarantor2Phone) {
      return res.status(400).json({ error: "Both guarantors' name and phone are required" });
    }

    const selfieFile = req.files?.selfie?.[0];

    try {
      // Upload ID Document to Supabase
      const docFilename = `${Date.now()}-${documentFile.originalname.replace(/\s+/g, "_")}`;
      const { error: docUploadError } = await supabase.storage
        .from("kyc-documents")
        .upload(docFilename, documentFile.buffer, { contentType: documentFile.mimetype });
      if (docUploadError) throw new Error("Failed to upload document: " + docUploadError.message);

      // Upload Selfie to Supabase (if provided)
      let selfieFilename = null;
      if (selfieFile) {
        selfieFilename = `${Date.now()}-selfie-${selfieFile.originalname.replace(/\s+/g, "_")}`;
        const { error: selfieUploadError } = await supabase.storage
          .from("kyc-documents")
          .upload(selfieFilename, selfieFile.buffer, { contentType: selfieFile.mimetype });
        if (selfieUploadError) throw new Error("Failed to upload selfie: " + selfieUploadError.message);
      }

      const submissionId = generateId();
      const submission = {
        id: submissionId,
        artisanId: req.auth.id,
        documentType: documentType || "Unspecified",
        fileName: docFilename,
        originalName: documentFile.originalname,
        ninNumber: ninNumber || null,
        selfieFileName: selfieFilename,
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
  }
);

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
