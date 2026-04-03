-- ================================================================
-- Migration 006: Add missing columns to pandits table
-- Resolves: column "years_of_experience" / "min_fee" / "bio" errors
-- NOTE: seed data now uses experience_years & specialization (singular)
--       so this migration is only needed if old data was already inserted
--       with the wrong column names via the Supabase dashboard.
-- ================================================================

ALTER TABLE pandits
  ADD COLUMN IF NOT EXISTS min_fee    DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_fee    DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bio        TEXT;

-- Reload PostgREST schema cache so the new columns are immediately visible
NOTIFY pgrst, 'reload schema';
