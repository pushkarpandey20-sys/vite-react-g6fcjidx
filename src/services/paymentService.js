import { supabase } from './supabase';

export const paymentService = {
  processPayment: ({ amount, bookingId, name, contact, description }) => {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        // Dev/demo fallback — simulate successful payment
        return resolve({ success: true, payment_id: 'dev_' + Date.now(), order_id: null, signature: null });
      }
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY",
        amount: amount * 100, // paise
        currency: "INR",
        name: "DevSetu",
        description: description || "Sacred Ritual Dakshina",
        image: "/favicon.svg",
        order_id: bookingId, // Supabase booking ID as reference
        prefill: { name: name || "", contact: contact || "" },
        notes: { booking_id: bookingId },
        theme: { color: "#FF6B00" },
        handler: (response) => resolve({
          success: true,
          payment_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          signature: response.razorpay_signature,
        }),
        modal: {
          ondismiss: () => reject({ success: false, message: "Payment cancelled." })
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        reject({ success: false, message: response.error?.description || "Payment failed." });
      });
      rzp.open();
    });
  }
};
