// SETUP REQUIRED: In Supabase Dashboard → Storage:
// 1. Create bucket: 'pandit-videos'
// 2. Set bucket to PUBLIC (so videos can be streamed)
// 3. Add Storage policy:
//    - INSERT: allow all (authenticated or anon)
//    - SELECT: allow all
//
// DB MIGRATION (run once in Supabase SQL editor):
// ALTER TABLE pandits ADD COLUMN IF NOT EXISTS intro_video_url TEXT;

import React, { useState, useRef } from 'react';
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
  bg:        '#1a0a00',
  card:      '#2a1200',
  gold:      '#F0C040',
  accent:    '#FF6B00',
  text:      'rgba(255,248,240,0.88)',
  sub:       'rgba(255,248,240,0.45)',
  border:    'rgba(212,160,23,0.22)',
  errBorder: 'rgba(239,68,68,0.7)',
};

// ── Validators ────────────────────────────────────────────
const VALIDATORS = {
  name:            v => !v.trim()                                        ? 'Full name is required.'               : null,
  phone:           v => !/^\d{10}$/.test(v.replace(/\D/g,''))           ? 'Enter a valid 10-digit phone number.' : null,
  email:           v => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)     ? 'Enter a valid email address.'         : null,
  city:            v => !v.trim()                                        ? 'City is required.'                    : null,
  pincode:         v => v && !/^\d{6}$/.test(v)                         ? 'Pincode must be 6 digits.'            : null,
  experience:      v => !v                                               ? 'Select your experience level.'        : null,
  specializations: v => v.length === 0                                   ? 'Select at least one specialization.'  : null,
  languages:       v => v.length === 0                                   ? 'Select at least one language.'        : null,
  aadhar:          v => v && v.replace(/\D/g,'').length !== 12          ? 'Aadhaar must be 12 digits.'           : null,
  pan:             v => v && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v)       ? 'Enter a valid PAN (e.g. ABCDE1234F).' : null,
  bankAccount:     v => !v.trim()                                        ? 'Bank account number is required.'     : null,
  ifsc:            v => !v.trim()                                        ? 'IFSC code is required.'               : null,
  accountHolder:   () => null, // optional
};

const STEP_FIELDS = {
  1: ['name', 'phone', 'email', 'city', 'pincode'],
  2: ['experience', 'specializations', 'languages'],
  3: ['aadhar', 'pan'],
  4: ['bankAccount', 'ifsc'],
};

// ── Inline components ─────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ color: '#f87171', fontSize: 11.5, fontWeight: 600, marginTop: 4, fontFamily: 'Nunito, sans-serif' }}>
      ⚠ {msg}
    </div>
  );
}

const getInputStyle = (hasError) => ({
  padding: '11px 14px',
  border: `1.5px solid ${hasError ? C.errBorder : C.border}`,
  borderRadius: 10,
  fontFamily: 'Nunito, sans-serif',
  fontSize: 13.5,
  color: C.text,
  background: hasError ? 'rgba(239,68,68,0.04)' : 'rgba(255,248,240,0.05)',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.18s',
});

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

// ── Auto-formatters ────────────────────────────────────────
const fmtPhone   = v => v.replace(/\D/g, '').slice(0, 10);
const fmtAadhar  = v => {
  const d = v.replace(/\D/g, '').slice(0, 12);
  return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};
const fmtPAN     = v => v.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 10);
const fmtIFSC    = v => v.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 11);
const fmtPincode = v => v.replace(/\D/g, '').slice(0, 6);

export default function PanditOnboardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    name: '', phone: '', email: '', city: '', pincode: '',
    experience: '', specializations: [], languages: [], bio: '',
    aadhar: '', pan: '',
    bankHolder: '', bankAccount: '', ifsc: '',
    introVideoUrl: '',
  });

  // ── Video upload state ────────────────────────────────────
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoError, setVideoError] = useState('');
  const [videoUploaded, setVideoUploaded] = useState(false);
  const videoInputRef = useRef(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggle = (field, val) => setForm(p => {
    const arr = p[field];
    return { ...p, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
  });

  // ── Per-field validation on blur ──────────────────────────
  const validateField = (key) => {
    const validatorKey = key === 'bankHolder' ? 'accountHolder' : key;
    const validator = VALIDATORS[validatorKey];
    if (!validator) return;
    const val = form[key];
    const msg = validator(val);
    setFieldErrors(prev => ({ ...prev, [key]: msg || null }));
  };

  // ── Per-step validation before Next ──────────────────────
  const validateStep = (s) => {
    const keys = STEP_FIELDS[s] || [];
    const errors = {};
    let hasError = false;
    keys.forEach(key => {
      const validatorKey = key === 'bankHolder' ? 'accountHolder' : key;
      const validator = VALIDATORS[validatorKey];
      if (!validator) return;
      const val = form[key];
      const msg = validator(val);
      if (msg) { errors[key] = msg; hasError = true; }
    });
    setFieldErrors(prev => ({ ...prev, ...errors }));
    return !hasError;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setError('');
    setStep(s => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    setError('');
    setStep(s => Math.max(s - 1, 1));
  };

  // ── Video handlers ────────────────────────────────────────
  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['video/mp4', 'video/quicktime', 'video/webm'];
    if (!allowed.includes(file.type)) {
      setVideoError('Only MP4, MOV or WebM videos are allowed.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setVideoError('Video must be smaller than 50MB.');
      return;
    }

    setVideoError('');
    setVideoFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
    setVideoUploaded(false);
  };

  const handleVideoUpload = async () => {
    if (!videoFile) return;
    setVideoUploading(true);
    setVideoUploadProgress(0);
    setVideoError('');

    try {
      const ext = videoFile.name.split('.').pop();
      const fileName = 'intro_' + Date.now() + '_' + Math.random().toString(36).substring(2) + '.' + ext;
      const filePath = 'pandits/' + fileName;

      const { data, error: uploadError } = await supabase.storage
        .from('pandit-videos')
        .upload(filePath, videoFile, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const pct = Math.round((progress.loaded / progress.total) * 100);
            setVideoUploadProgress(pct);
          },
        });

      if (uploadError) {
        console.error('[video-upload]', uploadError);
        setVideoError('Upload failed: ' + (uploadError.message || 'Please try again.'));
        setVideoUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('pandit-videos')
        .getPublicUrl(filePath);

      setForm(prev => ({ ...prev, introVideoUrl: publicUrl }));
      setVideoUploaded(true);
      setVideoUploadProgress(100);
    } catch (err) {
      console.error('[video-upload]', err);
      setVideoError('Something went wrong during upload. Please try again.');
    } finally {
      setVideoUploading(false);
    }
  };

  const handleVideoRemove = () => {
    setVideoFile(null);
    setVideoPreviewUrl('');
    setVideoUploaded(false);
    setVideoUploadProgress(0);
    setVideoError('');
    setForm(prev => ({ ...prev, introVideoUrl: '' }));
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  // ── Submit with Supabase v2 async/await ──────────────────
  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setSubmitting(true);
    setError('');

    const { error: insertError } = await supabase.from('pandits').insert({
      name:             form.name,
      phone:            form.phone.replace(/\D/g, ''),
      email:            form.email || null,
      city:             form.city,
      pincode:          form.pincode || null,
      experience_years: parseInt(form.experience) || 0,
      specializations:  form.specializations,
      languages:        form.languages,
      bio:              form.bio || null,
      aadhar_number:    form.aadhar ? form.aadhar.replace(/\s/g, '') : null,
      pan_number:       form.pan || null,
      bank_account:     form.bankAccount,
      ifsc_code:        form.ifsc,
      bank_holder:      form.bankHolder || form.name,
      intro_video_url:  form.introVideoUrl || null,
      status:           'pending',
      is_verified:      false,
      rating:           0,
      bookings_count:   0,
      created_at:       new Date().toISOString(),
    });

    if (insertError) {
      console.error('[pandit-onboard]', insertError);
      if (insertError.code === '23505') {
        setError('This phone number is already registered. Go to your dashboard or use a different number.');
      } else {
        setError(insertError.message || 'Submission failed. Please try again.');
      }
      setSubmitting(false);
      return;
    }

    // Fire-and-forget admin notification — non-critical
    supabase.from('notifications').insert({
      type:    'new_pandit_application',
      title:   'New Pandit Application',
      message: `${form.name} from ${form.city} has applied to join BhaktiGo.`,
      data:    { name: form.name, phone: form.phone, city: form.city },
    }).then(({ error: notifError }) => {
      if (notifError) console.warn('[pandit-onboard] notification insert failed (non-critical):', notifError.message);
    });

    setSubmitting(false);
    setSubmitted(true);
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
                    <input
                      style={getInputStyle(!!fieldErrors.name)}
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      onBlur={() => validateField('name')}
                      placeholder="Pandit Ram Sharma"
                    />
                    <FieldError msg={fieldErrors.name} />
                  </Field>
                </div>
                <Field label="Phone Number *">
                  <input
                    style={getInputStyle(!!fieldErrors.phone)}
                    value={form.phone}
                    onChange={e => set('phone', fmtPhone(e.target.value))}
                    onBlur={() => validateField('phone')}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    inputMode="numeric"
                  />
                  <FieldError msg={fieldErrors.phone} />
                </Field>
                <Field label="Email (optional)">
                  <input
                    style={getInputStyle(!!fieldErrors.email)}
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    onBlur={() => validateField('email')}
                    placeholder="you@example.com"
                  />
                  <FieldError msg={fieldErrors.email} />
                </Field>
                <Field label="City *">
                  <input
                    style={getInputStyle(!!fieldErrors.city)}
                    value={form.city}
                    onChange={e => set('city', e.target.value)}
                    onBlur={() => validateField('city')}
                    placeholder="Delhi, Mumbai, Kashi..."
                  />
                  <FieldError msg={fieldErrors.city} />
                </Field>
                <Field label="Pincode">
                  <input
                    style={getInputStyle(!!fieldErrors.pincode)}
                    value={form.pincode}
                    onChange={e => set('pincode', fmtPincode(e.target.value))}
                    onBlur={() => validateField('pincode')}
                    placeholder="110001"
                    maxLength={6}
                    inputMode="numeric"
                  />
                  <FieldError msg={fieldErrors.pincode} />
                </Field>
              </div>
            </div>
          )}

          {/* STEP 2 — Professional Info */}
          {step === 2 && (
            <div>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: C.gold, marginBottom: 20, fontSize: 16 }}>🕉️ Professional Details</h3>
              <Field label="Years of Experience *">
                <select
                  style={{ ...getInputStyle(!!fieldErrors.experience), cursor: 'pointer' }}
                  value={form.experience}
                  onChange={e => set('experience', e.target.value)}
                  onBlur={() => validateField('experience')}
                >
                  <option value="">Select experience...</option>
                  {EXP_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <FieldError msg={fieldErrors.experience} />
              </Field>

              <Field label="Specializations * (select all that apply)">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {SPECIALIZATION_OPTIONS.map(s => (
                    <button key={s} type="button"
                      onClick={() => { toggle('specializations', s); setFieldErrors(p => ({ ...p, specializations: null })); }}
                      style={chipStyle(form.specializations.includes(s))}>
                      {s}
                    </button>
                  ))}
                </div>
                <div style={{ color: C.sub, fontSize: 11, marginTop: 6 }}>
                  {form.specializations.length} selected
                </div>
                <FieldError msg={fieldErrors.specializations} />
              </Field>

              <Field label="Languages * (select all)">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {LANGUAGE_OPTIONS.map(l => (
                    <button key={l} type="button"
                      onClick={() => { toggle('languages', l); setFieldErrors(p => ({ ...p, languages: null })); }}
                      style={chipStyle(form.languages.includes(l))}>
                      {l}
                    </button>
                  ))}
                </div>
                <FieldError msg={fieldErrors.languages} />
              </Field>

              <Field label="Short Bio (max 300 chars)">
                <textarea
                  style={{ ...getInputStyle(false), minHeight: 80, resize: 'vertical' }}
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
                      style={getInputStyle(!!fieldErrors.aadhar)}
                      maxLength={14}
                      value={form.aadhar}
                      onChange={e => set('aadhar', fmtAadhar(e.target.value))}
                      onBlur={() => validateField('aadhar')}
                      placeholder="XXXX XXXX XXXX"
                      inputMode="numeric"
                    />
                    <FieldError msg={fieldErrors.aadhar} />
                  </Field>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="PAN Number (optional)">
                    <input
                      style={getInputStyle(!!fieldErrors.pan)}
                      maxLength={10}
                      value={form.pan}
                      onChange={e => set('pan', fmtPAN(e.target.value))}
                      onBlur={() => validateField('pan')}
                      placeholder="ABCDE1234F"
                    />
                    <FieldError msg={fieldErrors.pan} />
                  </Field>
                </div>
              </div>

              {/* ── INTRO VIDEO UPLOAD ── */}
              <div style={{ marginTop: 28 }}>
                <label style={{
                  color: 'rgba(255,248,240,0.55)',
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: 1, display: 'block', marginBottom: 8,
                }}>
                  🎬 INTRO VIDEO <span style={{ color: C.gold }}>(Recommended)</span>
                </label>

                {/* Why it matters */}
                <div style={{
                  background: 'rgba(212,160,23,0.08)',
                  border: '1px solid rgba(212,160,23,0.2)',
                  borderRadius: 10, padding: '10px 14px',
                  marginBottom: 14, fontSize: 13,
                  color: 'rgba(255,248,240,0.65)',
                  lineHeight: 1.6,
                }}>
                  📈 <strong style={{ color: C.gold }}>3x more bookings</strong> — Pandits with
                  an intro video receive significantly more booking requests.
                  Record a 30–60 second video introducing yourself, your
                  specializations, and your experience.
                </div>

                {/* Drop zone — shown when no file selected */}
                {!videoFile && (
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    style={{
                      border: '2px dashed rgba(212,160,23,0.3)',
                      borderRadius: 14,
                      padding: '32px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,107,0,0.5)';
                      e.currentTarget.style.background = 'rgba(255,107,0,0.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(212,160,23,0.3)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }}
                  >
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🎬</div>
                    <p style={{ color: C.gold, fontWeight: 700, margin: '0 0 4px', fontSize: 15 }}>
                      Click to select your intro video
                    </p>
                    <p style={{ color: 'rgba(255,248,240,0.4)', fontSize: 12, margin: 0 }}>
                      MP4, MOV or WebM · Max 50MB · 30–90 seconds recommended
                    </p>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={handleVideoSelect}
                  style={{ display: 'none' }}
                />

                {/* Video selected — preview + upload */}
                {videoFile && (
                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(212,160,23,0.2)',
                    borderRadius: 14, overflow: 'hidden',
                  }}>
                    {/* Preview */}
                    <video
                      src={videoPreviewUrl}
                      controls
                      style={{ width: '100%', maxHeight: 240, background: '#000', display: 'block' }}
                    />

                    {/* File info + actions */}
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
                        marginBottom: 12,
                      }}>
                        <div>
                          <p style={{ color: C.gold, fontWeight: 700, margin: 0, fontSize: 14 }}>
                            📄 {videoFile.name}
                          </p>
                          <p style={{ color: 'rgba(255,248,240,0.4)', margin: '2px 0 0', fontSize: 12 }}>
                            {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                        {!videoUploading && (
                          <button
                            onClick={handleVideoRemove}
                            style={{
                              background: 'rgba(239,68,68,0.1)',
                              border: '1px solid rgba(239,68,68,0.3)',
                              color: '#f87171', borderRadius: 8,
                              padding: '6px 14px', cursor: 'pointer',
                              fontSize: 12, fontWeight: 700,
                              fontFamily: 'inherit',
                            }}
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>

                      {/* Upload progress bar */}
                      {videoUploading && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            marginBottom: 6, fontSize: 12,
                            color: 'rgba(255,248,240,0.55)',
                          }}>
                            <span>Uploading...</span>
                            <span>{videoUploadProgress}%</span>
                          </div>
                          <div style={{
                            height: 6, background: 'rgba(255,255,255,0.1)',
                            borderRadius: 99, overflow: 'hidden',
                          }}>
                            <div style={{
                              height: '100%',
                              width: videoUploadProgress + '%',
                              background: 'linear-gradient(90deg, #FF6B00, #F0C040)',
                              borderRadius: 99,
                              transition: 'width 0.3s ease',
                            }} />
                          </div>
                        </div>
                      )}

                      {/* Upload success */}
                      {videoUploaded && (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          color: '#22c55e', fontSize: 13, fontWeight: 700,
                          marginBottom: 10,
                        }}>
                          ✅ Video uploaded successfully!
                        </div>
                      )}

                      {/* Upload button */}
                      {!videoUploaded && !videoUploading && (
                        <button
                          onClick={handleVideoUpload}
                          style={{
                            width: '100%',
                            background: `linear-gradient(135deg, ${C.accent}, #D4A017)`,
                            color: '#fff', border: 'none',
                            borderRadius: 10, padding: '12px',
                            fontWeight: 800, fontSize: 14,
                            cursor: 'pointer', fontFamily: 'inherit',
                          }}
                        >
                          ⬆️ Upload Video
                        </button>
                      )}

                      {/* Change video link */}
                      {videoUploaded && (
                        <button
                          onClick={handleVideoRemove}
                          style={{
                            background: 'none', border: 'none',
                            color: 'rgba(255,248,240,0.4)', fontSize: 12,
                            cursor: 'pointer', fontFamily: 'inherit',
                            textDecoration: 'underline', padding: 0, marginTop: 4,
                          }}
                        >
                          Change video
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Video error */}
                {videoError && (
                  <div style={{
                    color: '#f87171', fontSize: 12,
                    marginTop: 8, display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    ⚠️ {videoError}
                  </div>
                )}

                {/* Skip hint */}
                <p style={{
                  color: 'rgba(255,248,240,0.3)',
                  fontSize: 11, margin: '8px 0 0', textAlign: 'center',
                }}>
                  You can also add your video later from your pandit dashboard
                </p>
              </div>
              {/* ── END VIDEO UPLOAD ── */}

              <div style={{ background: 'rgba(255,107,0,0.07)', border: '1px dashed rgba(255,107,0,0.25)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: 'rgba(255,168,80,0.75)', marginTop: 24 }}>
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
                    <input
                      style={getInputStyle(false)}
                      value={form.bankHolder}
                      onChange={e => set('bankHolder', e.target.value)}
                      placeholder="As on bank passbook"
                    />
                  </Field>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="Bank Account Number *">
                    <input
                      style={getInputStyle(!!fieldErrors.bankAccount)}
                      value={form.bankAccount}
                      onChange={e => set('bankAccount', e.target.value.replace(/\D/g, ''))}
                      onBlur={() => validateField('bankAccount')}
                      placeholder="Account number for payouts"
                      inputMode="numeric"
                    />
                    <FieldError msg={fieldErrors.bankAccount} />
                  </Field>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="IFSC Code *">
                    <input
                      style={getInputStyle(!!fieldErrors.ifsc)}
                      value={form.ifsc}
                      onChange={e => set('ifsc', fmtIFSC(e.target.value))}
                      onBlur={() => validateField('ifsc')}
                      placeholder="e.g. SBIN0001234"
                      maxLength={11}
                    />
                    <FieldError msg={fieldErrors.ifsc} />
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
                style={{ flex: 1, background: submitting ? 'rgba(255,107,0,0.4)' : `linear-gradient(135deg, ${C.accent}, #D4A017)`, color: '#fff', border: 'none', borderRadius: 20, padding: '13px', fontWeight: 900, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 15, fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(255,107,0,0.35)' }}>
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
