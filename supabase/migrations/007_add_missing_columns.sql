-- ================================================================
-- Migration 007: Add all columns missing from pandits + bookings
-- Run once in Supabase SQL Editor
-- ================================================================

-- ── Pandits: missing columns ─────────────────────────────────────
ALTER TABLE pandits
  ADD COLUMN IF NOT EXISTS min_fee     DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_fee     DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bio         TEXT,
  ADD COLUMN IF NOT EXISTS phone       TEXT;

-- ── Bookings: missing columns referenced in code ─────────────────
-- Note: payment_id, order_id, signature, payment_status, booking_status
--       were added in migration 004. This adds remaining ones.
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS samagri_required   BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS language           TEXT,
  ADD COLUMN IF NOT EXISTS duration           TEXT,
  ADD COLUMN IF NOT EXISTS instant_booking    BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS devotee_emoji      TEXT DEFAULT '👤',
  ADD COLUMN IF NOT EXISTS samagri_id         TEXT,
  ADD COLUMN IF NOT EXISTS delivery_required  BOOLEAN DEFAULT FALSE;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
