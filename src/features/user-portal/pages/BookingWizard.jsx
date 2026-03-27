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
      setRituals(data || []); setFilteredRituals(data || []); setLoading(false);
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
    if (ritualFilters.category !== 'All') list = list.filter(r => r.name.toLowerCase().includes(ritualFilters.category.toLowerCase()));
    list = list.filter(r => r.price <= ritualFilters.maxPrice);
    if (ritualFilters.samagriOnly) list = list.filter(r => r.samagriRequired);
    setFilteredRituals(list);
  }, [ritualFilters, rituals]);

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const selectRitual = async (r) => {
    setLoading(true);
    const { data } = await bookingApi.getSamagriKits(r.id);
    setSamagriKits(data || []);
    setDraft(prev => ({ ...prev, ritualId: r.id, ritual: r.name, ritualIcon: r.icon, amount: r.price }));
    setLoading(false); nextStep();
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
      // Step 1: Create booking with pending_payment status
      const { data: booking, error: bookingError } = await supabase.from('bookings').insert({
        devotee_id: devoteeId,
        devotee_name: devoteeName,
        pandit_id: draft.panditId,
        pandit_name: draft.panditName,
        ritual: draft.ritual,
        ritual_icon: draft.ritualIcon,
        booking_date: draft.date,
        start_time: draft.time,
        booking_time: draft.time,
        address: draft.address,
        location: draft.location,
        notes: draft.notes,
        total_amount: totalAmount,
        amount: totalAmount,
        status: 'pending_payment',
        created_at: new Date().toISOString()
      }).select().single();

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

      <div className="wizard-card card" style={{ padding: '30px', borderRadius: '20px' }}>
        {step === 1 && (
          <div className="wizard-step">
            <h2 className="ph-title" style={{ color: '#F0C040' }}>Choose Your Sacred Ritual</h2>
            <p className="ph-sub">Explore our catalog and find the ceremony you wish to perform.</p>
            <div className="marketplace-content" style={{ marginTop: '20px' }}>
              <aside className="filters-sidebar"><RitualFilters onFilterChange={(k, v) => setRitualFilters(p => ({ ...p, [k]: v }))} activeFilters={ritualFilters} /></aside>
              <section>{loading ? <Spinner /> : <RitualGrid rituals={filteredRituals} onSelect={selectRitual} activeId={draft.ritualId} />}</section>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-step">
            <h2 className="ph-title" style={{ color: '#F0C040' }}>Sacred Samagri Options</h2>
            <div style={{ background: '#FFF3E6', border: '1px dashed #FF6B00', padding: '10px 20px', borderRadius: '12px', color: '#B04B00', fontWeight: 800, fontSize: '12px', display: 'inline-block', marginBottom: '15px' }}>
              🎁 BUNDLE OFFER: Save 10% when booking ritual with a samagri kit!
            </div>
            <SamagriSelector kits={samagriKits} selectedId={draft.samagriId}
              onSelect={(kit) => { setDraft(p => ({ ...p, samagriId: kit.id, samagriAmount: kit.price, deliveryRequired: true })); }}
              onSkip={() => { setDraft(p => ({ ...p, samagriId: null, samagriAmount: 0, deliveryRequired: false })); }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
              <button className="btn btn-outline" onClick={prevStep}>← Back</button>
              <button className="btn btn-primary" onClick={nextStep}>
                {draft.samagriId ? "Proceed with Samagri →" : "Proceed without Samagri →"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form className="wizard-step" onSubmit={(e) => { 
            e.preventDefault(); 
            if (!draft.date || !draft.time) return toast("Date and time required!", "⚠️");
            const selectedDate = new Date(draft.date);
            const today = new Date();
            today.setHours(0,0,0,0);
            if (selectedDate < today) return toast("Cannot select a past date!", "⚠️");
            nextStep(); 
          }}>
            <h2 className="ph-title" style={{ color: '#F0C040' }}>Pick Auspicious Timing</h2>
            <div className="fgrid" style={{ gap: '20px', marginTop: '30px' }}>
              <div className="fg"><label className="fl">Preferred Date</label><input type="date" className="fi" required value={draft.date} onChange={e => setDraft(d => ({ ...d, date: e.target.value }))} /></div>
              <div className="fg"><label className="fl">Start Time</label><input type="time" className="fi" required value={draft.time} onChange={e => setDraft(d => ({ ...d, time: e.target.value }))} /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
              <button type="button" className="btn btn-outline" onClick={prevStep}>← Back</button>
              <button type="submit" className="btn btn-primary">Choose Address →</button>
            </div>
          </form>
        )}

        {step === 4 && (
          <form className="wizard-step" onSubmit={handleStep4Submit}>
            <h2 className="ph-title" style={{ color: '#F0C040' }}>Where should Pt. Ji arrive?</h2>
            <div className="fgrid" style={{ gap: '20px', marginTop: '30px' }}>
              <div className="fg">
                <label className="fl">City</label>
                <select className="fs" required value={draft.location} onChange={e => setDraft(d => ({ ...d, location: e.target.value }))}>
                  <option value="">Select City</option>
                  {["Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad", "Mumbai", "Bengaluru", "Kashi", "Ayodhya", "Haridwar", "Ujjain", "Pune"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="fg"><label className="fl">Full Address</label><textarea className="fta" required value={draft.address} onChange={e => setDraft(d => ({ ...d, address: e.target.value }))} placeholder="House no, Street, Landmark..." /></div>
              <div className="fg"><label className="fl">Additional Instructions (Optional)</label><input className="fi" value={draft.notes} onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))} placeholder="Entry info, special requests..." /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
              <button type="button" className="btn btn-outline" onClick={prevStep}>← Back</button>
              <button type="submit" className="btn btn-primary">Find Available Pandits →</button>
            </div>
          </form>
        )}

        {step === 5 && (
          <div className="wizard-step">
            <h2 className="ph-title" style={{ color: '#F0C040' }}>Choose Your Vedic Scholar</h2>
            <div style={{ display: 'grid', gap: '15px', marginTop: '30px' }}>
              {loading ? <Spinner /> : (
                pandits.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', background: '#fff8f0', borderRadius: 12 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🙏</div>
                    <div style={{ color: '#1a0f07', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Finding Pandits...</div>
                    <div style={{ color: '#9a8070', fontSize: 13 }}>Verified scholars are being matched for you</div>
                  </div>
                ) : pandits.map(p => (
                  <div key={p.id}
                    className={`card card-p ${draft.panditId === p.id ? 'selected' : ''}`}
                    onClick={() => { setDraft(prev => ({ ...prev, panditId: p.id, panditName: p.name })); nextStep(); }}
                    style={{ cursor: 'pointer', border: draft.panditId === p.id ? '2px solid #FF6B00' : undefined }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ fontSize: '30px' }}>{p.emoji || '🕉️'}</div>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{p.name} {p.verified && "✓"}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{p.years_of_experience || p.experience}y exp · {p.rating}★ · ₹{p.min_fee?.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div style={{ marginTop: '40px' }}>
              <button className="btn btn-outline" onClick={prevStep}>← Back</button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="wizard-step">
            <h2 className="ph-title" style={{ color: '#F0C040' }}>Confirm Your Sacred Booking</h2>
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '15px', marginTop: '30px' }}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Ritual</strong><span>{draft.ritualIcon} {draft.ritual}</span></div>
                {draft.samagriId && <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Samagri Kit</strong><span style={{ color: '#FF6B00' }}>📦 Doorstep Kit (+₹{draft.samagriAmount})</span></div>}
                {draft.samagriId && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#12B76A', fontWeight: 800, fontSize: '13px' }}><span>✨ Bundle Savings (10%)</span><span>-₹{Math.round((draft.amount + draft.samagriAmount) * 0.1)}</span></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Timing</strong><span>📅 {draft.date} at 🕐 {draft.time}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Location</strong><span>📍 {draft.address}, {draft.location}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Pandit Ji</strong><span>🕉️ {draft.panditName || "Selecting Expert..."}</span></div>
                <hr style={{ margin: '15px 0', opacity: 0.1 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: '#FF6B00' }}>
                  <strong>Final Amount</strong><strong>₹{totalAmount.toLocaleString()}</strong>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
              <button className="btn btn-outline" onClick={prevStep}>← Back</button>
              <button className="btn btn-primary btn-lg" onClick={confirmBooking} disabled={submitting}>
                {submitting ? "Processing..." : "📿 Confirm & Pay Dakshina"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
