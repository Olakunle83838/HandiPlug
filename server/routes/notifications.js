import { Router } from "express";
import { supabase, generateId } from "../supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("userId", req.auth.id)
      .order("createdAt", { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error fetching notifications", code: "SERVER_ERROR" });
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const { data: updated, error } = await supabase
      .from("notifications")
      .update({ isRead: true })
      .eq("id", id)
      .eq("userId", req.auth.id) // Ensure ownership
      .select()
      .single();

    if (error) {
      return res.status(404).json({ error: "Notification not found or access denied", code: "NOT_FOUND" });
    }

    res.json({ notification: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error updating notification", code: "SERVER_ERROR" });
  }
});

export default router;
