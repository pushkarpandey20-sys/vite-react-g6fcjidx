-- ═══════════════════════════════════════════════════════
-- DevSetu Production Migration 003
-- Run ONCE in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════

-- ── BOOKINGS: core columns (run these first if not already done) ──
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ritual_name          TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_amount         NUMERIC DEFAULT 0;

-- ── BOOKINGS: extended columns ──
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS razorpay_payment_id  TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS razorpay_order_id    TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS devotee_rating        INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS devotee_review        TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS devotee_name          TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pandit_name           TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ritual_icon           TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_time          TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS start_time            TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS location              TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes                 TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS samagri_items         JSONB;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at            TIMESTAMPTZ;

-- ── PANDITS: core columns (missing from initial schema) ──
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS years_of_experience   INTEGER DEFAULT 0;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS rating                NUMERIC(3,1) DEFAULT 0;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS review_count          INTEGER DEFAULT 0;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS min_fee               NUMERIC DEFAULT 0;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS max_fee               NUMERIC DEFAULT 0;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS specializations       TEXT[] DEFAULT '{}';
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS languages             TEXT[] DEFAULT '{}';
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS status                TEXT DEFAULT 'pending_verification';

-- ── PANDITS: extended columns ──
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS bio                   TEXT;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS intro_video_url       TEXT;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS is_online             BOOLEAN DEFAULT false;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS show_whatsapp         BOOLEAN DEFAULT false;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS bank_account          TEXT;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS ifsc_code             TEXT;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS total_earnings        INTEGER DEFAULT 0;
ALTER TABLE pandits ADD COLUMN IF NOT EXISTS availability_slots    JSONB;

-- ── REVIEWS table ──
CREATE TABLE IF NOT EXISTS reviews (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id   UUID REFERENCES bookings(id) ON DELETE CASCADE,
  devotee_id   UUID,
  pandit_id    UUID,
  rating       INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_text  TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ── INDEXES ──
CREATE INDEX IF NOT EXISTS idx_bookings_devotee  ON bookings(devotee_id);
CREATE INDEX IF NOT EXISTS idx_bookings_pandit   ON bookings(pandit_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status   ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_pandits_status    ON pandits(status);
CREATE INDEX IF NOT EXISTS idx_pandits_city      ON pandits(city);

-- ── ROW LEVEL SECURITY ──
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pandits  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Devotees insert own bookings" ON bookings;
CREATE POLICY "Devotees insert own bookings"
  ON bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Devotees see own bookings" ON bookings;
CREATE POLICY "Devotees see own bookings"
  ON bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Pandits read verified" ON pandits;
CREATE POLICY "Pandits read verified"
  ON pandits FOR SELECT USING (true);

DROP POLICY IF EXISTS "Pandits insert own" ON pandits;
CREATE POLICY "Pandits insert own"
  ON pandits FOR INSERT WITH CHECK (true);
