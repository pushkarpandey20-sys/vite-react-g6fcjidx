import { supabase } from '../services/supabase';

export const bookingApi = {
  createBooking: async (bookingData) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        devotee_id:   bookingData.devoteeId,
        pandit_id:    bookingData.panditId,
        ritual_name:  bookingData.ritual || bookingData.ritualName || 'Pandit Consultation',
        booking_date: bookingData.date   || bookingData.bookingDate,
        address:      bookingData.address,
        total_amount: bookingData.amount || bookingData.totalAmount || 0,
        status:       'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error };
  },

  confirmBooking: async (bookingId, paymentDetails) => {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status:               'confirmed',
        razorpay_order_id:    paymentDetails?.razorpay_order_id   || null,
        razorpay_payment_id:  paymentDetails?.razorpay_payment_id || null,
        updated_at:           new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return { data, error };
  },

  getBookingById: async (bookingId) => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();
    if (error) throw error;
    return data;
  },

  getDevoteeBookings: async (devoteeId) => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('devotee_id', devoteeId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  getPanditBookings: async (panditId) => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('pandit_id', panditId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  getAvailablePandits: async (ritual, city, date) => {
    let query = supabase.from('pandits').select('*').eq('status', 'verified');
    if (city && city !== 'All') query = query.eq('city', city);
    const { data } = await query.order('rating', { ascending: false });
    if (!data) return [];
    if (date) {
      return data.filter(p => !p.availability_slots?.busy_dates?.includes(date));
    }
    return data;
  },

  getNearestPandits: async (userLat, userLon, maxKm = 25) => {
    const { data } = await supabase.from('pandits').select('*').eq('status', 'verified');
    if (!data) return [];
    const haversine = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };
    return data
      .map(p => ({ ...p, distance: haversine(userLat, userLon, p.latitude || 0, p.longitude || 0) }))
      .filter(p => p.distance <= maxKm)
      .sort((a, b) => a.distance - b.distance);
  },

  checkAvailability: async (panditId, date) => {
    const { data } = await supabase
      .from('pandits')
      .select('availability_slots')
      .eq('id', panditId)
      .single();
    return !data?.availability_slots?.busy_dates?.includes(date);
  },

  getRituals: async () => {
    const { data } = await supabase.from('rituals').select('*').order('name');
    return data || [];
  },

  getSamagriKits: async (ritualName) => {
    const { data } = await supabase.from('samagri').select('*').eq('is_kit', true);
    return data || [];
  },
};
