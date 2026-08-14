import { Router } from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Customer creates a booking request for an artisan
router.post("/", requireAuth, (req, res) => {
  if (req.auth.role !== "customer") {
    return res.status(403).json({ error: "Only customers can create bookings" });
  }
  const { artisanId, detail, date, time, location } = req.body;
  if (!artisanId || !detail) {
    return res.status(400).json({ error: "artisanId and detail are required" });
  }

  const data = db.read();
  const artisan = data.users.find((u) => u.id === artisanId && u.role === "artisan");
  if (!artisan) return res.status(404).json({ error: "Artisan not found" });

  const booking = {
    id: db.id(),
    customerId: req.auth.id,
    artisanId,
    detail,
    date: date || "",
    time: time || "",
    location: location || "",
    status: "pending", // pending -> accepted -> completed, or declined
    createdAt: new Date().toISOString(),
  };
  data.bookings.push(booking);
  db.write(data);
  res.status(201).json({ booking });
});

// List bookings relevant to the logged-in user (as customer or artisan)
router.get("/mine", requireAuth, (req, res) => {
  const data = db.read();
  const mine = data.bookings.filter((b) =>
    req.auth.role === "artisan" ? b.artisanId === req.auth.id : b.customerId === req.auth.id
  );

  const withNames = mine.map((b) => {
    const customer = data.users.find((u) => u.id === b.customerId);
    const artisan = data.users.find((u) => u.id === b.artisanId);
    return {
      ...b,
      customerName: customer?.fullName || "Unknown",
      artisanName: artisan?.fullName || "Unknown",
      artisanTrade: artisan?.trade || "",
    };
  });

  res.json({ bookings: withNames });
});

// Update booking status. Artisan can accept/decline/complete; customer can cancel.
router.patch("/:id", requireAuth, (req, res) => {
  const { status } = req.body;
  const allowed = ["accepted", "declined", "completed", "cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ error: `status must be one of ${allowed.join(", ")}` });

  const data = db.read();
  const booking = data.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  const isArtisan = req.auth.role === "artisan" && booking.artisanId === req.auth.id;
  const isCustomer = req.auth.role === "customer" && booking.customerId === req.auth.id;
  if (!isArtisan && !isCustomer) return res.status(403).json({ error: "Not your booking" });
  if (["accepted", "declined", "completed"].includes(status) && !isArtisan) {
    return res.status(403).json({ error: "Only the artisan can update this booking to that status" });
  }

  booking.status = status;
  booking.updatedAt = new Date().toISOString();
  db.write(data);
  res.json({ booking });
});

export default router;
