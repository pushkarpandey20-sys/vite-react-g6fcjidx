import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../store/AppCtx';
import { supabase } from '../../../services/supabase';

const CITIES = ['Delhi','Gurgaon','Noida','Faridabad','Ghaziabad','Mumbai','Bengaluru','Ayodhya'];
const SPECIALIZATIONS = ['Vivah','Griha Pravesh','Satyanarayan','Rudrabhishek','Navgrah','Kaal Sarp','Mundan','Namkaran','Vastu Shastra','Astrology','Custom Pooja','Antyesti'];
const LANGUAGES = ['Hindi','Sanskrit','English','Bengali','Tamil','Telugu','Garhwali','Bhojpuri'];

// ── 3-Step Onboarding Form ─────────────────────────────────────
function PanditOnboardingForm({ onComplete }) {
  const { panditId } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name:'', city:'Delhi', years_of_experience:'', bio:'',
    specializations:[], languages:[], min_fee:'', max_fee:'',
    aadhaar:'', bank_account:'', ifsc:'', agreed:false,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggle = (k, v) => setForm(f => ({ ...f, [k]: f[k].includes(v) ? f[k].filter(x=>x!==v) : [...f[k], v] }));

  const inp = { width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(212,160,23,0.3)', background:'rgba(255,255,255,0.05)', color:'#fff8f0', fontSize:14, marginBottom:12, boxSizing:'border-box' };
  const pill = (active) => ({ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', border:`1px solid ${active?'#FF6B00':'rgba(212,160,23,0.2)'}`, background:active?'rgba(255,107,0,0.2)':'transparent', color:active?'#FF6B00':'rgba(255,248,240,0.5)', marginBottom:6, marginRight:6, display:'inline-block' });

  const handleSubmit = async () => {
    if (!form.agreed) { setErr('Please agree to the terms'); return; }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = panditId || user?.id || null;
      const upsertData = {
        name: form.name,
        city: form.city,
        phone: user?.phone || null,           // needed so login can find by phone
        experience_years: parseInt(form.years_of_experience) || 0,
        bio: form.bio,
        specialization: form.specializations,
        languages: form.languages,
        min_fee: parseInt(form.min_fee) || 0,
        max_fee: parseInt(form.max_fee) || 0,
        bank_account: form.bank_account,
        ifsc_code: form.ifsc,
        status: 'pending_verification',
      };
      // Only set id when we have one — otherwise let DB auto-generate
      if (userId) upsertData.id = userId;
      await supabase.from('pandits').upsert(upsertData);
      onComplete && onComplete();
    } catch (e) {
      setErr('Submission failed. Please try again.');
    }
    setSaving(false);
  };

  return (
    <div className="dark-input" style={{ maxWidth:600, margin:'0 auto' }}>
      {/* Stepper */}
      <div style={{ display:'flex', alignItems:'center', marginBottom:32 }}>
        {['Basic Info','Specializations','Verification'].map((s,i)=>(
          <React.Fragment key={s}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14, background:step>i+1?'#22c55e':step===i+1?'linear-gradient(135deg,#FF6B00,#D4A017)':'rgba(255,255,255,0.1)', color:step>=i+1?'#fff':'rgba(255,255,255,0.4)', marginBottom:6 }}>{step>i+1?'✓':i+1}</div>
              <div style={{ fontSize:11, color:step>=i+1?'#F0C040':'rgba(255,255,255,0.3)', fontWeight:600 }}>{s}</div>
            </div>
            {i<2 && <div style={{ flex:1, height:2, background:step>i+1?'#22c55e':'rgba(255,255,255,0.1)', marginBottom:22 }}/>}
          </React.Fragment>
        ))}
      </div>

      <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,160,23,0.2)', borderRadius:16, padding:28 }}>
        {step===1 && (
          <>
            <h3 style={{ color:'#F0C040', fontFamily:'Cinzel,serif', marginTop:0 }}>Basic Information</h3>
            <input style={inp} placeholder="Full Name (e.g. Pt. Ram Sharma)" value={form.name} onChange={e=>set('name',e.target.value)}/>
            <select style={{...inp,color:'#fff8f0'}} value={form.city} onChange={e=>set('city',e.target.value)}>
              {CITIES.map(c=><option key={c} value={c} style={{background:'#1a0f07'}}>{c}</option>)}
            </select>
            <input style={inp} type="number" placeholder="Years of Experience" value={form.years_of_experience} onChange={e=>set('years_of_experience',e.target.value)}/>
            <textarea style={{...inp,height:100,resize:'none'}} placeholder="Brief bio — your Vedic training, lineage, expertise..." value={form.bio} onChange={e=>set('bio',e.target.value)}/>
          </>
        )}

        {step===2 && (
          <>
            <h3 style={{ color:'#F0C040', fontFamily:'Cinzel,serif', marginTop:0 }}>Specializations & Fees</h3>
            <div style={{ color:'rgba(255,248,240,0.5)', fontSize:12, marginBottom:8, letterSpacing:1 }}>SPECIALIZATIONS (select all that apply)</div>
            <div style={{ marginBottom:16 }}>
              {SPECIALIZATIONS.map(s=><span key={s} style={pill(form.specializations.includes(s))} onClick={()=>toggle('specializations',s)}>{s}</span>)}
            </div>
            <div style={{ color:'rgba(255,248,240,0.5)', fontSize:12, marginBottom:8, letterSpacing:1 }}>LANGUAGES</div>
            <div style={{ marginBottom:16 }}>
              {LANGUAGES.map(l=><span key={l} style={pill(form.languages.includes(l))} onClick={()=>toggle('languages',l)}>{l}</span>)}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <input style={inp} type="number" placeholder="Min Fee (₹)" value={form.min_fee} onChange={e=>set('min_fee',e.target.value)}/>
              <input style={inp} type="number" placeholder="Max Fee (₹)" value={form.max_fee} onChange={e=>set('max_fee',e.target.value)}/>
            </div>
          </>
        )}

        {step===3 && (
          <>
            <h3 style={{ color:'#F0C040', fontFamily:'Cinzel,serif', marginTop:0 }}>Verification & Bank Details</h3>
            <input style={inp} placeholder="Aadhaar Number (for verification)" value={form.aadhaar} onChange={e=>set('aadhaar',e.target.value)}/>
            <input style={inp} placeholder="Bank Account Number" value={form.bank_account} onChange={e=>set('bank_account',e.target.value)}/>
            <input style={inp} placeholder="IFSC Code" value={form.ifsc} onChange={e=>set('ifsc',e.target.value)}/>
            <label style={{ display:'flex', gap:10, alignItems:'flex-start', color:'rgba(255,248,240,0.6)', fontSize:13, marginTop:8, cursor:'pointer' }}>
              <input type="checkbox" checked={form.agreed} onChange={e=>set('agreed',e.target.checked)} style={{ marginTop:3 }}/>
              I agree to DevSetu's Pandit Code of Conduct, terms of service, and commission structure (18% platform fee).
            </label>
            {err && <div style={{ color:'#ef4444', fontSize:12, marginTop:8 }}>{err}</div>}
          </>
        )}

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:20 }}>
          {step>1 ? <button onClick={()=>setStep(s=>s-1)} style={{ background:'rgba(255,255,255,0.1)', color:'#fff', border:'none', borderRadius:20, padding:'10px 22px', fontWeight:700, cursor:'pointer' }}>← Back</button> : <div/>}
          {step<3 ? (
            <button onClick={()=>setStep(s=>s+1)} style={{ background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff', border:'none', borderRadius:20, padding:'10px 24px', fontWeight:700, cursor:'pointer' }}>Next →</button>
          ) : (
            <button onClick={handleSubmit} disabled={saving} style={{ background:'linear-gradient(135deg,#22c55e,#16a34a)', color:'#fff', border:'none', borderRadius:20, padding:'10px 24px', fontWeight:700, cursor:'pointer' }}>
              {saving ? 'Submitting...' : '✅ Submit for Verification'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────
export default function Dashboard() {
  const { panditId, panditName, panditOnline, setPanditOnline, toast, setShowLogin, loginPanditDemo } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formDone, setFormDone] = useState(false);

  useEffect(() => {
    if (!panditId) { setLoading(false); return; }
    (async () => {
      const [{ data: prof }, { data: bks }] = await Promise.all([
        supabase.from('pandits').select('*').eq('id', panditId).single(),
        supabase.from('bookings').select('*').eq('pandit_id', panditId).order('booking_date', { ascending: true }),
      ]);
      setProfile(prof || null);
      setBookings(bks || []);
      setLoading(false);
    })();

    const channel = supabase.channel(`dashboard_${panditId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `pandit_id=eq.${panditId}` }, (payload) => {
        if (payload.eventType === 'INSERT') { setBookings(prev => [payload.new, ...prev]); toast && toast('New Sacred Invitation!', '🔔'); }
        else if (payload.eventType === 'UPDATE') { setBookings(prev => prev.map(b => b.id === payload.new.id ? payload.new : b)); }
      }).subscribe();

    return () => supabase.removeChannel(channel);
  }, [panditId]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const next7 = new Date(); next7.setDate(next7.getDate() + 7);
    const next7str = next7.toISOString().split('T')[0];
    const pending = bookings.filter(b => b.status === 'pending');
    const todayBks = bookings.filter(b => b.booking_date === today && b.status === 'accepted');
    const accepted = bookings.filter(b => b.status === 'accepted' || b.status === 'completed');
    const monthEarnings = accepted.reduce((acc, b) => acc + ((b.total_amount || b.amount || 0) * 0.82), 0);
    const upcoming = bookings.filter(b => b.booking_date > today && b.booking_date <= next7str && b.status === 'accepted');
    return { pending, today: todayBks, monthEarnings, upcoming };
  }, [bookings]);

  const handleAction = async (id, status) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (!error) toast && toast(`Booking ${status}.`, status === 'accepted' ? '✅' : '⚠️');
  };

  const toggleOnline = async (val) => {
    setPanditOnline && setPanditOnline(val);
    if (panditId) await supabase.from('pandits').update({ is_online: val }).eq('id', panditId);
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ color:'rgba(255,248,240,0.5)', fontSize:14 }}>Loading your dashboard...</div>
    </div>
  );

  // Not logged in
  if (!panditId) return (
    <div style={{ background:'linear-gradient(135deg,#1a0f07,#3d2211)', borderRadius:16, padding:'32px 24px', minHeight:'60vh' }}>
      {showForm ? (
        <div>
          <button onClick={()=>setShowForm(false)} style={{ background:'rgba(255,255,255,0.1)', color:'#fff', border:'none', borderRadius:20, padding:'8px 18px', cursor:'pointer', marginBottom:20, fontWeight:600 }}>← Back</button>
          {formDone ? (
            <div style={{ textAlign:'center', padding:'40px 0' }}>
              <div style={{ fontSize:64 }}>🙏</div>
              <h2 style={{ fontFamily:'Cinzel,serif', color:'#D4A017' }}>Application Submitted!</h2>
              <p style={{ color:'rgba(255,248,240,0.6)' }}>Our team will verify your profile within 24-48 hours.</p>
            </div>
          ) : (
            <PanditOnboardingForm onComplete={()=>setFormDone(true)} />
          )}
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'50vh', gap:20 }}>
          <div style={{ fontSize:64 }}>🙏</div>
          <h2 style={{ fontFamily:'Cinzel,serif', color:'#D4A017' }}>Sacred Scholar Gateway</h2>
          <p style={{ color:'rgba(255,248,240,0.5)' }}>Login as a Pandit or register to manage your bookings</p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
            <button onClick={()=>setShowLogin && setShowLogin(true)} style={{ background:'linear-gradient(135deg,#D4A017,#F0C040)', color:'#1a0f07', border:'none', borderRadius:28, padding:'12px 36px', fontWeight:800, cursor:'pointer', fontSize:14 }}>🪔 Login with OTP</button>
            <button onClick={()=>setShowForm(true)} style={{ background:'rgba(255,107,0,0.2)', color:'#FF6B00', border:'1px solid rgba(255,107,0,0.4)', borderRadius:28, padding:'12px 36px', fontWeight:800, cursor:'pointer', fontSize:14 }}>📝 Register as Pandit</button>
          </div>
          <div style={{ marginTop:12, textAlign:'center' }}>
            <button onClick={()=>loginPanditDemo && loginPanditDemo()} style={{ background:'transparent', color:'rgba(240,192,64,0.4)', border:'1px solid rgba(240,192,64,0.15)', borderRadius:20, padding:'8px 20px', cursor:'pointer', fontSize:12, fontWeight:600 }}>⚡ Demo Access (Dev Mode)</button>
          </div>
        </div>
      )}
    </div>
  );

  // Incomplete profile → show form
  const profileComplete = profile && profile.name && profile.specializations?.length > 0;
  if (!profileComplete) return (
    <div style={{ background:'linear-gradient(135deg,#1a0f07,#3d2211)', borderRadius:16, padding:'32px 24px' }}>
      <div style={{ background:'rgba(255,107,0,0.1)', border:'1px solid rgba(255,107,0,0.3)', borderRadius:12, padding:'16px 20px', marginBottom:24, color:'#FF6B00', fontSize:14 }}>
        Complete your profile to start receiving booking requests from devotees.
      </div>
      {formDone ? (
        <div style={{ textAlign:'center', padding:'40px 0' }}>
          <div style={{ fontSize:64 }}>🙏</div>
          <h2 style={{ fontFamily:'Cinzel,serif', color:'#D4A017' }}>Profile Submitted!</h2>
          <p style={{ color:'rgba(255,248,240,0.6)' }}>Our team will verify your profile within 24-48 hours.</p>
        </div>
      ) : <PanditOnboardingForm onComplete={()=>setFormDone(true)} />}
    </div>
  );

  // Full dashboard
  const card = { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,160,23,0.12)', borderRadius:14, padding:'20px' };

  return (
    <div>
      {/* Header with online toggle */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:'Cinzel,serif', color:'#D4A017', margin:0, fontSize:22 }}>Namaste, {profile?.name || panditName || 'Pt. Ji'} 🙏</h2>
          <p style={{ color:'rgba(255,248,240,0.5)', margin:'4px 0 0', fontSize:13 }}>Managing your sacred schedule</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,160,23,0.15)', borderRadius:12, padding:'10px 16px' }}>
          <div style={{ width:10, height:10, borderRadius:'50%', background:panditOnline?'#22c55e':'#ef4444', boxShadow:panditOnline?'0 0 8px #22c55e':'none' }}/>
          <span style={{ color:'rgba(255,248,240,0.7)', fontSize:13 }}>{panditOnline?'Online':'Offline'}</span>
          <button onClick={()=>toggleOnline(!panditOnline)} style={{ background:panditOnline?'rgba(239,68,68,0.2)':'rgba(34,197,94,0.2)', color:panditOnline?'#ef4444':'#22c55e', border:`1px solid ${panditOnline?'rgba(239,68,68,0.3)':'rgba(34,197,94,0.3)'}`, borderRadius:20, padding:'4px 12px', cursor:'pointer', fontSize:12, fontWeight:700 }}>
            {panditOnline?'Go Offline':'Go Online'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'This Month', value:`₹${Math.round(stats.monthEarnings).toLocaleString()}`, sub:'After 18% commission', color:'#F0C040' },
          { label:"Today's Rituals", value:stats.today.length, sub:'Accepted bookings', color:'#22c55e' },
          { label:'Pending Requests', value:stats.pending.length, sub:'Awaiting response', color:'#FF6B00' },
          { label:'Next 7 Days', value:stats.upcoming.length, sub:'Upcoming bookings', color:'#c084fc' },
        ].map(s=>(
          <div key={s.label} style={{ ...card, textAlign:'center' }}>
            <div style={{ color:s.color, fontWeight:800, fontSize:28, marginBottom:4 }}>{s.value}</div>
            <div style={{ color:'rgba(255,248,240,0.8)', fontWeight:600, fontSize:13 }}>{s.label}</div>
            <div style={{ color:'rgba(255,248,240,0.4)', fontSize:11, marginTop:2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        {/* Pending Requests */}
        <div style={card}>
          <div style={{ color:'#F0C040', fontFamily:'Cinzel,serif', fontWeight:700, fontSize:15, marginBottom:16 }}>Pending Invitations ({stats.pending.length})</div>
          {stats.pending.length===0 ? (
            <div style={{ textAlign:'center', padding:'20px 0', color:'rgba(255,248,240,0.4)', fontSize:13 }}>✨ All caught up!</div>
          ) : stats.pending.map(b=>(
            <div key={b.id} style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'12px', marginBottom:10, border:'1px solid rgba(212,160,23,0.08)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <div style={{ color:'#F0C040', fontWeight:700, fontSize:13 }}>{b.ritual_name || b.ritual || 'Pooja'}</div>
                <div style={{ color:'rgba(255,248,240,0.5)', fontSize:12 }}>{b.booking_date}</div>
              </div>
              <div style={{ color:'rgba(255,248,240,0.5)', fontSize:12, marginBottom:10 }}>📍 {b.address || b.location || 'Location TBD'}</div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>handleAction(b.id,'declined')} style={{ flex:1, background:'rgba(239,68,68,0.15)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'6px', cursor:'pointer', fontSize:12, fontWeight:600 }}>Decline</button>
                <button onClick={()=>handleAction(b.id,'accepted')} style={{ flex:1, background:'rgba(34,197,94,0.15)', color:'#22c55e', border:'1px solid rgba(34,197,94,0.3)', borderRadius:8, padding:'6px', cursor:'pointer', fontSize:12, fontWeight:700 }}>Accept ✓</button>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Schedule */}
        <div style={card}>
          <div style={{ color:'#F0C040', fontFamily:'Cinzel,serif', fontWeight:700, fontSize:15, marginBottom:16 }}>Today's Schedule ({stats.today.length})</div>
          {stats.today.length===0 ? (
            <div style={{ textAlign:'center', padding:'20px 0', color:'rgba(255,248,240,0.4)', fontSize:13 }}>📿 No rituals today</div>
          ) : stats.today.map(b=>(
            <div key={b.id} style={{ background:'rgba(34,197,94,0.06)', borderRadius:10, padding:'12px', marginBottom:10, border:'1px solid rgba(34,197,94,0.15)' }}>
              <div style={{ color:'#22c55e', fontWeight:700, fontSize:13, marginBottom:4 }}>{b.ritual_name || b.ritual || 'Pooja'}</div>
              <div style={{ color:'rgba(255,248,240,0.5)', fontSize:12 }}>⏰ {b.booking_time || 'Time TBD'}</div>
              <div style={{ color:'rgba(255,248,240,0.5)', fontSize:12 }}>📍 {b.address || b.location || 'Location TBD'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming 7 days */}
      <div style={card}>
        <div style={{ color:'#F0C040', fontFamily:'Cinzel,serif', fontWeight:700, fontSize:15, marginBottom:16 }}>Upcoming This Week ({stats.upcoming.length})</div>
        {stats.upcoming.length===0 ? (
          <div style={{ textAlign:'center', padding:'20px 0', color:'rgba(255,248,240,0.4)', fontSize:13 }}>No upcoming bookings in the next 7 days</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
            {stats.upcoming.map(b=>(
              <div key={b.id} style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'12px', border:'1px solid rgba(212,160,23,0.08)' }}>
                <div style={{ color:'#F0C040', fontWeight:600, fontSize:13 }}>{b.ritual_name || b.ritual || 'Pooja'}</div>
                <div style={{ color:'rgba(255,248,240,0.5)', fontSize:12, marginTop:4 }}>{b.booking_date} {b.booking_time ? `· ${b.booking_time}` : ''}</div>
                <div style={{ color:'rgba(255,248,240,0.4)', fontSize:11, marginTop:2 }}>📍 {b.address || b.location || 'TBD'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
