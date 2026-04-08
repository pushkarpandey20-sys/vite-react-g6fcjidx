import { createClient } from "@supabase/supabase-js";

const _rawUrl = import.meta.env.VITE_SUPABASE_URL;
const _rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasValidUrl = Boolean(_rawUrl && _rawUrl.startsWith('http'));
const hasValidKey = Boolean(_rawKey && !_rawKey.startsWith('your_'));

if (!hasValidUrl || !hasValidKey) {
  throw new Error('Supabase environment variables are missing or still set to placeholder values. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before starting the app.');
}

export const SUPABASE_URL = _rawUrl;
export const SUPABASE_KEY = _rawKey;
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const db = {
  pandits: () => supabase.from("pandits"),
  rituals: () => supabase.from("rituals"),
  bookings: () => supabase.from("bookings"),
  requests: () => supabase.from("pandit_requests"),
  temples: () => supabase.from("temples"),
  samagri: () => supabase.from("samagri_kits"),
  donations: () => supabase.from("donations"),
  orders: () => supabase.from("orders"),
  devotees: () => supabase.from("devotees"),
  festivals: () => supabase.from("festivals"),
  referral_rewards: () => supabase.from("referral_rewards"),
  notifications: () => supabase.from("notifications"),
  admin_users: () => supabase.from("admin_users"),
  analytics: () => supabase.from("analytics_events"),
};

// Auth helpers
export const auth = {
  sendOTP: (phone) => supabase.auth.signInWithOtp({ phone }),
  verifyOTP: (phone, token) => supabase.auth.verifyOtp({ phone, token, type: 'sms' }),
  signInAdmin: (email, password) => supabase.auth.signInWithPassword({ email, password }),
  getSession: () => supabase.auth.getSession(),
  signOut: () => supabase.auth.signOut(),
  onAuthChange: (cb) => supabase.auth.onAuthStateChange(cb),
};

export function genId(_prefix) {
  // Always return a proper UUID so it's safe to store in UUID columns
  return crypto.randomUUID();
}

// Returns id only if it matches UUID format, otherwise null.
// Prevents "invalid input syntax for type uuid" when seed/demo IDs hit the DB.
export function toUUID(id) {
  if (!id) return null;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ? id : null;
}
