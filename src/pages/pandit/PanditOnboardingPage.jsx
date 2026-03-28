import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppCtx';
import { supabase } from '../../services/supabase';

const SPECIALIZATIONS = [
  'Griha Pravesh','Satyanarayan Katha','Vivah','Navgrah Puja','Rudrabhishek',
  'Sundarkand','Namkaran','Mundan','Annaprashan','Pitru Paksha','Kaal Sarp Dosh',
  'Vastu Shanti','Lakshmi Puja','Ganesh Puja','Durga Puja','Havan','Custom Pooja',
];
const LANGUAGES = ['Hindi','Sanskrit','English','Bengali','Marathi','Tamil','Telugu','Gujarati','Kannada','Punjabi'];
const CITIES = ['Delhi','Gurgaon','Noida','Faridabad','Ghaziabad','Mumbai','Bengaluru','Kashi','Ayodhya','Haridwar','Ujjain','Pune','Jaipur','Ahmedabad','Kolkata'];
const STEPS = [
  { label:'Basic Info',       icon:'👤' },
  { label:'Specializations', icon:'🕉️' },
  { label:'Identity & KYC',  icon:'🔐' },
  { label:'Video & Finish',  icon:'🎬' },
];

function UploadField({ label, hint, accept, icon, file, onChange, required }) {
  const ref = useRef();
  return (
    <div className="fg">
      <div style={{ fontSize:11.5, fontWeight:700, color:'rgba(240,192,64,0.75)', textTransform:'uppercase', letterSpacing:'.8px', marginBottom:6 }}>
        {label}{required && <span style={{ color:'#FF6B00' }}> *</span>}
      </div>
      <input ref={ref} type="file" accept={accept} style={{ display:'none' }}
        onChange={e => onChange(e.target.files?.[0]||null)} />
      <div className={`ds-upload-btn ${file ? 'ds-uploaded' : ''}`} onClick={() => ref.current?.click()}>
        <span className="ds-upload-icon">{file ? '✅' : icon}</span>
        <div className="ds-upload-label">
          <div>{file ? file.name : `Upload ${label}`}</div>
          {hint && !file && <div className="ds-upload-name">{hint}</div>}
          {file && <div className="ds-upload-name">{(file.size/1024/1024).toFixed(2)} MB — Click to replace</div>}
        </div>
        <span style={{ fontSize:11, fontWeight:700, color: file ? '#4ade80' : 'rgba(240,192,64,0.5)', flexShrink:0 }}>
          {file ? 'Uploaded' : 'Browse'}
        </span>
      </div>
    </div>
  );
}

function VideoUploadField({ file, onChange }) {
  const ref = useRef();
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const vid = document.createElement('video');
    vid.src = url;
    vid.onloadedmetadata = () => {
      if (vid.duration > 70) {
        setError('Video must be 60 seconds or less. Please trim and re-upload.');
        onChange(null); setPreview(null);
      } else {
        setError(''); setPreview(url); onChange(f);
      }
    };
  };

  return (
    <div className="fg ffw">
      <div style={{ fontSize:11.5, fontWeight:700, color:'rgba(240,192,64,0.75)', textTransform:'uppercase', letterSpacing:'.8px', marginBottom:6 }}>
        🎬 60-Second Intro Video <span style={{ color:'#FF6B00' }}>*</span>
      </div>
      <p style={{ color:'rgba(255,248,240,0.4)', fontSize:12, margin:'0 0 10px', fontFamily:'Nunito,sans-serif' }}>
        Record a 60-second intro — your expertise, lineage, and specializations. Shown to devotees on your profile card.
      </p>
      <input ref={ref} type="file" accept="video/*" style={{ display:'none' }} onChange={handleChange} />
      {!file ? (
        <div className="ds-upload-btn" onClick={() => ref.current?.click()}
          style={{ padding:'28px 20px', flexDirection:'column', textAlign:'center', gap:12, borderRadius:16, minHeight:160 }}>
          <div style={{ fontSize:40 }}>🎥</div>
          <div style={{ fontWeight:700, color:'rgba(255,248,240,0.65)', fontSize:14 }}>Click to upload your 60-second intro video</div>
          <div style={{ color:'rgba(255,248,240,0.3)', fontSize:12 }}>MP4, MOV, WebM · Max 100MB · Max 60 seconds</div>
          <div style={{ background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff', border:'none',
            borderRadius:20, padding:'9px 24px', fontWeight:800, fontSize:13, display:'inline-block', marginTop:4 }}>
            Choose Video
          </div>
        </div>
      ) : (
        <div style={{ border:'1.5px solid rgba(34,197,94,0.4)', borderRadius:16,
          background:'rgba(34,197,94,0.06)', padding:14 }}>
          <video src={preview} controls style={{ width:'100%', borderRadius:10, maxHeight:200 }} />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
            <div style={{ color:'#4ade80', fontWeight:700, fontSize:13 }}>
              ✅ {file.name} ({(file.size/1024/1024).toFixed(2)} MB)
            </div>
            <button onClick={() => { onChange(null); setPreview(null); ref.current.value=''; }}
              style={{ background:'rgba(255,107,0,0.1)', color:'#FF9F40', border:'1px solid rgba(255,107,0,0.3)',
                borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:11, fontWeight:700 }}>
              Replace
            </button>
          </div>
        </div>
      )}
      {error && <div style={{ color:'#f87171', fontSize:12, marginTop:6, fontWeight:600 }}>⚠️ {error}</div>}
    </div>
  );
}

export default function PanditOnboardingPage() {
  const navigate = useNavigate();
  const { toast, userPhone } = useApp();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name:'', phone:userPhone||'', city:'', years_of_experience:'', languages:[],
    specializations:[], min_fee:'', max_fee:'', about:'',
    aadhar_number:'', pan_number:'', bank_account:'', ifsc_code:'', show_whatsapp:false,
  });
  const [files, setFiles] = useState({ aadhar_front:null, aadhar_back:null, pan_card:null, bank_passbook:null, certificate:null, photo:null, intro_video:null });

  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const setFile = (k,v) => setFiles(p=>({...p,[k]:v}));
  const toggle = (field, val) => setForm(p => {
    const arr = p[field];
    return { ...p, [field]: arr.includes(val) ? arr.filter(x=>x!==val) : [...arr,val] };
  });

  const validateStep = () => {
    if (step===1) {
      if (!form.name||!form.phone||!form.city||!form.years_of_experience) { toast('Please fill all required fields.','⚠️'); return false; }
      if (!form.languages.length) { toast('Select at least one language.','⚠️'); return false; }
    }
    if (step===2) {
      if (!form.specializations.length) { toast('Select at least one specialization.','⚠️'); return false; }
      if (!form.min_fee) { toast('Set your minimum dakshina.','⚠️'); return false; }
    }
    if (step===3) {
      if (!form.bank_account||!form.ifsc_code) { toast('Bank account and IFSC are required.','⚠️'); return false; }
    }
    return true;
  };

  const handleNext = () => { if (validateStep()) setStep(s=>Math.min(s+1,4)); };
  const prevStep   = () => setStep(s=>Math.max(s-1,1));

  const handleSubmit = async () => {
    if (!files.intro_video) { toast('Please upload your 60-second intro video.','⚠️'); return; }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('pandits').insert({
        name:form.name, phone:form.phone, city:form.city,
        years_of_experience:parseInt(form.years_of_experience)||0,
        languages:form.languages,
        specialization:form.specializations[0]||'',
        specializations:form.specializations,
        rituals:form.specializations,
        min_fee:parseFloat(form.min_fee)||0,
        max_fee:parseFloat(form.max_fee)||0,
        about:form.about,
        aadhar_number:form.aadhar_number, pan_number:form.pan_number,
        bank_account:form.bank_account, ifsc_code:form.ifsc_code,
        show_whatsapp:form.show_whatsapp,
        status:'pending_verification',
        rating:5.0, emoji:'🕉️', verified:false,
        has_documents:!!(files.aadhar_front&&files.pan_card),
        has_intro_video:!!files.intro_video,
        created_at:new Date().toISOString(),
      });
      if (error) throw error;
      toast('Application submitted! Our team will verify you within 48 hours. 🙏','✅');
      navigate('/pandit/dashboard');
    } catch(err) {
      toast(err.message||'Submission failed. Please try again.','⚠️');
    } finally { setSubmitting(false); }
  };

  const inputStyle = { padding:'11px 14px', border:'1.5px solid rgba(240,192,64,0.2)', borderRadius:11,
    fontFamily:'Nunito,sans-serif', fontSize:13.5, color:'rgba(255,248,240,0.9)',
    background:'rgba(255,248,240,0.05)', outline:'none', width:'100%', boxSizing:'border-box' };
  const labelStyle = { fontSize:11.5, fontWeight:700, color:'rgba(240,192,64,0.75)',
    textTransform:'uppercase', letterSpacing:'.8px', marginBottom:6, display:'block' };
  const chip = (active) => ({ padding:'7px 14px', borderRadius:20, border:`1px solid ${active?'rgba(240,192,64,0.5)':'rgba(240,192,64,0.2)'}`,
    background:active?'rgba(240,192,64,0.15)':'transparent', color:active?'#F0C040':'rgba(255,248,240,0.45)',
    fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Nunito,sans-serif', transition:'all 0.2s' });

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#1a0f07,#0f0804)',
      display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 16px' }}>
      <div style={{ width:'100%', maxWidth:660 }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:52, marginBottom:10 }}>🪔</div>
          <h1 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontSize:'1.75rem', marginBottom:8, fontWeight:900 }}>Join as a Vedic Scholar</h1>
          <p style={{ color:'rgba(255,248,240,0.45)', fontFamily:'Nunito,sans-serif', fontSize:14, margin:0 }}>
            4-step profile setup — takes about 5 minutes
          </p>
        </div>

        {/* Stepper */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', marginBottom:32 }}>
          {STEPS.map((s,i) => {
            const n=i+1, done=step>n, active=step===n;
            return (
              <React.Fragment key={n}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, minWidth:70 }}>
                  <div style={{ width:34, height:34, borderRadius:'50%', display:'flex', alignItems:'center',
                    justifyContent:'center', fontWeight:800, fontSize:13,
                    background:done?'rgba(34,197,94,0.85)':active?'linear-gradient(135deg,#FF6B00,#D4A017)':'rgba(255,248,240,0.07)',
                    color:(done||active)?'#fff':'rgba(255,248,240,0.3)',
                    border:active?'none':'1px solid rgba(240,192,64,0.15)',
                    boxShadow:active?'0 0 14px rgba(255,107,0,0.35)':'none', transition:'all 0.3s' }}>
                    {done?'✓':s.icon}
                  </div>
                  <span style={{ fontSize:9.5, color:active?'#F0C040':done?'#4ade80':'rgba(255,248,240,0.3)',
                    fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', textAlign:'center', whiteSpace:'nowrap' }}>
                    {s.label}
                  </span>
                </div>
                {i<STEPS.length-1 && (
                  <div style={{ flex:1, height:1, background:step>n?'rgba(34,197,94,0.4)':'rgba(240,192,64,0.1)', margin:'0 4px 20px' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Main card */}
        <div style={{ background:'rgba(26,15,7,0.88)', border:'1px solid rgba(240,192,64,0.14)',
          borderRadius:22, padding:'30px 26px', backdropFilter:'blur(20px)',
          boxShadow:'0 24px 60px rgba(0,0,0,0.45)' }}>

          {/* STEP 1 */}
          {step===1 && (
            <div>
              <h3 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', marginBottom:22, fontSize:17 }}>👤 Basic Information</h3>
              <div className="fgrid" style={{ gap:18 }}>
                <div className="fg"><label style={labelStyle}>Full Name *</label>
                  <input style={inputStyle} value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Pandit Ram Sharma" /></div>
                <div className="fg"><label style={labelStyle}>Phone Number *</label>
                  <input style={inputStyle} value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+91XXXXXXXXXX" /></div>
                <div className="fg"><label style={labelStyle}>Primary City *</label>
                  <select style={{ ...inputStyle, cursor:'pointer' }} value={form.city} onChange={e=>set('city',e.target.value)}>
                    <option value="">Select City</option>
                    {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </select></div>
                <div className="fg"><label style={labelStyle}>Years of Experience *</label>
                  <input type="number" style={inputStyle} min="0" max="70" value={form.years_of_experience} onChange={e=>set('years_of_experience',e.target.value)} placeholder="e.g. 15" /></div>
                <div className="fg ffw">
                  <label style={labelStyle}>Languages You Chant In *</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:6 }}>
                    {LANGUAGES.map(l=>(
                      <button type="button" key={l} onClick={()=>toggle('languages',l)} style={chip(form.languages.includes(l))}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end', marginTop:28 }}>
                <button className="btn btn-primary" onClick={handleNext}>Specializations →</button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step===2 && (
            <div>
              <h3 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', marginBottom:22, fontSize:17 }}>🕉️ Sacred Specializations</h3>
              <div className="fgrid" style={{ gap:18 }}>
                <div className="fg ffw">
                  <label style={labelStyle}>Rituals You Perform * (select all)</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:6 }}>
                    {SPECIALIZATIONS.map(s=>(
                      <button type="button" key={s} onClick={()=>toggle('specializations',s)} style={chip(form.specializations.includes(s))}>{s}</button>
                    ))}
                  </div>
                  <div style={{ color:'rgba(255,248,240,0.3)', fontSize:11, marginTop:6 }}>
                    {form.specializations.length} ritual{form.specializations.length!==1?'s':''} selected
                  </div>
                </div>
                <div className="fg"><label style={labelStyle}>Min Dakshina (₹) *</label>
                  <input type="number" style={inputStyle} min="500" value={form.min_fee} onChange={e=>set('min_fee',e.target.value)} placeholder="e.g. 2100" /></div>
                <div className="fg"><label style={labelStyle}>Max Dakshina (₹)</label>
                  <input type="number" style={inputStyle} value={form.max_fee} onChange={e=>set('max_fee',e.target.value)} placeholder="e.g. 11000" /></div>
                <div className="fg ffw"><label style={labelStyle}>About You</label>
                  <textarea style={{ ...inputStyle, minHeight:86, resize:'vertical' }}
                    value={form.about} onChange={e=>set('about',e.target.value)}
                    placeholder="Your lineage, guru, areas of expertise…" /></div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:28 }}>
                <button className="btn btn-outline" onClick={prevStep}>← Back</button>
                <button className="btn btn-primary" onClick={handleNext}>Identity & KYC →</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step===3 && (
            <div>
              <h3 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', marginBottom:6, fontSize:17 }}>🔐 Identity & KYC Verification</h3>
              <p style={{ color:'rgba(255,248,240,0.38)', fontSize:12.5, marginBottom:22, fontFamily:'Nunito,sans-serif' }}>
                Encrypted and used only for identity verification & payouts. Stored securely on our servers.
              </p>
              <div className="fgrid" style={{ gap:16, marginBottom:22 }}>
                <div className="fg"><label style={labelStyle}>Aadhaar Number</label>
                  <input style={inputStyle} maxLength={12} value={form.aadhar_number}
                    onChange={e=>set('aadhar_number',e.target.value.replace(/\D/g,''))} placeholder="XXXX XXXX XXXX" /></div>
                <div className="fg"><label style={labelStyle}>PAN Number</label>
                  <input style={inputStyle} maxLength={10} value={form.pan_number}
                    onChange={e=>set('pan_number',e.target.value.toUpperCase())} placeholder="ABCDE1234F" /></div>
                <div className="fg"><label style={labelStyle}>Bank Account Number *</label>
                  <input style={inputStyle} required value={form.bank_account}
                    onChange={e=>set('bank_account',e.target.value)} placeholder="Account number for payouts" /></div>
                <div className="fg"><label style={labelStyle}>IFSC Code *</label>
                  <input style={inputStyle} required value={form.ifsc_code}
                    onChange={e=>set('ifsc_code',e.target.value.toUpperCase())} placeholder="e.g. SBIN0001234" /></div>
              </div>

              {/* Document uploads section */}
              <div style={{ background:'rgba(240,192,64,0.04)', border:'1px solid rgba(240,192,64,0.1)',
                borderRadius:16, padding:18, marginBottom:18 }}>
                <div style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontWeight:700, fontSize:14, marginBottom:16 }}>
                  📎 Document Attachments
                </div>
                <div className="fgrid" style={{ gap:12 }}>
                  <UploadField label="Aadhaar Card (Front)" hint="JPG, PNG or PDF · Max 5MB" icon="🪪" accept="image/*,.pdf" file={files.aadhar_front} onChange={f=>setFile('aadhar_front',f)} />
                  <UploadField label="Aadhaar Card (Back)" hint="JPG, PNG or PDF · Max 5MB" icon="🪪" accept="image/*,.pdf" file={files.aadhar_back} onChange={f=>setFile('aadhar_back',f)} />
                  <UploadField label="PAN Card" hint="JPG, PNG or PDF · Max 5MB" icon="🪪" accept="image/*,.pdf" file={files.pan_card} onChange={f=>setFile('pan_card',f)} />
                  <UploadField label="Bank Passbook / Cheque" hint="First page with name & account number" icon="🏦" accept="image/*,.pdf" file={files.bank_passbook} onChange={f=>setFile('bank_passbook',f)} />
                  <UploadField label="Sanskrit / Jyotish Certificate" hint="Optional — degree, shastra cert, or guru letter" icon="📜" accept="image/*,.pdf" file={files.certificate} onChange={f=>setFile('certificate',f)} />
                  <UploadField label="Profile Photo" hint="Clear face photo · JPG or PNG" icon="🖼️" accept="image/*" required file={files.photo} onChange={f=>setFile('photo',f)} />
                </div>
              </div>

              <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer',
                background:'rgba(37,211,102,0.06)', border:'1px solid rgba(37,211,102,0.18)',
                borderRadius:12, padding:'11px 14px', marginBottom:18 }}>
                <input type="checkbox" checked={form.show_whatsapp} onChange={e=>set('show_whatsapp',e.target.checked)}
                  style={{ width:17, height:17, accentColor:'#25D366', cursor:'pointer' }} />
                <div>
                  <div style={{ color:'rgba(255,248,240,0.85)', fontWeight:700, fontSize:13 }}>📱 Show WhatsApp on my profile</div>
                  <div style={{ color:'rgba(255,248,240,0.35)', fontSize:11 }}>Devotees can message you directly</div>
                </div>
              </label>

              <div style={{ background:'rgba(255,107,0,0.07)', border:'1px dashed rgba(255,107,0,0.25)',
                borderRadius:12, padding:'12px 16px', fontSize:13, color:'rgba(255,168,80,0.7)', marginBottom:16 }}>
                📋 Documents verified within <strong style={{ color:'#FF9F40' }}>48 hours</strong>. SMS confirmation after approval.
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:20 }}>
                <button className="btn btn-outline" onClick={prevStep}>← Back</button>
                <button className="btn btn-primary" onClick={handleNext}>Video & Finish →</button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step===4 && (
            <div>
              <h3 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', marginBottom:6, fontSize:17 }}>🎬 Intro Video & Submit</h3>
              <p style={{ color:'rgba(255,248,240,0.38)', fontSize:12.5, marginBottom:22, fontFamily:'Nunito,sans-serif' }}>
                A short intro video builds trust and significantly increases your bookings from devotees.
              </p>
              <div className="fgrid" style={{ gap:18 }}>
                <VideoUploadField file={files.intro_video} onChange={f=>setFile('intro_video',f)} />
              </div>

              <div style={{ background:'rgba(109,40,217,0.08)', border:'1px solid rgba(167,139,250,0.18)',
                borderRadius:14, padding:14, margin:'18px 0' }}>
                <div style={{ color:'#a78bfa', fontWeight:700, fontSize:13, marginBottom:8 }}>🎯 Tips for a great intro:</div>
                {['📍 Good lighting — outdoors or near a window','🗣️ Name, lineage & guru in the first 15 sec','🕉️ Mention 2-3 ritual specializations','🙏 End with a blessing for viewers','📱 Vertical (portrait) video works best on mobile'].map(t=>(
                  <div key={t} style={{ color:'rgba(255,248,240,0.45)', fontSize:12, marginBottom:4 }}>{t}</div>
                ))}
              </div>

              {/* Summary */}
              <div style={{ background:'rgba(240,192,64,0.05)', border:'1px solid rgba(240,192,64,0.12)',
                borderRadius:14, padding:16, marginBottom:22 }}>
                <div style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontWeight:700, fontSize:14, marginBottom:12 }}>✅ Application Summary</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {[['Name',form.name||'—'],['City',form.city||'—'],['Experience',form.years_of_experience?`${form.years_of_experience} yrs`:'—'],['Min Fee',form.min_fee?`₹${form.min_fee}`:'—'],['Specializations',`${form.specializations.length} selected`],['Languages',form.languages.join(', ')||'—'],['Aadhaar Doc',files.aadhar_front?'✅ Uploaded':'—'],['PAN Doc',files.pan_card?'✅ Uploaded':'—'],['Bank Doc',files.bank_passbook?'✅ Uploaded':'—'],['Profile Photo',files.photo?'✅ Uploaded':'—'],['Intro Video',files.intro_video?'✅ Uploaded':'⚠️ Required']].map(([k,v])=>(
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', gap:8,
                      padding:'5px 0', borderBottom:'1px solid rgba(240,192,64,0.05)' }}>
                      <span style={{ color:'rgba(255,248,240,0.38)', fontSize:12 }}>{k}</span>
                      <span style={{ color:v?.startsWith('⚠️')?'#f87171':'rgba(255,248,240,0.8)', fontSize:12, fontWeight:700, textAlign:'right' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', gap:12 }}>
                <button className="btn btn-outline" onClick={prevStep}>← Back</button>
                <button className="btn btn-primary" style={{ flex:1, justifyContent:'center', fontSize:15, padding:'13px',
                  boxShadow:'0 6px 20px rgba(255,107,0,0.35)' }} onClick={handleSubmit} disabled={submitting}>
                  {submitting ? '⏳ Submitting…' : '🙏 Submit Application'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign:'center', color:'rgba(255,248,240,0.28)', fontSize:12, marginTop:20 }}>
          Already registered? <a href="/pandit/dashboard" style={{ color:'#F0C040', fontWeight:700 }}>Go to Dashboard →</a>
        </p>
      </div>
    </div>
  );
}
