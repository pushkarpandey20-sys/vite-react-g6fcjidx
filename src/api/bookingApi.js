import { supabase } from '../services/supabase';

/**
 * DevSetu Booking API
 * ONLY uses columns confirmed to exist in the Supabase bookings table:
 *   devotee_id, pandit_id, ritual_name, booking_date,
 *   address, total_amount, status, created_at
 *
 * Run supabase/migrations/003_production_columns.sql to add extra columns.
 */

const isUUID = (v) => v && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
const safeUUID = (v) => isUUID(v) ? v : null;

export const bookingApi = {

  /** Create a booking — returns { booking, error } */
  async createBooking(data) {
    try {
      const payload = {
        devotee_id:   safeUUID(data.devoteeId   || data.devotee_id),
        pandit_id:    safeUUID(data.panditId    || data.pandit_id),
        ritual_name:  data.ritual      || data.ritualName   || data.ritual_name || 'Custom Pooja',
        booking_date: data.date        || data.bookingDate  || data.booking_date || new Date().toISOString().split('T')[0],
        address:      data.address     || null,
        total_amount: Number(data.amount || data.totalAmount || data.total_amount || 1500),
        status:       'pending_payment',
        created_at:   new Date().toISOString(),
      };
      console.log('[bookingApi] inserting:', payload);
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert(payload)
        .select()
        .single();
      if (error) {
        console.error('[bookingApi] insert error:', error.message, error.details);
        return { booking: null, error };
      }
      return { booking, error: null };
    } catch (err) {
      console.error('[bookingApi] exception:', err);
      return { booking: null, error: err };
    }
  },

  /** Confirm booking after successful payment */
  async confirmBooking(bookingId, razorpayPaymentId) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed', razorpay_payment_id: razorpayPaymentId || null })
        .eq('id', bookingId)
        .select()
        .single();
      return { booking: data, error };
    } catch (err) {
      return { booking: null, error: err };
    }
  },

  /** Get all bookings for a devotee */
  async getDevoteeBookings(devoteeId) {
    try {
      const { data, error } = await supabase
        .from('bookings').select('*').eq('devotee_id', devoteeId)
        .order('created_at', { ascending: false });
      return { bookings: data || [], error };
    } catch (err) {
      return { bookings: [], error: err };
    }
  },

  /** Get all bookings for a pandit */
  async getPanditBookings(panditId) {
    try {
      const { data, error } = await supabase
        .from('bookings').select('*').eq('pandit_id', panditId)
        .order('created_at', { ascending: false });
      return { bookings: data || [], error };
    } catch (err) {
      return { bookings: [], error: err };
    }
  },

  /** Cancel a booking */
  async cancelBooking(bookingId) {
    try {
      const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
      return { error };
    } catch (err) {
      return { error: err };
    }
  },

  /** Rate a completed booking */
  async rateBooking(bookingId, rating, review) {
    try {
      const { error } = await supabase.from('bookings')
        .update({ devotee_rating: rating, devotee_review: review || null }).eq('id', bookingId);
      return { error };
    } catch (err) {
      return { error: err };
    }
  },

  /** Utility: get available pandits */
  async getAvailablePandits(ritual, city, date) {
    let query = supabase.from('pandits').select('*').eq('status', 'verified');
    if (city && city !== 'All') query = query.eq('city', city);
    const { data } = await query.order('rating', { ascending: false });
    if (!data) return [];
    if (date) return data.filter(p => !p.availability_slots?.busy_dates?.includes(date));
    return data;
  },

  /** Utility: get rituals list */
  async getRituals() {
    const { data } = await supabase.from('rituals').select('*').order('name');
    return { data: data || [], error: null };
  },

  /** Utility: get samagri kits */
  async getSamagriKits() {
    const { data } = await supabase.from('samagri').select('*').eq('is_kit', true);
    return data || [];
  },
};

export default bookingApi;
