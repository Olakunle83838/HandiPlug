import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials not found in environment variables. Backend will fail on DB queries.");
}

const isValidUrl = (url) => {
  try { return new URL(url).protocol.startsWith("http"); } 
  catch { return false; }
};

const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl : "http://localhost:54321";

export const supabase = createClient(finalUrl, supabaseKey || "dummy");

// Helper function to generate unique IDs similar to nanoid
export const generateId = () => {
  return Math.random().toString(36).substring(2, 14);
};
