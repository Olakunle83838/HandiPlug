import { Router } from "express";
import { supabase } from "../supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const EDITABLE_FIELDS = [
  "fullName", "phone", "address", "bio", "area", "hourlyRate", "yearsExperience",
  "bankName", "accountNumber", "accountName",
];

router.patch("/me", requireAuth, async (req, res) => {
  try {
    const updates = {};
    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (Object.keys(updates).length === 0) {
      // Nothing to update, just return the user
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", req.auth.id)
        .single();
        
      if (error || !user) return res.status(404).json({ error: "User not found" });
      const { password, ...rest } = user;
      return res.json({ user: rest });
    }

    const { data: user, error: updateError } = await supabase
      .from("users")
      .update(updates)
      .eq("id", req.auth.id)
      .select()
      .single();

    if (updateError || !user) return res.status(404).json({ error: "User not found or update failed" });

    const { password, ...rest } = user;
    res.json({ user: rest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
