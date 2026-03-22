import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppCtx';
import { db } from '../../../services/supabase';
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
      const payment = await paymentService.processPayment({
        amount: totalPrice,
        name: devoteeName,
        description: `Temple Pooja: ${selectedPooja} at ${temple.name}`
      });

      if (payment.success) {
        const payload = {
          devotee_id: devoteeId,
          devotee_name: devoteeName,
          ritual: `Temple: ${selectedPooja}`,
          ritual_icon: "🛕",
          amount: totalPrice,
          booking_date: options.date,
          status: 'confirmed',
          location: temple.city,
          address: temple.name,
          notes: `Names: ${options.familyNames} | Streaming: ${options.liveStreaming} | Prasad: ${options.prasadDelivery}`,
          delivery_address: options.prasadDelivery ? options.deliveryAddress : null,
          prasad_required: options.prasadDelivery,
          courier_tracking: null,
          dispatch_date: null,
          payment_id: payment.payment_id,
          payment_status: 'paid'
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
    <div className="temple-pooja-booking-page" style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(330px, 1fr) 300px', gap: '25px' }}>
      <div className="wizard-card card" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ width: '80px', height: '80px', background: 'linear-gradient(45deg, #FFFAF5, #FFF3E6)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>{temple.icon}</div>
          <div>
            <h2 className="ph-title" style={{ color: '#F0C040', marginBottom: '4px' }}>Remote Pooja Booking</h2>
            <p className="ph-sub">📍 {temple.name}, {temple.city}</p>
          </div>
        </div>

        <form onSubmit={handleBooking}>
          <div style={{ marginBottom: '30px' }}>
            <label className="fl" style={{ marginBottom: '15px' }}>🔮 Select Sacred Pooja</label>
            <div style={{ display: 'grid', gap: '10px' }}>
              {(temple.poojas || []).map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '15px', border: `2px solid ${selectedPooja === p ? '#FF6B00' : '#eee'}`, background: selectedPooja === p ? 'rgba(255,107,0,0.05)' : '#fff', cursor: 'pointer', transition: '0.2s' }} onClick={() => setSelectedPooja(p)}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selectedPooja === p ? '#FF6B00' : '#ccc'}`, background: selectedPooja === p ? '#FF6B00' : 'transparent', position: 'relative' }}>
                    {selectedPooja === p && <div style={{ position: 'absolute', inset: '4px', background: '#fff', borderRadius: '50%' }} />}
                  </div>
                  <span style={{ fontWeight: 800 }}>{p}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#8B6347' }}>₹{basePrice}/-</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div className="fg"><label className="fl">Pooja Date</label><input type="date" className="fi" required value={options.date} onChange={e => setOptions({...options, date: e.target.value})} /></div>
            <div className="fg"><label className="fl">Girdhari Names (For Sankalp)</label><input className="fi" placeholder="Rahul, Priya, etc." value={options.familyNames} onChange={e => setOptions({...options, familyNames: e.target.value})} /></div>
          </div>

          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '18px', border: '1px dashed #ddd', marginBottom: '30px' }}>
            <h4 style={{ marginBottom: '15px' }}>✨ Exclusive Devotional Add-ons</h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="checkbox" checked={options.liveStreaming} onChange={e => setOptions({...options, liveStreaming: e.target.checked})} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800 }}>LIVE Streaming Darshan</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>Watch your pooja performed real-time via sacred link.</div>
                  </div>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FF6B00' }}>+₹201/-</span>
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="checkbox" checked={options.prasadDelivery} onChange={e => setOptions({...options, prasadDelivery: e.target.checked})} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800 }}>Sacred Prasad Delivery</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>Blessed prasad shipped to your verified home address.</div>
                  </div>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FF6B00' }}>+₹101/-</span>
              </label>
            </div>
            {options.prasadDelivery && (
              <div className="fg" style={{ marginTop: '20px' }}>
                <label className="fl">Delivery Address (Verified Home)</label>
                <textarea className="fta" required placeholder="Full address with Pincode..." value={options.deliveryAddress} onChange={e => setOptions({...options, deliveryAddress: e.target.value})} />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={submitting} style={{ padding: '18px' }}>
            {submitting ? "Processing Offering..." : `🙏 Confirm Offering (₹${totalPrice})`}
          </button>
        </form>
      </div>

      <aside>
        <div className="card" style={{ padding: '20px', position: 'sticky', top: '20px' }}>
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
