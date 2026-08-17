import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
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

async function seed() {
  console.log("Seeding demo accounts to Supabase...");
  const hash = (pw) => bcrypt.hashSync(pw, 10);
  const now = new Date().toISOString();

  const users = [
    {
      id: "u_admin",
      role: "admin",
      fullName: "HandiPlug Admin",
      email: "admin@handiplug.ng",
      phone: "+2348000000000",
      password: hash("admin1234"),
      verified: true,
      createdAt: now,
    },
    {
      id: "u_ifeanyi",
      role: "artisan",
      fullName: "Ifeanyi Obi",
      email: "ifeanyi@handiplug.ng",
      phone: "+2348011111111",
      password: hash("password123"),
      trade: "Electrician",
      area: "Lekki",
      yearsExperience: 6,
      bio: "Certified electrician specialising in home wiring, installations, and repairs.",
      hourlyRate: 6500,
      verified: true,
      rating: 5,
      reviewCount: 84,
      createdAt: now,
    },
    {
      id: "u_tunde",
      role: "artisan",
      fullName: "Tunde Bakare",
      email: "tunde@handiplug.ng",
      phone: "+2348022222222",
      password: hash("password123"),
      trade: "Carpenter",
      area: "Ikeja",
      yearsExperience: 8,
      bio: "Custom furniture and home carpentry, fast turnaround.",
      hourlyRate: 8000,
      verified: true,
      rating: 5,
      reviewCount: 41,
      createdAt: now,
    },
    {
      id: "u_musa",
      role: "artisan",
      fullName: "Musa Sani",
      email: "musa@handiplug.ng",
      phone: "+2348033333333",
      password: hash("password123"),
      trade: "Plumber",
      area: "Yaba",
      yearsExperience: 4,
      bio: "Reliable plumbing repairs and installations across Lagos mainland.",
      hourlyRate: 5000,
      verified: false,
      rating: 4,
      reviewCount: 12,
      createdAt: now,
    },
  ];

  for (const user of users) {
    // Upsert so it doesn't fail if they already exist
    const { error } = await supabase.from("users").upsert(user, { onConflict: "id" });
    if (error) {
      console.error(`Failed to insert ${user.email}:`, error.message);
    } else {
      console.log(`Inserted ${user.email}`);
    }
  }
  
  console.log("Done!");
}

seed();
