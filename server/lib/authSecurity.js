import crypto from "crypto";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && EMAIL_PATTERN.test(email) ? email : null;
}

export function normalizePhone(value) {
  if (typeof value !== "string") return null;
  const phone = value.replace(/[\s()-]/g, "").trim();
  return /^\+?\d{10,15}$/.test(phone) ? phone : null;
}

export function validateRegistration(input) {
  const fullName = typeof input?.fullName === "string" ? input.fullName.trim() : "";
  const email = normalizeEmail(input?.email);
  const phone = normalizePhone(input?.phone);
  const password = typeof input?.password === "string" ? input.password : "";
  const role = input?.role;
  const address = typeof input?.address === "string" ? input.address.trim() : "";

  if (!fullName || !input?.email || !input?.phone || !password || !role) {
    return { code: "VALIDATION_ERROR", error: "Full name, email, phone, password and role are required" };
  }
  if (fullName.length < 2 || fullName.length > 120) {
    return { code: "VALIDATION_ERROR", error: "Full name must be between 2 and 120 characters" };
  }
  if (!email) return { code: "INVALID_EMAIL", error: "Enter a valid email address" };
  if (!phone) return { code: "INVALID_PHONE", error: "Enter a valid phone number" };
  if (!['customer', 'artisan'].includes(role)) {
    return { code: "VALIDATION_ERROR", error: "role must be 'customer' or 'artisan'" };
  }
  if (password.length < 8 || password.length > 128) {
    return { code: "WEAK_PASSWORD", error: "Password must be between 8 and 128 characters" };
  }
  if (address.length > 300) {
    return { code: "VALIDATION_ERROR", error: "Address must not exceed 300 characters" };
  }

  return { value: { fullName, email, phone, password, role, address } };
}

export function secureHashEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;
  if (!/^[a-f0-9]{64}$/i.test(left) || !/^[a-f0-9]{64}$/i.test(right)) return false;
  return crypto.timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
}
