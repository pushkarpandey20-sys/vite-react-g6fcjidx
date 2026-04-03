-- ENSURE BOOKING COLUMNS ARE PRESENT
-- This fixes the "start_time column not found" error during booking completion.
-- ================================================================

ALTER TABLE bookings 
  ADD COLUMN IF NOT EXISTS start_time     TEXT,
  ADD COLUMN IF NOT EXISTS booking_time   TEXT,
  ADD COLUMN IF NOT EXISTS ritual_name    TEXT,
  ADD COLUMN IF NOT EXISTS devotee_name   TEXT,
  ADD COLUMN IF NOT EXISTS pandit_name    TEXT;

-- Refresh PostgREST schema cache (Supabase internal)
-- Usually happens automatically after DDL, but this ensures consistency.
NOTIFY pgrst, 'reload schema';
