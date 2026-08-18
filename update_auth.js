import fs from 'fs';

let content = fs.readFileSync('server/routes/auth.js', 'utf8');

// Add express-rate-limit import
content = content.replace(
  'import { signToken, requireAuth } from "../middleware/auth.js";',
  'import { signToken, requireAuth } from "../middleware/auth.js";\nimport rateLimit from "express-rate-limit";\n\nconst authLimiter = rateLimit({\n  windowMs: 1 * 60 * 1000, // 1 minute\n  max: 5, // limit each IP to 5 requests per windowMs\n  message: { error: "Too many requests from this IP, please try again after a minute" }\n});\n\nconst otpLimiter = rateLimit({\n  windowMs: 1 * 60 * 1000,\n  max: 3,\n  message: { error: "Too many OTP requests. Please wait a minute before trying again." }\n});'
);

// Update register route to use limiter and new logic
content = content.replace(
  'router.post("/register", async (req, res) => {',
  'router.post("/register", authLimiter, async (req, res) => {'
);

// Require fullName and email
content = content.replace(
  'if (!phone || !password || !role) {',
  'if (!fullName || !email || !password || !role) {\n    return res.status(400).json({ error: "fullName, email, password and role are required" });\n  }\n  if (!phone) {'
);

// Fix New User fallback
content = content.replace(
  'fullName: fullName || "New User",',
  'fullName: fullName,'
);

// Send OTP instead of returning token immediately
content = content.replace(
  'const token = signToken(newUser);\n    res.status(201).json({ token, user: publicUser(newUser) });',
  `// Send Supabase Email OTP
    const { error: otpError } = await supabase.auth.signInWithOtp({ email });
    if (otpError) {
      console.error("OTP send error:", otpError);
      return res.status(500).json({ error: "Failed to send verification code" });
    }

    // Do NOT return token yet. User must verify OTP.
    res.status(201).json({ message: "Verification code sent to email" });`
);

// Apply limiter to login
content = content.replace(
  'router.post("/login", async (req, res) => {',
  'router.post("/login", authLimiter, async (req, res) => {'
);

// Add verify-otp and resend-otp
const additionalRoutes = `
router.post("/verify-otp", authLimiter, async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

  try {
    const { data, error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    if (error) {
      return res.status(400).json({ error: "Invalid or expired verification code" });
    }

    // Mark user as verified in our table
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ verified: true })
      .eq("email", email)
      .select()
      .single();

    if (updateError) throw updateError;

    // Issue custom JWT for the app
    const token = signToken(updatedUser);
    res.json({ token, user: publicUser(updatedUser) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during verification" });
  }
});

router.post("/resend-otp", otpLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) return res.status(400).json({ error: "Failed to resend code" });

    res.json({ message: "Verification code resent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
`;

content = content.replace('export default router;', additionalRoutes + '\nexport default router;');

fs.writeFileSync('server/routes/auth.js', content);
