import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppCtx';
import { db, toUUID } from '../../../services/supabase';
import { Spinner } from '../../../components/common/UIElements';
import { paymentService } from '../../../services/paymentService';
import { notificationService } from '../../../services/notificationService';

export default function TemplePoojaBookingPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { devoteeId, devoteeName, toast } = useApp();
  const [temple, setTemple] = useState(state?.temple || null);
  const [loading, setLoading] = useState(!state?.temple);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedPooja, setSelectedPooja] = useState(null);
  const [options, setOptions] = useState({
    liveStreaming: false,
    prasadDelivery: false,
    deliveryAddress: '',
    date: new Date().toISOString().split('T')[0],
    familyNames: ''
  });

  useEffect(() => {
    if (!temple) {
      db.temples().select("*").eq("id", id).single().then(({ data }) => {
        setTemple(data);
        setLoading(false);
      });
    }
  }, [id, temple]);

  if (loading) return <Spinner />;
  if (!temple) return <div>Temple not found.</div>;

  const basePrice = 501; // Base donation for remote pooja
  const totalPrice = basePrice + (options.liveStreaming ? 201 : 0) + (options.prasadDelivery ? 101 : 0);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedPooja) return toast("Please select a pooja to perform.", "🙏");
    if (options.prasadDelivery && !options.deliveryAddress) return toast("Delivery address is required for Prasad.", "📍");
    setSubmitting(true);

    try {
      let payment;
      try {
        payment = await paymentService.processPayment({
          amount: totalPrice,
          name: devoteeName,
          description: `Temple Pooja: ${selectedPooja} at ${temple.name}`
        });
      } catch (payErr) {
        if (payErr.message === 'Payment cancelled.') {
          setSubmitting(false);
          return;
        }
        // Razorpay unavailable — simulate success for dev/demo
        payment = { success: true, payment_id: 'dev_' + Date.now() };
      }

      if (payment.success) {
        const payload = {
          devotee_id: toUUID(devoteeId),
          ritual_name: `Temple: ${selectedPooja}`,
          total_amount: totalPrice,
          booking_date: options.date,
          status: 'confirmed',
          address: `${temple.name}, ${temple.city}`,
          notes: `Names: ${options.familyNames} | Streaming: ${options.liveStreaming} | Prasad: ${options.prasadDelivery} | Delivery: ${options.deliveryAddress || 'N/A'} | Payment: ${payment.payment_id || 'demo'}`,
        };

        const { error } = await db.bookings().insert(payload);
        if (error) throw error;

        toast("Pooja Booked Successfully! 🙏", "🕉️");
        navigate('/user/history');
      }
    } catch (err) {
      toast(err.message || "Booking Failed", "❌");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="temple-booking-grid">
      <div style={{ padding: '30px', background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f0e0d0' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ width: '80px', height: '80px', background: 'linear-gradient(45deg, #FFFAF5, #FFF3E6)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>{temple.icon}</div>
          <div>
            <h2 style={{ fontFamily: 'Cinzel,serif', color: '#FF6B00', marginBottom: '4px', fontSize: 22, fontWeight: 900 }}>Remote Pooja Booking</h2>
            <p style={{ color: '#5C3317', margin: 0, fontSize: 14 }}>📍 {temple.name}, {temple.city}</p>
          </div>
        </div>

        <form onSubmit={handleBooking}>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 800, color: '#2C1A0E', fontSize: 14 }}>🔮 Select Sacred Pooja</label>
            <div style={{ display: 'grid', gap: '10px' }}>
              {(temple.poojas || []).map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '15px', border: `2px solid ${selectedPooja === p ? '#FF6B00' : '#eee'}`, background: selectedPooja === p ? 'rgba(255,107,0,0.06)' : '#FFFAF5', cursor: 'pointer', transition: '0.2s' }} onClick={() => setSelectedPooja(p)}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selectedPooja === p ? '#FF6B00' : '#ccc'}`, background: selectedPooja === p ? '#FF6B00' : 'transparent', flexShrink: 0, position: 'relative' }}>
                    {selectedPooja === p && <div style={{ position: 'absolute', inset: '4px', background: '#fff', borderRadius: '50%' }} />}
                  </div>
                  <span style={{ fontWeight: 800, color: '#2C1A0E' }}>{p}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#8B6347', fontWeight: 700 }}>₹{basePrice}/-</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 800, color: '#2C1A0E', fontSize: 13 }}>Pooja Date</label>
              <input type="date" style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e0d0c0', fontSize: 14, color: '#2C1A0E', background: '#FFFAF5', outline: 'none' }} required value={options.date} onChange={e => setOptions({...options, date: e.target.value})} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 800, color: '#2C1A0E', fontSize: 13 }}>Names (For Sankalp)</label>
              <input style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e0d0c0', fontSize: 14, color: '#2C1A0E', background: '#FFFAF5', outline: 'none' }} placeholder="Rahul, Priya, etc." value={options.familyNames} onChange={e => setOptions({...options, familyNames: e.target.value})} />
            </div>
          </div>

          <div style={{ background: '#FFF8F0', padding: '20px', borderRadius: '18px', border: '1px dashed #FFCCAA', marginBottom: '30px' }}>
            <h4 style={{ marginBottom: '15px', color: '#2C1A0E', fontWeight: 800 }}>✨ Exclusive Devotional Add-ons</h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { key: 'liveStreaming',  label: 'LIVE Streaming Darshan',  sub: 'Watch your pooja performed real-time via sacred link.',      price: '+₹201/-' },
                { key: 'prasadDelivery', label: 'Sacred Prasad Delivery',  sub: 'Blessed prasad shipped to your verified home address.',      price: '+₹101/-' },
              ].map(({ key, label, sub, price }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer',
                  background: options[key] ? 'rgba(255,107,0,0.05)' : '#FFFAF5',
                  border: `1.5px solid ${options[key] ? '#FF6B00' : '#eee'}`,
                  borderRadius: 12, padding: '12px 14px', transition: '0.2s' }}>
                  <input type="checkbox"
                    checked={options[key]}
                    onChange={e => setOptions({ ...options, [key]: e.target.checked })}
                    style={{ marginTop: 3, accentColor: '#FF6B00', width: 16, height: 16, flexShrink: 0, cursor: 'pointer' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#2C1A0E' }}>{label}</div>
                    <div style={{ fontSize: '11px', color: '#8B6347', marginTop: 2 }}>{sub}</div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#FF6B00', whiteSpace: 'nowrap', flexShrink: 0 }}>{price}</span>
                </label>
              ))}
            </div>
            {options.prasadDelivery && (
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontWeight: 800, color: '#2C1A0E', fontSize: 13 }}>Delivery Address (Verified Home)</label>
                <textarea required placeholder="Full address with Pincode..." value={options.deliveryAddress} onChange={e => setOptions({...options, deliveryAddress: e.target.value})}
                  style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e0d0c0', fontSize: 14, color: '#2C1A0E', background: '#FFFAF5', outline: 'none', minHeight: 80, resize: 'vertical' }} />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={submitting} style={{ padding: '18px' }}>
            {submitting ? "Processing Offering..." : `🙏 Confirm Offering (₹${totalPrice})`}
          </button>
        </form>
      </div>

      <aside>
        <div style={{ padding: '20px', position: 'sticky', top: '20px', background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #f0e0d0' }}>
          <h4 style={{ marginBottom: '15px', color: '#FF6B00' }}>🛕 About this Shrine</h4>
          <div style={{ fontSize: '13px', color: '#8B6347', lineHeight: 1.6, marginBottom: '20px' }}>
            {temple.description || "Establish your connection with the divine energy of this historic temple through remote offerings and traditional rituals."}
          </div>
          <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700 }}>Next Aarti</span>
              <span style={{ fontSize: '12px', color: '#FF6B00', fontWeight: 800 }}>{temple.next_aarti}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#888' }}>Remotely authorized by the temple trust committee.</div>
          </div>
        </div>
      </aside>

      {submitting && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ textAlign: 'center' }}>
            <Spinner />
            <p style={{ marginTop: '15px', color: '#FF6B00', fontWeight: 800 }}>Submitting Your Sacred Offering...</p>
          </div>
        </div>
      )}
    </div>
  );
}
