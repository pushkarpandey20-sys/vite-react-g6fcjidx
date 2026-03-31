export const paymentService = {
  processPayment: ({ amount, bookingId, name, contact, description }) => {
    return new Promise((resolve, reject) => {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      // Simulate payment when no Razorpay key is configured
      if (!razorpayKey || !window.Razorpay) {
        console.log('[paymentService] Dev mode — simulating payment success');
        return resolve({
          success: true,
          payment_id: 'dev_' + Date.now(),
          order_id: null,
          signature: null,
        });
      }

      const options = {
        key: razorpayKey,
        amount: amount * 100,
        currency: 'INR',
        name: 'DevSetu',
        description: description || 'Sacred Ritual Dakshina',
        image: '/favicon.svg',
        prefill: { name: name || '', contact: contact || '' },
        notes: { booking_id: bookingId },
        theme: { color: '#FF6B00' },
        handler: (response) => resolve({
          success: true,
          payment_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          signature: response.razorpay_signature,
        }),
        modal: {
          ondismiss: () => reject({ success: false, message: 'Payment cancelled.' }),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        reject({ success: false, message: response.error?.description || 'Payment failed.' });
      });
      rzp.open();
    });
  },
};
