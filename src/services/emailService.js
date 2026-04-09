export function sendBookingConfirmation({ devoteeName, devoteeEmail, ritualName, bookingDate, panditName, amount, bookingId }) {
  // Log for debugging
  console.log('[DevSetu Email]', { to: devoteeEmail, ritual: ritualName, bookingId });
  // Store in queue for future email provider integration (Resend/SendGrid)
  try {
    const queue = JSON.parse(localStorage.getItem('ds_email_queue') || '[]');
    queue.push({
      type: 'booking_confirmed',
      to: devoteeEmail,
      devoteeName,
      ritualName,
      bookingDate,
      panditName,
      amount,
      bookingId,
      sentAt: new Date().toISOString(),
    });
    localStorage.setItem('ds_email_queue', JSON.stringify(queue.slice(-20)));
  } catch(e) {}
}
