import { Router } from "express";
import { db } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireRole("admin"));

router.get("/stats", (req, res) => {
  const data = db.read();
  res.json({
    stats: {
      users: data.users.length,
      pendingKyc: data.kycSubmissions.filter((k) => k.status === "pending").length,
      flags: 0, // no flagging system implemented yet — see README
    },
  });
});

router.get("/verification-queue", (req, res) => {
  const data = db.read();
  const pending = data.kycSubmissions.filter((k) => k.status === "pending");
  const withNames = pending.map((k) => {
    const artisan = data.users.find((u) => u.id === k.artisanId);
    return { ...k, artisanName: artisan?.fullName || "Unknown", trade: artisan?.trade || "" };
  });
  res.json({ queue: withNames });
});

router.patch("/verification/:id", (req, res) => {
  const { decision } = req.body; // "approve" | "reject"
  if (!["approve", "reject"].includes(decision)) {
    return res.status(400).json({ error: "decision must be 'approve' or 'reject'" });
  }
  const data = db.read();
  const submission = data.kycSubmissions.find((k) => k.id === req.params.id);
  if (!submission) return res.status(404).json({ error: "Submission not found" });

  submission.status = decision === "approve" ? "approved" : "rejected";
  submission.reviewedAt = new Date().toISOString();

  if (decision === "approve") {
    const artisan = data.users.find((u) => u.id === submission.artisanId);
    if (artisan) artisan.verified = true;
  }

  db.write(data);
  res.json({ submission });
});

router.get("/users", (req, res) => {
  const data = db.read();
  res.json({ users: data.users.map(({ password, ...u }) => u) });
});

export default router;
