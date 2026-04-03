import { db, toUUID } from '../services/supabase';
import { withRetry } from '../utils/production/errorHandler';
import { logger } from '../utils/production/logger';


export const bookingApi = {
  createBooking: async (bookingData) => {
    logger.ritual(`Recording ritual registration for devotee: ${bookingData.devoteeName}`, bookingData);
    return await withRetry(async () => {
      const { data, error } = await db.bookings().insert({
        devotee_id:     toUUID(bookingData.devoteeId),
        devotee_name:   bookingData.devoteeName,
        pandit_id:      toUUID(bookingData.panditId),
        pandit_name:    bookingData.panditName,
        ritual_id:      bookingData.ritualId,
        ritual:         bookingData.ritual || "Pandit Consultation",
        ritual_name:    bookingData.ritual || "Pandit Consultation",
        ritual_icon:    bookingData.ritualIcon || "📿",
        amount:         bookingData.amount || 0,
        booking_date:   bookingData.date,
        booking_time:   bookingData.time,
        start_time:     bookingData.time,
        location:       bookingData.location,
        address:        bookingData.address,
        notes:          bookingData.notes,
        payment_id:     bookingData.payment_id,
        payment_status: bookingData.payment_status || "pending",
        status:         "pending"
      }).select().single();
      
      if (error) throw error;
      return { data, error };
    });
  },

  getSamagriKits: async (ritualId) => {
    return await db.samagri().select("*").eq("is_kit", true).eq("ritual_id", ritualId);
  },

  getRituals: async () => {
    return await db.rituals().select("*").eq("active", true).order("name");
  },

  getAvailablePandits: async (ritual, city, date) => {
    let query = db.pandits().select("*").eq("verified", true);
    if (ritual) query = query.contains("tags", [ritual]);
    if (city && city !== "All") query = query.eq("city", city);
    const { data } = await query.order("rating", { ascending: false });
    
    if (date && data) {
      return data.filter(p => !p.availability_config?.busy_dates?.includes(date));
    }
    return data;
  },

  getNearestPandits: async (userLat, userLon, maxKm = 10) => {
    const { data } = await db.pandits().select("*").eq("verified", true);
    if (!data) return [];

    const haversine = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    return data
      .map(p => ({
        ...p,
        distance: haversine(userLat, userLon, p.latitude || 0, p.longitude || 0)
      }))
      .filter(p => p.distance <= maxKm)
      .sort((a, b) => a.distance - b.distance || b.rating - a.rating || b.experience_years - a.experience_years);
  },

  checkAvailability: async (panditId, date) => {
    const { data } = await db.pandits().select("availability_config").eq("id", panditId).single();
    if (data?.availability_config?.busy_dates?.includes(date)) return false;
    return true;
  }
};
