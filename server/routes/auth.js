import { Router } from "express";
import bcrypt from "bcryptjs";
import { supabase, generateId } from "../supabase.js";
import { signToken, requireAuth } from "../middleware/auth.js";
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: { error: "Too many requests from this IP, please try again after a minute", code: "RATE_LIMITED" }
});

const otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: { error: "Too many OTP requests. Please wait a minute before trying again.", code: "RATE_LIMITED" }
});

const router = Router();

function publicUser(u) {
  const { password, ...rest } = u;
  return rest;
}

function issueAuthToken(user, res) {
  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
}

router.post("/register", authLimiter, async (req, res) => {
  const { fullName, email, phone, password, address, role, trade } = req.body;

  if (!fullName || !email || !password || !role || !phone) {
    return res.status(400).json({ error: "Missing required fields", code: "VALIDATION_ERROR" });
  }
  if (!["customer", "artisan"].includes(role)) {
    return res.status(400).json({ error: "role must be 'customer' or 'artisan'", code: "VALIDATION_ERROR" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters", code: "VALIDATION_ERROR" });
  }

  try {
    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("id, phone, email")
      .or(`phone.eq.${phone}${email ? `,email.eq.${email}` : ''}`);

    if (checkError) throw checkError;

    if (existingUsers.length > 0) {
      if (existingUsers.some(u => u.phone === phone)) {
        return res.status(409).json({ error: "An account with this phone number already exists", code: "VALIDATION_ERROR" });
      }
      if (email && existingUsers.some(u => u.email?.toLowerCase() === email.toLowerCase())) {
        return res.status(409).json({ error: "An account with this email already exists", code: "VALIDATION_ERROR" });
      }
    }

    const userId = generateId();
    const newUser = {
      id: userId,
      role,
      fullName,
      email: email || null,
      phone,
      address: address || null,
      password: bcrypt.hashSync(password, 10),
      verified: false,
      isSuspended: false,
      createdAt: new Date().toISOString(),
      ...(role === "artisan" ? { trade: trade || null, area: null, yearsExperience: 0, bio: null, hourlyRate: 0, rating: 0, reviewCount: 0 } : {}),
    };

    const { error: insertError } = await supabase.from("users").insert([newUser]);
    if (insertError) throw insertError;

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during registration", code: "SERVER_ERROR" });
  }
});

router.post("/login", authLimiter, async (req, res) => {
  const { email, phone, password } = req.body;
  const identifier = email || phone;
  if (!identifier || !password) return res.status(400).json({ error: "Email/phone and password are required", code: "VALIDATION_ERROR" });

  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .or(`phone.eq.${identifier},email.eq.${identifier}`)
      .limit(1);

    if (error) throw error;

    const user = users[0];
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid email/phone or password", code: "INVALID_CREDENTIALS" });
    }

    if (user.isSuspended) {
      return res.status(403).json({ error: "This account has been suspended", code: "ACCOUNT_SUSPENDED" });
    }

    if (!user.verified) {
      return res.status(401).json({ error: "Please verify your email address", code: "EMAIL_NOT_VERIFIED" });
    }

    issueAuthToken(user, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during login", code: "SERVER_ERROR" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.auth.id)
      .single();

    if (error || !user) return res.status(404).json({ error: "User not found", code: "ACCOUNT_NOT_FOUND" });
    if (user.isSuspended) return res.status(403).json({ error: "Account suspended", code: "ACCOUNT_SUSPENDED" });

    res.json({ user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", code: "SERVER_ERROR" });
  }
});

router.post("/forgot-password", authLimiter, async (req, res) => {
  const { email } = req.body;
  try {
    const { data: user } = await supabase
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
    res.status(500).json({ error: "Server error", code: "SERVER_ERROR" });
  }
});

router.patch("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "currentPassword and newPassword are required", code: "VALIDATION_ERROR" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters", code: "VALIDATION_ERROR" });
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.auth.id)
      .single();

    if (error || !user || !bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ error: "Current password is incorrect", code: "INVALID_CREDENTIALS" });
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
    res.status(500).json({ error: "Server error", code: "SERVER_ERROR" });
  }
});

router.post("/otp/request", otpLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required", code: "VALIDATION_ERROR" });

  try {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      console.error("OTP send error:", error);
      return res.status(400).json({ error: "Failed to send verification code", code: "OTP_REQUEST_FAILED" });
    }
    res.json({ message: "Verification code sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", code: "SERVER_ERROR" });
  }
});

router.post("/otp/verify", authLimiter, async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required", code: "VALIDATION_ERROR" });

  try {
    const { data, error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    if (error) {
      return res.status(400).json({ error: "Invalid or expired verification code", code: "OTP_INVALID" });
    }

    const verifiedEmail = data.user?.email;
    if (!verifiedEmail) {
      return res.status(400).json({ error: "No email associated with this verification", code: "VALIDATION_ERROR" });
    }

    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", verifiedEmail)
      .limit(1);

    if (fetchError || users.length === 0) return res.status(404).json({ error: "Account not found", code: "ACCOUNT_NOT_FOUND" });
    let user = users[0];

    if (user.isSuspended) {
      return res.status(403).json({ error: "This account has been suspended", code: "ACCOUNT_SUSPENDED" });
    }

    if (!user.verified) {
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({ verified: true })
        .eq("id", user.id)
        .select()
        .single();
      if (updateError) throw updateError;
      user = updatedUser;
    }

    issueAuthToken(user, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during verification", code: "SERVER_ERROR" });
  }
});

router.post("/magiclink-login", authLimiter, async (req, res) => {
  const { tokenHash, type = "email" } = req.body;

  if (typeof tokenHash !== "string" || !tokenHash.trim()) {
    return res.status(400).json({ error: "Invalid verification link", code: "MAGIC_LINK_INVALID" });
  }

  if (type !== "email") {
    return res.status(400).json({ error: "Unsupported verification type", code: "VALIDATION_ERROR" });
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error || !data?.user) {
      return res.status(400).json({ error: "Invalid or expired verification link", code: "MAGIC_LINK_INVALID" });
    }

    const verifiedEmail = data.user.email;
    if (!verifiedEmail) {
      return res.status(400).json({ error: "No email associated with this verification", code: "VALIDATION_ERROR" });
    }

    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", verifiedEmail)
      .limit(1);

    if (fetchError || users.length === 0) return res.status(404).json({ error: "Account not found", code: "ACCOUNT_NOT_FOUND" });
    let user = users[0];

    if (user.isSuspended) {
      return res.status(403).json({ error: "This account has been suspended", code: "ACCOUNT_SUSPENDED" });
    }

    if (!user.verified) {
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({ verified: true })
        .eq("id", user.id)
        .select()
        .single();
      if (updateError) throw updateError;
      user = updatedUser;
    }

    issueAuthToken(user, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during verification", code: "SERVER_ERROR" });
  }
});

// Backward compatibility or alternate route name for resend
router.post("/resend-otp", otpLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required", code: "VALIDATION_ERROR" });

  try {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) return res.status(400).json({ error: "Failed to resend code", code: "OTP_REQUEST_FAILED" });

    res.json({ message: "Verification code resent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", code: "SERVER_ERROR" });
  }
});

export default router;
