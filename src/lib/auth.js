export function normalizeIdentifier(value = "") {
  const trimmed = value.trim();
  return trimmed.includes("@") ? trimmed.toLowerCase() : trimmed;
}

export function normalizeOtpCredentials({ email, code } = {}) {
  const normalizedEmail = normalizeIdentifier(email);
  const otp = String(code ?? "").trim();

  if (!normalizedEmail) {
    throw new Error("Your email is missing. Please return to sign up.");
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new Error("Please enter the full 6-digit code.");
  }

  return { email: normalizedEmail, otp };
}

export function getPostAuthPath(user) {
  if (user?.role === "admin") return "/admin";
  if (user?.role === "artisan") {
    return user.trade ? "/artisan/dashboard" : "/artisan/build-profile";
  }
  return "/home";
}
