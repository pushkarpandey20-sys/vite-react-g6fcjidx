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

export default function VirtualPoojaPage() {
  const navigate = useNavigate();
  const { setShowLogin, devoteeId } = useApp();
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', date:'', sankalp:'' });

  const btn = (bg='linear-gradient(135deg,#FF6B00,#FF8C35)') => ({ background:bg, color:'#fff', border:'none', borderRadius:20, padding:'10px 22px', fontWeight:700, cursor:'pointer', fontSize:13 });
  const inp = { width:'100%', padding:'10px 14px', borderRadius:8, border:'1px solid rgba(212,160,23,0.3)', background:'rgba(255,255,255,0.05)', color:'#fff8f0', fontSize:14, marginBottom:12, boxSizing:'border-box' };

  const handleBook = (opt) => {
    notificationStore.recordSearch(opt.name);
    if (!devoteeId) { setShowLogin(true); return; }
    setSel(opt);
  };

  if (done) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', textAlign:'center', gap:16 }}>
      <div style={{ fontSize:64 }}>🙏</div>
      <h2 style={{ fontFamily:'Cinzel,serif', color:'#D4A017', fontSize:24 }}>Virtual Pooja Booked!</h2>
      <p style={{ color:'rgba(255,248,240,0.6)', maxWidth:420 }}>Confirmed! Livestream link on WhatsApp 30 min before. Prasad shipped in 3-5 days.</p>
      <div style={{ display:'flex', gap:12 }}>
        <button style={btn()} onClick={()=>navigate('/user/home')}>Back to Home</button>
        <button style={btn('rgba(255,255,255,0.1)')} onClick={()=>navigate('/user/history')}>My Bookings</button>
      </div>
    </div>
  );

  if (sel) return (
    <div>
      <button style={{ ...btn('rgba(255,255,255,0.1)'), marginBottom:20 }} onClick={()=>setSel(null)}>← Back</button>
      <div className="dark-input" style={{ maxWidth:520, margin:'0 auto', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,160,23,0.2)', borderRadius:16, padding:'28px' }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:48 }}>{sel.icon}</div>
          <h2 style={{ fontFamily:'Cinzel,serif', color:'#D4A017', fontSize:20, margin:'8px 0' }}>{sel.name}</h2>
          <div style={{ color:'#FF6B00', fontWeight:800, fontSize:22 }}>₹{sel.price || 'Custom'}</div>
        </div>
        <input style={inp} placeholder="Your full name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
        <input style={inp} placeholder="WhatsApp number (+91...)" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/>
        <input style={inp} type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
        <div style={{ color:'rgba(255,248,240,0.6)', fontSize:11, margin:'4px 0 6px', letterSpacing:1 }}>SANKALP (your wish for this pooja)</div>
        <textarea style={{...inp, height:80, resize:'none'}} placeholder="E.g. For the health and prosperity of my family..." value={form.sankalp} onChange={e=>setForm(f=>({...f,sankalp:e.target.value}))}/>
        <button style={{ ...btn(), width:'100%', padding:'14px', fontSize:15 }} onClick={()=>setDone(true)}>
          Confirm & Pay ₹{sel.price || '—'}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ background:'linear-gradient(135deg,rgba(138,43,226,0.4),rgba(75,0,130,0.5))', border:'1px solid rgba(138,43,226,0.3)', borderRadius:16, padding:'28px', marginBottom:28, textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:12 }}>📱</div>
        <h1 style={{ fontFamily:'Cinzel,serif', color:'#fff', fontSize:28, margin:0, marginBottom:8 }}>Virtual Pooja</h1>
        <p style={{ color:'rgba(255,255,255,0.7)', fontSize:15, maxWidth:600, margin:'0 auto' }}>
          Participate in sacred rituals from anywhere. Verified pandits perform on your behalf with your personal sankalp. Watch live, receive prasad at home.
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:24, marginTop:20, flexWrap:'wrap' }}>
          {[['📺','HD Livestream'],['🙏','Personal Sankalp'],['📦','Prasad Delivered'],['📜','Certificate']].map(([i,l])=>(
            <div key={l} style={{ textAlign:'center' }}><div style={{ fontSize:20 }}>{i}</div><div style={{ color:'rgba(255,255,255,0.6)', fontSize:12 }}>{l}</div></div>
          ))}
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16 }}>
        {OPTS.map(opt=>(
          <div key={opt.id} style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${opt.popular?'rgba(255,107,0,0.5)':'rgba(138,43,226,0.2)'}`, borderRadius:14, padding:'20px', position:'relative' }}>
            {opt.popular && <div style={{ position:'absolute', top:-1, right:16, background:'linear-gradient(135deg,#FF6B00,#F0C040)', color:'#fff', fontSize:10, fontWeight:800, padding:'4px 12px', borderRadius:'0 0 8px 8px', letterSpacing:1 }}>MOST POPULAR</div>}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div style={{ fontSize:36 }}>{opt.icon}</div>
              <div style={{ textAlign:'right' }}>
                {opt.price ? <div style={{ color:'#FF6B00', fontWeight:800, fontSize:20 }}>₹{opt.price}</div> : <div style={{ color:'#D4A017', fontWeight:700 }}>Custom Price</div>}
                <div style={{ color:'rgba(255,248,240,0.4)', fontSize:11 }}>📅 {opt.schedule}</div>
              </div>
            </div>
            <h3 style={{ color:'#F0C040', fontFamily:'Cinzel,serif', margin:'0 0 8px', fontSize:15 }}>{opt.name}</h3>
            <p style={{ color:'rgba(255,248,240,0.6)', fontSize:13, lineHeight:1.5, margin:'0 0 16px' }}>{opt.desc}</p>
            <button style={{ ...btn(opt.popular?'linear-gradient(135deg,#FF6B00,#FF8C35)':'rgba(138,43,226,0.7)'), width:'100%', padding:'12px' }}
              onClick={()=>handleBook(opt)}>
              {opt.price ? `Book for ₹${opt.price}` : 'Enquire & Book'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
