import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { supabase, generateId } from "../supabase.js";
import { signToken, requireAuth } from "../middleware/auth.js";
import rateLimit from "express-rate-limit";

const router = Router();

/*
|--------------------------------------------------------------------------
| RATE LIMITERS
|--------------------------------------------------------------------------
*/

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,

  message: {
    error: "Too many requests from this IP, please try again after a minute",
    code: "RATE_LIMITED",
  },

  // Vercel/proxy compatibility
  validate: {
    forwardedHeader: false,
  },
});

const otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,

  message: {
    error: "Too many OTP requests. Please wait a minute before trying again.",
    code: "RATE_LIMITED",
  },

  // Vercel/proxy compatibility
  validate: {
    forwardedHeader: false,
  },
});

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function publicUser(user) {
  if (!user) return null;

  const {
    password,
    verification_code_hash,
    verification_code_expires_at,
    ...rest
  } = user;

  return rest;
}

function issueAuthToken(user, res) {
  const token = signToken(user);

  return res.json({
    token,
    user: publicUser(user),
  });
}

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashOtp(otp) {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}

/*
|--------------------------------------------------------------------------
| BREVO EMAIL
|--------------------------------------------------------------------------
*/

async function sendOtpEmail({ email, fullName, otp }) {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not configured");
  }

  if (!process.env.BREVO_SENDER_EMAIL) {
    throw new Error("BREVO_SENDER_EMAIL is not configured");
  }

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
            <head>
              <meta charset="UTF-8" />
              <title>HandiPlug Verification Code</title>
            </head>

            <body
              style="
                margin: 0;
                padding: 0;
                background: #f5f7fb;
                font-family: Arial, Helvetica, sans-serif;
              "
            >
              <div
                style="
                  max-width: 600px;
                  margin: 40px auto;
                  background: #ffffff;
                  border-radius: 12px;
                  padding: 35px;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
                "
              >

                <h2 style="color: #1f2937; margin-bottom: 20px;">
                  Verify your HandiPlug account
                </h2>

                <p style="color: #4b5563; font-size: 16px;">
                  Hello ${fullName || "there"},
                </p>

                <p style="color: #4b5563; font-size: 16px;">
                  Use the verification code below to complete
                  your HandiPlug registration.
                </p>

                <div
                  style="
                    text-align: center;
                    margin: 30px 0;
                    padding: 20px;
                    background: #f3f6ff;
                    border-radius: 10px;
                  "
                >
                  <span
                    style="
                      font-size: 32px;
                      font-weight: bold;
                      letter-spacing: 8px;
                      color: #1c4cd1;
                    "
                  >
                    ${otp}
                  </span>
                </div>

                <p style="color: #6b7280;">
                  This verification code expires in
                  <strong>10 minutes</strong>.
                </p>

                <p style="color: #6b7280;">
                  If you did not create a HandiPlug account,
                  you can safely ignore this email.
                </p>

                <p
                  style="
                    margin-top: 30px;
                    color: #374151;
                  "
                >
                  — HandiPlug Team
                </p>

              </div>
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

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  authLimiter,
  async (req, res) => {
    const {
      fullName,
      email,
      phone,
      password,
      address,
      role,
      trade,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        error:
          "Full name, email, phone, password and role are required",
        code: "VALIDATION_ERROR",
      });
    }

    if (
      !["customer", "artisan"].includes(role)
    ) {
      return res.status(400).json({
        error:
          "role must be 'customer' or 'artisan'",
        code: "VALIDATION_ERROR",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters",
        code: "VALIDATION_ERROR",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    try {
      /*
      |--------------------------------------------------------------------------
      | Check existing account
      |--------------------------------------------------------------------------
      */

      const {
        data: existingUsers,
        error: checkError,
      } = await supabase
        .from("users")
        .select("id, phone, email")
        .or(
          `phone.eq.${phone},email.eq.${normalizedEmail}`
        );

      if (checkError) {
        throw checkError;
      }

      if (
        existingUsers &&
        existingUsers.length > 0
      ) {
        if (
          existingUsers.some(
            (user) =>
              user.phone === phone
          )
        ) {
          return res.status(409).json({
            error:
              "An account with this phone number already exists",
            code: "PHONE_EXISTS",
          });
        }

        if (
          existingUsers.some(
            (user) =>
              user.email &&
              user.email.toLowerCase() ===
                normalizedEmail
          )
        ) {
          return res.status(409).json({
            error:
              "An account with this email already exists",
            code: "EMAIL_EXISTS",
          });
        }
      }

      /*
      |--------------------------------------------------------------------------
      | Generate OTP
      |--------------------------------------------------------------------------
      */

      const otp = generateOtp();

      const otpHash = hashOtp(otp);

      const otpExpiresAt =
        new Date(
          Date.now() + 10 * 60 * 1000
        ).toISOString();

      /*
      |--------------------------------------------------------------------------
      | Create user
      |--------------------------------------------------------------------------
      */

      const userId = generateId();

      const hashedPassword =
        await bcrypt.hash(password, 10);

      const newUser = {
        id: userId,

        role,

        fullName:
          fullName.trim(),

        email:
          normalizedEmail,

        phone,

        address:
          address || null,

        password:
          hashedPassword,

        verified:
          false,

        verification_code_hash:
          otpHash,

        verification_code_expires_at:
          otpExpiresAt,

        isSuspended:
          false,

        createdAt:
          new Date().toISOString(),

        ...(role === "artisan"
          ? {
              trade:
                trade || null,

              area: null,

              yearsExperience: 0,

              bio: null,

              hourlyRate: 0,

              rating: 0,

              reviewCount: 0,
            }
          : {}),
      };

      /*
      |--------------------------------------------------------------------------
      | Insert user into Supabase database
      |--------------------------------------------------------------------------
      */

      const {
        error: insertError,
      } = await supabase
        .from("users")
        .insert([newUser]);

      if (insertError) {
        throw insertError;
      }

      /*
      |--------------------------------------------------------------------------
      | Send OTP using Brevo
      |--------------------------------------------------------------------------
      */

      await sendOtpEmail({
        email: normalizedEmail,
        fullName,
        otp,
      });

      /*
      |--------------------------------------------------------------------------
      | Registration successful
      |--------------------------------------------------------------------------
      */

      return res.status(201).json({
        message:
          "Registration successful. Verification code sent to your email.",

        requiresVerification:
          true,

        email:
          normalizedEmail,
      });

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Server error during registration",

        code:
          "REGISTRATION_ERROR",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| VERIFY OTP
|--------------------------------------------------------------------------
*/

router.post(
  "/verify-otp",
  authLimiter,
  async (req, res) => {
    const {
      email,
      otp,
    } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error:
          "Email and OTP are required",
        code:
          "VALIDATION_ERROR",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        error:
          "OTP must be a 6-digit code",
        code:
          "INVALID_OTP_FORMAT",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    try {
      /*
      |--------------------------------------------------------------------------
      | Find user
      |--------------------------------------------------------------------------
      */

      const {
        data: users,
        error: fetchError,
      } = await supabase
        .from("users")
        .select("*")
        .ilike(
          "email",
          normalizedEmail
        )
        .limit(1);

      if (fetchError) {
        throw fetchError;
      }

      const user =
        users?.[0];

      if (!user) {
        return res.status(404).json({
          error:
            "Account not found",
          code:
            "ACCOUNT_NOT_FOUND",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Already verified?
      |--------------------------------------------------------------------------
      */

      if (user.verified) {
        return res.status(400).json({
          error:
            "Account is already verified",
          code:
            "ALREADY_VERIFIED",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Check OTP exists
      |--------------------------------------------------------------------------
      */

      if (
        !user.verification_code_hash
      ) {
        return res.status(400).json({
          error:
            "No verification code exists. Please request a new code.",
          code:
            "OTP_NOT_FOUND",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Check expiration
      |--------------------------------------------------------------------------
      */

      if (
        !user.verification_code_expires_at ||
        new Date(
          user.verification_code_expires_at
        ) < new Date()
      ) {
        return res.status(400).json({
          error:
            "Verification code has expired. Please request a new code.",
          code:
            "OTP_EXPIRED",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Compare OTP
      |--------------------------------------------------------------------------
      */

      const submittedHash =
        hashOtp(otp);

      if (
        submittedHash !==
        user.verification_code_hash
      ) {
        return res.status(400).json({
          error:
            "Invalid verification code",
          code:
            "OTP_INVALID",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Mark account as verified
      |--------------------------------------------------------------------------
      */

      const {
        data: updatedUser,
        error: updateError,
      } = await supabase
        .from("users")
        .update({
          verified:
            true,

          verification_code_hash:
            null,

          verification_code_expires_at:
            null,
        })
        .eq(
          "id",
          user.id
        )
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      /*
      |--------------------------------------------------------------------------
      | Create JWT
      |--------------------------------------------------------------------------
      */

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

        code:
          "OTP_VERIFICATION_ERROR",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| RESEND OTP
|--------------------------------------------------------------------------
*/

router.post(
  "/resend-otp",
  otpLimiter,
  async (req, res) => {
    const { email } =
      req.body;

    if (!email) {
      return res.status(400).json({
        error:
          "Email is required",
        code:
          "VALIDATION_ERROR",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    try {
      /*
      |--------------------------------------------------------------------------
      | Find account
      |--------------------------------------------------------------------------
      */

      const {
        data: users,
        error: fetchError,
      } = await supabase
        .from("users")
        .select(
          "id, email, fullName, verified"
        )
        .ilike(
          "email",
          normalizedEmail
        )
        .limit(1);

      if (fetchError) {
        throw fetchError;
      }

      const user =
        users?.[0];

      if (!user) {
        return res.status(404).json({
          error:
            "Account not found",
          code:
            "ACCOUNT_NOT_FOUND",
        });
      }

      if (user.verified) {
        return res.status(400).json({
          error:
            "Account is already verified",
          code:
            "ALREADY_VERIFIED",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Generate new OTP
      |--------------------------------------------------------------------------
      */

      const otp =
        generateOtp();

      const otpHash =
        hashOtp(otp);

      const expiresAt =
        new Date(
          Date.now() + 10 * 60 * 1000
        ).toISOString();

      /*
      |--------------------------------------------------------------------------
      | Update OTP in database
      |--------------------------------------------------------------------------
      */

      const {
        error: updateError,
      } = await supabase
        .from("users")
        .update({
          verification_code_hash:
            otpHash,

          verification_code_expires_at:
            expiresAt,
        })
        .eq(
          "id",
          user.id
        );

      if (updateError) {
        throw updateError;
      }

      /*
      |--------------------------------------------------------------------------
      | Send new OTP through Brevo
      |--------------------------------------------------------------------------
      */

      await sendOtpEmail({
        email:
          normalizedEmail,

        fullName:
          user.fullName,

        otp,
      });

      return res.json({
        message:
          "Verification code resent successfully",
      });

    } catch (error) {
      console.error(
        "Resend OTP error:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Failed to resend verification code",

        code:
          "RESEND_OTP_ERROR",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

router.post(
  "/login",
  authLimiter,
  async (req, res) => {
    const {
      email,
      phone,
      password,
    } = req.body;

    const identifier =
      email || phone;

    if (
      !identifier ||
      !password
    ) {
      return res.status(400).json({
        error:
          "Email/phone and password are required",
        code:
          "VALIDATION_ERROR",
      });
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

      if (error) {
        throw error;
      }

      const user =
        users?.[0];

      if (!user) {
        return res.status(401).json({
          error:
            "Invalid email/phone or password",
          code:
            "INVALID_CREDENTIALS",
        });
      }

      const passwordMatches =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!passwordMatches) {
        return res.status(401).json({
          error:
            "Invalid email/phone or password",
          code:
            "INVALID_CREDENTIALS",
        });
      }

      if (user.isSuspended) {
        return res.status(403).json({
          error:
            "This account has been suspended",
          code:
            "ACCOUNT_SUSPENDED",
        });
      }

      if (!user.verified) {
        return res.status(403).json({
          error:
            "Please verify your email before logging in",

          code:
            "EMAIL_NOT_VERIFIED",

          requiresVerification:
            true,

          email:
            user.email,
        });
      }

      return issueAuthToken(
        user,
        res
      );

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return res.status(500).json({
        error:
          "Server error during login",

        code:
          "LOGIN_ERROR",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| GET CURRENT USER
|--------------------------------------------------------------------------
*/

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
        .eq(
          "id",
          req.auth.id
        )
        .single();

      if (error || !user) {
        return res.status(404).json({
          error:
            "User not found",
          code:
            "ACCOUNT_NOT_FOUND",
        });
      }

      if (user.isSuspended) {
        return res.status(403).json({
          error:
            "Account suspended",
          code:
            "ACCOUNT_SUSPENDED",
        });
      }

      return res.json({
        user:
          publicUser(user),
      });

    } catch (error) {
      console.error(
        "Get current user error:",
        error
      );

      return res.status(500).json({
        error:
          "Server error",
        code:
          "SERVER_ERROR",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| FORGOT PASSWORD
|--------------------------------------------------------------------------
*/

router.post(
  "/forgot-password",
  authLimiter,
  async (req, res) => {
    const { email } =
      req.body;

    if (!email) {
      return res.status(400).json({
        error:
          "Email is required",
        code:
          "VALIDATION_ERROR",
      });
    }

    try {
      const {
        data: users,
        error,
      } = await supabase
        .from("users")
        .select("id")
        .ilike(
          "email",
          email.trim().toLowerCase()
        )
        .limit(1);

      if (error) {
        throw error;
      }

      return res.json({
        message:
          users &&
          users.length > 0
            ? "If this were production, a reset link would be emailed to you now."
            : "If an account exists for that email, reset instructions would be sent.",
      });

    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      return res.status(500).json({
        error:
          "Server error",
        code:
          "SERVER_ERROR",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| CHANGE PASSWORD
|--------------------------------------------------------------------------
*/

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
        code:
          "VALIDATION_ERROR",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error:
          "New password must be at least 6 characters",
        code:
          "VALIDATION_ERROR",
      });
    }

    try {
      /*
      |--------------------------------------------------------------------------
      | Get current user
      |--------------------------------------------------------------------------
      */

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
        !user
      ) {
        return res.status(404).json({
          error:
            "User not found",
          code:
            "ACCOUNT_NOT_FOUND",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Verify current password
      |--------------------------------------------------------------------------
      */

      const passwordMatches =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!passwordMatches) {
        return res.status(401).json({
          error:
            "Current password is incorrect",
          code:
            "INVALID_CREDENTIALS",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Hash new password
      |--------------------------------------------------------------------------
      */

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      /*
      |--------------------------------------------------------------------------
      | Update password
      |--------------------------------------------------------------------------
      */

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
          "Password updated successfully",
      });

    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      return res.status(500).json({
        error:
          "Server error",
        code:
          "SERVER_ERROR",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default router;