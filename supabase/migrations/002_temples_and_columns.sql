-- ================================================================
-- Migration 002: Temples table + missing columns on existing tables
-- DevSetu Sacred Services Platform
-- ================================================================

-- ── Temples Table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS temples (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name          TEXT NOT NULL,
  city          TEXT,
  state         TEXT,
  deity         TEXT,
  icon          TEXT DEFAULT '🛕',
  description   TEXT,
  address       TEXT,
  phone         TEXT,
  website       TEXT,
  is_live       BOOLEAN DEFAULT FALSE,
  live_url      TEXT,
  image_url     TEXT,
  latitude      DECIMAL(9,6),
  longitude     DECIMAL(9,6),
  pooja_types   TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on temples
ALTER TABLE temples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read temples"
  ON temples FOR SELECT USING (true);

CREATE POLICY "Admin write temples"
  ON temples FOR ALL USING (auth.role() = 'service_role');

-- ── Pandits: add missing columns ──────────────────────────────
ALTER TABLE pandits
  ADD COLUMN IF NOT EXISTS intro_video_url     TEXT,
  ADD COLUMN IF NOT EXISTS review_count        INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_online           BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS bank_account        TEXT,
  ADD COLUMN IF NOT EXISTS ifsc_code           TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url          TEXT,
  ADD COLUMN IF NOT EXISTS aadhaar_verified    BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS languages           TEXT[] DEFAULT '{}';

-- ── Bookings: add missing columns ─────────────────────────────
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS ritual_icon         TEXT DEFAULT '🕉️',
  ADD COLUMN IF NOT EXISTS booking_time        TEXT,
  ADD COLUMN IF NOT EXISTS start_time          TEXT,
  ADD COLUMN IF NOT EXISTS location            TEXT,
  ADD COLUMN IF NOT EXISTS address             TEXT,
  ADD COLUMN IF NOT EXISTS total_amount        DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS devotee_name        TEXT,
  ADD COLUMN IF NOT EXISTS pandit_name         TEXT,
  ADD COLUMN IF NOT EXISTS ritual_name         TEXT,
  ADD COLUMN IF NOT EXISTS notes               TEXT;

-- ── Devotees: add missing columns ─────────────────────────────
ALTER TABLE devotees
  ADD COLUMN IF NOT EXISTS phone               TEXT,
  ADD COLUMN IF NOT EXISTS city                TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url          TEXT,
  ADD COLUMN IF NOT EXISTS sankalp             TEXT,
  ADD COLUMN IF NOT EXISTS referral_code       TEXT,
  ADD COLUMN IF NOT EXISTS karma_points        INTEGER DEFAULT 0;

-- ── Temple Bookings Table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS temple_bookings (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  temple_id     TEXT REFERENCES temples(id),
  devotee_id    TEXT,
  devotee_name  TEXT,
  pooja_type    TEXT,
  booking_date  DATE,
  booking_time  TEXT,
  amount        DECIMAL(10,2),
  status        TEXT DEFAULT 'pending',
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE temple_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Devotees read own temple bookings"
  ON temple_bookings FOR SELECT USING (auth.uid()::text = devotee_id);

CREATE POLICY "Devotees create temple bookings"
  ON temple_bookings FOR INSERT WITH CHECK (true);

-- ── Samagri Orders Table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS samagri_orders (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  devotee_id    TEXT,
  devotee_name  TEXT,
  items         JSONB DEFAULT '[]',
  total_amount  DECIMAL(10,2),
  address       TEXT,
  phone         TEXT,
  status        TEXT DEFAULT 'pending',
  tracking_id   TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE samagri_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Devotees read own samagri orders"
  ON samagri_orders FOR SELECT USING (auth.uid()::text = devotee_id);

CREATE POLICY "Devotees create samagri orders"
  ON samagri_orders FOR INSERT WITH CHECK (true);

-- ── Indexes ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_temples_city ON temples(city);
CREATE INDEX IF NOT EXISTS idx_temples_is_live ON temples(is_live);
CREATE INDEX IF NOT EXISTS idx_pandits_city ON pandits(city);
CREATE INDEX IF NOT EXISTS idx_pandits_status ON pandits(status);
CREATE INDEX IF NOT EXISTS idx_bookings_pandit_id ON bookings(pandit_id);
CREATE INDEX IF NOT EXISTS idx_bookings_devotee_id ON bookings(devotee_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);
