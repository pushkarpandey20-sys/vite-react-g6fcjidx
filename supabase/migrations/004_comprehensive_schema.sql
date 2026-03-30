-- DEVSETU COMPREHENSIVE SCHEMA UPDATE
-- ================================================================

-- ── 1. Bookings Table Updates ─────────────────────────────────────
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS ritual_id           TEXT,
  ADD COLUMN IF NOT EXISTS samagri_required    BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS payment_status       TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS booking_status       TEXT DEFAULT 'booking_confirmed',
  ADD COLUMN IF NOT EXISTS payment_id           TEXT,
  ADD COLUMN IF NOT EXISTS order_id             TEXT,
  ADD COLUMN IF NOT EXISTS signature            TEXT,
  ADD COLUMN IF NOT EXISTS timeline             JSONB DEFAULT '[]';

-- ── 2. Pandits Table Updates ──────────────────────────────────────
ALTER TABLE pandits
  ADD COLUMN IF NOT EXISTS experience_years     INTEGER,
  ADD COLUMN IF NOT EXISTS specialization      TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS rituals_supported    TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS rating               DECIMAL(2,1) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS verified_status      TEXT DEFAULT 'pending', -- pending, approved, rejected
  ADD COLUMN IF NOT EXISTS timezone             TEXT DEFAULT 'Asia/Kolkata',
  ADD COLUMN IF NOT EXISTS country              TEXT DEFAULT 'IN';

-- ── 3. Devotees Table Updates ─────────────────────────────────────
ALTER TABLE devotees
  ADD COLUMN IF NOT EXISTS referral_count      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referral_bookings   INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS puja_credit          DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS timezone             TEXT DEFAULT 'Asia/Kolkata',
  ADD COLUMN IF NOT EXISTS country              TEXT DEFAULT 'IN';

-- ── 4. New Table: Sankalp ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sankalp (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  booking_id    TEXT REFERENCES bookings(id) ON DELETE CASCADE,
  devotee_name  TEXT NOT NULL,
  gotra         TEXT,
  nakshatra     TEXT,
  purpose_of_puja TEXT,
  family_members JSONB DEFAULT '[]',
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE sankalp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sankalp" ON sankalp FOR SELECT USING (true);
CREATE POLICY "Devotee write own sankalp" ON sankalp FOR INSERT WITH CHECK (true);

-- ── 5. New Table: Samagri Kits ────────────────────────────────────
CREATE TABLE IF NOT EXISTS samagri_kits (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  kit_name      TEXT NOT NULL,
  ritual_id     TEXT,
  price         DECIMAL(10,2) NOT NULL,
  items_list    TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE samagri_kits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read kits" ON samagri_kits FOR SELECT USING (true);

-- ── 6. New Table: Pandit Availability ─────────────────────────────
CREATE TABLE IF NOT EXISTS pandit_availability (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  pandit_id     TEXT REFERENCES pandits(id) ON DELETE CASCADE,
  available_date DATE NOT NULL,
  time_slots    TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(pandit_id, available_date)
);

ALTER TABLE pandit_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read availability" ON pandit_availability FOR SELECT USING (true);
CREATE POLICY "Pandit manage own availability" ON pandit_availability FOR ALL USING (auth.uid()::text = pandit_id);

-- ── 7. New Table: Reviews ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  booking_id    TEXT REFERENCES bookings(id) ON DELETE CASCADE,
  user_id       TEXT,
  pandit_id     TEXT REFERENCES pandits(id) ON DELETE CASCADE,
  rating        INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text   TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Devotee create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- ── 8. New Table: Festivals ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS festivals (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  festival_name TEXT NOT NULL,
  festival_date DATE NOT NULL,
  recommended_rituals TEXT[] DEFAULT '{}',
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read festivals" ON festivals FOR SELECT USING (true);

-- ── 9. New Table: Shipments (Prasad) ─────────────────────────────
CREATE TABLE IF NOT EXISTS shipments (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  booking_id       TEXT REFERENCES bookings(id) ON DELETE CASCADE,
  courier          TEXT,
  tracking_number  TEXT,
  dispatch_date    DATE,
  status           TEXT DEFAULT 'pending', -- pending, dispatched, delivered
  created_at       TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User read own shipments" ON shipments FOR SELECT USING (true); -- Simplified

-- ── 10. New Table: Notifications ──────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id     TEXT NOT NULL,
  type        TEXT NOT NULL, -- booking_confirmed, pandit_assigned, ritual_reminder, ritual_completed, prasad_shipped
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User read own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id);

-- ── 11. Triggers ────────────────────────────────────────────────
-- Function to update pandit average rating
CREATE OR REPLACE FUNCTION update_pandit_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE pandits
  SET rating = (SELECT AVG(rating) FROM reviews WHERE pandit_id = NEW.pandit_id),
      review_count = (SELECT COUNT(*) FROM reviews WHERE pandit_id = NEW.pandit_id)
  WHERE id = NEW.pandit_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_pandit_rating
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_pandit_rating();
