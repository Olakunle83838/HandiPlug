import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { db } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ["image/png", "image/jpeg", "application/pdf"].includes(file.mimetype);
    cb(ok ? null : new Error("Only PNG, JPG or PDF files are allowed"), ok);
  },
});

const router = Router();

// Artisan uploads a KYC document (real file, saved to /server/uploads)
router.post("/submit", requireAuth, requireRole("artisan"), upload.single("document"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No document uploaded" });
  const { documentType } = req.body;

  const data = db.read();
  const submission = {
    id: db.id(),
    artisanId: req.auth.id,
    documentType: documentType || "Unspecified",
    fileName: req.file.filename,
    originalName: req.file.originalname,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  data.kycSubmissions.push(submission);
  db.write(data);
  res.status(201).json({ submission });
});

router.get("/mine", requireAuth, requireRole("artisan"), (req, res) => {
  const data = db.read();
  const mine = data.kycSubmissions.filter((k) => k.artisanId === req.auth.id);
  res.json({ submissions: mine });
});

export default router;
