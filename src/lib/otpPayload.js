export function createOtpPayload({ email, code } = {}) {
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const otp = typeof code === "string" ? code.trim() : "";

  if (!normalizedEmail) {
    throw new Error("Your email is missing. Please return to signup.");
  }
  if (!/^\d{6}$/.test(otp)) {
    throw new Error("Please enter the full 6-digit code.");
  }

  return { email: normalizedEmail, otp };
}
