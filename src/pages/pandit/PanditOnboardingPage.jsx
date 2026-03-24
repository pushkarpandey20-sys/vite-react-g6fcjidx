import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppCtx';
import { supabase } from '../../services/supabase';

const SPECIALIZATIONS = ['Griha Pravesh', 'Satyanarayan Katha', 'Vivah', 'Navgrah Puja', 'Rudrabhishek', 'Sundarkand', 'Namkaran', 'Mundan', 'Annaprashan', 'Pitru Paksha', 'Kaal Sarp Dosh', 'Vastu Shanti'];
const LANGUAGES = ['Hindi', 'Sanskrit', 'English', 'Bengali', 'Marathi', 'Tamil', 'Telugu', 'Gujarati', 'Kannada', 'Punjabi'];
const CITIES = ['Delhi', 'Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad', 'Mumbai', 'Bengaluru', 'Kashi', 'Ayodhya', 'Haridwar', 'Ujjain', 'Pune', 'Jaipur', 'Ahmedabad', 'Kolkata'];

export default function PanditOnboardingPage() {
  const navigate = useNavigate();
  const { toast, userPhone } = useApp();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    // Step 1
    name: '',
    phone: userPhone || '',
    city: '',
    years_of_experience: '',
    languages: [],
    // Step 2
    specializations: [],
    min_fee: '',
    about: '',
    // Step 3
    aadhar_number: '',
    pan_number: '',
    bank_account: '',
    ifsc_code: '',
    show_whatsapp: false,
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggle = (field, val) => setForm(p => {
    const arr = p[field];
    return { ...p, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!form.bank_account || !form.ifsc_code) {
      return toast('Bank account and IFSC are required for payouts.', '⚠️');
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('pandits').insert({
        name: form.name,
        phone: form.phone,
        city: form.city,
        years_of_experience: parseInt(form.years_of_experience) || 0,
        languages: form.languages,
        specialization: form.specializations[0] || '',
        rituals: form.specializations,
        min_fee: parseFloat(form.min_fee) || 0,
        about: form.about,
        aadhar_number: form.aadhar_number,
        pan_number: form.pan_number,
        bank_account: form.bank_account,
        ifsc_code: form.ifsc_code,
        show_whatsapp: form.show_whatsapp,
        status: 'pending_verification',
        rating: 5.0,
        emoji: '🕉️',
        verified: false,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast('Application submitted! Our team will verify you within 48 hours. 🙏', '✅');
      navigate('/pandit/dashboard');
    } catch (err) {
      toast(err.message || 'Submission failed. Please try again.', '⚠️');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a0f07, #3d2211)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: 640 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🪔</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", color: '#F0C040', fontSize: '1.8rem', marginBottom: 8 }}>Join as a Vedic Scholar</h1>
          <p style={{ color: 'rgba(255,248,240,0.6)', fontFamily: "'Crimson Pro', serif", fontSize: 15 }}>Complete your profile to start receiving sacred bookings</p>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
          {['Basic Info', 'Specializations', 'Verification'].map((label, i) => {
            const s = i + 1;
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, background: step >= s ? 'linear-gradient(135deg, #FF6B00, #D4A017)' : 'rgba(255,255,255,0.1)', color: step >= s ? '#fff' : 'rgba(255,248,240,0.4)' }}>
                  {step > s ? '✓' : s}
                </div>
                <span style={{ fontSize: 12, color: step >= s ? '#F0C040' : 'rgba(255,248,240,0.4)', fontWeight: 600 }}>{label}</span>
                {i < 2 && <div style={{ width: 24, height: 1, background: 'rgba(212,160,23,0.3)' }} />}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="card card-p" style={{ borderRadius: 20, padding: '32px 28px' }}>
          {step === 1 && (
            <div>
              <h3 style={{ fontFamily: "'Cinzel', serif", color: '#D4A017', marginBottom: 24 }}>Basic Information</h3>
              <div className="fgrid" style={{ gap: 20 }}>
                <div className="fg">
                  <label className="fl">Full Name *</label>
                  <input className="fi" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Pandit Ram Sharma" />
                </div>
                <div className="fg">
                  <label className="fl">Phone Number *</label>
                  <input className="fi" required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91XXXXXXXXXX" />
                </div>
                <div className="fg">
                  <label className="fl">Primary City *</label>
                  <select className="fs" required value={form.city} onChange={e => set('city', e.target.value)}>
                    <option value="">Select City</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label className="fl">Years of Experience *</label>
                  <input type="number" className="fi" required min="0" max="70" value={form.years_of_experience} onChange={e => set('years_of_experience', e.target.value)} placeholder="e.g. 15" />
                </div>
                <div className="fg ffw">
                  <label className="fl">Languages You Chant In</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {LANGUAGES.map(l => (
                      <button type="button" key={l} onClick={() => toggle('languages', l)}
                        style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid', borderColor: form.languages.includes(l) ? '#FF6B00' : 'rgba(212,160,23,0.3)', background: form.languages.includes(l) ? 'rgba(255,107,0,0.12)' : 'transparent', color: form.languages.includes(l) ? '#FF6B00' : '#8B6347', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
                <button className="btn btn-primary" onClick={() => {
                  if (!form.name || !form.phone || !form.city || !form.years_of_experience) return toast('Please fill all required fields.', '⚠️');
                  nextStep();
                }}>Specializations →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontFamily: "'Cinzel', serif", color: '#D4A017', marginBottom: 24 }}>Your Sacred Specializations</h3>
              <div className="fgrid" style={{ gap: 20 }}>
                <div className="fg ffw">
                  <label className="fl">Rituals You Perform * (select all that apply)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {SPECIALIZATIONS.map(s => (
                      <button type="button" key={s} onClick={() => toggle('specializations', s)}
                        style={{ padding: '7px 14px', borderRadius: 20, border: '1px solid', borderColor: form.specializations.includes(s) ? '#D4A017' : 'rgba(212,160,23,0.3)', background: form.specializations.includes(s) ? 'rgba(212,160,23,0.15)' : 'transparent', color: form.specializations.includes(s) ? '#D4A017' : '#8B6347', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="fg">
                  <label className="fl">Minimum Dakshina (₹ per Pooja) *</label>
                  <input type="number" className="fi" min="500" value={form.min_fee} onChange={e => set('min_fee', e.target.value)} placeholder="e.g. 2100" />
                </div>
                <div className="fg ffw">
                  <label className="fl">About You (Optional)</label>
                  <textarea className="fta" value={form.about} onChange={e => set('about', e.target.value)} placeholder="Tell devotees about your lineage, guru, and areas of expertise..." rows={3} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                <button className="btn btn-outline" onClick={prevStep}>← Back</button>
                <button className="btn btn-primary" onClick={() => {
                  if (!form.specializations.length || !form.min_fee) return toast('Select at least one specialization and set your minimum fee.', '⚠️');
                  nextStep();
                }}>Verification →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ fontFamily: "'Cinzel', serif", color: '#D4A017', marginBottom: 8 }}>Identity & Payout Details</h3>
              <p style={{ color: '#8B6347', fontSize: 13, marginBottom: 24 }}>Your details are encrypted and used only for KYC verification and payments.</p>
              <div className="fgrid" style={{ gap: 20 }}>
                <div className="fg">
                  <label className="fl">Aadhar Number</label>
                  <input className="fi" maxLength={12} value={form.aadhar_number} onChange={e => set('aadhar_number', e.target.value.replace(/\D/g, ''))} placeholder="XXXX XXXX XXXX" />
                </div>
                <div className="fg">
                  <label className="fl">PAN Number</label>
                  <input className="fi" maxLength={10} value={form.pan_number} onChange={e => set('pan_number', e.target.value.toUpperCase())} placeholder="ABCDE1234F" />
                </div>
                <div className="fg">
                  <label className="fl">Bank Account Number *</label>
                  <input className="fi" required value={form.bank_account} onChange={e => set('bank_account', e.target.value)} placeholder="Account number for payouts" />
                </div>
                <div className="fg">
                  <label className="fl">IFSC Code *</label>
                  <input className="fi" required value={form.ifsc_code} onChange={e => set('ifsc_code', e.target.value.toUpperCase())} placeholder="e.g. SBIN0001234" />
                </div>
                <div className="fg ffw" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="checkbox" id="whatsapp" checked={form.show_whatsapp} onChange={e => set('show_whatsapp', e.target.checked)} style={{ width: 18, height: 18 }} />
                  <label htmlFor="whatsapp" style={{ fontWeight: 600, fontSize: 14, color: '#2C1A0E', cursor: 'pointer' }}>Show WhatsApp button on my profile card</label>
                </div>
              </div>

              <div style={{ background: 'rgba(255,107,0,0.06)', border: '1px dashed rgba(255,107,0,0.3)', borderRadius: 12, padding: '14px 18px', marginTop: 20, fontSize: 13, color: '#B04B00' }}>
                📋 Our team will verify your documents within <strong>48 hours</strong>. You'll receive an SMS once approved.
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                <button className="btn btn-outline" onClick={prevStep}>← Back</button>
                <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Submitting...' : '🙏 Submit Application'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,248,240,0.4)', fontSize: 12, marginTop: 20 }}>
          Already have an account? <a href="/pandit/dashboard" style={{ color: '#F0C040' }}>Go to Dashboard</a>
        </p>
      </div>
    </div>
  );
}
