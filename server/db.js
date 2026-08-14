// Minimal file-backed JSON "database". No native dependencies, so it
// installs and runs anywhere `npm install` works — swap for Postgres/Mongo
// later without touching the route files much, since everything goes
// through the functions exported here.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "data", "db.json");

function seedData() {
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

  return {
    users,
    bookings: [],
    reviews: [],
    kycSubmissions: [],
    messages: [],
  };
}

function load() {
  if (!fs.existsSync(DB_FILE)) {
    const data = seedData();
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return data;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export const db = {
  read: load,
  write: save,
  id: () => nanoid(12),
};
