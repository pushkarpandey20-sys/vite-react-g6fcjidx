import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const SPECIALIZATION_OPTIONS = [
  'Grih & Vastu', 'Marriage', 'Childhood Sanskars', 'Planetary & Dosh',
  'Shiva', 'Vishnu', 'Devi', 'Havan & Yagna',
  'Pitru Karma', 'Last Rites', 'Festival Puja',
];
const LANGUAGE_OPTIONS = [
  'Hindi', 'Sanskrit', 'English', 'Telugu',
  'Tamil', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Kannada',
];
const EXP_OPTIONS = [
  { value: '1', label: '1–2 years' },
  { value: '3', label: '3–5 years' },
  { value: '6', label: '6–10 years' },
  { value: '10', label: '10+ years' },
];

const STEPS = [
  { label: 'Personal Info',    icon: '👤' },
  { label: 'Professional',     icon: '🕉️' },
  { label: 'Verification',     icon: '🔐' },
  { label: 'Bank Details',     icon: '🏦' },
];

const C = {
  bg:     '#1a0a00',
  card:   '#2a1200',
  gold:   '#F0C040',
  accent: '#FF6B00',
  text:   'rgba(255,248,240,0.88)',
  sub:    'rgba(255,248,240,0.45)',
  border: 'rgba(212,160,23,0.22)',
};

const inputStyle = {
  padding: '11px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10,
  fontFamily: 'Nunito, sans-serif', fontSize: 13.5, color: C.text,
  background: 'rgba(255,248,240,0.05)', outline: 'none',
  width: '100%', boxSizing: 'border-box',
};
const labelStyle = {
  fontSize: 11, fontWeight: 700, color: 'rgba(240,192,64,0.7)',
  textTransform: 'uppercase', letterSpacing: '.8px',
  marginBottom: 6, display: 'block',
};
const chipStyle = (active) => ({
  padding: '7px 14px', borderRadius: 20,
  border: `1px solid ${active ? 'rgba(240,192,64,0.6)' : 'rgba(240,192,64,0.2)'}`,
  background: active ? 'rgba(240,192,64,0.15)' : 'transparent',
  color: active ? C.gold : C.sub,
  fontWeight: 700, fontSize: 12, cursor: 'pointer',
  fontFamily: 'Nunito, sans-serif', transition: 'all 0.18s',
});

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function PanditOnboardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', email: '', city: '', pincode: '',
    experience: '', specializations: [], languages: [], bio: '',
    aadhar: '', pan: '',
    bankHolder: '', bankAccount: '', ifsc: '',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggle = (field, val) => setForm(p => {
    const arr = p[field];
    return { ...p, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
  });

  // Per-step validation
  const validate = () => {
    if (step === 1) {
      if (!form.name.trim()) return 'Full name is required.';
      const digits = form.phone.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 12) return 'Enter a valid 10-digit phone number.';
      if (!form.city.trim()) return 'City is required.';
    }
    if (step === 2) {
      if (!form.experience) return 'Select your experience level.';
      if (form.specializations.length === 0) return 'Select at least one specialization.';
      if (form.languages.length === 0) return 'Select at least one language.';
    }
    if (step === 3) {
      if (form.aadhar && form.aadhar.replace(/\D/g, '').length !== 12)
        return 'Aadhaar number must be 12 digits.';
    }
    if (step === 4) {
      if (!form.bankAccount.trim() || !form.ifsc.trim())
        return 'Bank account and IFSC are required.';
    }
    return null;
  };

  const [error, setError] = useState('');

  const handleNext = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setStep(s => Math.min(s + 1, 4));
  };
  const handleBack = () => { setError(''); setStep(s => Math.max(s - 1, 1)); };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setSubmitting(true);
    try {
      await supabase.from('pandits').insert({
        name:             form.name,
        phone:            form.phone,
        email:            form.email || null,
        city:             form.city,
        pincode:          form.pincode || null,
        experience_years: parseInt(form.experience) || 0,
        specializations:  form.specializations,
        languages:        form.languages,
        bio:              form.bio || null,
        aadhar_number:    form.aadhar || null,
        pan_number:       form.pan || null,
        bank_account:     form.bankAccount,
        ifsc_code:        form.ifsc,
        bank_holder:      form.bankHolder || form.name,
        status:           'pending',
        is_verified:      false,
        rating:           0,
        bookings_count:   0,
        created_at:       new Date().toISOString(),
      });

      // Notify admin
      await supabase.from('notifications').insert({
        type:    'new_pandit_application',
        title:   'New Pandit Application',
        message: `${form.name} from ${form.city} has applied to join BhaktiGo.`,
        data:    { name: form.name, phone: form.phone, city: form.city },
      }).catch(() => {}); // non-critical

      setSubmitted(true);
    } catch (e) {
      console.error('[pandit-onboard]', e);
      setError(e.message || 'Submission failed. Please try again.');
    }
    setSubmitting(false);
  };

  // ── Success screen ──────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: 500, textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>🙏</div>
          <h2 style={{ fontFamily: 'Cinzel, serif', color: C.gold, fontSize: '1.7rem', marginBottom: 12, fontWeight: 900 }}>
            Application Submitted!
          </h2>
          <p style={{ color: 'rgba(255,248,240,0.75)', fontSize: 15, lineHeight: 1.7, marginBottom: 28, fontFamily: 'Nunito, sans-serif' }}>
            Our team will verify your profile within{' '}
            <strong style={{ color: C.accent }}>24–48 hours</strong>.
          </p>
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 16, padding: '18px 22px', marginBottom: 28, textAlign: 'left' }}>
            {[
              '📋 Application received successfully',
              '🔍 KYC and documents under review',
              `📱 WhatsApp confirmation will be sent to ${form.phone}`,
              '⏳ Estimated verification: 24–48 hours',
            ].map((line, i, arr) => (
              <div key={i} style={{
                color: 'rgba(255,248,240,0.7)', fontSize: 13,
                fontFamily: 'Nunito, sans-serif',
                padding: '7px 0',
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                {line}
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/')}
            style={{ background: `linear-gradient(135deg, ${C.accent}, #D4A017)`, color: '#fff', border: 'none', borderRadius: 30, padding: '14px 40px', fontSize: 15, fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,107,0,0.35)' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ── Progress bar ────────────────────────────────────────
  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 620 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🪔</div>
          <h1 style={{ fontFamily: 'Cinzel, serif', color: C.gold, fontSize: '1.7rem', marginBottom: 8, fontWeight: 900 }}>
            Join as a Vedic Scholar
          </h1>
          <p style={{ color: C.sub, fontSize: 14, margin: 0 }}>
            4-step profile setup — takes about 5 minutes
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            {STEPS.map((s, i) => {
              const n = i + 1;
              const done = step > n;
              const active = step === n;
              return (
                <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 13,
                    background: done ? 'rgba(34,197,94,0.85)' : active ? `linear-gradient(135deg, ${C.accent}, #D4A017)` : 'rgba(255,248,240,0.07)',
                    color: (done || active) ? '#fff' : C.sub,
                    border: active ? 'none' : `1px solid ${C.border}`,
                    boxShadow: active ? `0 0 14px rgba(255,107,0,0.4)` : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {done ? '✓' : s.icon}
                  </div>
                  <span style={{ fontSize: 9.5, color: active ? C.gold : done ? '#4ade80' : C.sub, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Bar */}
          <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${C.accent}, #D4A017)`, borderRadius: 4, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(26,15,7,0.9)', border: `1px solid ${C.border}`, borderRadius: 22, padding: '28px 24px', boxShadow: '0 24px 60px rgba(0,0,0,0.45)' }}>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, color: '#f87171', fontSize: 13, fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          {/* STEP 1 — Personal Info */}
          {step === 1 && (
            <div>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: C.gold, marginBottom: 20, fontSize: 16 }}>👤 Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="Full Name *">
                    <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Pandit Ram Sharma" />
                  </Field>
                </div>
                <Field label="Phone Number *">
                  <input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
                </Field>
                <Field label="Email (optional)">
                  <input style={inputStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
                </Field>
                <Field label="City *">
                  <input style={inputStyle} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Delhi, Mumbai, Kashi..." />
                </Field>
                <Field label="Pincode">
                  <input style={inputStyle} value={form.pincode} onChange={e => set('pincode', e.target.value)} placeholder="110001" maxLength={6} />
                </Field>
              </div>
            </div>
          )}

          {/* STEP 2 — Professional Info */}
          {step === 2 && (
            <div>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: C.gold, marginBottom: 20, fontSize: 16 }}>🕉️ Professional Details</h3>
              <Field label="Years of Experience *">
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.experience} onChange={e => set('experience', e.target.value)}>
                  <option value="">Select experience...</option>
                  {EXP_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>

              <Field label="Specializations * (select all that apply)">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {SPECIALIZATION_OPTIONS.map(s => (
                    <button key={s} type="button" onClick={() => toggle('specializations', s)} style={chipStyle(form.specializations.includes(s))}>
                      {s}
                    </button>
                  ))}
                </div>
                <div style={{ color: C.sub, fontSize: 11, marginTop: 6 }}>
                  {form.specializations.length} selected
                </div>
              </Field>

              <Field label="Languages * (select all)">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {LANGUAGE_OPTIONS.map(l => (
                    <button key={l} type="button" onClick={() => toggle('languages', l)} style={chipStyle(form.languages.includes(l))}>
                      {l}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Short Bio (max 300 chars)">
                <textarea
                  style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                  value={form.bio}
                  onChange={e => set('bio', e.target.value.slice(0, 300))}
                  placeholder="Your lineage, guru, areas of expertise..."
                />
                <div style={{ color: C.sub, fontSize: 11, marginTop: 4 }}>{form.bio.length}/300</div>
              </Field>
            </div>
          )}

          {/* STEP 3 — Verification */}
          {step === 3 && (
            <div>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: C.gold, marginBottom: 8, fontSize: 16 }}>🔐 Identity Verification</h3>
              <p style={{ color: C.sub, fontSize: 12.5, marginBottom: 20, lineHeight: 1.6 }}>
                Your documents are encrypted and stored securely. Used only for identity verification.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="Aadhaar Number * (12 digits)">
                    <input
                      style={inputStyle}
                      maxLength={12}
                      value={form.aadhar}
                      onChange={e => set('aadhar', e.target.value.replace(/\D/g, ''))}
                      placeholder="XXXX XXXX XXXX"
                    />
                  </Field>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="PAN Number (optional)">
                    <input
                      style={inputStyle}
                      maxLength={10}
                      value={form.pan}
                      onChange={e => set('pan', e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                    />
                  </Field>
                </div>
              </div>
              <div style={{ background: 'rgba(255,107,0,0.07)', border: '1px dashed rgba(255,107,0,0.25)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: 'rgba(255,168,80,0.75)' }}>
                📋 Documents verified within <strong style={{ color: '#FF9F40' }}>48 hours</strong>. SMS and WhatsApp confirmation sent after approval.
              </div>
            </div>
          )}

          {/* STEP 4 — Bank Details */}
          {step === 4 && (
            <div>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: C.gold, marginBottom: 8, fontSize: 16 }}>🏦 Bank Details (for payouts)</h3>
              <p style={{ color: C.sub, fontSize: 12.5, marginBottom: 20, lineHeight: 1.6 }}>
                Earnings are transferred within <strong style={{ color: C.accent }}>48 hours</strong> of ritual completion.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="Account Holder Name">
                    <input style={inputStyle} value={form.bankHolder} onChange={e => set('bankHolder', e.target.value)} placeholder="As on bank passbook" />
                  </Field>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="Bank Account Number *">
                    <input style={inputStyle} value={form.bankAccount} onChange={e => set('bankAccount', e.target.value)} placeholder="Account number for payouts" />
                  </Field>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="IFSC Code *">
                    <input style={inputStyle} value={form.ifsc} onChange={e => set('ifsc', e.target.value.toUpperCase())} placeholder="e.g. SBIN0001234" />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: step > 1 ? 'space-between' : 'flex-end', marginTop: 28, gap: 12 }}>
            {step > 1 && (
              <button onClick={handleBack}
                style={{ background: 'rgba(255,255,255,0.06)', color: C.sub, border: `1px solid ${C.border}`, borderRadius: 20, padding: '11px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                ← Back
              </button>
            )}
            {step < 4 ? (
              <button onClick={handleNext}
                style={{ background: `linear-gradient(135deg, ${C.accent}, #D4A017)`, color: '#fff', border: 'none', borderRadius: 20, padding: '11px 32px', fontWeight: 800, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', boxShadow: '0 6px 18px rgba(255,107,0,0.3)' }}>
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting}
                style={{ flex: 1, background: `linear-gradient(135deg, ${C.accent}, #D4A017)`, color: '#fff', border: 'none', borderRadius: 20, padding: '13px', fontWeight: 900, cursor: 'pointer', fontSize: 15, fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(255,107,0,0.35)' }}>
                {submitting ? '⏳ Submitting...' : '🙏 Submit Application'}
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', color: C.sub, fontSize: 12, marginTop: 20 }}>
          Already registered?{' '}
          <a href="/pandit/dashboard" style={{ color: C.gold, fontWeight: 700 }}>Go to Dashboard →</a>
        </p>
      </div>
    </div>
  );
}
