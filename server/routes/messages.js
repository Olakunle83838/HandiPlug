import { Router } from "express";
import { supabase, generateId } from "../supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  try {
    // 1. Validate booking and participant
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, customerId, artisanId")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ error: "Booking not found", code: "NOT_FOUND" });
    }

    if (booking.customerId !== req.auth.id && booking.artisanId !== req.auth.id) {
      return res.status(403).json({ error: "You are not a participant in this booking", code: "FORBIDDEN" });
    }

    // 2. Get messages
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("bookingId", bookingId)
      .order("createdAt", { ascending: true })
      .limit(100);

    if (messagesError) throw messagesError;

    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error fetching messages", code: "SERVER_ERROR" });
  }
});

router.post("/", async (req, res) => {
  const { bookingId, text } = req.body;

  if (!bookingId || !text || !text.trim()) {
    return res.status(400).json({ error: "bookingId and text are required", code: "VALIDATION_ERROR" });
  }
  if (text.length > 2000) {
    return res.status(400).json({ error: "Message too long", code: "VALIDATION_ERROR" });
  }

  try {
    // 1. Validate booking and participant
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, customerId, artisanId")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ error: "Booking not found", code: "NOT_FOUND" });
    }

    if (booking.customerId !== req.auth.id && booking.artisanId !== req.auth.id) {
      return res.status(403).json({ error: "You are not a participant in this booking", code: "FORBIDDEN" });
    }

    const receiverId = req.auth.id === booking.customerId ? booking.artisanId : booking.customerId;

    const newMessage = {
      id: generateId(),
      bookingId,
      senderId: req.auth.id,
      receiverId,
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    const { data: inserted, error: insertError } = await supabase
      .from("messages")
      .insert([newMessage])
      .select()
      .single();

    if (insertError) throw insertError;

    // Optional: create a notification for the receiver
    await supabase.from("notifications").insert([{
      id: generateId(),
      userId: receiverId,
      title: "New Message",
      body: `You have a new message regarding a booking.`,
      isRead: false,
      createdAt: new Date().toISOString()
    }]);

    res.status(201).json({ message: inserted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error sending message", code: "SERVER_ERROR" });
  }
});

export default router;
