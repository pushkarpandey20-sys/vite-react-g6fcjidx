import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppCtx';
import MuhuratWidget from '../../components/MuhuratWidget';
import notificationStore from '../../services/notificationService';
import { supabase } from '../../services/supabase';
import RitualTimeline from '../../components/RitualTimeline';
import SmartRecommendations from '../../components/SmartRecommendations';
import { PremiumIcon } from '../../components/Icons';

/* ── Static data ──────────────────────────────────────────── */
import { IconBook, IconShoppingBag, IconPhone, IconTemple, IconHeart, IconCalendar, IconTrendingUp, IconMapPin, IconStar, IconOm } from '../../components/icons/Icons';

/* ── Static data ──────────────────────────────────────────── */
const SERVICES = [
  { Icon: IconBook,        label: 'Book Pandit',  path: '/user/booking',      bg: '#FF6B00' },
  { Icon: IconShoppingBag, label: 'Buy Samagri',  path: '/user/samagri',      bg: '#D4A017' },
  { Icon: IconPhone,       label: 'Virtual Puja', path: '/user/virtual-pooja',bg: '#7c3aed' },
  { Icon: IconTemple,      label: 'Temples',      path: '/user/temples',      bg: '#0891b2' },
  { Icon: IconHeart,       label: 'Donate/Seva',  path: '/user/donations',    bg: '#dc2626' },
  { Icon: IconCalendar,    label: 'Muhurta',      path: '/user/muhurta',      bg: '#16a34a' },
];

const RITUALS = [
  { name:'Griha Pravesh', icon:'🏠', price:'₹2,100', numPrice:2100, path:'/user/booking' },
  { name:'Satyanarayan',  icon:'🌟', price:'₹1,500', numPrice:1500, path:'/user/booking' },
  { name:'Rudrabhishek',  icon:'🔱', price:'₹2,500', numPrice:2500, path:'/user/booking' },
  { name:'Navgrah Puja',  icon:'⭐', price:'₹1,800', numPrice:1800, path:'/user/booking' },
  { name:'Vivah',         icon:'💍', price:'₹8,000', numPrice:8000, path:'/user/booking' },
  { name:'Custom Pooja',  icon:'✨', price:'Custom',  numPrice:1500, path:'/user/rituals' },
];

const SAMAGRI_HIGHLIGHTS = [
  { name:'Diwali Kit',    icon:'🪔', price:'₹899', items:'61 items', badge:'BESTSELLER', color:'#FF6B00' },
  { name:'Griha Kit',     icon:'🏡', price:'₹599', items:'52 items', badge:'POPULAR',    color:'#D4A017' },
  { name:'Satyanarayan',  icon:'🌟', price:'₹299', items:'24 items', badge:null,         color:'#9B59B6' },
];

const SAMPLE_PANDITS = [
  { id:'1', name:'Pt. Ram Sharma',    city:'Delhi',   specialization:['Satyanarayan','Griha Pravesh'], experience_years:15, min_fee:1800, rating:4.9 },
  { id:'2', name:'Pt. Anil Mishra',   city:'Noida',   specialization:['Rudrabhishek','Navgrah'],       experience_years:12, min_fee:1500, rating:4.8 },
  { id:'3', name:'Pt. Suresh Tiwari', city:'Gurgaon', specialization:['Vivah','Mundan'],               experience_years:20, min_fee:2500, rating:4.7 },
];

/* ── Shared card styles ───────────────────────────────────── */
const dk = { background:'rgba(26,15,7,0.85)', border:'1px solid rgba(212,160,23,0.18)', borderRadius:14, boxShadow:'0 4px 20px rgba(0,0,0,0.3)' };

/* ── Horizontal scroll container ─────────────────────────── */
const hscroll = {
  display:'flex', overflowX:'auto', gap:10,
  paddingBottom:6, WebkitOverflowScrolling:'touch',
  scrollbarWidth:'none', msOverflowStyle:'none',
};

/* ── Section wrapper ──────────────────────────────────────── */
function Section({ title, onViewAll, viewLabel, children, style }) {
  return (
    <div style={{ background:'rgba(26,15,7,0.85)', border:'1px solid rgba(212,160,23,0.18)',
      borderRadius:18, padding:'16px 16px 12px', boxShadow:'0 4px 20px rgba(0,0,0,0.3)', ...style }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontWeight:900, fontSize:16 }}>{title}</div>
        {onViewAll && (
          <button onClick={onViewAll}
            style={{ background:'rgba(255,107,0,0.06)', color:'#FF6B00', border:'1px solid rgba(255,107,0,0.2)',
              borderRadius:16, padding:'4px 12px', fontWeight:800, cursor:'pointer', fontSize:11, fontFamily:'Nunito,sans-serif', flexShrink:0 }}>
            {viewLabel || 'View All →'}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
export default function UserHome() {
  const navigate = useNavigate();
  const { devoteeName, devoteeId, festivals } = useApp();
  const [pandits, setPandits]   = useState(SAMPLE_PANDITS);
  const [bookings, setBookings] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);
  const BG_IMAGES = ['/temple-bg.png', '/temple-bg-2.png', '/temple-bg-3.png'];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    supabase.from('pandits').select('id,name,city,experience_years,rating,specialization,min_fee')
      .eq('status','verified').order('rating',{ascending:false}).limit(3)
      .then(({data}) => { if (data?.length) setPandits(data); });
    if (devoteeId) {
      supabase.from('bookings')
        .select('id,ritual,ritual_name,ritual_icon,booking_date,booking_time,total_amount,amount,booking_status,status')
        .eq('devotee_id', devoteeId).order('created_at',{ascending:false}).limit(5)
        .then(({data}) => {
          setBookings(data || []);
          setActiveBooking(data?.find(b => b.booking_status !== 'ritual_completed' && b.booking_status !== 'prasad_dispatched'));
        });
    }
  }, [devoteeId]);

  const ritualList = (festivals?.length > 0 ? festivals[0].recommended_rituals : RITUALS.map(r => r.name)).slice(0, 6);

  return (
    <div style={{ color:'rgba(255,248,240,0.9)', display:'flex', flexDirection:'column', gap:14 }}>

      {/* ── Hero ──────────────────────────────────────────── */}
      {/* ── Hero with Dynamic Banner ──────────────────── */}
      <div className="hero-glass" style={{
        position:'relative', overflow:'hidden', borderRadius:24, padding:'40px 20px 24px',
        display:'flex', flexDirection:'column', justifyContent:'flex-end',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        {/* Background Image Slider guarantees full height coverage and no blocked video loads */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, backgroundColor: '#1a0a00' }}>
          {BG_IMAGES.map((img, idx) => (
            <img 
              key={img}
              src={img} 
              alt="Sacred Background"
              style={{ 
                position: 'absolute', top: 0, left: 0, 
                width: '100%', height: '100%', objectFit: 'cover', 
                opacity: bgIndex === idx ? 0.6 : 0,
                transition: 'opacity 1.5s ease-in-out'
              }}
            />
          ))}
          {/* Dark gradient overlay for sacred feel */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(26,10,0,0.3) 0%, rgba(26,10,0,0.85) 80%)' }} />
        </div>

        <div style={{ position:'relative', zIndex:1, paddingTop: 60 }}>
          <div className="banner-glow" style={{
            display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,107,0,0.1)',
            border:'1.5px solid rgba(255,107,0,0.25)', color:'#FF6B00', fontSize:10, fontWeight:900,
            letterSpacing:'1.5px', textTransform:'uppercase', padding:'4px 12px', borderRadius:25, marginBottom:12
          }}>
            <span className="float-anim">✨</span> DEVSETU — BRIDGING YOU TO THE DIVINE
          </div>

          <h1 style={{
            fontFamily:'Cinzel,serif', color:'#F0C040', fontSize:'clamp(22px,6.5vw,34px)',
            margin:'0 0 8px', fontWeight:900, lineHeight:1.1
          }}>
            {devoteeName ? `Namaste, ${devoteeName.split(' ')[0]} 🙏` : 'Namaste, Devotee 🙏'}
          </h1>

          <p style={{ color:'rgba(255,248,240,0.75)', margin:'0 0 20px', fontSize:14, maxWidth:300, lineHeight:1.6, fontWeight:600 }}>
            Ancient Vedic traditions, delivered with <strong style={{ color:'#FF6B00' }}>modern precision</strong>.
          </p>

          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button onClick={() => navigate('/user/booking')}
              className="btn btn-primary" style={{ flex:'1 1 150px', justifyContent:'center', fontSize:14, padding:'12px 20px', borderRadius:30, border:'1px solid rgba(255,255,255,0.2)' }}>
              ⚡ Book Pandit Now
            </button>
            <button onClick={() => navigate('/user/rituals')}
              style={{
                flex:'1 1 120px', background:'rgba(255,107,0,0.1)', color:'#FF6B00',
                border:'1.5px solid rgba(255,107,0,0.3)', borderRadius:30,
                padding:'12px 20px', fontWeight:800, cursor:'pointer', fontSize:13, fontFamily:'Nunito,sans-serif'
              }}>
              🕉️ View Rituals
            </button>
          </div>

          {/* Interactive Stats Row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginTop:24 }}>
            {[
              { Icon:IconTrendingUp, val:'180+', lbl:'Pandits', path:'/user/marketplace', color: '#FF6B00' },
              { Icon:IconOm,         val:'80+',  lbl:'Rituals', path:'/user/rituals',     color: '#D4A017' },
              { Icon:IconMapPin,     val:'50+',  lbl:'Cities',  path:'/user/marketplace', color: '#27AE60' },
              { Icon:IconStar,       val:'4.9',  lbl:'Rating',  path:'/user/history',     color: '#FF6B00' }
            ].map((s) => (
              <div
                key={s.lbl}
                onClick={() => navigate(s.path)}
                className="clickable-stat"
                style={{
                  ...dk, padding:'12px 4px', textAlign:'center', borderRadius:16,
                }}
              >
                <div style={{ marginBottom:4, display: 'flex', justifyContent: 'center' }}><s.Icon size={22} color={s.color} /></div>
                <div style={{ color: s.color, fontFamily:'Cinzel,serif', fontWeight:900, fontSize:18, lineHeight:1 }}>{s.val}</div>
                <div style={{ color:'rgba(255,248,240,0.55)', fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'1px', marginTop:3 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Service icons ─────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
        {SERVICES.map((s) => (
          <div key={s.label} onClick={()=>navigate(s.path)} style={{
            display:'flex', flexDirection:'column', alignItems:'center',
            gap:10, padding:'18px 12px', background:'rgba(26,15,7,0.85)',
            border:'1px solid rgba(212,160,23,0.18)', borderRadius:14,
            cursor:'pointer', transition:'all 0.2s',
            boxShadow:'0 4px 16px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
          onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
            <div style={{
              width:52, height:52, borderRadius:14,
              background:`${s.bg}22`,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <s.Icon size={26} color={s.bg} />
            </div>
            <span style={{ color:'rgba(255,248,240,0.85)', fontWeight:700, fontSize:13, textAlign:'center' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Active booking timeline ────────────────────────── */}
      {activeBooking && <RitualTimeline booking={activeBooking} />}

      {/* ── Smart Recommendations ─────────────────────────── */}
      <SmartRecommendations bookingHistory={bookings} />

      {/* ── Most Booked Rituals ───────────────────────────── */}
      <Section
        title={`🕉️ ${festivals?.length > 0 ? `${festivals[0].festival_name} Rituals` : 'Most Booked Rituals'}`}
        onViewAll={() => navigate('/user/rituals')}>
        <div style={hscroll}>
          {ritualList.map(name => {
            const r = RITUALS.find(x => x.name === name) || { name, icon:'🕉️', price:'₹1,500', numPrice:1500, path:'/user/booking' };
            return (
              <div key={r.name}
                onClick={() => {
                  notificationStore.recordSearch(r.name);
                  navigate(r.path || '/user/booking', {
                    state:{ selectedRitual:{ id:r.name.toLowerCase().replace(/\s+/g,'-'), name:r.name, icon:r.icon, price:r.numPrice||1500 } }
                  });
                }}
                style={{ ...dk, borderRadius:14, padding:'14px 10px', textAlign:'center',
                  cursor:'pointer', transition:'all 0.2s', flexShrink:0,
                  minWidth:120, maxWidth:130, position:'relative' }}>
                {festivals?.length > 0 && (
                  <div style={{ position:'absolute', top:0, right:0, background:'#FF6B00', color:'#fff',
                    fontSize:7, fontWeight:900, padding:'2px 5px', borderRadius:'0 14px 0 8px', letterSpacing:'0.5px' }}>
                    FESTIVAL
                  </div>
                )}
                <div style={{ fontSize:26, marginBottom:7 }}>
                  {r.icon.startsWith('/') ? <PremiumIcon src={r.icon} size={32} /> : r.icon}
                </div>
                <div style={{ color:'rgba(255,248,240,0.9)', fontSize:11, fontWeight:800, marginBottom:4, lineHeight:1.3 }}>{r.name}</div>
                <div style={{ color:'#FF9F40', fontSize:11, fontWeight:800, fontFamily:'Cinzel,serif' }}>from {r.price}</div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign:'center', marginTop:8 }}>
          <span style={{ fontSize:10, color:'rgba(255,248,240,0.4)', opacity:0.8 }}>← swipe to see more →</span>
        </div>
      </Section>

      {/* ── Pooja Samagri Store ───────────────────────────── */}
      <Section title="🛍️ Pooja Samagri Store" onViewAll={() => navigate('/user/samagri')} viewLabel="Shop All →">
        <div style={hscroll}>
          {SAMAGRI_HIGHLIGHTS.map(s => (
            <div key={s.name} onClick={() => navigate('/user/samagri')}
              style={{ ...dk, borderRadius:14, padding:'14px 10px', textAlign:'center',
                cursor:'pointer', transition:'all 0.2s', flexShrink:0,
                minWidth:130, maxWidth:145, position:'relative', overflow:'hidden' }}>
              {s.badge && (
                <div style={{ position:'absolute', top:0, right:0,
                  background:`linear-gradient(135deg,${s.color},${s.color}cc)`,
                  color:'#fff', fontSize:7, fontWeight:800, padding:'2px 7px',
                  borderRadius:'0 14px 0 8px', letterSpacing:'0.5px' }}>{s.badge}</div>
              )}
              <div style={{ fontSize:26, marginBottom:5 }}>
                {s.icon.startsWith('/') ? <PremiumIcon src={s.icon} size={32} /> : s.icon}
              </div>
              <div style={{ color:'rgba(255,248,240,0.9)', fontSize:11, fontWeight:800, marginBottom:2 }}>{s.name}</div>
              <div style={{ color:'rgba(255,248,240,0.55)', fontSize:10, marginBottom:5 }}>{s.items}</div>
              <div style={{ color:'#FF9F40', fontSize:13, fontWeight:800, fontFamily:'Cinzel,serif' }}>{s.price}</div>
            </div>
          ))}
          {/* Shop all card */}
          <div onClick={() => navigate('/user/samagri')}
            style={{ ...dk, borderRadius:14, padding:'14px 10px', textAlign:'center',
              cursor:'pointer', flexShrink:0, minWidth:100, maxWidth:110,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
            <div style={{ fontSize:22 }}>🛒</div>
            <div style={{ color:'#FF6B00', fontSize:10, fontWeight:800 }}>Shop All</div>
            <div style={{ color:'rgba(255,248,240,0.5)', fontSize:9 }}>40+ items</div>
          </div>
        </div>
      </Section>

      {/* ── Virtual Pooja ─────────────────────────────────── */}
      {/* ── Premium Virtual Pooja Feature ────────────────── */}
      <div onClick={() => navigate('/user/virtual-pooja')}
        className="banner-glow vibrant-gradient-2"
        style={{
          borderRadius:24, padding:'20px 24px', position:'relative', overflow:'hidden',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12,
          boxShadow:'0 15px 35px -5px rgba(124,58,237,0.4)', transition:'transform 0.3s ease'
        }}>
        {/* Subtle geometric particles */}
        <div style={{ position:'absolute', top:-20, right:-20, fontSize:100, opacity:0.1, color:'#fff' }}>🕉️</div>

        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{
            background:'rgba(255,255,255,0.2)', color:'#fff', padding:'3px 10px',
            borderRadius:20, fontSize:9, fontWeight:900, marginBottom:8, display:'inline-block',
            letterSpacing:1.5
          }}>
            🚀 FUTURE OF WORSHIP
          </div>
          <div style={{ color:'#fff', fontFamily:'Cinzel,serif', fontWeight:900, fontSize:22, marginBottom:4, display:'flex', alignItems:'center', gap:8 }}>
            📱 Virtual Pooja <span className="float-anim" style={{ fontSize:14 }}>✨</span>
          </div>
          <div style={{ color:'rgba(255,255,255,0.95)', fontSize:13, fontWeight:700 }}>
            Live HD Streaming · Direct Connection · Prasad 🚚
          </div>
        </div>
        <div style={{
          width:50, height:50, borderRadius:'50%', background:'rgba(255,255,255,0.25)',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, color:'#fff',
          border:'2px solid rgba(255,255,255,0.5)', flexShrink:0
        }}>
          ➔
        </div>
      </div>

      {/* ── Verified Pandits ──────────────────────────────── */}
      {/* ── Verified Scholars with Premium Accents ────────── */}
      <Section title="🙏 Vedic Scholars & Acharyas" onViewAll={() => navigate('/user/marketplace')} viewLabel="Meet All Scholars →">
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {pandits.slice(0,3).map((p, idx) => (
            <div key={p.id} onClick={() => navigate('/user/marketplace')}
              style={{
                ...dk, borderRadius:18, padding:'14px 16px',
                background: idx === 0 ? 'rgba(255,107,0,0.06)' : 'rgba(255,248,240,0.04)',
                border: idx === 0 ? '1px solid rgba(255,107,0,0.3)' : '1px solid rgba(240,192,64,0.12)',
                cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'all 0.3s'
              }}>
              <div style={{ display:'flex', gap:14, alignItems:'center', minWidth:0 }}>
                <div style={{
                  width:46, height:46, borderRadius:'50%',
                  background:'linear-gradient(135deg,#FF6B00,#D4A017)',
                  border:'2px solid rgba(255,255,255,0.2)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0,
                  boxShadow:'0 4px 12px rgba(255,107,0,0.2)'
                }}>🙏</div>
                <div style={{ minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ color:'#F0C040', fontWeight:900, fontSize:15, fontFamily:'Cinzel,serif',
                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:140 }}>{p.name}</div>
                    {p.rating >= 4.9 && (
                      <span style={{ background:'#FFD700', color:'#1a0f07', fontSize:8, fontWeight:900, padding:'2px 6px', borderRadius:4, letterSpacing:0.5 }}>PREMIUM</span>
                    )}
                  </div>
                  <div style={{ color:'rgba(255,248,240,0.55)', fontSize:11, marginTop:2, fontWeight:700 }}>
                    📍 {p.city} · {p.experience_years||p.years_of_experience}yr Exp · ⭐ {p.rating||'New'}
                  </div>
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ color:'#FF6B00', fontWeight:900, fontFamily:'Cinzel,serif', fontSize:16 }}>₹{(p.min_fee||1500).toLocaleString()}</div>
                <button onClick={idx === 0 ? e => { e.stopPropagation(); navigate('/user/booking'); } : undefined}
                  style={{
                    background: idx === 0 ? 'linear-gradient(135deg,#FF6B00,#D4A017)' : 'rgba(255,255,255,0.1)',
                    color: idx === 0 ? '#fff' : 'rgba(255,248,240,0.6)',
                    border: idx === 0 ? 'none' : '1px solid rgba(255,255,255,0.2)',
                    borderRadius:10, padding:'6px 14px', fontWeight:800,
                    cursor:'pointer', fontSize:11, marginTop:6
                  }}>
                  {idx === 0 ? '⚡ Book' : 'Details'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Today's Muhurat (compact) ─────────────────────── */}
      <Section title="🕐 Today's Muhurat" onViewAll={() => navigate('/user/muhurta')} viewLabel="Full Panchang →">
        <MuhuratWidget compact={true} />
      </Section>

      {/* ── My Bookings ───────────────────────────────────── */}
      <Section title="📋 My Bookings" onViewAll={() => navigate('/user/history')} viewLabel="All →">
        {!devoteeId ? (
          <div style={{ textAlign:'center', padding:'12px 0' }}>
            <div style={{ color:'rgba(255,248,240,0.4)', fontSize:12, marginBottom:10 }}>Login to see your bookings</div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/user/booking')}>Book Now</button>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign:'center', padding:'12px 0' }}>
            <div style={{ fontSize:24, marginBottom:6 }}>🙏</div>
            <div style={{ color:'rgba(255,248,240,0.5)', fontSize:12, marginBottom:10, fontWeight:700 }}>No rituals booked yet</div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/user/booking')}>Book First Ritual</button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {bookings.slice(0,3).map(b => (
              <div key={b.id} style={{ ...dk, borderRadius:10, padding:'10px 12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ color:'rgba(255,248,240,0.9)', fontWeight:800, fontSize:13 }}>{b.ritual_name||'Pooja'}</div>
                  <div style={{ fontSize:11, color:b.status==='confirmed'?'#27AE60':'#FF6B00',
                    fontWeight:800, textTransform:'capitalize' }}>{b.status||'pending'}</div>
                </div>
                <div style={{ color:'rgba(255,248,240,0.55)', fontSize:11, marginTop:2, fontWeight:600 }}>
                  {b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : 'TBD'}
                  {' · '}₹{(b.total_amount||0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Pandit CTA ────────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg,rgba(61,31,0,0.9),rgba(26,10,0,0.95))',
        border:'1.5px solid rgba(255,107,0,0.25)', borderRadius:18, padding:'20px', boxShadow:'0 6px 25px rgba(0,0,0,0.4)' }}>
        <div style={{ color:'#FF6B00', fontSize:11, fontWeight:900, letterSpacing:1.5, marginBottom:8 }}>🪔 JOIN OUR PANDIT NETWORK</div>
        <div style={{ color:'#F0C040', fontFamily:'Cinzel,serif', fontSize:18, fontWeight:900, marginBottom:8 }}>Are You a Verified Pandit?</div>
        <div style={{ color:'rgba(255,248,240,0.75)', fontSize:13, marginBottom:12, lineHeight:1.6, fontWeight:600 }}>
          Join 500+ pandits earning <strong style={{ color:'#FF6B00' }}>₹30K–₹80K/month</strong> on DevSetu.
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <button onClick={() => navigate('/pandit/onboard')}
            style={{ flex:'1 1 140px', background:'linear-gradient(135deg,#FF6B00,#e55a00)', color:'#fff',
              border:'none', borderRadius:20, padding:'10px 16px', fontWeight:800, cursor:'pointer', fontSize:13 }}>
            ✨ Register as Pandit
          </button>
          <button onClick={() => navigate('/pandit/dashboard')}
            style={{ flex:'1 1 120px', background:'rgba(255,255,255,0.08)', color:'rgba(255,248,240,0.75)',
              border:'1px solid rgba(255,255,255,0.15)', borderRadius:20, padding:'10px 16px',
              fontWeight:700, cursor:'pointer', fontSize:12 }}>
            🔐 Pandit Login
          </button>
        </div>
      </div>

      {/* ── Refer & Earn ──────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(99,102,241,0.08))',
        border:'1px solid rgba(124,58,237,0.25)', borderRadius:16, padding:'16px', textAlign:'center' }}>
        <div style={{ fontSize:24, marginBottom:6 }}>🎁</div>
        <div style={{ color:'#a78bfa', fontWeight:700, fontSize:14, marginBottom:4 }}>Refer & Earn ₹50</div>
        <div style={{ color:'rgba(167,139,250,0.7)', fontSize:12, marginBottom:10 }}>Invite friends · Earn ₹50 per booking</div>
        <div style={{ background:'rgba(255,255,255,0.05)', padding:'7px 12px', borderRadius:8,
          border:'1px dashed rgba(124,58,237,0.3)', display:'flex', justifyContent:'space-between',
          alignItems:'center', marginBottom:10 }}>
          <span style={{ fontFamily:'monospace', fontWeight:800, color:'#F0C040', fontSize:13 }}>
            DEVSETU{devoteeId?.slice(-4).toUpperCase() || 'XXXX'}
          </span>
          <button className="btn btn-ghost btn-sm" style={{ fontSize:10, padding:'2px 8px' }}>Copy</button>
        </div>
        <button onClick={() => navigate('/user/referral')}
          style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'#fff',
            border:'none', borderRadius:20, padding:'8px 20px', fontWeight:700, cursor:'pointer', fontSize:12 }}>
          Share & Earn →
        </button>
      </div>

      {/* ── Seva & Donations ──────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg,rgba(233,30,140,0.08),rgba(255,107,0,0.05))',
        border:'1.5px solid rgba(233,30,140,0.15)', borderRadius:18, padding:'20px', textAlign:'center', marginBottom:8 }}>
        <div style={{ fontSize:28, marginBottom:8 }}>❤️</div>
        <div style={{ color:'#F0C040', fontFamily:'Cinzel,serif', fontWeight:900, fontSize:18, marginBottom:4 }}>Seva & Donations</div>
        <div style={{ color:'rgba(255,248,240,0.65)', fontSize:13, marginBottom:16, fontWeight:600 }}>Support temples & sacred traditions</div>
        <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}
          onClick={() => navigate('/user/donations')}>Donate Now ❤️</button>
      </div>

    </div>
  );
}
