import { db } from './supabase';

export const notificationService = {
  send: async (userId, userType, message, type = 'info') => {
    try {
      await db.notifications().insert({
        user_id: userId,
        user_type: userType, // 'devotee' or 'pandit'
        message: message,
        type: type,
        read: false,
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.error("Failed to send notification:", err);
    }
  },

  // Helpers
  notifyPanditOfNewBooking: (panditId, ritual) => {
    return notificationService.send(panditId, 'pandit', `You have a new booking request for ${ritual}! 🙏`, 'booking');
  },

  notifyDevoteeOfAcceptance: (devoteeId, ritual, panditName) => {
    return notificationService.send(devoteeId, 'devotee', `Pt. ${panditName} has accepted your booking for ${ritual}. ✨`, 'acceptance');
  },

  ritualReminder: (userId, userType, ritual, time) => {
    return notificationService.send(userId, userType, `Reminder: Your ${ritual} is scheduled for ${time}. 📿`, 'reminder');
  }
};
