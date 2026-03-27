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

export default function VirtualPoojaPage() {
  const navigate = useNavigate();
  const { setShowLogin, devoteeId } = useApp();
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', date:'', sankalp:'' });
  const [openFaq, setOpenFaq] = useState(null);

  const btn = (bg='linear-gradient(135deg,#FF6B00,#FF8C35)') => ({
    background:bg, color:'#fff', border:'none', borderRadius:20, padding:'10px 22px', fontWeight:700, cursor:'pointer', fontSize:13,
  });

  const handleBook = (opt) => {
    notificationStore.recordSearch(opt.name);
    if (!devoteeId) { setShowLogin(true); return; }
    setSel(opt);
  };

  // ── Success Screen ───────────────────────────────────────────
  if (done) return (
    <div style={{ background:'#fff8f0', minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', gap:16, padding:24 }}>
      <div style={{ fontSize:72 }}>🙏</div>
      <h2 style={{ fontFamily:'Cinzel,serif', color:'#D4A017', fontSize:24, margin:0 }}>Virtual Pooja Booked!</h2>
      <p style={{ color:'#4a3728', maxWidth:420, lineHeight:1.7, margin:0 }}>
        Confirmed! Livestream link on WhatsApp 30 min before. Prasad shipped in 3-5 days.
      </p>
      <div style={{ display:'flex', gap:12 }}>
        <button style={btn()} onClick={()=>navigate('/user/home')}>Back to Home</button>
        <button style={btn('rgba(139,99,71,0.15)')} onClick={()=>navigate('/user/history')}>
          <span style={{ color:'#4a3728' }}>My Bookings</span>
        </button>
      </div>
    </div>
  );

  // ── Booking Form ─────────────────────────────────────────────
  if (sel) return (
    <div style={{ background:'#fff8f0', minHeight:'100vh', padding:'0 0 40px' }}>
      <button style={{ background:'rgba(139,99,71,0.1)', color:'#4a3728', border:'1px solid rgba(139,99,71,0.2)', borderRadius:20, padding:'9px 18px', cursor:'pointer', fontWeight:700, fontSize:13, margin:'20px 0 20px 0' }}
        onClick={()=>setSel(null)}>← Back</button>
      <div style={{ maxWidth:520, margin:'0 auto', background:'#ffffff', border:'1px solid rgba(212,160,23,0.3)', borderRadius:16, padding:'28px', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:52 }}>{sel.icon}</div>
          <h2 style={{ fontFamily:'Cinzel,serif', color:'#1a0f07', fontSize:20, margin:'8px 0 4px' }}>{sel.name}</h2>
          <div style={{ color:'#FF6B00', fontWeight:800, fontSize:22 }}>₹{sel.price || 'Custom'}</div>
          <div style={{ color:'#9a8070', fontSize:12, marginTop:4 }}>📅 {sel.schedule}</div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          <label style={{ color:'#4a3728', fontSize:12, fontWeight:700, letterSpacing:0.5 }}>YOUR FULL NAME</label>
          <input style={{ padding:'10px 14px', borderRadius:8, border:'1.5px solid rgba(212,160,23,0.4)', background:'#fff', color:'#1a0f07', fontSize:14, marginBottom:12, outline:'none' }}
            placeholder="As per sankalp" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>

          <label style={{ color:'#4a3728', fontSize:12, fontWeight:700, letterSpacing:0.5 }}>WHATSAPP NUMBER</label>
          <input style={{ padding:'10px 14px', borderRadius:8, border:'1.5px solid rgba(212,160,23,0.4)', background:'#fff', color:'#1a0f07', fontSize:14, marginBottom:12, outline:'none' }}
            placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/>

          <label style={{ color:'#4a3728', fontSize:12, fontWeight:700, letterSpacing:0.5 }}>PREFERRED DATE</label>
          <input type="date" style={{ padding:'10px 14px', borderRadius:8, border:'1.5px solid rgba(212,160,23,0.4)', background:'#fff', color:'#1a0f07', fontSize:14, marginBottom:12, outline:'none' }}
            value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>

          <label style={{ color:'#4a3728', fontSize:12, fontWeight:700, letterSpacing:0.5 }}>SANKALP (YOUR WISH)</label>
          <textarea style={{ padding:'10px 14px', borderRadius:8, border:'1.5px solid rgba(212,160,23,0.4)', background:'#fff', color:'#1a0f07', fontSize:14, height:80, resize:'none', outline:'none' }}
            placeholder="E.g. For the health and prosperity of my family..." value={form.sankalp} onChange={e=>setForm(f=>({...f,sankalp:e.target.value}))}/>
        </div>

        <button style={{ ...btn(), width:'100%', padding:'14px', fontSize:15, marginTop:20 }} onClick={()=>setDone(true)}>
          Confirm & Pay ₹{sel.price || '—'}
        </button>

        <div style={{ display:'flex', justifyContent:'center', gap:20, marginTop:16 }}>
          {[['📺','HD Livestream'],['📦','Prasad Delivered'],['📜','Certificate'],['🙏','Personal Sankalp']].map(([i,l])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:18 }}>{i}</div>
              <div style={{ color:'#9a8070', fontSize:11 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Main Listing ─────────────────────────────────────────────
  return (
    <div style={{ background:'#fff8f0', minHeight:'100vh' }}>
      {/* Hero Banner */}
      <div style={{ background:'linear-gradient(135deg,rgba(138,43,226,0.85),rgba(75,0,130,0.9))', borderRadius:16, padding:'28px', marginBottom:28, textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:12 }}>📱</div>
        <h1 style={{ fontFamily:'Cinzel,serif', color:'#fff', fontSize:28, margin:0, marginBottom:8 }}>Virtual Pooja</h1>
        <p style={{ color:'rgba(255,255,255,0.8)', fontSize:15, maxWidth:600, margin:'0 auto' }}>
          Participate in sacred rituals from anywhere. Verified pandits perform on your behalf with your personal sankalp.
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:24, marginTop:20, flexWrap:'wrap' }}>
          {[['📺','HD Livestream'],['🙏','Personal Sankalp'],['📦','Prasad Delivered'],['📜','Certificate']].map(([i,l])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:20 }}>{i}</div>
              <div style={{ color:'rgba(255,255,255,0.7)', fontSize:12 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pooja Options */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16, marginBottom:36 }}>
        {OPTS.map(opt=>(
          <div key={opt.id} style={{ background:'#ffffff', border:`${opt.popular?'2px solid rgba(255,107,0,0.5)':'1px solid rgba(212,160,23,0.25)'}`, borderRadius:14, padding:'20px', position:'relative', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', transition:'all 0.2s' }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.06)'; }}>
            {opt.popular && <div style={{ position:'absolute', top:-1, right:16, background:'linear-gradient(135deg,#FF6B00,#F0C040)', color:'#fff', fontSize:10, fontWeight:800, padding:'4px 12px', borderRadius:'0 0 8px 8px', letterSpacing:1 }}>MOST POPULAR</div>}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div style={{ fontSize:40 }}>{opt.icon}</div>
              <div style={{ textAlign:'right' }}>
                {opt.price ? <div style={{ color:'#FF6B00', fontWeight:800, fontSize:20 }}>₹{opt.price}</div> : <div style={{ color:'#D4A017', fontWeight:700 }}>Custom Price</div>}
                <div style={{ color:'#9a8070', fontSize:11, marginTop:2 }}>📅 {opt.schedule}</div>
              </div>
            </div>
            <h3 style={{ color:'#1a0f07', fontFamily:'Cinzel,serif', margin:'0 0 8px', fontSize:15 }}>{opt.name}</h3>
            <p style={{ color:'#4a3728', fontSize:13, lineHeight:1.6, margin:'0 0 16px' }}>{opt.desc}</p>
            <button
              style={{ background:opt.popular?'linear-gradient(135deg,#FF6B00,#FF8C35)':'rgba(138,43,226,0.12)', color:opt.popular?'#fff':'#6d28d9', border:opt.popular?'none':'1px solid rgba(138,43,226,0.3)', borderRadius:20, padding:'10px 0', fontWeight:700, cursor:'pointer', fontSize:13, width:'100%' }}
              onClick={()=>handleBook(opt)}>
              {opt.price ? `Book for ₹${opt.price}` : 'Enquire & Book'}
            </button>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div style={{ background:'#ffffff', border:'1px solid rgba(212,160,23,0.2)', borderRadius:14, padding:'24px', marginBottom:28, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
        <h3 style={{ color:'#1a0f07', fontFamily:'Cinzel,serif', margin:'0 0 20px', fontSize:17 }}>How Virtual Pooja Works</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:20 }}>
          {[
            { step:1, icon:'📝', title:'Book & Sankalp', desc:'Fill your name, wish, and preferred date' },
            { step:2, icon:'📲', title:'Get Link', desc:'Receive WhatsApp livestream link 30 mins before' },
            { step:3, icon:'📺', title:'Watch Live', desc:'Pandit performs ritual in your name' },
            { step:4, icon:'📦', title:'Receive Prasad', desc:'Prasad delivered to your home in 3-5 days' },
          ].map(s=>(
            <div key={s.step} style={{ textAlign:'center' }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#FF6B00,#D4A017)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, margin:'0 auto 10px' }}>{s.icon}</div>
              <div style={{ color:'#1a0f07', fontWeight:700, fontSize:13, marginBottom:5 }}>Step {s.step}: {s.title}</div>
              <div style={{ color:'#9a8070', fontSize:12, lineHeight:1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background:'#ffffff', border:'1px solid rgba(212,160,23,0.2)', borderRadius:14, padding:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
        <h3 style={{ color:'#1a0f07', fontFamily:'Cinzel,serif', margin:'0 0 16px', fontSize:17 }}>Frequently Asked Questions</h3>
        {FAQ.map((f, i)=>(
          <div key={i} style={{ borderBottom: i < FAQ.length-1 ? '1px solid rgba(212,160,23,0.15)' : 'none', paddingBottom:12, marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }} onClick={()=>setOpenFaq(openFaq===i?null:i)}>
              <div style={{ color:'#1a0f07', fontWeight:700, fontSize:14 }}>{f.q}</div>
              <div style={{ color:'#D4A017', fontSize:18, fontWeight:700 }}>{openFaq===i?'−':'+'}</div>
            </div>
            {openFaq===i && <div style={{ color:'#4a3728', fontSize:13, lineHeight:1.7, marginTop:8 }}>{f.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
