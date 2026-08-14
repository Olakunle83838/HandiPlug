import { Router } from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const EDITABLE_FIELDS = [
  "fullName", "phone", "address", "bio", "area", "hourlyRate", "yearsExperience",
  "bankName", "accountNumber", "accountName",
];

router.patch("/me", requireAuth, (req, res) => {
  const data = db.read();
  const user = data.users.find((u) => u.id === req.auth.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  for (const field of EDITABLE_FIELDS) {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  }
  db.write(data);

  const { password, ...rest } = user;
  res.json({ user: rest });
});

export default router;
