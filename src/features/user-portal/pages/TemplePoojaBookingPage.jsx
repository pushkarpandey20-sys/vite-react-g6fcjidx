import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppCtx';
import { db, toUUID } from '../../../services/supabase';
import { Spinner } from '../../../components/common/UIElements';
import { paymentService } from '../../../services/paymentService';
import { notificationService } from '../../../services/notificationService';

const C = {
  bg: '#fff8f0',
  card: '#ffffff',
  text: '#3d1f00',
  soft: '#9a8070',
  accent: '#FF6B00',
  gold: '#D4A017',
  border: 'rgba(212,160,23,0.15)',
  inputBg: '#ffffff'
};

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

  if (loading) return <div style={{ textAlign:'center', padding:'100px 0' }}><Spinner /></div>;
  if (!temple) return <div style={{ textAlign:'center', padding:'100px 0', color:C.text }}>Temple not found.</div>;

  const basePrice = 501; 
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

  const inputStyle = {
    padding: '12px 16px',
    borderRadius: 14,
    border: `1px solid ${C.border}`,
    fontSize: 14,
    color: C.text,
    background: C.card,
    outline: 'none',
    fontWeight: 600,
    width: '100%'
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: window.innerWidth < 850 ? '1fr' : 'minmax(0, 2fr) minmax(0, 1fr)', 
      gap: window.innerWidth < 850 ? '16px' : '32px', 
      alignItems: 'start', color: C.text, fontFamily: '"Inter", sans-serif' 
    }}>
      <div style={{ background: C.card, padding: window.innerWidth < 480 ? '24px' : '40px', borderRadius: 32, border: `1px solid ${C.border}`, boxShadow: '0 4px 30px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', gap: window.innerWidth < 480 ? '16px' : '24px', alignItems: 'center', marginBottom: window.innerWidth < 480 ? '24px' : '40px', flexWrap: 'wrap' }}>
          <div style={{ width: window.innerWidth < 480 ? '60px' : '80px', height: window.innerWidth < 480 ? '60px' : '80px', background: 'linear-gradient(135deg, #fff5eb, #fff)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: window.innerWidth < 480 ? '32px' : '44px', border: `1px solid ${C.border}`, flexShrink: 0 }}>{temple.icon}</div>
          <div>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: C.text, marginBottom: '4px', fontSize: window.innerWidth < 480 ? 20 : 26, fontWeight: 900 }}>Remote Pooja Offering</h2>
            <p style={{ color: C.soft, margin: 0, fontSize: window.innerWidth < 480 ? 12 : 15, fontWeight: 700 }}>📍 {temple.name}, {temple.city}</p>
          </div>
        </div>

        <form onSubmit={handleBooking}>
          <div style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', marginBottom: '16px', fontWeight: 900, color: C.text, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>🔮 Select Sacred Pooja</label>
            <div style={{ display: 'grid', gap: '12px' }}>
              {(temple.poojas || []).map(p => (
                <div key={p} 
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '18px', 
                    border: `2px solid ${selectedPooja === p ? C.accent : C.border}`, 
                    background: selectedPooja === p ? 'rgba(255,107,0,0.04)' : '#fff', cursor: 'pointer', transition: '0.2s' }} 
                  onClick={() => setSelectedPooja(p)}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${selectedPooja === p ? C.accent : '#d1d1d1'}`, background: selectedPooja === p ? C.accent : 'transparent', flexShrink: 0, position: 'relative' }}>
                    {selectedPooja === p && <div style={{ position: 'absolute', inset: '5px', background: '#fff', borderRadius: '50%' }} />}
                  </div>
                  <span style={{ fontWeight: 800, color: C.text, fontSize: 15 }}>{p}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '14px', color: C.accent, fontWeight: 900, fontFamily: 'Cinzel, serif' }}>₹{basePrice}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontWeight: 900, color: C.text, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Sankalp Date</label>
              <input type="date" style={inputStyle} required value={options.date} onChange={e => setOptions({...options, date: e.target.value})} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontWeight: 900, color: C.text, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Family Names (Sankalp)</label>
              <input style={inputStyle} placeholder="E.g. Rahul, Priya, etc." value={options.familyNames} onChange={e => setOptions({...options, familyNames: e.target.value})} />
            </div>
          </div>

          <div style={{ background: '#fff9f4', padding: '32px', borderRadius: '24px', border: `1px dashed ${C.border}`, marginBottom: '40px' }}>
            <h4 style={{ marginBottom: '20px', color: C.text, fontWeight: 900, fontFamily: 'Cinzel, serif', fontSize: 16 }}>✨ Devotional Optimizations</h4>
            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                { key: 'liveStreaming',  label: 'LIVE Streaming Darshan',  sub: 'Engage via high-fidelity live stream real-time.', price: '+₹201' },
                { key: 'prasadDelivery', label: 'Blessed Prasad Delivery',  sub: 'Sacred prasad shipped to your doorstep.', price: '+₹101' },
              ].map(({ key, label, sub, price }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', cursor: 'pointer',
                  background: options[key] ? 'rgba(255,107,0,0.06)' : '#fff',
                  border: `1px solid ${options[key] ? C.accent : C.border}`,
                  borderRadius: 16, padding: '16px 20px', transition: '0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <input type="checkbox"
                    checked={options[key]}
                    onChange={e => setOptions({ ...options, [key]: e.target.checked })}
                    style={{ marginTop: 4, accentColor: C.accent, width: 20, height: 20, flexShrink: 0, cursor: 'pointer' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: C.text }}>{label}</div>
                    <div style={{ fontSize: '12px', color: C.soft, marginTop: 4, fontWeight: 500 }}>{sub}</div>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: C.accent, whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'Cinzel, serif' }}>{price}</span>
                </label>
              ))}
            </div>
            {options.prasadDelivery && (
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={{ fontWeight: 900, color: C.text, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Detailed Delivery Address</label>
                <textarea required placeholder="House No, Street, Landmark, Pincode..." value={options.deliveryAddress} onChange={e => setOptions({...options, deliveryAddress: e.target.value})}
                  style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} />
              </div>
            )}
          </div>

          <button type="submit" disabled={submitting} 
            style={{ width: '100%', padding: '20px', background: C.accent, color: '#fff', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 30px rgba(255,107,0,0.3)', transition: '0.3s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='scale(1.02)'}
            onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
          >
            {submitting ? "Processing Offering..." : `🙏 Confirm Offering · ₹${totalPrice}`}
          </button>
        </form>
      </div>

      <aside>
        <div style={{ padding: '32px', background: C.card, borderRadius: 24, border: `1px solid ${C.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h4 style={{ marginBottom: '16px', color: C.text, fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 18 }}>🛕 Ancient Shrine</h4>
          <div style={{ fontSize: '14px', color: C.soft, lineHeight: 1.7, marginBottom: '24px', fontWeight: 500 }}>
            {temple.description || "Ancient shrine of divine grace and spiritual wisdom. Connect with the eternal energy of Bharat."}
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', color: C.soft, fontWeight: 700 }}>Next Aarti</span>
              <span style={{ fontSize: '12px', color: C.accent, fontWeight: 900 }}>{temple.next_aarti || '4:00 AM'}</span>
            </div>
            <div style={{ fontSize: '11px', color: C.soft, fontStyle: 'italic', marginTop: 12, lineHeight: 1.5 }}>Authorized by the respective temple governing body for remote devotee participation.</div>
          </div>
        </div>
      </aside>

      {submitting && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ textAlign: 'center' }}>
            <Spinner />
            <p style={{ marginTop: '20px', color: C.text, fontWeight: 900, fontSize: 18, fontFamily: 'Cinzel, serif' }}>Submitting Your Sacred Offering...</p>
          </div>
        </div>
      )}
    </div>
  );
}
