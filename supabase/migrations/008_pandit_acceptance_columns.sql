-- Pandit acceptance/rejection timestamps
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pandit_accepted_at TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pandit_rejected_at TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS devotee_email      TEXT;

-- Allow Google OAuth users to be stored in devotees
ALTER TABLE devotees ALTER COLUMN phone DROP NOT NULL;
