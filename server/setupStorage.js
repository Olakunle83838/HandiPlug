import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  console.log("Ensuring 'kyc-documents' bucket exists...");
  const { data, error } = await supabase.storage.createBucket("kyc-documents", {
    public: false,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ["image/png", "image/jpeg", "application/pdf"],
  });

  if (error) {
    if (error.message.includes("already exists") || error.error === "Duplicate") {
      console.log("Bucket 'kyc-documents' already exists.");
    } else {
      console.error("Failed to create bucket:", error.message);
    }
  } else {
    console.log("Created 'kyc-documents' bucket successfully.");
  }
}

setup();
