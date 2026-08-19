-- SETUP SCRIPT FOR HANDIPLUG SUPABASE

-- 1. ADD NEW COLUMNS TO USERS TABLE (Safe, IF NOT EXISTS behavior conceptually by checking information_schema if possible, or just raw DDL)
-- Postgres doesn't easily support ADD COLUMN IF NOT EXISTS in standard SQL without DO blocks.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='isSuspended') THEN
        ALTER TABLE "users" ADD COLUMN "isSuspended" BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='avatarUrl') THEN
        ALTER TABLE "users" ADD COLUMN "avatarUrl" TEXT;
    END IF;
END $$;


-- 2. CREATE PORTFOLIO IMAGES TABLE
CREATE TABLE IF NOT EXISTS "portfolio_images" (
    "id" TEXT PRIMARY KEY,
    "artisanId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_portfolio_artisan_id" ON "portfolio_images"("artisanId");


-- 3. CREATE NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS "notifications" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_notifications_user_id" ON "notifications"("userId");
CREATE INDEX IF NOT EXISTS "idx_notifications_created_at" ON "notifications"("createdAt" DESC);


-- 4. CREATE MESSAGES TABLE
CREATE TABLE IF NOT EXISTS "messages" (
    "id" TEXT PRIMARY KEY,
    "bookingId" TEXT NOT NULL, -- Would reference bookings(id) if schema known
    "senderId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "receiverId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "text" TEXT NOT NULL CHECK (char_length(trim("text")) > 0),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_messages_booking_id" ON "messages"("bookingId");
CREATE INDEX IF NOT EXISTS "idx_messages_created_at" ON "messages"("createdAt" ASC);


-- 5. BUCKET MANUAL INSTRUCTIONS
/*
  MANUAL ACTIONS REQUIRED IN SUPABASE DASHBOARD:

  1. Go to Storage > Create Bucket "portfolios"
     - Mark as PUBLIC
  2. Go to Storage > Create Bucket "avatars"
     - Mark as PUBLIC
     
  3. Since we use `SUPABASE_SERVICE_KEY` on the backend for all inserts and uploads, 
     we do NOT need RLS insert policies for these buckets for anonymous users.
     The backend securely handles the uploads and generates the safe paths.
*/
