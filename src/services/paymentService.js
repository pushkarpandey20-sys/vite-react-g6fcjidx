export const paymentService = {
  processPayment: ({ amount, bookingId, name, contact, description }) => {
    return new Promise((resolve) => {
      // Simulate successful payment — integrate real Razorpay when live key is ready
      console.log('[paymentService] Simulating payment success for booking:', bookingId, 'amount:', amount);
      resolve({
        success: true,
        payment_id: 'dev_' + Date.now(),
        order_id: null,
        signature: null,
      });
    });
  },
};
