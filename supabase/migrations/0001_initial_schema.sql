-- CLEANUP OLD TABLES IF RE-RUNNING
DROP TABLE IF EXISTS "messages";
DROP TABLE IF EXISTS "notifications";
DROP TABLE IF EXISTS "portfolio_images";
DROP TABLE IF EXISTS "kycSubmissions";
DROP TABLE IF EXISTS "reviews";
DROP TABLE IF EXISTS "bookings";
DROP TABLE IF EXISTS "users";

CREATE TABLE "users" (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('customer', 'artisan', 'admin')),
  "fullName" TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  address TEXT,
  verified BOOLEAN DEFAULT FALSE,
  "isSuspended" BOOLEAN DEFAULT FALSE,
  "avatarUrl" TEXT,
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

CREATE TABLE "bookings" (
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

CREATE TABLE "reviews" (
  id TEXT PRIMARY KEY,
  "artisanId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "bookingId" TEXT,
  "customerId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "kycSubmissions" (
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

CREATE TABLE "portfolio_images" (
    "id" TEXT PRIMARY KEY,
    "artisanId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX "idx_portfolio_artisan_id" ON "portfolio_images"("artisanId");

CREATE TABLE "notifications" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX "idx_notifications_user_id" ON "notifications"("userId");
CREATE INDEX "idx_notifications_created_at" ON "notifications"("createdAt" DESC);

CREATE TABLE "messages" (
    "id" TEXT PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "receiverId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "text" TEXT NOT NULL CHECK (char_length(trim("text")) > 0),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX "idx_messages_booking_id" ON "messages"("bookingId");
CREATE INDEX "idx_messages_created_at" ON "messages"("createdAt" ASC);
