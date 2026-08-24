import { Router } from "express";
import { supabase, generateId } from "../supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function getBookingIfParticipant(bookingId, userId) {
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("id, customerId, artisanId")
    .eq("id", bookingId)
    .single();

  if (error || !booking) return { booking: null, error: "NOT_FOUND" };
  if (booking.customerId !== userId && booking.artisanId !== userId) {
    return { booking: null, error: "FORBIDDEN" };
  }
  return { booking, error: null };
}

router.get("/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  try {
    const { booking, error: participantError } = await getBookingIfParticipant(bookingId, req.auth.id);

    if (participantError === "NOT_FOUND") {
      return res.status(404).json({ error: "Booking not found", code: "NOT_FOUND" });
    }
    if (participantError === "FORBIDDEN") {
      return res.status(403).json({ error: "You are not a participant in this booking", code: "FORBIDDEN" });
    }

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

// Issues a short-lived signed upload URL for a chat image, scoped to this
// booking's folder. The browser uploads directly to Supabase Storage using
// this URL — the file never passes through our server.
router.post("/upload-url", async (req, res) => {
  const { bookingId, fileName, fileType } = req.body;

  if (!bookingId || !fileName || !fileType) {
    return res.status(400).json({ error: "bookingId, fileName and fileType are required", code: "VALIDATION_ERROR" });
  }
  if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
    return res.status(400).json({ error: "Only JPEG, PNG, and WebP are allowed", code: "VALIDATION_ERROR" });
  }

  try {
    const { error: participantError } = await getBookingIfParticipant(bookingId, req.auth.id);

    if (participantError === "NOT_FOUND") {
      return res.status(404).json({ error: "Booking not found", code: "NOT_FOUND" });
    }
    if (participantError === "FORBIDDEN") {
      return res.status(403).json({ error: "You are not a participant in this booking", code: "FORBIDDEN" });
    }

    const fileExt = fileType.split("/")[1];
    const cleanName = fileName.replace(/\s+/g, "_");
    const path = `${bookingId}/${req.auth.id}-${Date.now()}-${cleanName}.${fileExt}`.replace(/\.\w+\.\w+$/, `.${fileExt}`);

    const { data, error } = await supabase.storage
      .from("chat-images")
      .createSignedUploadUrl(path);

    if (error) throw error;

    res.json({ path, signedUrl: data.signedUrl, token: data.token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to create upload URL" });
  }
});

router.post("/", async (req, res) => {
  const { bookingId, text, imagePath } = req.body;

  const trimmedText = typeof text === "string" ? text.trim() : "";

  if (!bookingId || (!trimmedText && !imagePath)) {
    return res.status(400).json({ error: "bookingId and either text or an image are required", code: "VALIDATION_ERROR" });
  }
  if (trimmedText.length > 2000) {
    return res.status(400).json({ error: "Message too long", code: "VALIDATION_ERROR" });
  }

  try {
    const { booking, error: participantError } = await getBookingIfParticipant(bookingId, req.auth.id);

    if (participantError === "NOT_FOUND") {
      return res.status(404).json({ error: "Booking not found", code: "NOT_FOUND" });
    }
    if (participantError === "FORBIDDEN") {
      return res.status(403).json({ error: "You are not a participant in this booking", code: "FORBIDDEN" });
    }

    const receiverId = req.auth.id === booking.customerId ? booking.artisanId : booking.customerId;

    let imageUrl = null;
    if (imagePath) {
      const { data: publicUrlData } = supabase.storage.from("chat-images").getPublicUrl(imagePath);
      imageUrl = publicUrlData.publicUrl;
    }

    const newMessage = {
      id: generateId(),
      bookingId,
      senderId: req.auth.id,
      receiverId,
      text: trimmedText,
      imageUrl,
      createdAt: new Date().toISOString()
    };

    const { data: inserted, error: insertError } = await supabase
      .from("messages")
      .insert([newMessage])
      .select()
      .single();

    if (insertError) throw insertError;

    await supabase.from("notifications").insert([{
      id: generateId(),
      userId: receiverId,
      title: "New Message",
      message: imageUrl ? "You received a photo." : `You have a new message regarding a booking.`,
      isRead: false,
      createdAt: new Date().toISOString(),
      link: `/chat?bookingId=${bookingId}`,
    }]);

    res.status(201).json({ message: inserted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error sending message", code: "SERVER_ERROR" });
  }
});

export default router;