import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppCtx';
import { bookingApi } from '../../../api/bookingApi';
import { Spinner } from '../../../components/common/UIElements';
import RitualFilters from '../components/RitualFilters';
import RitualGrid from '../components/RitualGrid';
import { SamagriSelector } from '../components/SamagriSelector';
import { paymentService } from '../../../services/paymentService';
import { notificationService } from '../../../services/notificationService';

export default function BookingWizard() {
  const { devoteeId, devoteeName, toast } = useApp();
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

  // Draft State
  const [draft, setDraft] = useState({
    ritualId: null,
    ritual: '',
    ritualIcon: '🕉️',
    amount: 0,
    samagriId: null,
    samagriAmount: 0,
    deliveryRequired: false,
    date: '',
    time: '',
    location: '',
    address: '',
    notes: '',
    panditId: null,
    panditName: '',
    devoteeId: devoteeId,
    devoteeName: devoteeName
  });

  useEffect(() => {
    (async () => {
      const { data } = await bookingApi.getRituals();
      setRituals(data || []);
      setFilteredRituals(data || []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (location.state?.selectedRitual) {
      const r = location.state.selectedRitual;
      setDraft(prev => ({
        ...prev,
        ritualId: r.id,
        ritual: r.name,
        ritualIcon: r.icon,
        amount: r.price
      }));
      setStep(2);
    }
  }, [location.state]);

  useEffect(() => {
    let list = [...rituals];
    if (ritualFilters.category !== 'All') {
      list = list.filter(r => 
        r.name.toLowerCase().includes(ritualFilters.category.toLowerCase()) || 
        r.description?.toLowerCase().includes(ritualFilters.category.toLowerCase())
      );
    }
    list = list.filter(r => r.price <= ritualFilters.maxPrice);
    if (ritualFilters.samagriOnly) {
      list = list.filter(r => r.samagriRequired);
    }
    setFilteredRituals(list);
  }, [ritualFilters, rituals]);

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleRitualFilter = (key, val) => {
    setRitualFilters(prev => ({ ...prev, [key]: val }));
  };

  const selectRitual = async (r) => {
    setLoading(true);
    const { data } = await bookingApi.getSamagriKits(r.id);
    setSamagriKits(data || []);
    setDraft(prev => ({ ...prev, ritualId: r.id, ritual: r.name, ritualIcon: r.icon, amount: r.price }));
    setLoading(false);
    nextStep();
  };

  const handleSamagriSelect = (kit) => {
    setDraft(prev => ({ 
      ...prev, 
      samagriId: kit.id, 
      samagriAmount: kit.price, 
      deliveryRequired: true 
    }));
    nextStep();
  };

  const skipSamagri = () => {
    setDraft(prev => ({ ...prev, samagriId: null, samagriAmount: 0, deliveryRequired: false }));
    nextStep();
  };

  const handleStep3Submit = (e) => {
    e.preventDefault();
    if (!draft.date || !draft.time) return toast("Date and time are required!", "⚠️");
    nextStep();
  };

  const handleStep4Submit = (e) => {
    e.preventDefault();
    if (!draft.address || !draft.location) return toast("Location and Address are required!", "⚠️");
    (async () => {
      setLoading(true);
      const { data } = await bookingApi.getAvailablePandits(draft.ritual, draft.location, draft.date);
      setPandits(data || []);
      setLoading(false);
      nextStep();
    })();
  };

  const selectPandit = (p) => {
    setDraft(prev => ({ ...prev, panditId: p.id, panditName: p.name }));
    nextStep();
  };

  const confirmBooking = async () => {
    setSubmitting(true);
    const totalRaw = draft.amount + draft.samagriAmount;
    const discount = draft.samagriId ? Math.round(totalRaw * 0.1) : 0;
    const totalAmount = totalRaw - discount;
    
    try {
      const payment = await paymentService.processPayment({
        amount: totalAmount,
        name: devoteeName,
        description: `Sacred Ritual: ${draft.ritual} ${draft.samagriId ? '+ Samagri Bundle' : ''}`
      });

      if (payment.success) {
        const { error } = await bookingApi.createBooking({
          ...draft,
          total_amount: totalAmount,
          discount_amount: discount,
          payment_id: payment.payment_id,
          payment_status: 'paid'
        });
        if (error) throw error;
        
        // Notify Pandit
        if (draft.panditId) {
          notificationService.notifyPanditOfNewBooking(draft.panditId, draft.ritual);
        }

        toast("Sacred Bundle Confirmed (+10% Savings)! 🙏", "🕉️");
        navigate('/user/history');
      }
    } catch (err) {
      toast(err.message || "Payment Process Interrupted", "⚠️");
    } finally {
      setSubmitting(false);
    }
  };


  if (loading && step === 1) return <Spinner />;

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
          <div className="wizard-step step-1">
            <h2 className="ph-title" style={{ color: '#F0C040' }}>Choose Your Sacred Ritual</h2>
            <p className="ph-sub">Explore our catalog and find the ceremony you wish to perform.</p>
            
            <div className="marketplace-content" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '30px', marginTop: '20px' }}>
              <aside className="filters-sidebar">
                <RitualFilters 
                  onFilterChange={handleRitualFilter} 
                  activeFilters={ritualFilters} 
                />
              </aside>
              <section className="wizard-main">
                {loading ? <Spinner /> : (
                  <RitualGrid 
                    rituals={filteredRituals} 
                    onSelect={selectRitual} 
                    activeId={draft.ritualId} 
                  />
                )}
              </section>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-step step-2">
            <h2 className="ph-title" style={{ color: '#F0C040' }}>Sacred Samagri Options</h2>
            <div style={{ background: '#FFF3E6', border: '1px dashed #FF6B00', padding: '10px 20px', borderRadius: '12px', color: '#B04B00', fontWeight: 800, fontSize: '12px', display: 'inline-block', marginBottom: '15px' }}>
              🎁 BUNDLE OFFER: Save 10% when booking ritual with a samagri kit!
            </div>
            <p className="ph-sub">Would you like us to deliver a doorstep ritual kit for {draft.ritual}?</p>
            <div style={{ marginTop: '30px' }}>
              <SamagriSelector 
                kits={samagriKits} 
                selectedId={draft.samagriId} 
                onSelect={handleSamagriSelect} 
                onSkip={skipSamagri} 
              />
            </div>
            <div className="wizard-btns" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
              <button className="btn btn-outline" onClick={prevStep}>← Back</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form className="wizard-step step-3" onSubmit={handleStep3Submit}>
            <h2 className="ph-title" style={{ color: '#F0C040' }}>Pick Auspicious Timing</h2>
            <p className="ph-sub">Consult the Panchang for a Shubh Muhurta.</p>
            <div className="fgrid" style={{ marginBottom: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
              <div className="fg">
                <label className="fl">Preferred Date</label>
                <input type="date" className="fi" required value={draft.date} onChange={e => setDraft(d => ({ ...d, date: e.target.value }))} />
              </div>
              <div className="fg">
                <label className="fl">Start Time</label>
                <input type="time" className="fi" required value={draft.time} onChange={e => setDraft(d => ({ ...d, time: e.target.value }))} />
              </div>
            </div>
            <div className="wizard-btns" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
              <button type="button" className="btn btn-outline" onClick={prevStep}>← Back</button>
              <button type="submit" className="btn btn-primary">Choose Address →</button>
            </div>
          </form>
        )}

        {step === 4 && (
          <form className="wizard-step step-4" onSubmit={handleStep4Submit}>
            <h2 className="ph-title" style={{ color: '#F0C040' }}>Where should Pt. Ji arrive?</h2>
            <p className="ph-sub">Complete this for your home, office, or temple venue.</p>
            <div className="fgrid" style={{ display: 'grid', gap: '20px', marginTop: '30px' }}>
              <div className="fg">
                <label className="fl">City</label>
                <select className="fs" required value={draft.location} onChange={e => setDraft(d => ({ ...d, location: e.target.value }))}>
                  <option value="">Select City</option>
                  {["Kashi", "Delhi", "Mumbai", "Bangalore", "Ayodhya", "Agra", "Ujjain", "Haridwar", "Pune"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="fg">
                <label className="fl">Full Address</label>
                <textarea className="fta" required value={draft.address} onChange={e => setDraft(d => ({ ...d, address: e.target.value }))} placeholder="House no, Street name, LandMark..." />
              </div>
              <div className="fg">
                <label className="fl">Additional Instructions (Optional)</label>
                <input className="fi" value={draft.notes} onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))} placeholder="Ask for specific preparation or entry info..." />
              </div>
            </div>
            <div className="wizard-btns" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
              <button type="button" className="btn btn-outline" onClick={prevStep}>← Back</button>
              <button type="submit" className="btn btn-primary">Find Available Pandits →</button>
            </div>
          </form>
        )}

        {step === 5 && (
          <div className="wizard-step step-5">
            <h2 className="ph-title" style={{ color: '#F0C040' }}>Choose Your Vedic Scholar</h2>
            <p className="ph-sub">Based on your ritual and location, we've found these experts.</p>
            <div className="pandit-picker-grid" style={{ display: 'grid', gap: '15px', marginTop: '30px' }}>
              {loading ? <Spinner /> : (
                pandits.length === 0 ? <div style={{ textAlign: 'center', padding: '40px' }}><p>No experts available for this city/ritual. Try another city.</p></div> : (
                  pandits.map(p => (
                    <div key={p.id} className={`pandit-pick-card ${draft.panditId === p.id ? 'active' : ''}`} 
                      onClick={() => selectPandit(p)}
                      style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '12px', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ fontSize: '30px' }}>{p.emoji}</div>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{p.name} {p.verified && "✓"}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{p.experience_years}y exp · {p.rating}★</div>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
            <div className="wizard-btns" style={{ marginTop: '40px' }}>
              <button className="btn btn-outline" onClick={prevStep}>← Back</button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="wizard-step step-6">
            <h2 className="ph-title" style={{ color: '#F0C040' }}>Reconfirm Your Sacred Activity</h2>
            <p className="ph-sub">Check all details before Pt. Ji accepts your request.</p>
            <div className="confirm-box" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '15px', marginTop: '30px' }}>
              <div className="conf-summary" style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Ritual</strong> <span>{draft.ritualIcon} {draft.ritual}</span></div>
                {draft.samagriId && <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Samagri Kit</strong> <span style={{ color: '#FF6B00' }}>📦 Doorstep Kit (+₹{draft.samagriAmount})</span></div>}
                {draft.samagriId && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#12B76A', fontWeight: 800, fontSize: '13px' }}>
                    <span>✨ Bundle Savings (10% Off)</span>
                    <span>-₹{Math.round((draft.amount + draft.samagriAmount) * 0.1)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Timing</strong> <span>📅 {draft.date} at 🕐 {draft.time}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Location</strong> <span>📍 {draft.address}, {draft.location}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Pandit Ji</strong> <span>🕉️ {draft.panditName || "Selecting Expert..."}</span></div>
                <hr style={{ margin: '15px 0', opacity: 0.1 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: '#FF6B00' }}>
                  <strong>Final Amount</strong> 
                  <strong>₹{(draft.amount + draft.samagriAmount) - (draft.samagriId ? Math.round((draft.amount + draft.samagriAmount) * 0.1) : 0)}</strong>
                </div>
              </div>
            </div>
            <div className="wizard-btns" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
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
