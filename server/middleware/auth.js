import jwt from "jsonwebtoken";
import { supabase } from "../supabase.js";

const SECRET = process.env.JWT_SECRET || "HandiPlugSuperSecretKey_2026!SecureAuth#91";

export function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "7d" });
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing or invalid token", code: "UNAUTHORIZED" });
  try {
    const payload = jwt.verify(token, SECRET);
    
    // Check suspension via a lightweight DB lookup
    const { data: user, error } = await supabase
      .from("users")
      .select("id, isSuspended")
      .eq("id", payload.id)
      .limit(1);
      
    if (error || !user || user.length === 0) {
      return res.status(401).json({ error: "Account not found", code: "ACCOUNT_NOT_FOUND" });
    }
    if (user[0].isSuspended) {
      return res.status(403).json({ error: "Account suspended", code: "ACCOUNT_SUSPENDED" });
    }
    
    req.auth = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token", code: "UNAUTHORIZED" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({ error: "Not allowed for your account type", code: "FORBIDDEN" });
    }
    next();
  };
}
