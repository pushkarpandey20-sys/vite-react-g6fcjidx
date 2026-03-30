-- ═══════════════════════════════════════════════
-- DevSetu Production Migration 003
-- Run in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════

-- Bookings: add all columns used by the app
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS start_time         TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_time       TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS devotee_name       TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS devotee_phone      TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pandit_name        TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ritual_icon        TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS location           TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes              TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS samagri_items      JSONB;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at         TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS razorpay_order_id  TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS devotee_rating     INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS devotee_review     TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pandit_rating      INTEGER;

-- Pandits: add all columns used by the app
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS intro_video_url     TEXT;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS bio                 TEXT;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS is_online           BOOLEAN DEFAULT false;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS show_whatsapp       BOOLEAN DEFAULT false;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS bank_account        TEXT;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS ifsc_code           TEXT;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS aadhaar_last4       TEXT;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS total_earnings      INTEGER DEFAULT 0;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS payout_day          TEXT DEFAULT 'Monday';

-- Devotees: add all columns
ALTER TABLE devotees ADD COLUMN IF NOT EXISTS phone              TEXT;
ALTER TABLE devotees ADD COLUMN IF NOT EXISTS city               TEXT DEFAULT 'Delhi';
ALTER TABLE devotees ADD COLUMN IF NOT EXISTS referral_code      TEXT;
ALTER TABLE devotees ADD COLUMN IF NOT EXISTS referred_by        TEXT;
ALTER TABLE devotees ADD COLUMN IF NOT EXISTS credits            INTEGER DEFAULT 0;
ALTER TABLE devotees ADD COLUMN IF NOT EXISTS total_bookings     INTEGER DEFAULT 0;

-- Temples table (create if not exists)
CREATE TABLE IF NOT EXISTS temples (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  city          TEXT,
  deity         TEXT,
  description   TEXT,
  services      TEXT[],
  timing        TEXT,
  is_live       BOOLEAN DEFAULT false,
  image_url     TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID,
  role       TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT,
  user_id    UUID,
  user_role  TEXT,
  metadata   JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id   UUID,
  devotee_id   UUID,
  pandit_id    UUID,
  rating       INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_text  TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id     UUID,
  referred_id     UUID,
  status          TEXT DEFAULT 'pending',
  credits_awarded INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_devotee_id   ON bookings(devotee_id);
CREATE INDEX IF NOT EXISTS idx_bookings_pandit_id    ON bookings(pandit_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status       ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_pandits_status        ON pandits(status);
CREATE INDEX IF NOT EXISTS idx_pandits_city          ON pandits(city);
CREATE INDEX IF NOT EXISTS idx_pandits_is_online     ON pandits(is_online);
CREATE INDEX IF NOT EXISTS idx_reviews_pandit_id     ON reviews(pandit_id);

-- Row Level Security
ALTER TABLE bookings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Bookings policies
DROP POLICY IF EXISTS "Devotees see own bookings"  ON bookings;
DROP POLICY IF EXISTS "Devotees insert own bookings" ON bookings;
DROP POLICY IF EXISTS "Pandits see their bookings"  ON bookings;
CREATE POLICY "Devotees see own bookings"
  ON bookings FOR SELECT USING (auth.uid() = devotee_id OR devotee_id IS NULL);
CREATE POLICY "Devotees insert own bookings"
  ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Pandits see their bookings"
  ON bookings FOR SELECT USING (auth.uid() = pandit_id OR pandit_id IS NULL);

-- Pandits policies
DROP POLICY IF EXISTS "Public read pandits"       ON pandits;
DROP POLICY IF EXISTS "Pandits update own profile" ON pandits;
DROP POLICY IF EXISTS "Insert pandits"             ON pandits;
CREATE POLICY "Public read pandits"
  ON pandits FOR SELECT USING (true);
CREATE POLICY "Pandits update own profile"
  ON pandits FOR UPDATE USING (true);
CREATE POLICY "Insert pandits"
  ON pandits FOR INSERT WITH CHECK (true);

-- Reviews policies
DROP POLICY IF EXISTS "Public read reviews"   ON reviews;
DROP POLICY IF EXISTS "Devotees write reviews" ON reviews;
CREATE POLICY "Public read reviews"
  ON reviews FOR SELECT USING (true);
CREATE POLICY "Devotees write reviews"
  ON reviews FOR INSERT WITH CHECK (true);

-- Analytics policies
DROP POLICY IF EXISTS "Insert analytics" ON analytics_events;
CREATE POLICY "Insert analytics"
  ON analytics_events FOR INSERT WITH CHECK (true);
