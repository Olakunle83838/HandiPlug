import { Router } from "express";
import { supabase, generateId } from "../supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Customer creates a booking request for an artisan
router.post("/", requireAuth, async (req, res) => {
  if (req.auth.role !== "customer") {
    return res.status(403).json({ error: "Only customers can create bookings" });
  }
  const { artisanId, detail, date, time, location } = req.body;
  if (!artisanId || !detail) {
    return res.status(400).json({ error: "artisanId and detail are required" });
  }

  try {
    const { data: artisan, error: artisanError } = await supabase
      .from("users")
      .select("id")
      .eq("id", artisanId)
      .eq("role", "artisan")
      .single();

    if (artisanError || !artisan) return res.status(404).json({ error: "Artisan not found" });

    const bookingId = generateId();
    const newBooking = {
      id: bookingId,
      customerId: req.auth.id,
      artisanId,
      detail,
      date: date || null,
      time: time || null,
      location: location || null,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { error: insertError } = await supabase.from("bookings").insert([newBooking]);
    if (insertError) throw insertError;

    res.status(201).json({ booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// List bookings relevant to the logged-in user (as customer or artisan)
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const roleCol = req.auth.role === "artisan" ? "artisanId" : "customerId";
    
    // We can use a join, but for simplicity we fetch bookings then users
    // Supabase can do: .select('*, customer:users!customerId(*), artisan:users!artisanId(*)')
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        *,
        customer:customerId(fullName),
        artisan:artisanId(fullName, trade)
      `)
      .eq(roleCol, req.auth.id);

    if (error) throw error;

    const withNames = bookings.map((b) => ({
      ...b,
      customerName: b.customer?.fullName || "Unknown",
      artisanName: b.artisan?.fullName || "Unknown",
      artisanTrade: b.artisan?.trade || "",
      customer: undefined,
      artisan: undefined,
    }));

    res.json({ bookings: withNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update booking status. Artisan can accept/decline/complete; customer can cancel.
router.patch("/:id", requireAuth, async (req, res) => {
  const { status } = req.body;
  const allowed = ["accepted", "declined", "completed", "cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ error: `status must be one of ${allowed.join(", ")}` });

  try {
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchError || !booking) return res.status(404).json({ error: "Booking not found" });

    const isArtisan = req.auth.role === "artisan" && booking.artisanId === req.auth.id;
    const isCustomer = req.auth.role === "customer" && booking.customerId === req.auth.id;
    if (!isArtisan && !isCustomer) return res.status(403).json({ error: "Not your booking" });
    
    if (["accepted", "declined", "completed"].includes(status) && !isArtisan) {
      return res.status(403).json({ error: "Only the artisan can update this booking to that status" });
    }

    const updatedData = { 
      status, 
      updatedAt: new Date().toISOString() 
    };

    const { data: updatedBooking, error: updateError } = await supabase
      .from("bookings")
      .update(updatedData)
      .eq("id", req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ booking: updatedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
