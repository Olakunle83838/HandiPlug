import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db.js";
import { signToken, requireAuth } from "../middleware/auth.js";

const router = Router();

function publicUser(u) {
  const { password, ...rest } = u;
  return rest;
}

router.post("/register", (req, res) => {
  const { fullName, email, phone, password, address, role, trade } = req.body;

  // The actual Signup screen only collects phone + password (see
  // src/screens/Signup.jsx) — fullName/email are optional and can be
  // filled in later from Settings. Phone is the required unique identifier.
  if (!phone || !password || !role) {
    return res.status(400).json({ error: "phone, password and role are required" });
  }
  if (!["customer", "artisan"].includes(role)) {
    return res.status(400).json({ error: "role must be 'customer' or 'artisan'" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const data = db.read();
  const phoneTaken = data.users.find((u) => u.phone && u.phone === phone);
  if (phoneTaken) return res.status(409).json({ error: "An account with this phone number already exists" });
  if (email) {
    const emailTaken = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (emailTaken) return res.status(409).json({ error: "An account with this email already exists" });
  }

  const user = {
    id: db.id(),
    role,
    fullName: fullName || "New User",
    email: email || "",
    phone,
    address: address || "",
    password: bcrypt.hashSync(password, 10),
    verified: false,
    createdAt: new Date().toISOString(),
    ...(role === "artisan" ? { trade: trade || "", area: "", yearsExperience: 0, bio: "", hourlyRate: 0, rating: 0, reviewCount: 0 } : {}),
  };

  data.users.push(user);
  db.write(data);

  const token = signToken(user);
  res.status(201).json({ token, user: publicUser(user) });
});

router.post("/login", (req, res) => {
  const { email, phone, password } = req.body;
  const identifier = email || phone;
  if (!identifier || !password) return res.status(400).json({ error: "Email/phone and password are required" });

  const data = db.read();
  const user = data.users.find(
    (u) => (u.email && u.email.toLowerCase() === identifier.toLowerCase()) || (u.phone && u.phone === identifier)
  );
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid email/phone or password" });
  }

  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

router.get("/me", requireAuth, (req, res) => {
  const data = db.read();
  const user = data.users.find((u) => u.id === req.auth.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: publicUser(user) });
});

// Demo-only password reset: in a real deployment this would email a
// reset link. Here it just confirms the account exists so the frontend
// flow (Forgot Password screen) has something real to talk to.
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  const data = db.read();
  const user = data.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
  // Always return success to avoid leaking which emails are registered.
  res.json({
    message: user
      ? "If this were production, a reset link would be emailed to you now."
      : "If an account exists for that email, reset instructions would be sent.",
  });
});


router.patch("/change-password", requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "currentPassword and newPassword are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters" });
  }
  const data = db.read();
  const user = data.users.find((u) => u.id === req.auth.id);
  if (!user || !bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }
  user.password = bcrypt.hashSync(newPassword, 10);
  db.write(data);
  res.json({ message: "Password updated" });
});

export default router;
