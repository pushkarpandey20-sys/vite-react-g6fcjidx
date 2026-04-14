import React, { useState } from 'react';
import { paymentService } from '../../../services/paymentService';

export default function CheckoutModal({ subtotal, onComplete, onClose }) {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', city: 'Kashi' });
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const payment = await paymentService.processPayment({
        amount: subtotal,
        name: formData.name,
        contact: formData.phone,
        description: "BhaktiGo Samagri Order"
      });
      if (payment.success) {
        onComplete({ ...formData, payment_id: payment.payment_id });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div className="checkout-modal card" onClick={e => e.stopPropagation()}>
        <div className="cm-header">
          <div className="cm-title">Sacred Checkout</div>
          <button className="cm-close" onClick={onClose}>✕</button>
        </div>

        <form className="cm-form" onSubmit={handleSubmit}>
          <div className="fgrid">
            <div className="fg ffw">
              <label className="fl">Devotee Name</label>
              <input className="fi" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter your full name" />
            </div>
            <div className="fg">
              <label className="fl">Phone Number</label>
              <input className="fi" required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 00000 00000" />
            </div>
            <div className="fg">
              <label className="fl">City</label>
              <select className="fs" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                {["Kashi", "Delhi", "Mumbai", "Bangalore", "Ayodhya", "Agra", "Ujjain", "Haridwar", "Pune"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="fg ffw">
              <label className="fl">Delivery Address</label>
              <textarea className="fta" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="House no, Street name, LandMark..." />
            </div>
          </div>

          <div className="cm-footer">
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span>FREE (Promotional)</span>
              </div>
              <hr className="summary-hr" />
              <div className="summary-row grand-total">
                <span>Grand Total</span>
                <span>₹{subtotal}</span>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full cm-btn" disabled={processing}>
              {processing ? 'Processing Sacred Transaction...' : '📿 Complete Sacred Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
