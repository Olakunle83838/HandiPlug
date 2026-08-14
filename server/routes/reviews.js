import { Router } from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, (req, res) => {
  if (req.auth.role !== "customer") return res.status(403).json({ error: "Only customers can leave reviews" });
  const { artisanId, bookingId, rating, comment } = req.body;
  if (!artisanId || !rating) return res.status(400).json({ error: "artisanId and rating are required" });

  const data = db.read();
  const artisan = data.users.find((u) => u.id === artisanId && u.role === "artisan");
  if (!artisan) return res.status(404).json({ error: "Artisan not found" });

  const review = {
    id: db.id(),
    artisanId,
    bookingId: bookingId || null,
    customerId: req.auth.id,
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment: comment || "",
    createdAt: new Date().toISOString(),
  };
  data.reviews.push(review);

  // Recompute the artisan's aggregate rating
  const artisanReviews = data.reviews.filter((r) => r.artisanId === artisanId);
  const avg = artisanReviews.reduce((sum, r) => sum + r.rating, 0) / artisanReviews.length;
  artisan.rating = Math.round(avg * 10) / 10;
  artisan.reviewCount = artisanReviews.length;

  db.write(data);
  res.status(201).json({ review });
});

router.get("/artisan/:id", (req, res) => {
  const data = db.read();
  const list = data.reviews.filter((r) => r.artisanId === req.params.id);
  res.json({ reviews: list });
});

router.get("/mine", requireAuth, (req, res) => {
  const data = db.read();
  const mine = data.reviews.filter((r) => r.customerId === req.auth.id);
  const withNames = mine.map((r) => {
    const artisan = data.users.find((u) => u.id === r.artisanId);
    return { ...r, artisanName: artisan?.fullName || "Unknown", trade: artisan?.trade || "" };
  });
  res.json({ reviews: withNames });
});

export default router;
