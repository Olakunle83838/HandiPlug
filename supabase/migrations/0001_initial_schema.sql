CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('customer', 'artisan', 'admin')),
  "fullName" TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  address TEXT,
  verified BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Artisan specific fields
  trade TEXT,
  area TEXT,
  "yearsExperience" INTEGER DEFAULT 0,
  bio TEXT,
  "hourlyRate" NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  "reviewCount" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  "customerId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "artisanId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  detail TEXT NOT NULL,
  date TEXT,
  time TEXT,
  location TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  "artisanId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "bookingId" TEXT,
  "customerId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "kycSubmissions" (
  id TEXT PRIMARY KEY,
  "artisanId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "documentType" TEXT,
  "fileName" TEXT,
  "originalName" TEXT,
  "ninNumber" TEXT,
  "selfieFileName" TEXT,
  guarantors JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  "submittedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  "senderId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "receiverId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
