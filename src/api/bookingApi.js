import { supabase } from '../services/supabase';

/** Returns true only for valid Supabase UUID format */
function isUUID(v) {
  return typeof v === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

/** Pass only if valid UUID, else null */
const uuid = (v) => isUUID(v) ? v : null;

export const bookingApi = {

  async createBooking(data) {
    const payload = {
      devotee_id:   uuid(data.devoteeId   || data.devotee_id),
      pandit_id:    uuid(data.panditId    || data.pandit_id),
      ritual_name:  data.ritual || data.ritualName || data.ritual_name || 'Custom Pooja',
      booking_date: data.date   || data.bookingDate || data.booking_date
                    || new Date().toISOString().split('T')[0],
      address:      data.address || null,
      total_amount: Number(data.amount || data.totalAmount || data.total_amount || 1500),
      status:       'pending_payment',
      created_at:   new Date().toISOString(),
    };

    console.log('[bookingApi] insert payload:', JSON.stringify(payload));

    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('[bookingApi] error:', error.message, error.details, error.hint);
        return { booking: null, error };
      }
      return { booking, error: null };
    } catch (err) {
      console.error('[bookingApi] exception:', err);
      return { booking: null, error: err };
    }
  },

  async confirmBooking(bookingId, razorpayPaymentId) {
    if (!isUUID(bookingId)) return { error: { message: 'Invalid booking ID: ' + bookingId } };
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed', razorpay_payment_id: razorpayPaymentId || null })
        .eq('id', bookingId)
        .select()
        .single();
      return { booking: data, error };
    } catch (err) { return { booking: null, error: err }; }
  },

  async getDevoteeBookings(devoteeId) {
    if (!isUUID(devoteeId)) return { bookings: [], error: null };
    try {
      const { data, error } = await supabase
        .from('bookings').select('*')
        .eq('devotee_id', devoteeId)
        .order('created_at', { ascending: false });
      return { bookings: data || [], error };
    } catch (err) { return { bookings: [], error: err }; }
  },

  async getPanditBookings(panditId) {
    if (!isUUID(panditId)) return { bookings: [], error: null };
    try {
      const { data, error } = await supabase
        .from('bookings').select('*')
        .eq('pandit_id', panditId)
        .order('created_at', { ascending: false });
      return { bookings: data || [], error };
    } catch (err) { return { bookings: [], error: err }; }
  },

  async cancelBooking(bookingId) {
    if (!isUUID(bookingId)) return { error: { message: 'Invalid ID' } };
    try {
      const { error } = await supabase
        .from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
      return { error };
    } catch (err) { return { error: err }; }
  },

  async rateBooking(bookingId, rating, review) {
    if (!isUUID(bookingId)) return { error: { message: 'Invalid ID' } };
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ devotee_rating: rating, devotee_review: review || null })
        .eq('id', bookingId);
      return { error };
    } catch (err) { return { error: err }; }
  },

  async getAvailablePandits(ritual, city, date) {
    let query = supabase.from('pandits').select('*').eq('status', 'verified');
    if (city && city !== 'All') query = query.eq('city', city);
    const { data } = await query.order('rating', { ascending: false });
    if (!data) return { data: [] };
    const filtered = date
      ? data.filter(p => !p.availability_slots?.busy_dates?.includes(date))
      : data;
    return { data: filtered };
  },

  async getRituals() {
    const { data } = await supabase.from('rituals').select('*').order('name');
    return { data: data || [], error: null };
  },

  async getSamagriKits(ritualId) {
    const { data } = await supabase.from('samagri').select('*').eq('is_kit', true);
    return { data: data || [] };
  },
};

export default bookingApi;
