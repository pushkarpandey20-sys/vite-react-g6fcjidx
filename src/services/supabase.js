import { createClient } from "@supabase/supabase-js";

const _rawUrl = import.meta.env.VITE_SUPABASE_URL;
const _rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasValidUrl = Boolean(_rawUrl && _rawUrl.startsWith('http'));
const hasValidKey = Boolean(_rawKey && !_rawKey.startsWith('your_'));

const FALLBACK_SUPABASE_URL = 'https://lnhlnogpmpjajwtmmrmq.supabase.co';
const FALLBACK_SUPABASE_KEY = 'sb_publishable_hkLodTGQEUBQ5QcLTIey1Q_snE7L9j1';

if (!hasValidUrl || !hasValidKey) {
  console.warn(
    'Supabase environment variables are missing or still set to placeholder values. Falling back to the default public project config.'
  );
}

export const SUPABASE_URL = hasValidUrl ? _rawUrl : FALLBACK_SUPABASE_URL;
export const SUPABASE_KEY = hasValidKey ? _rawKey : FALLBACK_SUPABASE_KEY;
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
  // Use crypto.randomUUID if available (secure context), otherwise fallback to manual UUID generation
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generator for non-secure contexts (http://localhost in mobile webviews)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Returns id only if it matches UUID format, otherwise null.
// Prevents "invalid input syntax for type uuid" when seed/demo IDs hit the DB.
export function toUUID(id) {
  if (!id) return null;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ? id : null;
}
