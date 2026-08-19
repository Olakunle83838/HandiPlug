import { Router } from "express";
import { supabase } from "../supabase.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireRole("admin"));

router.get("/stats", async (req, res) => {
  try {
    const { count: usersCount, error: usersError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: pendingKyc, error: kycError } = await supabase
      .from("kycSubmissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    if (usersError || kycError) throw (usersError || kycError);

    res.json({
      stats: {
        users: usersCount || 0,
        pendingKyc: pendingKyc || 0,
        flags: 0, // no flagging system implemented yet — see README
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/verification-queue", async (req, res) => {
  try {
    const { data: queue, error } = await supabase
      .from("kycSubmissions")
      .select(`
        *,
        artisan:artisanId(fullName, trade)
      `)
      .eq("status", "pending");

    if (error) throw error;

    const withNames = queue.map((k) => ({
      ...k,
      artisanName: k.artisan?.fullName || "Unknown",
      trade: k.artisan?.trade || "",
      artisan: undefined
    }));

    res.json({ queue: withNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/verification/:id", async (req, res) => {
  const { decision } = req.body; // "approve" | "reject"
  if (!["approve", "reject"].includes(decision)) {
    return res.status(400).json({ error: "decision must be 'approve' or 'reject'" });
  }

  try {
    const { data: submission, error: fetchError } = await supabase
      .from("kycSubmissions")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !submission) return res.status(404).json({ error: "Submission not found" });

    const newStatus = decision === "approve" ? "approved" : "rejected";
    
    const { data: updatedSubmission, error: updateError } = await supabase
      .from("kycSubmissions")
      .update({ status: newStatus })
      .eq("id", req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    if (decision === "approve") {
      await supabase
        .from("users")
        .update({ verified: true })
        .eq("id", submission.artisanId);
    }

    res.json({ submission: updatedSubmission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("*");

    if (error) throw error;

    // Remove passwords
    const publicUsers = users.map(({ password, ...u }) => u);
    res.json({ users: publicUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/users/:id/suspend", async (req, res) => {
  const { isSuspended } = req.body;
  if (typeof isSuspended !== "boolean") {
    return res.status(400).json({ error: "isSuspended must be a boolean", code: "VALIDATION_ERROR" });
  }

  try {
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ error: "User not found", code: "NOT_FOUND" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ error: "Cannot suspend an admin user", code: "FORBIDDEN" });
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ isSuspended })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    const { password, ...publicUser } = updatedUser;
    res.json({ user: publicUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error updating suspension status", code: "SERVER_ERROR" });
  }
});

export default router;
