import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RITUAL_CARDS = [
  { name:'Griha Pravesh', icon:'🏠', price:'₹2,100', desc:'Purify and bless your new home with Vedic rituals' },
  { name:'Satyanarayan Katha', icon:'🌟', price:'₹1,500', desc:'Lord Vishnu pooja for prosperity and fulfillment' },
  { name:'Rudrabhishek', icon:'🔱', price:'₹2,500', desc:'Sacred Shiva abhishek for health and blessings' },
  { name:'Navgrah Shanti', icon:'⭐', price:'₹1,800', desc:'Nine planet ritual to remove doshas' },
  { name:'Vivah Pooja', icon:'💍', price:'₹8,000', desc:'Complete Vedic wedding ceremony' },
  { name:'Mundan Ceremony', icon:'✂️', price:'₹1,200', desc:'Sacred first haircut ritual for children' },
  { name:'Kaal Sarp Dosh', icon:'🐍', price:'₹3,500', desc:'Powerful remedy for Kaal Sarp dosha' },
  { name:'Custom Pooja', icon:'✨', price:'Custom', desc:'Any ritual, any time — we arrange everything' },
];

const SAMAGRI_KITS = [
  { name:'Diwali Mega Kit', icon:'🪔', price:'₹899', items:'61 items', badge:'BESTSELLER' },
  { name:'Ganesh Chaturthi', icon:'🐘', price:'₹349', items:'29 items', badge:null },
  { name:'Griha Pravesh Kit', icon:'🏡', price:'₹599', items:'52 items', badge:'NEW' },
  { name:'Navratri Kit', icon:'🌺', price:'₹449', items:'38 items', badge:null },
];

const VIRTUAL_POOJAS = [
  { name:'Satyanarayan Katha', icon:'🌟', price:501, schedule:'Every Sunday 8 AM', popular:true },
  { name:'Rudrabhishek', icon:'🔱', price:751, schedule:'Every Monday 6 AM', popular:false },
  { name:'Navgrah Shanti', icon:'⭐', price:1100, schedule:'Every Monday 7 AM', popular:false },
  { name:'Laxmi Pooja', icon:'🪷', price:501, schedule:'Every Friday 7 AM', popular:false },
];

const DONATE_CATEGORIES = [
  { name:'Temple Restoration', icon:'🛕', amounts:[101,501,1001] },
  { name:'Pandit Welfare', icon:'🙏', amounts:[51,251,501] },
  { name:'Anna Daan', icon:'🍚', amounts:[101,501,2001] },
  { name:'Gau Seva', icon:'🐄', amounts:[251,501,1001] },
  { name:'Veda Pathshala', icon:'📚', amounts:[501,1001,5001] },
  { name:'Divyang Seva', icon:'❤️', amounts:[101,501,1001] },
];

const TEMPLES = [
  { name:'Kashi Vishwanath', city:'Varanasi', icon:'🛕', live:false },
  { name:'Mahakaleshwar', city:'Ujjain', icon:'🔱', live:true },
  { name:'Vrindavan Dham', city:'Mathura', icon:'🪷', live:false },
];

const BUNDLES = [
  { name:'Griha Pravesh Complete', icon:'🏠', price:'₹4,999', includes:'Pandit + Samagri Kit + Muhurta', popular:true },
  { name:'Navratri Package', icon:'🌺', price:'₹7,500', includes:'9-day Durga Pooja + Daily Aarti', popular:false },
  { name:'Wedding Rituals', icon:'💍', price:'₹18,000', includes:'Full ceremony + all rituals', popular:false },
  { name:'Monthly Pooja Plan', icon:'📅', price:'₹1,999/mo', includes:'4 Poojas/month + Muhurta alerts', popular:false },
];

const TABS = ['Book Pandit','Buy Samagri','Virtual Pooja','Donate/Seva','Temples','Bundles'];

export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const btn = (bg='linear-gradient(135deg,#FF6B00,#FF8C35)', extra={}) => ({
    background:bg, color:'#fff', border:'none', borderRadius:28, padding:'12px 28px',
    fontWeight:800, cursor:'pointer', fontSize:14, ...extra,
  });

  return (
    <div style={{ minHeight:'100vh', background:'radial-gradient(ellipse at top,#2c1a0e 0%,#0d0700 60%)', fontFamily:'Nunito,sans-serif', color:'#fff8f0' }}>
      {/* Sticky Nav */}
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(13,7,0,0.92)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(212,160,23,0.15)', padding:'0 5%', display:'flex', alignItems:'center', gap:24, height:60 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', flexShrink:0 }} onClick={()=>navigate('/')}>
          <span style={{ fontSize:26 }}>🕉️</span>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontWeight:900, fontSize:16, lineHeight:1 }}>DevSetu</div>
            <div style={{ color:'rgba(255,248,240,0.4)', fontSize:9, letterSpacing:1 }}>VEDIC ECOSYSTEM</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:20, marginLeft:20, flex:1 }}>
          {[['Find Pandits','/user/marketplace'],['Samagri Store','/user/samagri'],['Temples','/user/temples'],['Muhurta','/user/muhurta']].map(([l,p])=>(
            <span key={l} onClick={()=>navigate(p)} style={{ color:'rgba(255,248,240,0.6)', fontSize:13, cursor:'pointer', fontWeight:600, transition:'color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.color='#F0C040'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(255,248,240,0.6)'}>{l}</span>
          ))}
        </div>
        <a href="https://pandit.devsetu.app" target="_blank" rel="noreferrer" style={{ color:'#D4A017', fontSize:13, fontWeight:700, textDecoration:'none' }}>Pandit Portal ↗</a>
        <button style={btn('linear-gradient(135deg,#FF6B00,#D4A017)',{padding:'8px 22px',fontSize:13})} onClick={()=>navigate('/user/home')}>Enter App →</button>
      </nav>

      {/* Hero */}
      <div style={{ textAlign:'center', padding:'80px 5% 60px', maxWidth:900, margin:'0 auto' }}>
        <div style={{ fontSize:72, marginBottom:20, display:'inline-block', animation:'float 4s ease-in-out infinite' }}>🕉️</div>
        <h1 style={{ fontFamily:'Cinzel,serif', fontSize:52, fontWeight:900, background:'linear-gradient(135deg,#FF6B00,#F0C040,#FF6B00)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', margin:'0 0 12px', letterSpacing:2 }}>
          India's Spiritual Super-App
        </h1>
        <p style={{ color:'rgba(255,248,240,0.6)', fontSize:18, fontFamily:'Crimson Pro,serif', fontStyle:'italic', marginBottom:36 }}>
          Book verified pandits, buy pooja samagri, attend virtual rituals — all in one sacred platform
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:16, marginBottom:48, flexWrap:'wrap' }}>
          <button style={btn()} onClick={()=>navigate('/user/booking')}>⚡ Book a Pandit Now</button>
          <button style={btn('rgba(255,255,255,0.08)',{border:'1px solid rgba(255,255,255,0.2)'})} onClick={()=>navigate('/user/home')}>Explore DevSetu →</button>
        </div>
        {/* Stats */}
        <div style={{ display:'flex', justifyContent:'center', gap:40, flexWrap:'wrap' }}>
          {[['500+','Verified Pandits'],['10,000+','Happy Devotees'],['100+','Sacred Rituals'],['4.9★','Average Rating']].map(([v,l])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:28, fontWeight:900, color:'#F0C040' }}>{v}</div>
              <div style={{ color:'rgba(255,248,240,0.5)', fontSize:12 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Service Tabs */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 5% 80px' }}>
        {/* Tab Bar */}
        <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.04)', borderRadius:16, padding:6, marginBottom:32, flexWrap:'wrap' }}>
          {TABS.map((t,i)=>(
            <button key={t} onClick={()=>setActiveTab(i)}
              style={{ flex:1, padding:'10px 16px', borderRadius:12, border:'none', cursor:'pointer', fontWeight:700, fontSize:13, transition:'all 0.2s', minWidth:120,
                background:activeTab===i?'linear-gradient(135deg,#FF6B00,#D4A017)':'transparent',
                color:activeTab===i?'#fff':'rgba(255,248,240,0.5)' }}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab: Book Pandit */}
        {activeTab===0 && (
          <div>
            <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', marginBottom:24, textAlign:'center' }}>🕉️ Sacred Rituals & Ceremonies</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
              {RITUAL_CARDS.map(r=>(
                <div key={r.name} onClick={()=>navigate('/user/booking')}
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,160,23,0.12)', borderRadius:14, padding:'20px', cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(255,107,0,0.5)'; e.currentTarget.style.transform='translateY(-4px)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(212,160,23,0.12)'; e.currentTarget.style.transform='translateY(0)'; }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>{r.icon}</div>
                  <div style={{ color:'#F0C040', fontWeight:700, fontSize:15, marginBottom:6 }}>{r.name}</div>
                  <div style={{ color:'rgba(255,248,240,0.5)', fontSize:12, lineHeight:1.5, marginBottom:12 }}>{r.desc}</div>
                  <div style={{ color:'#FF6B00', fontWeight:800, fontSize:16 }}>from {r.price}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:28 }}>
              <button style={btn()} onClick={()=>navigate('/user/booking')}>View All Rituals & Book →</button>
            </div>
          </div>
        )}

        {/* Tab: Buy Samagri */}
        {activeTab===1 && (
          <div>
            <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', marginBottom:24, textAlign:'center' }}>🛍️ Pooja Samagri Kits</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
              {SAMAGRI_KITS.map(s=>(
                <div key={s.name} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,160,23,0.15)', borderRadius:14, padding:'24px', position:'relative', cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,107,0,0.5)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(212,160,23,0.15)'}>
                  {s.badge && <div style={{ position:'absolute', top:-1, right:16, background:s.badge==='BESTSELLER'?'linear-gradient(135deg,#FF6B00,#F0C040)':'rgba(34,197,94,0.8)', color:'#fff', fontSize:10, fontWeight:800, padding:'4px 12px', borderRadius:'0 0 8px 8px' }}>{s.badge}</div>}
                  <div style={{ fontSize:52, marginBottom:16 }}>{s.icon}</div>
                  <div style={{ color:'#F0C040', fontWeight:700, fontSize:17, marginBottom:4 }}>{s.name}</div>
                  <div style={{ color:'rgba(255,248,240,0.4)', fontSize:12, marginBottom:16 }}>{s.items}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ color:'#FF6B00', fontWeight:800, fontSize:20 }}>{s.price}</div>
                    <button style={btn('rgba(255,107,0,0.2)',{color:'#FF6B00',border:'1px solid rgba(255,107,0,0.4)',padding:'8px 18px',fontSize:13})} onClick={()=>navigate('/user/samagri')}>Add to Basket</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:28 }}>
              <button style={btn()} onClick={()=>navigate('/user/samagri')}>Shop All Samagri →</button>
            </div>
          </div>
        )}

        {/* Tab: Virtual Pooja */}
        {activeTab===2 && (
          <div>
            <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', marginBottom:8, textAlign:'center' }}>📱 Virtual Pooja</h2>
            <p style={{ textAlign:'center', color:'rgba(255,248,240,0.5)', marginBottom:28, fontSize:14 }}>Verified pandits perform on your behalf. Watch live, receive prasad at home.</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16 }}>
              {VIRTUAL_POOJAS.map(v=>(
                <div key={v.name} onClick={()=>navigate('/user/virtual-pooja')}
                  style={{ background:'rgba(138,43,226,0.1)', border:`1px solid ${v.popular?'rgba(255,107,0,0.5)':'rgba(138,43,226,0.3)'}`, borderRadius:14, padding:'20px', cursor:'pointer', position:'relative', transition:'all 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                  {v.popular && <div style={{ position:'absolute', top:-1, right:16, background:'linear-gradient(135deg,#FF6B00,#F0C040)', color:'#fff', fontSize:10, fontWeight:800, padding:'4px 12px', borderRadius:'0 0 8px 8px' }}>MOST POPULAR</div>}
                  <div style={{ fontSize:40, marginBottom:12 }}>{v.icon}</div>
                  <div style={{ color:'#F0C040', fontWeight:700, fontSize:15, marginBottom:4 }}>{v.name}</div>
                  <div style={{ color:'rgba(255,248,240,0.4)', fontSize:12, marginBottom:12 }}>📅 {v.schedule}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ color:'#FF6B00', fontWeight:800, fontSize:18 }}>₹{v.price}</div>
                    <span style={{ background:'rgba(138,43,226,0.6)', color:'#fff', fontSize:11, padding:'5px 14px', borderRadius:20, fontWeight:700 }}>Book Virtual</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:28 }}>
              <button style={btn('rgba(138,43,226,0.8)')} onClick={()=>navigate('/user/virtual-pooja')}>All Virtual Poojas →</button>
            </div>
          </div>
        )}

        {/* Tab: Donate/Seva */}
        {activeTab===3 && (
          <div>
            <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', marginBottom:8, textAlign:'center' }}>❤️ Seva & Donations</h2>
            <p style={{ textAlign:'center', color:'rgba(255,248,240,0.5)', marginBottom:28, fontSize:14 }}>Support sacred traditions and earn divine blessings</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
              {DONATE_CATEGORIES.map(d=>(
                <div key={d.name} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,160,23,0.12)', borderRadius:14, padding:'20px' }}>
                  <div style={{ fontSize:32, marginBottom:10 }}>{d.icon}</div>
                  <div style={{ color:'#F0C040', fontWeight:700, fontSize:15, marginBottom:12 }}>{d.name}</div>
                  <div style={{ display:'flex', gap:8 }}>
                    {d.amounts.map(a=>(
                      <button key={a} onClick={()=>navigate('/user/donations')}
                        style={{ flex:1, background:'rgba(255,107,0,0.15)', color:'#FF6B00', border:'1px solid rgba(255,107,0,0.3)', borderRadius:8, padding:'8px', cursor:'pointer', fontSize:13, fontWeight:700 }}>₹{a}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:28 }}>
              <button style={btn()} onClick={()=>navigate('/user/donations')}>Donate Now →</button>
            </div>
          </div>
        )}

        {/* Tab: Temples */}
        {activeTab===4 && (
          <div>
            <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', marginBottom:8, textAlign:'center' }}>🛕 Sacred Temple Network</h2>
            <p style={{ textAlign:'center', color:'rgba(255,248,240,0.5)', marginBottom:28, fontSize:14 }}>Connect with divine energies at sacred temples across Bharat</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
              {TEMPLES.map(t=>(
                <div key={t.name} onClick={()=>navigate('/user/temples')}
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,160,23,0.15)', borderRadius:14, padding:'28px', cursor:'pointer', textAlign:'center', position:'relative', transition:'all 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,107,0,0.5)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(212,160,23,0.15)'}>
                  {t.live && <div style={{ position:'absolute', top:16, right:16, background:'#ef4444', color:'#fff', fontSize:10, fontWeight:800, padding:'3px 10px', borderRadius:20, display:'flex', alignItems:'center', gap:4 }}><div style={{ width:6, height:6, borderRadius:'50%', background:'#fff', animation:'pulse 1s infinite' }}/> LIVE</div>}
                  <div style={{ fontSize:52, marginBottom:12 }}>{t.icon}</div>
                  <div style={{ color:'#F0C040', fontFamily:'Cinzel,serif', fontWeight:700, fontSize:18, marginBottom:4 }}>{t.name}</div>
                  <div style={{ color:'rgba(255,248,240,0.5)', fontSize:13, marginBottom:16 }}>📍 {t.city}</div>
                  <button style={btn('rgba(255,107,0,0.15)',{color:'#FF6B00',border:'1px solid rgba(255,107,0,0.3)',padding:'8px 20px',fontSize:12})}>Book Temple Pooja</button>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:28 }}>
              <button style={btn()} onClick={()=>navigate('/user/temples')}>All Temples →</button>
            </div>
          </div>
        )}

        {/* Tab: Bundles */}
        {activeTab===5 && (
          <div>
            <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', marginBottom:8, textAlign:'center' }}>📦 Sacred Bundles</h2>
            <p style={{ textAlign:'center', color:'rgba(255,248,240,0.5)', marginBottom:28, fontSize:14 }}>Everything you need — pandit + samagri + muhurta in one package</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
              {BUNDLES.map(b=>(
                <div key={b.name} style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${b.popular?'rgba(255,107,0,0.5)':'rgba(212,160,23,0.15)'}`, borderRadius:14, padding:'24px', position:'relative', cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                  {b.popular && <div style={{ position:'absolute', top:-1, right:16, background:'linear-gradient(135deg,#FF6B00,#F0C040)', color:'#fff', fontSize:10, fontWeight:800, padding:'4px 12px', borderRadius:'0 0 8px 8px' }}>MOST POPULAR</div>}
                  <div style={{ fontSize:44, marginBottom:12 }}>{b.icon}</div>
                  <div style={{ color:'#F0C040', fontFamily:'Cinzel,serif', fontWeight:700, fontSize:16, marginBottom:6 }}>{b.name}</div>
                  <div style={{ color:'rgba(255,248,240,0.5)', fontSize:12, marginBottom:12 }}>{b.includes}</div>
                  <div style={{ color:'#FF6B00', fontWeight:800, fontSize:20, marginBottom:16 }}>{b.price}</div>
                  <button style={btn(b.popular?undefined:'rgba(255,255,255,0.08)',{width:'100%',padding:'12px',fontSize:14})} onClick={()=>navigate('/user/booking')}>Get Bundle →</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(212,160,23,0.1)', borderBottom:'1px solid rgba(212,160,23,0.1)', padding:'60px 5%' }}>
        <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', textAlign:'center', marginBottom:48, fontSize:28 }}>How DevSetu Works</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:32, maxWidth:900, margin:'0 auto' }}>
          {[
            { step:1, icon:'🔍', title:'Choose Ritual', desc:'Browse 100+ Vedic rituals or let us recommend based on muhurat' },
            { step:2, icon:'📍', title:'Share Details', desc:'Enter your address, preferred date, and any special requests' },
            { step:3, icon:'💳', title:'Secure Payment', desc:'Pay online with UPI, card, or wallet. 100% secure.' },
            { step:4, icon:'🙏', title:'Sacred Done!', desc:'Verified pandit arrives on time. Rate and review after.' },
          ].map(s=>(
            <div key={s.step} style={{ textAlign:'center' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#FF6B00,#D4A017)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, margin:'0 auto 16px' }}>{s.icon}</div>
              <div style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontWeight:700, fontSize:15, marginBottom:8 }}>Step {s.step}: {s.title}</div>
              <div style={{ color:'rgba(255,248,240,0.5)', fontSize:13, lineHeight:1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pandit CTA */}
      <div style={{ textAlign:'center', padding:'60px 5%', maxWidth:700, margin:'0 auto' }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🪔</div>
        <h2 style={{ fontFamily:'Cinzel,serif', color:'#D4A017', fontSize:28, marginBottom:12 }}>Are You a Pandit?</h2>
        <p style={{ color:'rgba(255,248,240,0.6)', fontSize:15, marginBottom:28, lineHeight:1.6 }}>
          Join 500+ verified Vedic scholars earning on DevSetu. Get bookings, manage your schedule, and grow your sacred practice.
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
          <button style={btn('linear-gradient(135deg,#D4A017,#F0C040)',{color:'#1a0f07'})} onClick={()=>navigate('/pandit/dashboard')}>Join as Pandit →</button>
          <a href="https://pandit.devsetu.app" target="_blank" rel="noreferrer" style={{ ...btn('rgba(255,255,255,0.08)',{border:'1px solid rgba(255,255,255,0.2)',textDecoration:'none',display:'inline-block'}) }}>Visit Pandit Portal ↗</a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid rgba(212,160,23,0.1)', padding:'28px 5%', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:24 }}>🕉️</span>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontWeight:700 }}>DevSetu</div>
            <div style={{ color:'rgba(255,248,240,0.3)', fontSize:11 }}>India's Spiritual Super-App</div>
          </div>
        </div>
        <div style={{ color:'rgba(255,248,240,0.3)', fontSize:12 }}>© 2025 DevSetu · Crafted with 🙏 for Bharat</div>
        <div style={{ display:'flex', gap:16 }}>
          {['Privacy','Terms','Contact'].map(l=>(
            <span key={l} style={{ color:'rgba(255,248,240,0.4)', fontSize:12, cursor:'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Pro:ital,wght@0,400;1,400&family=Nunito:wght@400;600;700;800&display=swap');
        @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
      `}</style>
    </div>
  );
}
