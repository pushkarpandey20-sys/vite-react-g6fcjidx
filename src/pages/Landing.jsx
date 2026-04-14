import React, { useState, useEffect } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);
  const BG_IMAGES = ['/temple-bg.png', '/temple-bg-2.png', '/temple-bg-3.png'];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const notifications = [
      "🙏 Rahul from Mumbai just booked a Griha Pravesh",
      "✨ Priya from Delhi bought a Navratri Samagri Kit",
      "🔥 Amit from Bangalore booked a Rudrabhishek pooja",
      "🪔 Sneha from Pune booked a Virtual Satyanarayan Katha"
    ];
    let index = 0;
    const interval = setInterval(() => {
      setNotification(notifications[index]);
      index = (index + 1) % notifications.length;
      setTimeout(() => setNotification(null), 5000); // Hide after 5 seconds
    }, 12000); // Show next notification every 12 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('ds_referral', ref);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const btn = (bg = 'linear-gradient(135deg,#FF6B00,#FF8C35)', extra = {}) => ({
    background: bg, color: '#fff', border: 'none', borderRadius: 28, padding: '12px 28px',
    fontWeight: 800, cursor: 'pointer', fontSize: 14, ...extra,
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0d0700', fontFamily: 'Nunito,sans-serif', color: 'rgba(255,248,240,0.85)' }}>
      {/* Sticky Nav */}
      <nav className={`landing-nav ${menuOpen ? 'menu-open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/')}>
          <span style={{ fontSize: 28 }}>🕉️</span>
          <div>
            <div style={{ fontFamily: 'Cinzel,serif', color: '#F0C040', fontWeight: 900, fontSize: 18, lineHeight: 1 }}>BhaktiGo</div>
            <div style={{ color: 'rgba(255,248,240,0.5)', fontSize: 10, letterSpacing: 1.5, fontWeight: 600 }}>BRIDGING YOU TO DIVINE SERVICES</div>
          </div>
        </div>

        <button className="landing-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span />
          <span />
          <span />
        </button>

        <div className="landing-nav-links">
          {[['Find Pandits', '/user/marketplace'], ['Samagri Store', '/user/samagri'], ['Temples', '/user/temples'], ['Muhurta', '/user/muhurta'], ['Roadmap', '/user/roadmap']].map(([l, p]) => (
            <span key={l} onClick={() => { navigate(p); setMenuOpen(false); }} className="nav-link">{l}</span>
          ))}
          <span onClick={() => { navigate('/pandit/dashboard'); setMenuOpen(false); }} style={{ color: '#D4A017', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Pandit Portal ↗</span>
          <span onClick={() => { navigate('/admin/overview'); setMenuOpen(false); }} style={{ color: '#F0C040', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginLeft: '10px' }}>Admin Panel ⚙️</span>
          <button style={btn('linear-gradient(135deg,#FF6B00,#D4A017)', { padding: '8px 22px', fontSize: 13, marginLeft: '10px' })} onClick={() => { navigate('/user/home'); setMenuOpen(false); }}>Enter App →</button>
        </div>
      </nav>

      {/* Hero with Interactive Temple Background Slider */}
      <div style={{ position: 'relative', textAlign:'center', padding:'120px 5% 100px', overflow: 'hidden' }}>
        {/* Stable Background Image Slider */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, backgroundColor: '#0d0700' }}>
          {BG_IMAGES.map((img, idx) => (
            <img 
              key={img}
              src={img} 
              alt="Temple Background"
              style={{ 
                position: 'absolute', top: 0, left: 0, 
                width: '100%', height: '100%', objectFit: 'cover', 
                opacity: bgIndex === idx ? 0.6 : 0,
                transition: 'opacity 2s ease-in-out'
              }}
            />
          ))}
        {/* Safe, warm overlay instead of dark */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(13,7,0,0.25), rgba(13,7,0,0.55), #0d0700)' }}></div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,107,0,0.08)', border: '1.5px solid rgba(255,107,0,0.3)', padding: '10px 24px', borderRadius: 30, marginBottom: 30, fontSize: 13, fontWeight: 900, color: '#FF6B00', letterSpacing: 1.2 }}>
            <span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background:'#27AE60', boxShadow:'0 0 10px rgba(39,174,96,0.3)', animation:'pulse 1.5s infinite' }}></span>
            LIVE: BOOKINGS OPEN FOR NAVRATRI 2026
          </div>
          
          <h1 style={{ fontFamily:'Cinzel,serif', fontSize: 'clamp(42px, 6.5vw, 84px)', fontWeight:900, color: '#F0C040', margin:'0 0 24px', lineHeight: 1.1, letterSpacing: 0.5 }}>
            India's Most Trusted<br />
            <span style={{ background:'linear-gradient(135deg,#FF6B00,#D4A017)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Spiritual Platform</span>
          </h1>
          
          <p style={{ color:'rgba(255,248,240,0.78)', fontSize: 'clamp(18px, 2vw, 24px)', fontFamily:'Crimson Pro,serif', fontStyle:'italic', marginBottom:48, maxWidth: 680, margin: '0 auto 48px', fontWeight: 600, lineHeight: 1.6 }}>
            Experience authentic Vedic rituals at your doorstep. From finding the right Pandit to sacred Pooja Samagri — we arrange everything.
          </p>
          
          <div style={{ display:'flex', justifyContent:'center', gap:24, marginBottom:80, flexWrap:'wrap' }}>
            <button style={{...btn(), padding: '18px 42px', fontSize: 16, boxShadow: '0 10px 35px rgba(255,107,0,0.3)', display:'flex', alignItems:'center', gap:10 }} onClick={()=>navigate('/user/booking')}>
              <span style={{ fontSize: 22 }}>⚡</span> Book a Pandit Now
            </button>
            <button style={{...btn('rgba(255,107,0,0.1)', {border:'2px solid rgba(255,107,0,0.4)', color: '#FF6B00'}), padding: '18px 42px', fontSize: 16 }} onClick={()=>navigate('/user/home')}>
              Explore Services →
            </button>
          </div>
          
          {/* Prominent Stats Banner (Glassmorphism) */}
          <div style={{ display:'flex', justifyContent:'center', gap: 'clamp(20px, 4vw, 60px)', flexWrap:'wrap', background: 'rgba(26,15,7,0.85)', border: '1.5px solid rgba(212,160,23,0.2)', padding: '40px', borderRadius: 28, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            {[
              ['180+','Verified Pandits','🙏'],
              ['80+','Sacred Rituals','🔥'],
              ['10k+','Happy Devotees','✨'],
              ['4.9★','Average Rating','⭐']
            ].map(([v,l,icon])=>(
              <div key={l} style={{ textAlign:'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontFamily:'Cinzel,serif', fontSize:42, fontWeight:900, color:'#FF6B00', lineHeight: 1 }}>{v}</div>
                <div style={{ color:'rgba(255,248,240,0.6)', fontSize:14, fontWeight: 800, letterSpacing: 1.5, marginTop: 8, textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6 Service Tabs */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 5% 80px' }}>
        {/* Tab Bar */}
        <div style={{ display:'flex', gap:6, background:'rgba(26,15,7,0.85)', borderRadius:20, padding:6, marginBottom:32, flexWrap:'wrap', border:'1.5px solid rgba(212,160,23,0.15)' }}>
          {TABS.map((t,i)=>(
            <button key={t} onClick={()=>setActiveTab(i)}
              style={{ flex:1, padding:'12px 20px', borderRadius:16, border:'none', cursor:'pointer', fontWeight:800, fontSize:14, transition:'all 0.24s', minWidth:130,
                background:activeTab===i?'#FF6B00':'transparent',
                color:activeTab===i?'#fff':'rgba(255,248,240,0.6)' }}>
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
        <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', textAlign:'center', marginBottom:48, fontSize:28 }}>How BhaktiGo Works</h2>
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

      {/* Trust & Verification Section */}
      <div style={{ padding:'80px 5%', background:'linear-gradient(to bottom, rgba(13,7,0,1), rgba(255,107,0,0.03), rgba(13,7,0,1))' }}>
        <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', textAlign:'center', marginBottom:12, fontSize:32 }}>Why Devotees Trust BhaktiGo</h2>
        <p style={{ textAlign:'center', color:'rgba(255,248,240,0.6)', marginBottom:48, fontSize:15, maxWidth:600, margin:'0 auto 48px' }}>We don't just connect you; we ensure a pure, uncompromising spiritual experience.</p>
        
        <div style={{ display:'flex', justifyContent:'center', gap:32, flexWrap:'wrap', maxWidth:1100, margin:'0 auto' }}>
          {[
            { icon:'📜', title:'100% Vedic Verification', desc:'Every Pandit undergoes a strict 4-step interview assessing their Vedic knowledge and chanting accuracy.' },
            { icon:'🔒', title:'Transparent Pricing', desc:'No hidden dakshina. You know exactly what you pay before the ritual starts.' },
            { icon:'📦', title:'Pure Samagri Guarantee', desc:'We use only Grade-A authenticated holy materials sourced directly from pilgrim cities.' },
            { icon:'🛡️', title:'Secure Rescheduling', desc:'Change of plans? Easily postpone your pooja with zero penalty up to 24 hours prior.' },
          ].map((t)=>(
            <div key={t.title} style={{ flex:'1 1 200px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(212,160,23,0.15)', borderRadius:16, padding:'30px 24px', textAlign:'center', transition:'transform 0.2s, box-shadow 0.2s', cursor:'default', boxShadow:'0 10px 30px rgba(0,0,0,0.2)' }} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 15px 40px rgba(255,107,0,0.15)';}} onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 10px 30px rgba(0,0,0,0.2)';}}>
              <div style={{ fontSize:40, marginBottom:16 }}>{t.icon}</div>
              <div style={{ fontFamily:'Cinzel,serif', color:'#D4A017', fontSize:18, fontWeight:800, marginBottom:12 }}>{t.title}</div>
              <div style={{ color:'rgba(255,248,240,0.5)', fontSize:13, lineHeight:1.6 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pandit CTA */}
      <div style={{ textAlign:'center', padding:'60px 5%', maxWidth:700, margin:'0 auto' }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🪔</div>
        <h2 style={{ fontFamily:'Cinzel,serif', color:'#D4A017', fontSize:28, marginBottom:12 }}>Are You a Pandit?</h2>
        <p style={{ color:'rgba(255,248,240,0.6)', fontSize:15, marginBottom:28, lineHeight:1.6 }}>
          Join 500+ verified Vedic scholars earning on BhaktiGo. Get bookings, manage your schedule, and grow your sacred practice.
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
          <button style={btn('linear-gradient(135deg,#D4A017,#F0C040)',{color:'#1a0f07'})} onClick={()=>navigate('/pandit/dashboard')}>Join as Pandit →</button>
          <button style={btn('rgba(255,255,255,0.08)',{border:'1px solid rgba(255,255,255,0.2)'})} onClick={()=>navigate('/pandit/dashboard')}>Visit Pandit Portal ↗</button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid rgba(212,160,23,0.1)', padding:'28px 5%', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:24 }}>🕉️</span>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontWeight:700 }}>BhaktiGo</div>
            <div style={{ color:'rgba(255,248,240,0.3)', fontSize:11 }}>India's Spiritual Super-App</div>
          </div>
        </div>
        <div style={{ color:'rgba(255,248,240,0.3)', fontSize:12 }}>© 2025 BhaktiGo · Crafted with 🙏 for Bharat</div>
        <div style={{ display:'flex', gap:16 }}>
          {['Privacy','Terms','Contact'].map(l=>(
            <span key={l} style={{ color:'rgba(255,248,240,0.4)', fontSize:12, cursor:'pointer' }}>{l}</span>
          ))}
          <span onClick={()=>navigate('/user/roadmap')} style={{ color:'rgba(255,248,240,0.4)', fontSize:12, cursor:'pointer' }}>Roadmap</span>
        </div>
      </footer>

      {/* Live Booking Notification Toast */}
      <div className={`live-toast ${notification ? 'show' : ''}`}>
        <div style={{ fontSize: 22, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{notification?.split(' ')[0]}</div>
        <div>
          <div style={{ color: '#4ade80', fontSize: 11, fontWeight: 800, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 1 }}>Verified Booking • Just Now</div>
          <div style={{ color: '#fff8f0', fontSize: 13, fontWeight: 500 }}>{notification?.split(' ').slice(1).join(' ')}</div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Pro:ital,wght@0,400;1,400&family=Nunito:wght@400;500;600;700;800&display=swap');
        @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}

        .live-toast {
          position: fixed;
          bottom: 24px;
          left: 24px;
          background: rgba(13,7,0,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(212,160,23,0.3);
          border-left: 4px solid #4ade80;
          padding: 16px 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
          z-index: 1000;
          transform: translateY(150%);
          opacity: 0;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: 320px;
        }
        
        .live-toast.show {
          transform: translateY(0);
          opacity: 1;
        }

        .landing-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #1a0a00;
          border-bottom: 1.5px solid rgba(255,107,0,0.2);
          padding: 0 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }

        .landing-nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-link {
          color: rgba(255,248,240,0.75);
          font-size: 14px;
          cursor: pointer;
          font-weight: 700;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #FF6B00;
        }

        .landing-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 10px;
        }

        .landing-hamburger span {
          display: block;
          width: 25px;
          height: 2px;
          background: #F0C040;
          transition: 0.3s;
        }

        @media (max-width: 968px) {
          .landing-hamburger {
            display: flex;
          }

          .landing-nav-links {
            position: fixed;
            top: 70px;
            left: 0;
            width: 100%;
            background: #0d0700;
            flex-direction: column;
            padding: 30px;
            gap: 20px;
            transform: translateY(-150%);
            transition: transform 0.3s ease-in-out;
            border-bottom: 2px solid #D4A017;
          }

          .landing-nav.menu-open .landing-nav-links {
            transform: translateY(0);
          }

          .landing-nav.menu-open .landing-hamburger span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
          .landing-nav.menu-open .landing-hamburger span:nth-child(2) { opacity: 0; }
          .landing-nav.menu-open .landing-hamburger span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
        }
      `}</style>

    </div>
  );
}
