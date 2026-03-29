import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppCtx';
import { supabase } from '../../../services/supabase';
import { bookingApi } from '../../../api/bookingApi';
import { Spinner } from '../../../components/common/UIElements';
import RitualFilters from '../components/RitualFilters';
import RitualGrid from '../components/RitualGrid';
import { SamagriSelector } from '../components/SamagriSelector';
import { paymentService } from '../../../services/paymentService';
import { notificationService } from '../../../services/notificationService';
import { SEED_PANDITS } from '../../../data/seedData';
import { sendBookingConfirmationWhatsApp, sendPanditNewBookingWhatsApp } from '../../../services/whatsappService';

export default function BookingWizard() {
  const { devoteeId, devoteeName, userPhone, toast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [rituals, setRituals] = useState([]);
  const [filteredRituals, setFilteredRituals] = useState([]);
  const [ritualFilters, setRitualFilters] = useState({ category: 'All', maxPrice: 31000, samagriOnly: false });
  const [pandits, setPandits] = useState([]);
  const [samagriKits, setSamagriKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [draft, setDraft] = useState({
    ritualId: null, ritual: '', ritualIcon: '🕉️', amount: 0,
    samagriId: null, samagriAmount: 0, deliveryRequired: false,
    date: '', time: '', location: '', address: '', notes: '',
    panditId: null, panditName: ''
  });

  useEffect(() => {
    (async () => {
      const { data } = await bookingApi.getRituals();
      const onDemand = { id: 'on-demand', name: 'On-Demand Pandit', icon: '⚡', price: 1500, description: 'Book a certified scholar for a general consultation or custom rituals.', samagriRequired: false, category: 'General' };
      const allRituals = [onDemand, ...(data || [])];
      setRituals(allRituals); 
      setFilteredRituals(allRituals); 
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (location.state?.selectedRitual) {
      const r = location.state.selectedRitual;
      setDraft(prev => ({ ...prev, ritualId: r.id, ritual: r.name, ritualIcon: r.icon, amount: r.price }));
      setStep(2);
    }
  }, [location.state]);

  useEffect(() => {
    let list = [...rituals];
    if (ritualFilters.category !== 'All') {
      list = list.filter(r => r.id === 'on-demand' || (r.category && r.category.toLowerCase().includes(ritualFilters.category.toLowerCase())) || r.name.toLowerCase().includes(ritualFilters.category.toLowerCase()));
    }
    list = list.filter(r => r.id === 'on-demand' || r.price <= ritualFilters.maxPrice);
    if (ritualFilters.samagriOnly) list = list.filter(r => r.id === 'on-demand' || r.samagriRequired);
    setFilteredRituals(list);
  }, [ritualFilters, rituals]);

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const selectRitual = async (r) => {
    setLoading(true);
    if (r.id === 'on-demand') {
      setDraft(prev => ({ ...prev, ritualId: r.id, ritual: r.name, ritualIcon: r.icon, amount: r.price, samagriId: null, samagriAmount: 0 }));
      setStep(3); // Skip Samagri for on-demand
    } else {
      const { data } = await bookingApi.getSamagriKits(r.id);
      setSamagriKits(data || []);
      setDraft(prev => ({ ...prev, ritualId: r.id, ritual: r.name, ritualIcon: r.icon, amount: r.price }));
      nextStep();
    }
    setLoading(false);
  };

  const handleStep4Submit = (e) => {
    e.preventDefault();
    if (!draft.address || !draft.location) return toast("Location and Address are required!", "⚠️");
    (async () => {
      setLoading(true);
      const { data } = await bookingApi.getAvailablePandits(draft.ritual, draft.location, draft.date);
      // Always merge DB results with seed pandits as fallback
      const dbIds = new Set((data || []).map(p => p.id));
      const seedFallback = SEED_PANDITS.filter(p => !dbIds.has(p.id));
      const allPandits = [...(data || []), ...seedFallback];
      // Filter by city, show all if none match
      const cityMatch = allPandits.filter(p => !draft.location || p.city === draft.location || draft.location === 'Any City');
      setPandits(cityMatch.length > 0 ? cityMatch : allPandits);
      setLoading(false); nextStep();
    })();
  };

  const confirmBooking = async () => {
    setSubmitting(true);
    const totalRaw = draft.amount + draft.samagriAmount;
    const discount = draft.samagriId ? Math.round(totalRaw * 0.1) : 0;
    const totalAmount = totalRaw - discount;

    let bookingId = null;
    try {
      // Step 1: Create booking — only safe columns confirmed in DB schema
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          devotee_id:   devoteeId || null,
          pandit_id:    draft.panditId || null,
          ritual_name:  draft.ritual || 'Custom Pooja',
          booking_date: draft.date || new Date().toISOString().split('T')[0],
          address:      draft.address || null,
          total_amount: totalAmount || 0,
          status:       'pending_payment',
          created_at:   new Date().toISOString(),
        })
        .select()
        .single();

      if (bookingError) throw bookingError;
      bookingId = booking.id;

      // Step 2: Open Razorpay
      const payment = await paymentService.processPayment({
        amount: totalAmount,
        bookingId,
        name: devoteeName,
        contact: userPhone,
        description: `${draft.ritual}${draft.samagriId ? ' + Samagri' : ''}`
      });

      // Step 3: Update booking to confirmed
      await supabase.from('bookings').update({
        status: 'confirmed',
        razorpay_payment_id: payment.payment_id,
        razorpay_order_id: payment.order_id
      }).eq('id', bookingId);

      // Notify pandit
      if (draft.panditId) notificationService.notifyPanditOfNewBooking(draft.panditId, draft.ritual);

      // WhatsApp notifications
      if (userPhone) {
        sendBookingConfirmationWhatsApp({
          devoteeName,
          panditName: draft.panditName,
          ritual: draft.ritual,
          date: draft.date,
          amount: totalAmount,
          phone: userPhone,
        });
      }

      toast(draft.samagriId ? "Sacred Bundle Confirmed (+10% Savings)! 🙏" : "Booking Confirmed! 🙏", "🕉️");
      navigate('/user/history');

    } catch (err) {
      console.error("Booking Error:", err);
      // Mark payment as failed if booking was created
      if (bookingId) {
        await supabase.from('bookings').update({ status: 'payment_failed' }).eq('id', bookingId).catch(() => {});
      }
      toast(err.details || err.message || "Payment or Booking failed. Please try again.", "⚠️");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && step === 1) return <Spinner />;

  const totalAmount = (draft.amount + draft.samagriAmount) - (draft.samagriId ? Math.round((draft.amount + draft.samagriAmount) * 0.1) : 0);

  return (
    <div className="wizard-container">
      <div className="stepper" style={{ marginBottom: 40 }}>
        {[1, 2, 3, 4, 5, 6].map(s => (
          <div key={s} className={`step ${step === s ? 'active' : step > s ? 'done' : ''}`}>
            <div className="step-num">{step > s ? '✓' : s}</div>
            <div className="step-lbl">Step {s}</div>
          </div>
        ))}
      </div>

      {/* Progress Header */}
      <div style={{ maxWidth: 800, margin: '0 auto 40px', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: 10 }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'rgba(240,192,64,0.1)', zIndex: 1 }} />
          <div style={{ position: 'absolute', top: '50%', left: 0, width: `${(step-1)*20}%`, height: 2, background: 'linear-gradient(to right, #FF6B00, #F0C040)', transition: 'width 0.5s', zIndex: 2 }} />
          {[1, 2, 3, 4, 5, 6].map(s => (
            <div key={s} style={{ 
              width: 32, height: 32, borderRadius: '50%', 
              background: step >= s ? 'linear-gradient(135deg, #FF6B00, #F0C040)' : '#2c1a0e',
              border: `2px solid ${step >= s ? '#F0C040' : 'rgba(240,192,64,0.2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 900, color: step >= s ? '#fff' : 'rgba(240,192,64,0.4)',
              zIndex: 3, position: 'relative', transition: 'all 0.3s'
            }}>
              {step > s ? '✓' : s}
              <div style={{ position: 'absolute', top: 38, fontSize: 10, fontWeight: 700, color: step >= s ? '#F0C040' : 'rgba(240,192,64,0.3)', width: 'max-content' }}>
                {['Ritual', 'Samagri', 'Timing', 'Location', 'Pandit', 'Pay'][s-1]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ maxWidth: 900, margin: '0 auto', padding: '40px', borderRadius: 30, background: 'rgba(44,26,14,0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(240,192,64,0.15)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
        {step === 1 && (
          <div className="fade-in">
            <h1 style={{ fontFamily: 'Cinzel,serif', fontSize: 32, fontWeight: 900, textAlign: 'center', color: '#F0C040', marginBottom: 10 }}>⚡ Sacred Service Selection ⚡</h1>
            <p style={{ textAlign: 'center', color: 'rgba(255,248,240,0.6)', marginBottom: 30 }}>Choose a specialized ritual or book an expert scholar directly.</p>
            
            {/* Quick On-Demand CTA */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(255,107,0,0.15), rgba(212,160,23,0.05))', 
              border: '1px solid rgba(255,107,0,0.3)', 
              borderRadius: '24px', 
              padding: '24px', 
              marginBottom: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              boxShadow: '0 15px 35px rgba(255,107,0,0.1)'
            }}>
              <div>
                <h3 style={{ fontFamily: 'Cinzel', color: '#FF6B00', margin: 0, fontSize: '20px' }}>⚡ On-Demand Pandit Booking</h3>
                <p style={{ margin: '5px 0 0', color: 'rgba(255,248,240,0.5)', fontSize: '13px' }}>Book for custom rituals, consultations, or urgent Vedic guidance.</p>
              </div>
              <button 
                onClick={() => selectRitual({ id: 'on-demand', name: 'On-Demand Scholar', icon: '⚡', price: 1500, description: 'Book a certified scholar for custom needs.', samagriRequired: false })}
                style={{ background: 'linear-gradient(135deg, #FF6B00, #F0C040)', border: 'none', color: '#fff', padding: '12px 25px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Book Scholar Now →
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontFamily: 'Cinzel', color: 'rgba(240,192,64,0.3)', fontSize: '12px', letterSpacing: '2px' }}>OR SELECT BY RITUAL</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              </div>

              <RitualFilters onFilterChange={(k, v) => setRitualFilters(p => ({ ...p, [k]: v }))} activeFilters={ritualFilters} />
              
              <div style={{ marginTop: '20px' }}>
                {loading ? <Spinner /> : <RitualGrid rituals={filteredRituals.filter(r => r.id !== 'on-demand')} onSelect={selectRitual} activeId={draft.ritualId} />}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h2 style={{ fontFamily: 'Cinzel', color: '#F0C040', textAlign: 'center', fontSize: 28, marginBottom: 10 }}>Sacred Samagri</h2>
            <p style={{ textAlign: 'center', color: 'rgba(255,248,240,0.5)', marginBottom: 20 }}>Choose a curated kit for {draft.ritual} or arrange it yourself.</p>
            <div style={{ background: 'rgba(255, 107, 0, 0.1)', border: '1px dashed rgba(255, 107, 0, 0.3)', padding: '12px 20px', borderRadius: '15px', color: '#FF6B00', fontWeight: 800, fontSize: '13px', textAlign: 'center', marginBottom: '30px', animation: 'pulse 3s infinite' }}>
              🎁 BUNDLE OFFER: Save 10% when booking ritual with a samagri kit!
            </div>
            <SamagriSelector kits={samagriKits} selectedId={draft.samagriId}
              onSelect={(kit) => { setDraft(p => ({ ...p, samagriId: kit.id, samagriAmount: kit.price, deliveryRequired: true })); }}
              onSkip={() => { setDraft(p => ({ ...p, samagriId: null, samagriAmount: 0, deliveryRequired: false })); }} />
            
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <button className="btn btn-ghost" style={{ fontSize: '12px', color: 'rgba(240,192,64,0.6)' }} onClick={() => toast("Item-level customization available inside the kit selector!", "📦")}>
                ⚙️ Need more customization? Click items above to toggle
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
              <button className="btn btn-outline" onClick={prevStep}>← Back</button>
              <button className="btn btn-primary" onClick={nextStep} style={{ background: 'linear-gradient(135deg, #FF6B00, #D4A017)', border: 'none', padding: '12px 30px' }}>
                {draft.samagriId ? "Proceed with Samagri →" : "Proceed without Samagri →"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form className="fade-in" onSubmit={(e) => { 
            e.preventDefault(); 
            if (!draft.date || !draft.time) return toast("Date and time required!", "⚠️");
            const selectedDate = new Date(draft.date);
            const today = new Date();
            today.setHours(0,0,0,0);
            if (selectedDate < today) return toast("Cannot select a past date!", "⚠️");
            nextStep(); 
          }}>
            <h2 style={{ fontFamily: 'Cinzel', color: '#F0C040', textAlign: 'center', fontSize: 28, marginBottom: 30 }}>Pick Auspicious Timing</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 40 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'rgba(240,192,64,0.6)', marginBottom: 8, letterSpacing: 1 }}>Preferred Date</label>
                <input type="date" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(240,192,64,0.2)', color: '#fff', padding: 15, borderRadius: 12, outline: 'none' }} required value={draft.date} onChange={e => setDraft(d => ({ ...d, date: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'rgba(240,192,64,0.6)', marginBottom: 8, letterSpacing: 1 }}>Start Time</label>
                <input type="time" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(240,192,64,0.2)', color: '#fff', padding: 15, borderRadius: 12, outline: 'none' }} required value={draft.time} onChange={e => setDraft(d => ({ ...d, time: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-outline" onClick={prevStep}>← Back</button>
              <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #FF6B00, #D4A017)', border: 'none', padding: '12px 30px' }}>Choose Address →</button>
            </div>
          </form>
        )}

        {step === 4 && (
          <form className="fade-in" onSubmit={handleStep4Submit}>
            <h2 style={{ fontFamily: 'Cinzel', color: '#F0C040', textAlign: 'center', fontSize: 28, marginBottom: 30 }}>Service Location</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginBottom: 40 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'rgba(240,192,64,0.6)', marginBottom: 8, letterSpacing: 1 }}>City / Region</label>
                <select style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(240,192,64,0.2)', color: '#fff', padding: 15, borderRadius: 12, outline: 'none' }} required value={draft.location} onChange={e => setDraft(d => ({ ...d, location: e.target.value }))}>
                  <option value="">Select City</option>
                  {["Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad", "Mumbai", "Bengaluru", "Kashi", "Ayodhya", "Haridwar", "Ujjain", "Pune"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'rgba(240,192,64,0.6)', marginBottom: 8, letterSpacing: 1 }}>Detailed Address</label>
                <textarea style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(240,192,64,0.2)', color: '#fff', padding: 15, borderRadius: 12, outline: 'none', minHeight: 100 }} required value={draft.address} onChange={e => setDraft(d => ({ ...d, address: e.target.value }))} placeholder="House no, Building, Street name..." />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-outline" onClick={prevStep}>← Back</button>
              <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #FF6B00, #D4A017)', border: 'none', padding: '12px 30px' }}>Find Available Pandits →</button>
            </div>
          </form>
        )}

        {step === 5 && (
          <div className="fade-in">
            <h2 style={{ fontFamily: 'Cinzel', color: '#F0C040', textAlign: 'center', fontSize: 28, marginBottom: 10 }}>Choose Your Scholar</h2>
            <p style={{ textAlign: 'center', color: 'rgba(255,248,240,0.5)', marginBottom: 30 }}>Available certified experts for {draft.ritual} in {draft.location}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
              {loading ? <Spinner /> : (
                pandits.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px solid rgba(240,192,64,0.1)' }}>
                    <div style={{ fontSize: 48, marginBottom: 15 }}>🙏</div>
                    <div style={{ color: '#F0C040', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Finding Best Match...</div>
                    <div style={{ color: 'rgba(255,248,240,0.4)', fontSize: 13 }}>We are matching certified scholars in {draft.location}</div>
                  </div>
                ) : pandits.map(p => (
                  <div key={p.id}
                    className={`glass-card ${draft.panditId === p.id ? 'active' : ''}`}
                    onClick={() => { setDraft(prev => ({ ...prev, panditId: p.id, panditName: p.name })); nextStep(); }}
                    style={{ 
                      padding: 24, borderRadius: 20, cursor: 'pointer',
                      background: draft.panditId === p.id ? 'rgba(255,107,0,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${draft.panditId === p.id ? '#FF6B00' : 'rgba(240,192,64,0.1)'}`,
                      transition: 'all 0.3s'
                    }}>
                    <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B00, #F0C040)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900 }}>
                        {p.name[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: '#fff' }}>{p.name} {p.verified && "✓"}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,248,240,0.4)' }}>
                          {p.years_of_experience || p.experience_years}+ Yrs • ⭐ {p.rating} • ₹{p.min_fee?.toLocaleString()}
                        </div>
                      </div>
                      {draft.panditId === p.id && <span style={{ color: '#FF6B00', fontSize: 20 }}>✓</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-outline" onClick={prevStep}>← Back</button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="fade-in">
            <h2 style={{ fontFamily: 'Cinzel', color: '#F0C040', textAlign: 'center', fontSize: 28, marginBottom: 30 }}>Final Review</h2>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 30, marginBottom: 40, border: '1px solid rgba(240,192,64,0.1)' }}>
              <div style={{ display: 'grid', gap: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'rgba(255,248,240,0.5)', fontSize: 14 }}>Ritual Service</span>
                  <span style={{ fontWeight: 800, color: '#fff', textAlign: 'right' }}>{draft.ritualIcon} {draft.ritual}</span>
                </div>
                {draft.samagriId && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'rgba(255,248,240,0.5)', fontSize: 14 }}>Sacred Samagri Bundle</span>
                    <span style={{ fontWeight: 800, color: '#FF6B00', textAlign: 'right' }}>📦 Doorstep Delivery (+₹{draft.samagriAmount})</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'rgba(255,248,240,0.5)', fontSize: 14 }}>Date & Time</span>
                  <span style={{ fontWeight: 800, color: '#fff', textAlign: 'right' }}>📅 {draft.date} at 🕐 {draft.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'rgba(255,248,240,0.5)', fontSize: 14 }}>Vedic Scholar</span>
                  <span style={{ fontWeight: 800, color: '#F0C040', textAlign: 'right' }}>🕉️ {draft.panditName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <span style={{ fontWeight: 900, color: '#F0C040', fontSize: 22, fontFamily: 'Cinzel' }}>Total Amount</span>
                  <span style={{ fontWeight: 900, color: '#FF6B00', fontSize: 24, fontFamily: 'Cinzel' }}>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-outline" onClick={prevStep}>← Back</button>
              <button className="btn btn-primary" disabled={submitting} onClick={confirmBooking} style={{ background: 'linear-gradient(135deg, #FF6B00, #D4A017)', border: 'none', padding: '15px 40px', fontSize: 18, borderRadius: 15 }}>
                {submitting ? "Initiating Razorpay..." : "📿 Complete Payment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
