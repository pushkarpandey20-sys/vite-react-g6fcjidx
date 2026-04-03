import { createClient } from "@supabase/supabase-js";

const _rawUrl = import.meta.env.VITE_SUPABASE_URL;
const _rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// Reject placeholder values that don't start with http
export const SUPABASE_URL = (_rawUrl && _rawUrl.startsWith('http')) ? _rawUrl : "https://lnhlnogpmpjajwtmmrmq.supabase.co";
export const SUPABASE_KEY = (_rawKey && !_rawKey.startsWith('your_')) ? _rawKey : "sb_publishable_hkLodTGQEUBQ5QcLTIey1Q_snE7L9j1";
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const db = {
  pandits: () => supabase.from("pandits"),
  rituals: () => supabase.from("rituals"),
  bookings: () => supabase.from("bookings"),
  requests: () => supabase.from("pandit_requests"),
  temples: () => supabase.from("temples"),
  samagri: () => supabase.from("samagri"),
  donations: () => supabase.from("donations"),
  orders: () => supabase.from("orders"),
  devotees: () => supabase.from("devotees"),
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
