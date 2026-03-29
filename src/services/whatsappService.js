// WhatsApp notification service
// Production: connect to Twilio or Meta WhatsApp Business API
// Development: opens WhatsApp web with pre-filled message

export function sendBookingConfirmationWhatsApp({ devoteeName, panditName, ritual, date, amount, phone }) {
  const message =
    `🕉️ *Booking Confirmed — DevSetu*\n\n` +
    `Namaste ${devoteeName || 'Devotee'},\n\n` +
    `Your booking is confirmed! 🎉\n\n` +
    `📿 *Ritual:* ${ritual}\n` +
    `🙏 *Pandit:* ${panditName || 'Assigned Pandit'}\n` +
    `📅 *Date:* ${date}\n` +
    `💰 *Amount:* ₹${amount?.toLocaleString()}\n\n` +
    `Your pandit will contact you 24 hours before the ceremony.\n\n` +
    `_DevSetu — Bridging You to Divine Services_`;

  if (phone) {
    const clean = phone.replace(/\D/g, '');
    const num = clean.startsWith('91') ? clean : '91' + clean;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
  }
}

export function sendPanditNewBookingWhatsApp({ panditName, ritual, date, devoteeName, address, panditPhone }) {
  const message =
    `🔔 *New Booking — DevSetu*\n\n` +
    `Namaste ${panditName || 'Pandit Ji'},\n\n` +
    `You have a new booking! 📿\n\n` +
    `🕉️ *Ritual:* ${ritual}\n` +
    `👤 *Devotee:* ${devoteeName || 'Devotee'}\n` +
    `📅 *Date:* ${date}\n` +
    `📍 *Address:* ${address || 'Will be shared'}\n\n` +
    `Please confirm via the DevSetu app.\n\n` +
    `_DevSetu — Bridging You to Divine Services_`;

  if (panditPhone) {
    const clean = panditPhone.replace(/\D/g, '');
    const num = clean.startsWith('91') ? clean : '91' + clean;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
  }
}

export function sendMuhuratReminderWhatsApp({ devoteeName, ritual, muhurat, phone }) {
  const message =
    `⏰ *Shubh Muhurat Reminder — DevSetu*\n\n` +
    `Namaste ${devoteeName || 'Devotee'},\n\n` +
    `Auspicious time for *${ritual}* is approaching!\n\n` +
    `🕐 *Muhurat:* ${muhurat}\n\n` +
    `Book a pandit now to make the most of this sacred timing.\n\n` +
    `👉 https://vite-react-g6fcjidx.vercel.app/user/booking\n\n` +
    `_DevSetu — Bridging You to Divine Services_`;

  if (phone) {
    const clean = phone.replace(/\D/g, '');
    const num = clean.startsWith('91') ? clean : '91' + clean;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
  }
}
