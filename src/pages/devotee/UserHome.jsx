import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppCtx';
import MuhuratWidget from '../../components/MuhuratWidget';
import notificationStore from '../../services/notificationService';
import { supabase } from '../../services/supabase';
import RitualTimeline from '../../components/RitualTimeline';
import SmartRecommendations from '../../components/SmartRecommendations';

/* ── Static data ──────────────────────────────────────────── */
const SERVICES = [
  { icon:'🛕', label:'Book Pandit',  path:'/user/booking',       color:'#FF6B00' },
  { icon:'📦', label:'Buy Samagri',  path:'/user/samagri',       color:'#F0C040' },
  { icon:'📱', label:'Virtual Puja', path:'/user/virtual-pooja', color:'#9B59B6' },
  { icon:'🏛️', label:'Temples',      path:'/user/temples',       color:'#27AE60' },
  { icon:'❤️', label:'Donate',       path:'/user/donations',     color:'#E91E8C' },
  { icon:'📅', label:'Muhurta',      path:'/user/muhurta',       color:'#3498DB' },
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
const dk = { background:'rgba(255,248,240,0.04)', border:'1px solid rgba(240,192,64,0.12)', borderRadius:14 };

/* ── Horizontal scroll container ─────────────────────────── */
const hscroll = {
  display:'flex', overflowX:'auto', gap:10,
  paddingBottom:6, WebkitOverflowScrolling:'touch',
  scrollbarWidth:'none', msOverflowStyle:'none',
};

/* ── Section wrapper ──────────────────────────────────────── */
function Section({ title, onViewAll, viewLabel, children, style }) {
  return (
    <div style={{ background:'rgba(26,15,7,0.7)', border:'1px solid rgba(240,192,64,0.14)',
      borderRadius:18, padding:'16px 16px 12px', backdropFilter:'blur(16px)', ...style }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontWeight:700, fontSize:15 }}>{title}</div>
        {onViewAll && (
          <button onClick={onViewAll}
            style={{ background:'rgba(240,192,64,0.08)', color:'#F0C040', border:'1px solid rgba(240,192,64,0.2)',
              borderRadius:16, padding:'4px 12px', fontWeight:700, cursor:'pointer', fontSize:11, fontFamily:'Nunito,sans-serif', flexShrink:0 }}>
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
    <div style={{ color:'rgba(255,248,240,0.88)', display:'flex', flexDirection:'column', gap:14 }}>

      {/* ── Hero ──────────────────────────────────────────── */}
      <div style={{ background:'rgba(26,15,7,0.75)', border:'1px solid rgba(240,192,64,0.14)',
        borderRadius:18, padding:'18px 16px 16px', backdropFilter:'blur(16px)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-40, width:220, height:220,
          background:'radial-gradient(ellipse,rgba(255,107,0,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(240,192,64,0.1)',
          border:'1px solid rgba(240,192,64,0.25)', color:'#F0C040', fontSize:9, fontWeight:800,
          letterSpacing:'1.2px', textTransform:'uppercase', padding:'3px 10px', borderRadius:20, marginBottom:8 }}>
          🕉️ DevSetu — Bridging You to the Divine
        </div>
        <h1 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontSize:'clamp(17px,4.5vw,24px)',
          margin:'0 0 5px', fontWeight:900 }}>
          {devoteeName ? `Namaste, ${devoteeName.split(' ')[0]} 🙏` : 'Namaste, Devotee 🙏'}
        </h1>
        <p style={{ color:'rgba(255,248,240,0.5)', margin:'0 0 14px', fontSize:12 }}>
          Book a certified pandit in under 60 seconds.
        </p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <button onClick={() => navigate('/user/booking')}
            className="btn btn-primary" style={{ flex:'1 1 140px', justifyContent:'center', fontSize:13 }}>
            ⚡ Book Pandit Now
          </button>
          <button onClick={() => navigate('/user/rituals')}
            style={{ flex:'1 1 120px', background:'rgba(240,192,64,0.1)', color:'#F0C040',
              border:'1.5px solid rgba(240,192,64,0.3)', borderRadius:20,
              padding:'10px 16px', fontWeight:700, cursor:'pointer', fontSize:12, fontFamily:'Nunito,sans-serif' }}>
            🕉️ View Rituals
          </button>
        </div>
        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginTop:14 }}>
          {[['🙏','120+','Pandits'],['🕉️','80+','Rituals'],['📍','20+','Cities'],['⭐','4.9','Avg Rating']].map(([ic,val,lbl]) => (
            <div key={lbl} style={{ ...dk, padding:'10px 4px', textAlign:'center', borderRadius:12 }}>
              <div style={{ fontSize:18 }}>{ic}</div>
              <div style={{ color:'#F0C040', fontFamily:'Cinzel,serif', fontWeight:800, fontSize:16, lineHeight:1.2 }}>{val}</div>
              <div style={{ color:'rgba(255,248,240,0.4)', fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Service icons ─────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
        {SERVICES.map(({ icon, label, path, color }) => (
          <div key={label} onClick={() => navigate(path)}
            style={{ ...dk, borderRadius:14, padding:'14px 8px', textAlign:'center', cursor:'pointer',
              transition:'all 0.2s' }}
            onTouchStart={e => e.currentTarget.style.background='rgba(255,107,0,0.1)'}
            onTouchEnd={e => e.currentTarget.style.background='rgba(255,248,240,0.04)'}>
            <div style={{ fontSize:26, marginBottom:6 }}>{icon}</div>
            <div style={{ color:'rgba(255,248,240,0.75)', fontSize:11, fontWeight:700 }}>{label}</div>
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
                <div style={{ fontSize:26, marginBottom:7 }}>{r.icon}</div>
                <div style={{ color:'rgba(255,248,240,0.88)', fontSize:11, fontWeight:700, marginBottom:4, lineHeight:1.3 }}>{r.name}</div>
                <div style={{ color:'#FF9F40', fontSize:11, fontWeight:800, fontFamily:'Cinzel,serif' }}>from {r.price}</div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign:'center', marginTop:8 }}>
          <span style={{ fontSize:10, color:'rgba(255,248,240,0.3)' }}>← swipe to see more →</span>
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
              <div style={{ fontSize:26, marginBottom:5 }}>{s.icon}</div>
              <div style={{ color:'rgba(255,248,240,0.88)', fontSize:11, fontWeight:700, marginBottom:2 }}>{s.name}</div>
              <div style={{ color:'rgba(255,248,240,0.35)', fontSize:10, marginBottom:5 }}>{s.items}</div>
              <div style={{ color:'#FF9F40', fontSize:13, fontWeight:800, fontFamily:'Cinzel,serif' }}>{s.price}</div>
            </div>
          ))}
          {/* Shop all card */}
          <div onClick={() => navigate('/user/samagri')}
            style={{ ...dk, borderRadius:14, padding:'14px 10px', textAlign:'center',
              cursor:'pointer', flexShrink:0, minWidth:100, maxWidth:110,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
            <div style={{ fontSize:22 }}>🛒</div>
            <div style={{ color:'#F0C040', fontSize:10, fontWeight:700 }}>Shop All</div>
            <div style={{ color:'rgba(255,248,240,0.3)', fontSize:9 }}>40+ items</div>
          </div>
        </div>
      </Section>

      {/* ── Virtual Pooja ─────────────────────────────────── */}
      <div onClick={() => navigate('/user/virtual-pooja')}
        style={{ background:'linear-gradient(135deg,rgba(109,40,217,0.7),rgba(75,0,130,0.8))',
          border:'1px solid rgba(167,139,250,0.35)', borderRadius:18, padding:'16px',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div>
          <div style={{ color:'#e9d5ff', fontWeight:800, fontSize:9, letterSpacing:2, marginBottom:4 }}>✨ NEW FEATURE</div>
          <div style={{ color:'#fff', fontFamily:'Cinzel,serif', fontWeight:700, fontSize:16, marginBottom:3 }}>📱 Virtual Pooja</div>
          <div style={{ color:'rgba(255,255,255,0.65)', fontSize:12 }}>Sacred rituals live · Prasad delivered home</div>
        </div>
        <button style={{ background:'rgba(255,255,255,0.15)', color:'#fff',
          border:'1px solid rgba(255,255,255,0.35)', borderRadius:20,
          padding:'8px 14px', fontWeight:800, cursor:'pointer', fontSize:12, flexShrink:0, whiteSpace:'nowrap' }}>
          Book →
        </button>
      </div>

      {/* ── Verified Pandits ──────────────────────────────── */}
      <Section title="🙏 Verified Scholars" onViewAll={() => navigate('/user/marketplace')} viewLabel="All Pandits →">
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {pandits.slice(0,3).map(p => (
            <div key={p.id} onClick={() => navigate('/user/marketplace')}
              style={{ ...dk, borderRadius:12, padding:'10px 12px',
                cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'all 0.2s' }}>
              <div style={{ display:'flex', gap:10, alignItems:'center', minWidth:0 }}>
                <div style={{ width:38, height:38, borderRadius:'50%',
                  background:'linear-gradient(135deg,rgba(255,107,0,0.15),rgba(240,192,64,0.15))',
                  border:'1.5px solid rgba(240,192,64,0.2)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🙏</div>
                <div style={{ minWidth:0 }}>
                  <div style={{ color:'rgba(255,248,240,0.92)', fontWeight:700, fontSize:13, fontFamily:'Cinzel,serif',
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:160 }}>{p.name}</div>
                  <div style={{ color:'rgba(255,248,240,0.35)', fontSize:10, marginTop:1 }}>
                    📍{p.city} · {p.experience_years||p.years_of_experience}yr · ⭐{p.rating||'New'}
                  </div>
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ color:'#FF9F40', fontWeight:800, fontFamily:'Cinzel,serif', fontSize:12 }}>₹{(p.min_fee||1500).toLocaleString()}</div>
                <button onClick={e => { e.stopPropagation(); navigate('/user/booking'); }}
                  style={{ background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff',
                    border:'none', borderRadius:8, padding:'4px 10px', fontWeight:700,
                    cursor:'pointer', fontSize:10, marginTop:4 }}>Book</button>
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
            <div style={{ color:'rgba(255,248,240,0.4)', fontSize:12, marginBottom:10 }}>No rituals booked yet</div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/user/booking')}>Book First Ritual</button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {bookings.slice(0,3).map(b => (
              <div key={b.id} style={{ ...dk, borderRadius:10, padding:'10px 12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ color:'rgba(255,248,240,0.85)', fontWeight:700, fontSize:13 }}>{b.ritual_name||'Pooja'}</div>
                  <div style={{ fontSize:11, color:b.status==='confirmed'?'#4ade80':'#FF9F40',
                    fontWeight:700, textTransform:'capitalize' }}>{b.status||'pending'}</div>
                </div>
                <div style={{ color:'rgba(255,248,240,0.35)', fontSize:11, marginTop:2 }}>
                  {b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : 'TBD'}
                  {' · '}₹{(b.total_amount||0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Pandit CTA ────────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg,rgba(26,15,7,0.9),rgba(61,31,0,0.6))',
        border:'1px solid rgba(255,107,0,0.25)', borderRadius:18, padding:'16px' }}>
        <div style={{ color:'#F0C040', fontSize:10, fontWeight:800, letterSpacing:2, marginBottom:6 }}>🪔 JOIN OUR PANDIT NETWORK</div>
        <div style={{ color:'#fff', fontFamily:'Cinzel,serif', fontSize:16, fontWeight:700, marginBottom:6 }}>Are You a Verified Pandit?</div>
        <div style={{ color:'rgba(255,248,240,0.7)', fontSize:12, marginBottom:10, lineHeight:1.5 }}>
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
      <div style={{ background:'linear-gradient(135deg,rgba(233,30,140,0.1),rgba(255,107,0,0.07))',
        border:'1px solid rgba(233,30,140,0.2)', borderRadius:16, padding:'16px', textAlign:'center', marginBottom:8 }}>
        <div style={{ fontSize:24, marginBottom:6 }}>❤️</div>
        <div style={{ color:'#F0C040', fontFamily:'Cinzel,serif', fontWeight:700, fontSize:14, marginBottom:4 }}>Seva & Donations</div>
        <div style={{ color:'rgba(255,248,240,0.4)', fontSize:12, marginBottom:12 }}>Support temples & sacred traditions</div>
        <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}
          onClick={() => navigate('/user/donations')}>Donate Now ❤️</button>
      </div>

    </div>
  );
}
