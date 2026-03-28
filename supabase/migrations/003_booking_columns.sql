-- ================================================================
-- Migration 003: Add missing columns to bookings table
-- Run this in Supabase SQL Editor to enable all booking fields
-- ================================================================

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS devotee_name  TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pandit_name   TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ritual_icon   TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS start_time    TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_time  TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS location      TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes         TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS samagri_items JSONB;

-- After running this SQL in Supabase, BookingWizard can safely include all fields.
