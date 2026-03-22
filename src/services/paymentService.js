export const paymentService = {
  processPayment: ({ amount, name, email, contact, description }) => {
    return new Promise((resolve, reject) => {
      const options = {
        key: "rzp_test_YOUR_KEY", // Should be in env in prod
        amount: amount * 100, // amount in the smallest currency unit
        currency: "INR",
        name: "DevSetu Spiritual Services",
        description: description || "Sacred Offering",
        image: "/logo.png",
        handler: function (response) {
          // Success!
          resolve({
            success: true,
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: name || "",
          email: email || "",
          contact: contact || "",
        },
        notes: {
          address: "Virtual Mandap",
        },
        theme: {
          color: "#FF6B00", // DevSetu Saffron
        },
        modal: {
          ondismiss: function() {
            reject({ success: false, message: "Payment cancelled by devotee." });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  }
};
