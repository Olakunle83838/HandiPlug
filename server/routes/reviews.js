import { Router } from "express";
import { supabase, generateId } from "../supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  if (req.auth.role !== "customer") return res.status(403).json({ error: "Only customers can leave reviews" });
  const { artisanId, bookingId, rating, comment } = req.body;
  if (!artisanId || !rating) return res.status(400).json({ error: "artisanId and rating are required" });

  try {
    const { data: artisan, error: artisanError } = await supabase
      .from("users")
      .select("id")
      .eq("id", artisanId)
      .eq("role", "artisan")
      .single();

    if (artisanError || !artisan) return res.status(404).json({ error: "Artisan not found" });

    const reviewId = generateId();
    const newReview = {
      id: reviewId,
      artisanId,
      bookingId: bookingId || null,
      customerId: req.auth.id,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: comment || null,
      createdAt: new Date().toISOString(),
    };

    const { error: insertError } = await supabase.from("reviews").insert([newReview]);
    if (insertError) throw insertError;

    // Recompute the artisan's aggregate rating
    const { data: reviews, error: fetchReviewsError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("artisanId", artisanId);

    if (!fetchReviewsError && reviews) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      const roundedAvg = Math.round(avg * 10) / 10;
      
      await supabase
        .from("users")
        .update({ rating: roundedAvg, reviewCount: reviews.length })
        .eq("id", artisanId);
    }

    res.status(201).json({ review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/artisan/:id", async (req, res) => {
  try {
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("artisanId", req.params.id);

    if (error) throw error;
    res.json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/mine", requireAuth, async (req, res) => {
  try {
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(`
        *,
        artisan:artisanId(fullName, trade)
      `)
      .eq("customerId", req.auth.id);

    if (error) throw error;

    const withNames = reviews.map((r) => ({ 
      ...r, 
      artisanName: r.artisan?.fullName || "Unknown", 
      trade: r.artisan?.trade || "",
      artisan: undefined
    }));

    res.json({ reviews: withNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
