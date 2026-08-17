import { Router } from "express";
import bcrypt from "bcryptjs";
import { supabase, generateId } from "../supabase.js";
import { signToken, requireAuth } from "../middleware/auth.js";

const router = Router();

function publicUser(u) {
  const { password, ...rest } = u;
  return rest;
}

router.post("/register", async (req, res) => {
  const { fullName, email, phone, password, address, role, trade } = req.body;

  if (!phone || !password || !role) {
    return res.status(400).json({ error: "phone, password and role are required" });
  }
  if (!["customer", "artisan"].includes(role)) {
    return res.status(400).json({ error: "role must be 'customer' or 'artisan'" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    // Check if phone or email already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("id, phone, email")
      .or(`phone.eq.${phone}${email ? `,email.eq.${email}` : ''}`);

    if (checkError) throw checkError;

    if (existingUsers.length > 0) {
      if (existingUsers.some(u => u.phone === phone)) {
        return res.status(409).json({ error: "An account with this phone number already exists" });
      }
      if (email && existingUsers.some(u => u.email?.toLowerCase() === email.toLowerCase())) {
        return res.status(409).json({ error: "An account with this email already exists" });
      }
    }

    const userId = generateId();
    const newUser = {
      id: userId,
      role,
      fullName: fullName || "New User",
      email: email || null,
      phone,
      address: address || null,
      password: bcrypt.hashSync(password, 10),
      verified: false,
      createdAt: new Date().toISOString(),
      ...(role === "artisan" ? { 
        trade: trade || null, 
        area: null, 
        yearsExperience: 0, 
        bio: null, 
        hourlyRate: 0, 
        rating: 0, 
        reviewCount: 0 
      } : {}),
    };

    const { error: insertError } = await supabase.from("users").insert([newUser]);
    if (insertError) throw insertError;

    const token = signToken(newUser);
    res.status(201).json({ token, user: publicUser(newUser) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

router.post("/login", async (req, res) => {
  const { email, phone, password } = req.body;
  const identifier = email || phone;
  if (!identifier || !password) return res.status(400).json({ error: "Email/phone and password are required" });

  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .or(`phone.eq.${identifier},email.eq.${identifier}`)
      .limit(1);

    if (error) throw error;

    const user = users[0];
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid email/phone or password" });
    }

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during login" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.auth.id)
      .single();

    if (error || !user) return res.status(404).json({ error: "User not found" });
    res.json({ user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id")
      .ilike("email", email || "")
      .limit(1);

    res.json({
      message: user && user.length > 0
        ? "If this were production, a reset link would be emailed to you now."
        : "If an account exists for that email, reset instructions would be sent.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


router.patch("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "currentPassword and newPassword are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters" });
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.auth.id)
      .single();

    if (error || !user || !bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", req.auth.id);

    if (updateError) throw updateError;
    
    res.json({ message: "Password updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
