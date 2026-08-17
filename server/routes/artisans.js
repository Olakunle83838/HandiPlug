import { Router } from "express";
import { supabase } from "../supabase.js";

const router = Router();

function publicArtisan(u) {
  const { password, ...rest } = u;
  return rest;
}

// GET /api/artisans?trade=Electrician&area=Lekki&verified=true&minRating=4
router.get("/", async (req, res) => {
  const { trade, area, verified, minRating, q } = req.query;
  
  try {
    let query = supabase.from("users").select("*").eq("role", "artisan");

    if (trade) query = query.ilike("trade", trade);
    if (area) query = query.ilike("area", `%${area}%`);
    if (verified === "true") query = query.eq("verified", true);
    if (minRating) query = query.gte("rating", Number(minRating));
    
    if (q) {
      const needle = `%${q}%`;
      query = query.or(`fullName.ilike.${needle},trade.ilike.${needle},area.ilike.${needle}`);
    }

    const { data: artisans, error } = await query;
    if (error) throw error;

    res.json({ artisans: artisans.map(publicArtisan) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { data: artisan, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.params.id)
      .eq("role", "artisan")
      .single();

    if (error || !artisan) return res.status(404).json({ error: "Artisan not found" });
    
    res.json({ artisan: publicArtisan(artisan) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
