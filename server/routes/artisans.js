import { Router } from "express";
import { db } from "../db.js";

const router = Router();

function publicArtisan(u) {
  const { password, ...rest } = u;
  return rest;
}

// GET /api/artisans?trade=Electrician&area=Lekki&verified=true&minRating=4
router.get("/", (req, res) => {
  const { trade, area, verified, minRating, q } = req.query;
  const data = db.read();

  let list = data.users.filter((u) => u.role === "artisan");

  if (trade) list = list.filter((u) => u.trade?.toLowerCase() === String(trade).toLowerCase());
  if (area) list = list.filter((u) => u.area?.toLowerCase().includes(String(area).toLowerCase()));
  if (verified === "true") list = list.filter((u) => u.verified);
  if (minRating) list = list.filter((u) => (u.rating || 0) >= Number(minRating));
  if (q) {
    const needle = String(q).toLowerCase();
    list = list.filter(
      (u) =>
        u.fullName.toLowerCase().includes(needle) ||
        u.trade?.toLowerCase().includes(needle) ||
        u.area?.toLowerCase().includes(needle)
    );
  }

  res.json({ artisans: list.map(publicArtisan) });
});

router.get("/:id", (req, res) => {
  const data = db.read();
  const artisan = data.users.find((u) => u.id === req.params.id && u.role === "artisan");
  if (!artisan) return res.status(404).json({ error: "Artisan not found" });
  res.json({ artisan: publicArtisan(artisan) });
});

export default router;
