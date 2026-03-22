import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://lnhlnogpmpjajwtmmrmq.supabase.co";
export const SUPABASE_KEY = "sb_publishable_hkLodTGQEUBQ5QcLTIey1Q_snE7L9j1";
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
  notifications: () => supabase.from("notifications"),
};

export function genId(prefix) {
  return `${prefix}${Date.now().toString(36).toUpperCase()}`;
}
