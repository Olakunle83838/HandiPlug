import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
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
  const {
    password,
    verification_code_hash,
    verification_code_expires_at,
    ...rest
  } = u;

  return rest;
}

<<<<<<< HEAD
function issueAuthToken(user, res) {
  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
}

router.post("/register", authLimiter, async (req, res) => {
  const { fullName, email, phone, password, address, role, trade } = req.body;

  if (!fullName || !email || !password || !role || !phone) {
    return res.status(400).json({ error: "Missing required fields", code: "VALIDATION_ERROR" });
=======
function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashOtp(otp) {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}

async function sendOtpEmail({ email, fullName, otp }) {
  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: process.env.BREVO_SENDER_NAME || "HandiPlug",
          email: process.env.BREVO_SENDER_EMAIL,
        },

        to: [
          {
            email,
            name: fullName || "HandiPlug User",
          },
        ],

        subject: "Your HandiPlug verification code",

        htmlContent: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Verify your HandiPlug account</h2>

              <p>Hello ${fullName || "there"},</p>

              <p>
                Use the verification code below to complete your
                registration:
              </p>

              <div style="
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                margin: 25px 0;
              ">
                ${otp}
              </div>

              <p>This code expires in 10 minutes.</p>

              <p>
                If you did not create a HandiPlug account,
                you can ignore this email.
              </p>

              <p>— HandiPlug Team</p>
            </body>
          </html>
        `,

        textContent:
          `Your HandiPlug verification code is ${otp}. ` +
          `This code expires in 10 minutes.`,
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `Brevo email failed: ${errorBody}`
    );
  }

  return response.json();
}


// =====================================================
// REGISTER
// =====================================================

router.post("/register", async (req, res) => {
  const {
    fullName,
    email,
    phone,
    password,
    address,
    role,
    trade,
  } = req.body;

  if (!phone || !password || !role) {
    return res.status(400).json({
      error: "phone, password and role are required",
    });
>>>>>>> 17a0c4f (update on back and frontend)
  }

  if (!email) {
    return res.status(400).json({
      error: "Email is required",
    });
  }

  if (!["customer", "artisan"].includes(role)) {
<<<<<<< HEAD
    return res.status(400).json({ error: "role must be 'customer' or 'artisan'", code: "VALIDATION_ERROR" });
=======
    return res.status(400).json({
      error: "role must be 'customer' or 'artisan'",
    });
>>>>>>> 17a0c4f (update on back and frontend)
  }

  if (password.length < 6) {
<<<<<<< HEAD
    return res.status(400).json({ error: "Password must be at least 6 characters", code: "VALIDATION_ERROR" });
  }

  try {
    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("id, phone, email")
      .or(`phone.eq.${phone}${email ? `,email.eq.${email}` : ''}`);
=======
    return res.status(400).json({
      error: "Password must be at least 6 characters",
    });
  }

  try {
    // ---------------------------------------------
    // Check existing account
    // ---------------------------------------------
>>>>>>> 17a0c4f (update on back and frontend)

    const { data: existingUsers, error: checkError } =
      await supabase
        .from("users")
        .select("id, phone, email")
        .or(`phone.eq.${phone},email.eq.${email}`);

<<<<<<< HEAD
    if (existingUsers.length > 0) {
      if (existingUsers.some(u => u.phone === phone)) {
        return res.status(409).json({ error: "An account with this phone number already exists", code: "VALIDATION_ERROR" });
      }
      if (email && existingUsers.some(u => u.email?.toLowerCase() === email.toLowerCase())) {
        return res.status(409).json({ error: "An account with this email already exists", code: "VALIDATION_ERROR" });
=======
    if (checkError) {
      throw checkError;
    }

    if (existingUsers && existingUsers.length > 0) {

      if (
        existingUsers.some(
          (u) => u.phone === phone
        )
      ) {
        return res.status(409).json({
          error:
            "An account with this phone number already exists",
        });
      }

      if (
        existingUsers.some(
          (u) =>
            u.email &&
            u.email.toLowerCase() ===
              email.toLowerCase()
        )
      ) {
        return res.status(409).json({
          error:
            "An account with this email already exists",
        });
>>>>>>> 17a0c4f (update on back and frontend)
      }
    }

    // ---------------------------------------------
    // Generate OTP
    // ---------------------------------------------

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    // ---------------------------------------------
    // Create user
    // ---------------------------------------------

    const userId = generateId();

    const newUser = {
      id: userId,
      role,
<<<<<<< HEAD
      fullName,
      email: email || null,
=======

      fullName:
        fullName || "New User",

      email,
>>>>>>> 17a0c4f (update on back and frontend)
      phone,

      address:
        address || null,

      password:
        bcrypt.hashSync(password, 10),

      verified: false,
<<<<<<< HEAD
      isSuspended: false,
      createdAt: new Date().toISOString(),
      ...(role === "artisan" ? { trade: trade || null, area: null, yearsExperience: 0, bio: null, hourlyRate: 0, rating: 0, reviewCount: 0 } : {}),
=======

      verification_code_hash:
        otpHash,

      verification_code_expires_at:
        new Date(
          Date.now() + 10 * 60 * 1000
        ).toISOString(),

      createdAt:
        new Date().toISOString(),

      ...(role === "artisan"
        ? {
            trade: trade || null,
            area: null,
            yearsExperience: 0,
            bio: null,
            hourlyRate: 0,
            rating: 0,
            reviewCount: 0,
          }
        : {}),
>>>>>>> 17a0c4f (update on back and frontend)
    };

    // ---------------------------------------------
    // Insert user
    // ---------------------------------------------

    const { error: insertError } =
      await supabase
        .from("users")
        .insert([newUser]);

    if (insertError) {
      throw insertError;
    }

    // ---------------------------------------------
    // Send OTP
    // ---------------------------------------------

    await sendOtpEmail({
      email,
      fullName,
      otp,
    });

    // ---------------------------------------------
    // IMPORTANT:
    // Do NOT create JWT yet.
    // User must verify OTP first.
    // ---------------------------------------------

    return res.status(201).json({
      message:
        "Registration successful. Verification code sent to your email.",

      requiresVerification: true,

      email,
    });

<<<<<<< HEAD
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
=======
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Server error during registration",
    });
  }
});


// =====================================================
// VERIFY OTP
// =====================================================

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      error: "Email and OTP are required",
    });
  }

  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      error: "OTP must be a 6-digit code",
    });
  }

  try {

    const { data: users, error } =
      await supabase
        .from("users")
        .select("*")
        .ilike("email", email)
        .limit(1);

    if (error) {
      throw error;
    }

    const user = users?.[0];

    if (!user) {
      return res.status(404).json({
        error: "Account not found",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        error: "Account is already verified",
      });
    }

    if (!user.verification_code_hash) {
      return res.status(400).json({
        error:
          "No verification code exists. Please request a new code.",
      });
    }

    if (
      !user.verification_code_expires_at ||
      new Date(
        user.verification_code_expires_at
      ) < new Date()
    ) {
      return res.status(400).json({
        error:
          "Verification code has expired. Please request a new code.",
      });
    }

    // ---------------------------------------------
    // Compare OTP
    // ---------------------------------------------

    const submittedHash =
      hashOtp(otp);

    if (
      submittedHash !==
      user.verification_code_hash
    ) {
      return res.status(400).json({
        error: "Invalid verification code",
      });
    }

    // ---------------------------------------------
    // Mark account as verified
    // ---------------------------------------------

    const {
      data: updatedUser,
      error: updateError,
    } = await supabase
      .from("users")
      .update({
        verified: true,

        verification_code_hash:
          null,

        verification_code_expires_at:
          null,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // ---------------------------------------------
    // Create JWT AFTER verification
    // ---------------------------------------------

    const token =
      signToken(updatedUser);

    return res.json({
      message:
        "Email verified successfully",

      token,

      user:
        publicUser(updatedUser),
    });

  } catch (error) {
    console.error(
      "OTP verification error:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Server error during OTP verification",
    });
  }
});


// =====================================================
// LOGIN
// =====================================================

router.post("/login", async (req, res) => {
  const {
    email,
    phone,
    password,
  } = req.body;
>>>>>>> 17a0c4f (update on back and frontend)

  const identifier =
    email || phone;

<<<<<<< HEAD
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
=======
  if (!identifier || !password) {
    return res.status(400).json({
      error:
        "Email/phone and password are required",
    });
>>>>>>> 17a0c4f (update on back and frontend)
  }

  try {

    const {
      data: users,
      error,
    } = await supabase
      .from("users")
      .select("*")
      .or(
        `email.eq.${identifier},phone.eq.${identifier}`
      )
      .limit(1);

<<<<<<< HEAD
    if (error || !user || !bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ error: "Current password is incorrect", code: "INVALID_CREDENTIALS" });
=======
    if (error) {
      throw error;
>>>>>>> 17a0c4f (update on back and frontend)
    }

    const user =
      users?.[0];

    if (!user) {
      return res.status(401).json({
        error:
          "Invalid email/phone or password",
      });
    }

    const passwordMatches =
      bcrypt.compareSync(
        password,
        user.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        error:
          "Invalid email/phone or password",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        error:
          "Please verify your email before logging in",

        requiresVerification:
          true,

        email:
          user.email,
      });
    }

    const token =
      signToken(user);

    return res.json({
      token,

      user:
        publicUser(user),
    });

  } catch (error) {
<<<<<<< HEAD
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
=======

    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      error:
        "Server error during login",
    });
>>>>>>> 17a0c4f (update on back and frontend)
  }
});


// =====================================================
// GET CURRENT USER
// =====================================================

router.get(
  "/me",
  requireAuth,
  async (req, res) => {

    try {

      const {
        data: user,
        error,
      } = await supabase
        .from("users")
        .select("*")
        .eq("id", req.auth.id)
        .single();

      if (error || !user) {
        return res.status(404).json({
          error:
            "User not found",
        });
      }

      return res.json({
        user:
          publicUser(user),
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        error:
          "Server error",
      });
    }
  }
);


// =====================================================
// FORGOT PASSWORD
// =====================================================

router.post(
  "/forgot-password",
  async (req, res) => {

    const { email } =
      req.body;

    try {

      const {
        data: user,
        error,
      } = await supabase
        .from("users")
        .select("id")
        .ilike(
          "email",
          email || ""
        )
        .limit(1);

      if (error) {
        throw error;
      }

      return res.json({
        message:
          user &&
          user.length > 0
            ? "If this were production, a reset link would be emailed to you now."
            : "If an account exists for that email, reset instructions would be sent.",
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        error:
          "Server error",
      });
    }
  }
);


// =====================================================
// CHANGE PASSWORD
// =====================================================

router.patch(
  "/change-password",
  requireAuth,
  async (req, res) => {

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        error:
          "currentPassword and newPassword are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error:
          "New password must be at least 6 characters",
      });
    }

    try {

      const {
        data: user,
        error,
      } = await supabase
        .from("users")
        .select("*")
        .eq(
          "id",
          req.auth.id
        )
        .single();

      if (
        error ||
        !user ||
        !bcrypt.compareSync(
          currentPassword,
          user.password
        )
      ) {
        return res.status(401).json({
          error:
            "Current password is incorrect",
        });
      }

      const hashedPassword =
        bcrypt.hashSync(
          newPassword,
          10
        );

      const {
        error: updateError,
      } = await supabase
        .from("users")
        .update({
          password:
            hashedPassword,
        })
        .eq(
          "id",
          req.auth.id
        );

      if (updateError) {
        throw updateError;
      }

      return res.json({
        message:
          "Password updated",
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        error:
          "Server error",
      });
    }
  }
);


// =====================================================
// EXPORT
// =====================================================

export default router;