import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppCtx';
import notificationStore from '../../services/notificationService';

const OPTS = [
  { id:'satyanarayan', name:'Satyanarayan Katha', icon:'🌟', price:501, schedule:'Every Sunday 8:00 AM', desc:'Pandit performs on your behalf with your sankalp. HD livestream + prasad shipped home.', popular:true },
  { id:'navgrah',      name:'Navgrah Shanti Pooja', icon:'⭐', price:1100, schedule:'Every Monday 7:00 AM', desc:'Nine planet ritual for removing doshas. Navgrah yantra shipped home.' },
  { id:'rudra',        name:'Rudrabhishek', icon:'🔱', price:751, schedule:'Every Monday 6:00 AM', desc:'Shivalinga abhishek by certified Kashi pandit. Private YouTube livestream.' },
  { id:'laxmi',        name:'Laxmi Pooja', icon:'🪷', price:501, schedule:'Every Friday 7:00 AM', desc:'Maa Laxmi pooja for wealth and prosperity at a sacred location.' },
  { id:'ganesh',       name:'Ganesh Pooja', icon:'🐘', price:351, schedule:'Every Wednesday & Sunday', desc:'Remove obstacles before any new venture or auspicious work.' },
  { id:'custom',       name:'Custom Virtual Pooja', icon:'✨', price:null, schedule:'Any date & time', desc:'Any ritual performed virtually. You specify, we arrange everything.' },
];

const FAQ = [
  { q: 'How do I watch the live stream?', a: "We send a private YouTube/Zoom link to your WhatsApp 30 minutes before the pooja starts." },
  { q: 'When will prasad arrive?', a: 'Prasad is shipped within 24 hours of the pooja. Delivery takes 3-5 business days.' },
  { q: 'Can I give sankalp in my name?', a: 'Yes! Fill in your full name, gotra (if known), and your wish during booking.' },
  { q: 'What if I miss the livestream?', a: 'A recording link is sent to your WhatsApp within 2 hours of completion.' },
];

const dk = {
  card: { background:'rgba(26,15,7,0.72)', border:'1px solid rgba(240,192,64,0.14)', borderRadius:16, backdropFilter:'blur(14px)' },
  label: { color:'rgba(240,192,64,0.75)', fontSize:11, fontWeight:800, letterSpacing:1, textTransform:'uppercase', marginBottom:6, display:'block' },
};

export default function VirtualPoojaPage() {
  const navigate = useNavigate();
  const { setShowLogin, devoteeId } = useApp();
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', date:'', sankalp:'' });
  const [openFaq, setOpenFaq] = useState(null);

  const handleBook = (opt) => {
    notificationStore.recordSearch(opt.name);
    if (!devoteeId) { setShowLogin(true); return; }
    setSel(opt);
  };

  // ── Success Screen ──────────────────────────────────────────────────
  if (done) return (
    <div style={{ minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', textAlign:'center', gap:20, padding:24 }}>
      <div style={{ width:100, height:100, borderRadius:'50%',
        background:'linear-gradient(135deg,rgba(255,107,0,0.2),rgba(240,192,64,0.1))',
        border:'2px solid rgba(240,192,64,0.3)', display:'flex', alignItems:'center',
        justifyContent:'center', fontSize:52 }}>🙏</div>
      <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontSize:26, margin:0 }}>Virtual Pooja Booked!</h2>
      <p style={{ color:'rgba(255,248,240,0.6)', maxWidth:420, lineHeight:1.7, margin:0 }}>
        Livestream link on WhatsApp 30 min before. Prasad shipped in 3–5 days.
      </p>
      <div style={{ display:'flex', gap:12 }}>
        <button className="btn btn-primary" onClick={()=>navigate('/user/home')}>Back to Home</button>
        <button className="btn btn-outline" onClick={()=>navigate('/user/history')}>My Bookings</button>
      </div>
    </div>
  );

  // ── Booking Form ────────────────────────────────────────────────────
  if (sel) return (
    <div style={{ paddingBottom:40 }}>
      <button className="btn btn-outline" style={{ marginBottom:20 }} onClick={()=>setSel(null)}>← Back</button>
      <div className="ds-vp-form-wrap">
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:52 }}>{sel.icon}</div>
          <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontSize:20, margin:'10px 0 4px' }}>{sel.name}</h2>
          <div style={{ color:'#FF9F40', fontWeight:800, fontSize:22 }}>₹{sel.price || 'Custom'}</div>
          <div style={{ color:'rgba(255,248,240,0.4)', fontSize:12, marginTop:4 }}>📅 {sel.schedule}</div>
        </div>

        <div style={{ display:'flex', flexDirection:'column' }}>
          <label style={dk.label}>Your Full Name</label>
          <input className="ds-vp-input" placeholder="As per sankalp"
            value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>

          <label style={dk.label}>WhatsApp Number</label>
          <input className="ds-vp-input" placeholder="+91 XXXXX XXXXX"
            value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/>

          <label style={dk.label}>Preferred Date</label>
          <input type="date" className="ds-vp-input"
            value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>

          <label style={dk.label}>Sankalp (Your Wish)</label>
          <textarea className="ds-vp-input" style={{ height:80, resize:'none' }}
            placeholder="E.g. For the health and prosperity of my family..."
            value={form.sankalp} onChange={e=>setForm(f=>({...f,sankalp:e.target.value}))}/>
        </div>

        <button className="btn btn-primary" style={{ width:'100%', padding:'14px', fontSize:15, marginTop:8 }}
          onClick={()=>setDone(true)}>
          Confirm & Pay ₹{sel.price || '—'}
        </button>

        <div style={{ display:'flex', justifyContent:'center', gap:24, marginTop:20, flexWrap:'wrap' }}>
          {[['📺','HD Livestream'],['📦','Prasad Delivered'],['📜','Certificate'],['🙏','Personal Sankalp']].map(([i,l])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:20 }}>{i}</div>
              <div style={{ color:'rgba(255,248,240,0.4)', fontSize:11 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Main Listing ────────────────────────────────────────────────────
  return (
    <div>
      {/* Hero Banner */}
      <div style={{ ...dk.card, padding:'28px 26px', marginBottom:28, position:'relative', overflow:'hidden', borderRadius:20 }}>
        <div style={{ position:'absolute', top:-40, right:-20, width:220, height:220,
          background:'radial-gradient(ellipse,rgba(138,43,226,0.15) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ display:'inline-flex', alignItems:'center', gap:6,
          background:'rgba(138,43,226,0.12)', border:'1px solid rgba(138,43,226,0.3)',
          color:'#c084fc', fontSize:10, fontWeight:800, letterSpacing:'1.2px',
          textTransform:'uppercase', padding:'4px 12px', borderRadius:20, marginBottom:12 }}>
          📱 Virtual Pooja — From Anywhere
        </div>
        <h1 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontSize:'clamp(20px,3vw,28px)',
          margin:'0 0 8px', fontWeight:900 }}>Sacred Rituals — Remotely Performed</h1>
        <p style={{ color:'rgba(255,248,240,0.5)', margin:0, fontSize:13 }}>
          Verified pandits perform on your behalf with your personal sankalp. HD livestream + prasad delivered home.
        </p>
        <div style={{ display:'flex', gap:24, marginTop:20, flexWrap:'wrap' }}>
          {[['📺','HD Livestream'],['🙏','Personal Sankalp'],['📦','Prasad Delivered'],['📜','Certificate']].map(([icon,label])=>(
            <div key={label} style={{ display:'flex', alignItems:'center', gap:6,
              background:'rgba(255,248,240,0.04)', border:'1px solid rgba(240,192,64,0.12)',
              borderRadius:12, padding:'8px 14px' }}>
              <span style={{ fontSize:16 }}>{icon}</span>
              <span style={{ color:'rgba(255,248,240,0.6)', fontSize:12, fontWeight:600 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pooja Options Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16, marginBottom:36 }}>
        {OPTS.map(opt=>(
          <div key={opt.id} className="ds-vp-card" style={{ borderColor: opt.popular ? 'rgba(255,107,0,0.4)' : 'rgba(240,192,64,0.14)' }}>
            {opt.popular && (
              <div style={{ position:'absolute', top:-1, right:16,
                background:'linear-gradient(135deg,#FF6B00,#F0C040)', color:'#fff',
                fontSize:10, fontWeight:800, padding:'4px 12px',
                borderRadius:'0 0 8px 8px', letterSpacing:1 }}>MOST POPULAR</div>
            )}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div style={{ fontSize:40 }}>{opt.icon}</div>
              <div style={{ textAlign:'right' }}>
                {opt.price
                  ? <div style={{ color:'#FF9F40', fontWeight:800, fontSize:20 }}>₹{opt.price}</div>
                  : <div style={{ color:'#F0C040', fontWeight:700 }}>Custom Price</div>}
                <div style={{ color:'rgba(255,248,240,0.35)', fontSize:11, marginTop:2 }}>📅 {opt.schedule}</div>
              </div>
            </div>
            <h3 style={{ color:'#F0C040', fontFamily:'Cinzel,serif', margin:'0 0 8px', fontSize:15 }}>{opt.name}</h3>
            <p style={{ color:'rgba(255,248,240,0.5)', fontSize:13, lineHeight:1.6, margin:'0 0 16px' }}>{opt.desc}</p>
            <button className="btn btn-primary btn-sm" style={{ width:'100%', justifyContent:'center',
              background: opt.popular ? 'linear-gradient(135deg,#FF6B00,#FF8C35)' : 'rgba(138,43,226,0.18)',
              borderColor: opt.popular ? 'transparent' : 'rgba(138,43,226,0.4)',
              color: '#fff' }}
              onClick={()=>handleBook(opt)}>
              {opt.price ? `Book for ₹${opt.price}` : 'Enquire & Book'}
            </button>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="ds-vp-how-wrap">
        <h3 style={{ color:'#F0C040', fontFamily:'Cinzel,serif', margin:'0 0 20px', fontSize:17 }}>How Virtual Pooja Works</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:20 }}>
          {[
            { step:1, icon:'📝', title:'Book & Sankalp', desc:'Fill your name, wish, and preferred date' },
            { step:2, icon:'📲', title:'Get Link', desc:'Receive WhatsApp livestream link 30 mins before' },
            { step:3, icon:'📺', title:'Watch Live', desc:'Pandit performs ritual in your name' },
            { step:4, icon:'📦', title:'Receive Prasad', desc:'Prasad delivered to your home in 3-5 days' },
          ].map(s=>(
            <div key={s.step} style={{ textAlign:'center' }}>
              <div style={{ width:48, height:48, borderRadius:'50%',
                background:'linear-gradient(135deg,rgba(255,107,0,0.2),rgba(212,160,23,0.1))',
                border:'1px solid rgba(240,192,64,0.2)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:22, margin:'0 auto 10px' }}>{s.icon}</div>
              <div style={{ color:'rgba(255,248,240,0.8)', fontWeight:700, fontSize:13, marginBottom:5 }}>Step {s.step}: {s.title}</div>
              <div style={{ color:'rgba(255,248,240,0.4)', fontSize:12, lineHeight:1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="ds-vp-faq-wrap">
        <h3 style={{ color:'#F0C040', fontFamily:'Cinzel,serif', margin:'0 0 16px', fontSize:17 }}>Frequently Asked Questions</h3>
        {FAQ.map((f,i)=>(
          <div key={i} className="ds-vp-faq-item">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }}
              onClick={()=>setOpenFaq(openFaq===i?null:i)}>
              <div style={{ color:'rgba(255,248,240,0.85)', fontWeight:700, fontSize:14 }}>{f.q}</div>
              <div style={{ color:'#F0C040', fontSize:18, fontWeight:700, minWidth:20, textAlign:'center' }}>
                {openFaq===i?'−':'+'}
              </div>
            </div>
            {openFaq===i && (
              <div style={{ color:'rgba(255,248,240,0.5)', fontSize:13, lineHeight:1.7, marginTop:10, paddingTop:10,
                borderTop:'1px solid rgba(240,192,64,0.08)' }}>{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
