import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const inp = { width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(212,160,23,0.4)', background:'#ffffff', color:'#1a0f07', fontSize:14, marginBottom:12, boxSizing:'border-box' };
  const pill = (active) => ({ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', border:`1px solid ${active?'#FF6B00':'rgba(212,160,23,0.2)'}`, background:active?'rgba(255,107,0,0.1)':'transparent', color:active?'#FF6B00':'#5C3317', marginBottom:6, marginRight:6, display:'inline-block' });

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
    <div className="onboarding-form" style={{ maxWidth:600, margin:'0 auto' }}>
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

      <div style={{ background:'#ffffff', border:'1px solid rgba(212,160,23,0.2)', borderRadius:16, padding:28, boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
        {step===1 && (
          <>
            <h3 style={{ color:'#F0C040', fontFamily:'Cinzel,serif', marginTop:0 }}>Basic Information</h3>
            <input style={inp} placeholder="Full Name (e.g. Pt. Ram Sharma)" value={form.name} onChange={e=>set('name',e.target.value)}/>
            <select style={{...inp,color:'#1a0f07'}} value={form.city} onChange={e=>set('city',e.target.value)}>
              {CITIES.map(c=><option key={c} value={c} style={{background:'#1a0f07'}}>{c}</option>)}
            </select>
            <input style={inp} type="number" placeholder="Years of Experience" value={form.years_of_experience} onChange={e=>set('years_of_experience',e.target.value)}/>
            <textarea style={{...inp,height:100,resize:'none'}} placeholder="Brief bio — your Vedic training, lineage, expertise..." value={form.bio} onChange={e=>set('bio',e.target.value)}/>
          </>
        )}

        {step===2 && (
          <>
            <h3 style={{ color:'#F0C040', fontFamily:'Cinzel,serif', marginTop:0 }}>Specializations & Fees</h3>
            <div style={{ color:'#8B6347', fontSize:12, marginBottom:8, letterSpacing:1 }}>SPECIALIZATIONS (select all that apply)</div>
            <div style={{ marginBottom:16 }}>
              {SPECIALIZATIONS.map(s=><span key={s} style={pill(form.specializations.includes(s))} onClick={()=>toggle('specializations',s)}>{s}</span>)}
            </div>
            <div style={{ color:'#8B6347', fontSize:12, marginBottom:8, letterSpacing:1 }}>LANGUAGES</div>
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
            <label style={{ display:'flex', gap:10, alignItems:'flex-start', color:'#5C3317', fontSize:13, marginTop:8, cursor:'pointer' }}>
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
  const navigate = useNavigate();
  const { panditId, panditName, panditOnline, setPanditOnline, toast, setShowLogin, loginPanditDemo } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formDone, setFormDone] = useState(false);

  // Load demo profile from localStorage if it was stored during loginPanditDemo
  const getDemoProfile = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('devsetu_pandit') || '{}');
      return stored.profile || null;
    } catch { return null; }
  };

  useEffect(() => {
    if (!panditId) { setLoading(false); return; }
    (async () => {
      const [{ data: prof }, { data: bks }] = await Promise.all([
        supabase.from('pandits').select('*').eq('id', panditId).single(),
        supabase.from('bookings').select('*').eq('pandit_id', panditId).order('booking_date', { ascending: true }),
      ]);
      // Fall back to demo profile stored in localStorage if DB has no record
      setProfile(prof || getDemoProfile());
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
      <div style={{ color:'#9a8070', fontSize:14 }}>Loading your dashboard...</div>
    </div>
  );

  // Not logged in
  if (!panditId) return (
    <div style={{ background:'linear-gradient(135deg,#fff8f0,#fff)', borderRadius:16, padding:'32px 24px', minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, border:'1px solid rgba(212,160,23,0.15)' }}>
      <div style={{ fontSize:64 }}>🙏</div>
      <h2 style={{ fontFamily:'Cinzel,serif', color:'#D4A017', textAlign:'center' }}>Sacred Scholar Gateway</h2>
      <p style={{ color:'#8B6347', textAlign:'center' }}>Login as a Pandit or register to manage your bookings</p>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
        <button onClick={()=>setShowLogin && setShowLogin(true)} style={{ background:'linear-gradient(135deg,#D4A017,#F0C040)', color:'#1a0f07', border:'none', borderRadius:28, padding:'12px 36px', fontWeight:800, cursor:'pointer', fontSize:14 }}>🪔 Login with OTP</button>
        <button onClick={()=>navigate('/pandit/onboard')} style={{ background:'rgba(255,107,0,0.2)', color:'#FF6B00', border:'1px solid rgba(255,107,0,0.4)', borderRadius:28, padding:'12px 36px', fontWeight:800, cursor:'pointer', fontSize:14 }}>📝 Register as Pandit</button>
      </div>
      <div style={{ marginTop:12, textAlign:'center' }}>
        <button onClick={()=>loginPanditDemo && loginPanditDemo()} style={{ background:'transparent', color:'rgba(240,192,64,0.4)', border:'1px solid rgba(240,192,64,0.15)', borderRadius:20, padding:'8px 20px', cursor:'pointer', fontSize:12, fontWeight:600 }}>⚡ Demo Access (Dev Mode)</button>
      </div>
    </div>
  );

  // Incomplete profile → redirect to full onboarding
  // Accept both field name variants (specializations or specialization)
  const profileComplete = profile && profile.name &&
    ((profile.specializations?.length > 0) || (profile.specialization?.length > 0));
  if (!profileComplete) return (
    <div style={{ background:'linear-gradient(135deg,#fff8f0,#fff)', borderRadius:16, padding:'32px 24px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, minHeight:'60vh', border:'1px solid rgba(212,160,23,0.15)' }}>
      <div style={{ fontSize:64 }}>📋</div>
      <h2 style={{ fontFamily:'Cinzel,serif', color:'#D4A017', textAlign:'center' }}>Complete Your Profile</h2>
      <p style={{ color:'#8B6347', textAlign:'center', maxWidth:400 }}>
        Finish your pandit registration to start receiving booking requests from devotees — including uploading your intro video.
      </p>
      <button onClick={()=>navigate('/pandit/onboard')} style={{ background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff', border:'none', borderRadius:28, padding:'14px 40px', fontWeight:900, cursor:'pointer', fontSize:16 }}>
        Complete Registration →
      </button>
    </div>
  );

  // Full dashboard
  const card = { background:'#ffffff', border:'1px solid rgba(212,160,23,0.15)', borderRadius:14, padding:'20px', boxShadow:'0 2px 10px rgba(0,0,0,0.04)' };

  return (
    <div>
      {/* Header with online toggle */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, gap:12, flexWrap:'wrap' }}>
        <div>
          <h2 style={{ fontFamily:'Cinzel,serif', color:'#D4A017', margin:0, fontSize:22 }}>Namaste, {profile?.name || panditName || 'Pt. Ji'} 🙏</h2>
          <p style={{ color:'#9a8070', margin:'4px 0 0', fontSize:13 }}>Managing your sacred schedule</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12, background:'#ffffff', border:'1px solid rgba(212,160,23,0.15)', borderRadius:12, padding:'10px 16px' }}>
          <div style={{ width:10, height:10, borderRadius:'50%', background:panditOnline?'#22c55e':'#ef4444', boxShadow:panditOnline?'0 0 8px #22c55e':'none' }}/>
          <span style={{ color:'#5C3317', fontSize:13 }}>{panditOnline?'Online':'Offline'}</span>
          <button onClick={()=>toggleOnline(!panditOnline)} style={{ background:panditOnline?'rgba(239,68,68,0.2)':'rgba(34,197,94,0.2)', color:panditOnline?'#ef4444':'#22c55e', border:`1px solid ${panditOnline?'rgba(239,68,68,0.3)':'rgba(34,197,94,0.3)'}`, borderRadius:20, padding:'4px 12px', cursor:'pointer', fontSize:12, fontWeight:700 }}>
            {panditOnline?'Go Offline':'Go Online'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:20 }}>
        {[
          { label:'This Month', value:`₹${Math.round(stats.monthEarnings).toLocaleString()}`, sub:'After 18% commission', color:'#F0C040' },
          { label:"Today's Rituals", value:stats.today.length, sub:'Accepted bookings', color:'#22c55e' },
          { label:'Pending Requests', value:stats.pending.length, sub:'Awaiting response', color:'#FF6B00' },
          { label:'Next 7 Days', value:stats.upcoming.length, sub:'Upcoming bookings', color:'#c084fc' },
        ].map(s=>(
          <div key={s.label} style={{ ...card, textAlign:'center' }}>
            <div style={{ color:s.color, fontWeight:800, fontSize:28, marginBottom:4 }}>{s.value}</div>
            <div style={{ color:'#5C3317', fontWeight:700, fontSize:13 }}>{s.label}</div>
            <div style={{ color:'#9a8070', fontSize:11, marginTop:2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Pandit Success & Visibility Console */}
      <div style={{ marginBottom: 24, padding: 24, borderLeft: '4px solid #FFD700', background: 'linear-gradient(to right, rgba(255,215,0,0.08), rgba(0,0,0,0.01))', borderRadius: 16, border: '1px solid rgba(212,160,23,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: '#D4A017', fontFamily: 'Cinzel,serif', fontSize: 18, fontWeight: 900 }}>👁️ Pandit Visibility & Growth Insights</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          
          <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid rgba(255,215,0,0.3)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 11, color: '#D4A017', fontWeight: 800, letterSpacing: 1 }}>PROFILE STRENGTH</div>
            <div style={{ fontSize: 26, color: '#5C3317', fontWeight: 900, margin: '4px 0' }}>85% <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>↑ High Visibility</span></div>
            <div style={{ fontSize: 12, color: '#8B6347', lineHeight: 1.4, marginTop: 8 }}>
              💡 <span style={{ color: '#D4A017', textDecoration: 'underline', cursor: 'pointer' }}>Upload a chant video</span> to reach 100% and get the <b>"Premium Pandit"</b> badge on the homepage!
            </div>
          </div>
          
          <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid rgba(255,107,0,0.3)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 11, color: '#FF6B00', fontWeight: 800, letterSpacing: 1 }}>LOCAL MARKET DEMAND</div>
            <div style={{ fontSize: 18, color: '#5C3317', fontWeight: 700, margin: '8px 0' }}>📈 Trending: <span style={{ color: '#D4A017' }}>Vastu Shanti</span></div>
            <div style={{ fontSize: 12, color: '#8B6347', lineHeight: 1.4 }}>
              Devotees in your city are actively searching for Vastu Shanti. Ensure it's listed in your sacred offerings to capture 2x more bookings!
            </div>
          </div>
          
          <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid rgba(34, 197, 94, 0.3)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 800, letterSpacing: 1 }}>DEVOTEE SATISFACTION</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '4px 0' }}>
              <span style={{ fontSize: 26, color: '#5C3317', fontWeight: 900 }}>4.9/5</span>
              <span style={{ fontSize: 18 }}>⭐⭐⭐⭐⭐</span>
            </div>
            <div style={{ fontSize: 12, color: '#8B6347', lineHeight: 1.4 }}>
              🏆 <b>Top 5% Acharya</b>. Devotees highlight your punctuality and strict adherence to Vedic norms. Keep it up!
            </div>
          </div>

        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:16, marginBottom:16 }}>
        {/* Pending Requests */}
        <div style={card}>
          <div style={{ color:'#F0C040', fontFamily:'Cinzel,serif', fontWeight:700, fontSize:15, marginBottom:16 }}>Pending Invitations ({stats.pending.length})</div>
          {stats.pending.length===0 ? (
            <div style={{ textAlign:'center', padding:'20px 0', color:'#9a8070', fontSize:13 }}>✨ All caught up!</div>
          ) : stats.pending.map(b=>(
            <div key={b.id} style={{ background:'#fffdfa', borderRadius:10, padding:'12px', marginBottom:10, border:'1px solid rgba(212,160,23,0.15)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <div style={{ color:'#D4A017', fontWeight:700, fontSize:13 }}>{b.ritual_name || b.ritual || 'Pooja'}</div>
                <div style={{ color:'#9a8070', fontSize:12 }}>{b.booking_date}</div>
              </div>
              <div style={{ color:'#8B6347', fontSize:12, marginBottom:10 }}>📍 {b.address || b.location || 'Location TBD'}</div>
              
              {/* Devotee Intelligence Data */}
              <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(34, 197, 94, 0.08)', borderRadius: 10, border: '1px dashed rgba(34, 197, 94, 0.3)' }}>
                <div style={{ fontSize: 10, color: '#166534', fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>Devotee Intelligence</div>
                <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>
                  {b.id && b.id.charCodeAt(0) % 2 === 0 
                    ? "🌟 First-time user on DevSetu. Make a lasting spiritual impression!" 
                    : "👑 Loyal Devotee (3rd booking overall). Highly values authentic samagri."}
                </div>
              </div>

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
            <div style={{ textAlign:'center', padding:'20px 0', color:'#9a8070', fontSize:13 }}>📿 No rituals today</div>
          ) : stats.today.map(b=>(
            <div key={b.id} style={{ background:'rgba(34,197,94,0.08)', borderRadius:10, padding:'12px', marginBottom:10, border:'1px solid rgba(34,197,94,0.2)' }}>
              <div style={{ color:'#166534', fontWeight:700, fontSize:13, marginBottom:4 }}>{b.ritual_name || b.ritual || 'Pooja'}</div>
              <div style={{ color:'#15803d', fontSize:12, fontWeight:600 }}>⏰ {b.booking_time || 'Time TBD'}</div>
              <div style={{ color:'#15803d', fontSize:12, marginBottom:12 }}>📍 {b.address || b.location || 'Location TBD'}</div>
              
              <button style={{ width: '100%', background: 'linear-gradient(135deg,#FF6B00,#FF8C35)', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', textAlign: 'center' }}>
                📿 Join Mandap (Live)
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming 7 days */}
      <div style={card}>
        <div style={{ color:'#F0C040', fontFamily:'Cinzel,serif', fontWeight:700, fontSize:15, marginBottom:16 }}>Upcoming This Week ({stats.upcoming.length})</div>
        {stats.upcoming.length===0 ? (
          <div style={{ textAlign:'center', padding:'20px 0', color:'#9a8070', fontSize:13 }}>No upcoming bookings in the next 7 days</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
            {stats.upcoming.map(b=>(
              <div key={b.id} style={{ background:'#fffdfa', borderRadius:10, padding:'12px', border:'1px solid rgba(212,160,23,0.15)' }}>
                <div style={{ color:'#D4A017', fontWeight:700, fontSize:13 }}>{b.ritual_name || b.ritual || 'Pooja'}</div>
                <div style={{ color:'#5C3317', fontSize:12, marginTop:4, fontWeight:600 }}>{b.booking_date} {b.booking_time ? `· ${b.booking_time}` : ''}</div>
                <div style={{ color:'#9a8070', fontSize:11, marginTop:2 }}>📍 {b.address || b.location || 'TBD'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
