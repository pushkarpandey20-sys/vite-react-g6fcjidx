import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppCtx';
import SmartRecommendations from '../../components/SmartRecommendations';
import MuhuratWidget from '../../components/MuhuratWidget';
import notificationStore from '../../services/notificationService';
import { supabase } from '../../services/supabase';

const SERVICES = [
  { icon:'🛕', label:'Book Pandit',   path:'/user/booking',       color:'#FF6B00' },
  { icon:'📦', label:'Buy Samagri',   path:'/user/samagri',       color:'#F0C040' },
  { icon:'📱', label:'Virtual Puja',  path:'/user/virtual-pooja', color:'#9B59B6' },
  { icon:'🏛️', label:'Temples',       path:'/user/temples',       color:'#27AE60' },
  { icon:'❤️', label:'Donate/Seva',   path:'/user/donations',     color:'#E91E8C' },
  { icon:'📅', label:'Muhurta',       path:'/user/muhurta',       color:'#3498DB' },
];

const RITUALS = [
  { name:'Griha Pravesh', icon:'🏠', price:'₹2,100', path:'/user/booking' },
  { name:'Satyanarayan',  icon:'🌟', price:'₹1,500', path:'/user/booking' },
  { name:'Rudrabhishek',  icon:'🔱', price:'₹2,500', path:'/user/booking' },
  { name:'Navgrah Puja',  icon:'⭐', price:'₹1,800', path:'/user/booking' },
  { name:'Vivah',         icon:'💍', price:'₹8,000', path:'/user/booking' },
  { name:'Custom Pooja',  icon:'✨', price:'Custom',  path:'/user/rituals' },
];

const SAMAGRI_HIGHLIGHTS = [
  { name:'Diwali Kit',   icon:'🪔', price:'₹899',  items:'61 items', badge:'BESTSELLER' },
  { name:'Griha Kit',    icon:'🏡', price:'₹599',  items:'52 items', badge:'POPULAR' },
  { name:'Satyanarayan', icon:'🌟', price:'₹299',  items:'24 items', badge:null },
];

const SAMPLE_PANDITS = [
  { id:'1', name:'Pt. Ram Sharma',    city:'Delhi',   specializations:['Satyanarayan','Griha Pravesh'], years_of_experience:15, min_fee:1800, rating:4.9 },
  { id:'2', name:'Pt. Anil Mishra',   city:'Noida',   specializations:['Rudrabhishek','Navgrah'],       years_of_experience:12, min_fee:1500, rating:4.8 },
  { id:'3', name:'Pt. Suresh Tiwari', city:'Gurgaon', specializations:['Vivah','Mundan'],               years_of_experience:20, min_fee:2500, rating:4.7 },
];

function StatChip({ icon, label, value, color }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'12px 8px',
      background:'rgba(255,248,240,0.04)', borderRadius:14, border:'1px solid rgba(240,192,64,0.1)', flex:1 }}>
      <div style={{ fontSize:20 }}>{icon}</div>
      <div style={{ color: color || '#F0C040', fontFamily:'Cinzel,serif', fontWeight:800, fontSize:18 }}>{value}</div>
      <div style={{ color:'rgba(255,248,240,0.45)', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', textAlign:'center' }}>{label}</div>
    </div>
  );
}

const dkCard = { background:'rgba(26,15,7,0.7)', border:'1px solid rgba(240,192,64,0.14)', borderRadius:18, padding:'20px', backdropFilter:'blur(16px)' };

export default function UserHome() {
  const navigate = useNavigate();
  const { devoteeName, devoteeId } = useApp();
  const [pandits, setPandits] = useState(SAMPLE_PANDITS);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    supabase.from('pandits').select('id,name,city,years_of_experience,rating,specializations,min_fee')
      .eq('status','verified').order('rating',{ascending:false}).limit(3)
      .then(({data}) => { if(data?.length) setPandits(data); });
    if(devoteeId) {
      supabase.from('bookings').select('*').eq('devotee_id',devoteeId)
        .order('created_at',{ascending:false}).limit(3)
        .then(({data}) => setBookings(data||[]));
    }
  }, [devoteeId]);

  return (
    <div style={{ color:'rgba(255,248,240,0.88)' }}>

      {/* ── Hero Welcome ── */}
      <div style={{ position:'relative', overflow:'hidden', ...dkCard, padding:'28px 28px 22px', marginBottom:20 }}>
        <div style={{ position:'absolute', top:-60, right:-40, width:280, height:280,
          background:'radial-gradient(ellipse,rgba(255,107,0,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(240,192,64,0.1)',
              border:'1px solid rgba(240,192,64,0.25)', color:'#F0C040', fontSize:10, fontWeight:800,
              letterSpacing:'1.2px', textTransform:'uppercase', padding:'4px 12px', borderRadius:20, marginBottom:10 }}>
              🕉️ DevSetu — Bridging You to the Divine
            </div>
            <h1 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontSize:'clamp(18px,4vw,26px)',
              margin:'0 0 6px', fontWeight:900 }}>
              {devoteeName ? `Namaste, ${devoteeName.split(' ')[0]} 🙏` : 'Namaste, Devotee 🙏'}
            </h1>
            <p style={{ color:'rgba(255,248,240,0.55)', margin:'0 0 18px', fontSize:13, fontFamily:'Nunito,sans-serif' }}>
              Book a certified pandit in under 60 seconds — verified, rated, ready.
            </p>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <button onClick={() => navigate('/user/booking')}
                className="btn btn-primary" style={{ fontSize:14, padding:'11px 24px' }}>
                ⚡ Book Pandit Now
              </button>
              <button onClick={() => navigate('/user/rituals')}
                style={{ background:'rgba(240,192,64,0.1)', color:'#F0C040',
                  border:'1.5px solid rgba(240,192,64,0.3)', borderRadius:20,
                  padding:'11px 22px', fontWeight:700, cursor:'pointer', fontSize:13, fontFamily:'Nunito,sans-serif' }}>
                🕉️ View Rituals
              </button>
            </div>
          </div>
          <div style={{ fontSize:52, lineHeight:1, opacity:0.6 }}>🪔</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginTop:18 }}>
          <StatChip icon="🙏" label="Pandits" value="120+" color="#F0C040" />
          <StatChip icon="🕉️" label="Rituals" value="80+" color="#FF9F40" />
          <StatChip icon="📍" label="Cities" value="20+" color="#4ade80" />
          <StatChip icon="⭐" label="Avg Rating" value="4.9" color="#a78bfa" />
        </div>
      </div>

      {/* ── Service Icons Grid ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10, marginBottom:20 }}>
        {SERVICES.map(({ icon, label, path, color }) => (
          <div key={label} onClick={() => navigate(path)}
            style={{ ...dkCard, padding:'16px 8px', textAlign:'center', cursor:'pointer', transition:'all 0.22s', borderRadius:14 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=color; e.currentTarget.style.background=`${color}18`; e.currentTarget.style.transform='translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(240,192,64,0.14)'; e.currentTarget.style.background='rgba(26,15,7,0.7)'; e.currentTarget.style.transform=''; }}>
            <div style={{ fontSize:26, marginBottom:7 }}>{icon}</div>
            <div style={{ color:'rgba(255,248,240,0.75)', fontSize:11, fontWeight:700 }}>{label}</div>
          </div>
        ))}
      </div>

      <SmartRecommendations bookingHistory={bookings} />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:20 }}>
        <div>

          {/* Most Booked Rituals */}
          <div style={{ ...dkCard, marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontWeight:700, fontSize:16 }}>🕉️ Most Booked Rituals</div>
              <button onClick={() => navigate('/user/rituals')}
                style={{ background:'rgba(240,192,64,0.08)', color:'#F0C040', border:'1px solid rgba(240,192,64,0.2)',
                  borderRadius:16, padding:'5px 14px', fontWeight:700, cursor:'pointer', fontSize:12, fontFamily:'Nunito,sans-serif' }}>
                View All →
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {RITUALS.map(r => (
                <div key={r.name} onClick={() => { notificationStore.recordSearch(r.name); navigate(r.path); }}
                  style={{ background:'rgba(255,248,240,0.03)', border:'1px solid rgba(240,192,64,0.1)',
                    borderRadius:12, padding:'14px 8px', textAlign:'center', cursor:'pointer', transition:'all 0.22s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,107,0,0.35)'; e.currentTarget.style.background='rgba(255,107,0,0.06)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(240,192,64,0.1)'; e.currentTarget.style.background='rgba(255,248,240,0.03)'; e.currentTarget.style.transform=''; }}>
                  <div style={{ fontSize:24, marginBottom:5 }}>{r.icon}</div>
                  <div style={{ color:'rgba(255,248,240,0.85)', fontSize:11, fontWeight:700, marginBottom:3 }}>{r.name}</div>
                  <div style={{ color:'#FF9F40', fontSize:12, fontWeight:800, fontFamily:'Cinzel,serif' }}>from {r.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Samagri Store Preview */}
          <div style={{ ...dkCard, marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontWeight:700, fontSize:16 }}>🛍️ Pooja Samagri Store</div>
              <button onClick={() => navigate('/user/samagri')}
                style={{ background:'rgba(240,192,64,0.08)', color:'#F0C040', border:'1px solid rgba(240,192,64,0.2)',
                  borderRadius:16, padding:'5px 14px', fontWeight:700, cursor:'pointer', fontSize:12, fontFamily:'Nunito,sans-serif' }}>
                Shop All →
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {SAMAGRI_HIGHLIGHTS.map(s => (
                <div key={s.name} onClick={() => navigate('/user/samagri')}
                  style={{ background:'rgba(255,248,240,0.03)', border:'1px solid rgba(240,192,64,0.1)',
                    borderRadius:12, padding:'14px 8px', textAlign:'center', cursor:'pointer',
                    transition:'all 0.22s', position:'relative', overflow:'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,107,0,0.35)'; e.currentTarget.style.background='rgba(255,107,0,0.05)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(240,192,64,0.1)'; e.currentTarget.style.background='rgba(255,248,240,0.03)'; e.currentTarget.style.transform=''; }}>
                  {s.badge && <div style={{ position:'absolute', top:0, right:0, background:'linear-gradient(135deg,#FF6B00,#D4A017)',
                    color:'#fff', fontSize:'8px', fontWeight:800, padding:'2px 7px',
                    borderRadius:'0 12px 0 8px', letterSpacing:'0.5px' }}>{s.badge}</div>}
                  <div style={{ fontSize:24, marginBottom:4 }}>{s.icon}</div>
                  <div style={{ color:'rgba(255,248,240,0.85)', fontSize:11, fontWeight:700, marginBottom:2 }}>{s.name}</div>
                  <div style={{ color:'rgba(255,248,240,0.3)', fontSize:10, marginBottom:4 }}>{s.items}</div>
                  <div style={{ color:'#FF9F40', fontSize:13, fontWeight:800, fontFamily:'Cinzel,serif' }}>{s.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Virtual Pooja Banner */}
          <div style={{ background:'linear-gradient(135deg,rgba(109,40,217,0.65),rgba(75,0,130,0.75))',
            border:'1px solid rgba(167,139,250,0.3)', borderRadius:18, padding:'22px 26px', marginBottom:20,
            display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 }}>
            <div>
              <div style={{ color:'#e9d5ff', fontWeight:800, fontSize:10, letterSpacing:2, marginBottom:5 }}>✨ NEW FEATURE</div>
              <h3 style={{ color:'#fff', fontFamily:'Cinzel,serif', margin:'0 0 5px', fontSize:17 }}>📱 Virtual Pooja</h3>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:13, margin:0 }}>Sacred rituals live. Prasad delivered home.</p>
            </div>
            <button onClick={() => navigate('/user/virtual-pooja')}
              style={{ background:'rgba(255,255,255,0.15)', color:'#fff',
                border:'1px solid rgba(255,255,255,0.35)', borderRadius:20,
                padding:'10px 20px', fontWeight:800, cursor:'pointer', fontSize:13, flexShrink:0 }}>
              Book Virtual →
            </button>
          </div>

          {/* Top Pandits */}
          <div style={dkCard}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontWeight:700, fontSize:16 }}>🙏 Verified Scholars</div>
              <button onClick={() => navigate('/user/marketplace')}
                style={{ background:'rgba(240,192,64,0.08)', color:'#F0C040', border:'1px solid rgba(240,192,64,0.2)',
                  borderRadius:16, padding:'5px 14px', fontWeight:700, cursor:'pointer', fontSize:12 }}>
                All Pandits →
              </button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {pandits.map(p => (
                <div key={p.id} onClick={() => navigate('/user/marketplace')}
                  style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                    background:'rgba(255,248,240,0.03)', borderRadius:12, padding:'12px 14px',
                    cursor:'pointer', border:'1px solid rgba(240,192,64,0.1)', transition:'all 0.22s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(240,192,64,0.3)'; e.currentTarget.style.background='rgba(240,192,64,0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(240,192,64,0.1)'; e.currentTarget.style.background='rgba(255,248,240,0.03)'; }}>
                  <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <div style={{ width:42, height:42, borderRadius:'50%',
                      background:'linear-gradient(135deg,rgba(255,107,0,0.15),rgba(240,192,64,0.15))',
                      border:'1.5px solid rgba(240,192,64,0.2)',
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🙏</div>
                    <div>
                      <div style={{ color:'rgba(255,248,240,0.92)', fontWeight:700, fontSize:14, fontFamily:'Cinzel,serif' }}>{p.name}</div>
                      <div style={{ color:'rgba(255,248,240,0.38)', fontSize:11, marginTop:2 }}>
                        {(p.specializations||[]).slice(0,2).join(' · ')} · {p.city}
                      </div>
                      <div style={{ color:'rgba(255,248,240,0.3)', fontSize:10, marginTop:1 }}>
                        {p.years_of_experience} yrs · ⭐ {p.rating||'New'}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ color:'#FF9F40', fontWeight:800, fontFamily:'Cinzel,serif' }}>₹{(p.min_fee||1500).toLocaleString()}</div>
                    <button onClick={e => { e.stopPropagation(); navigate('/user/booking'); }}
                      style={{ background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff',
                        border:'none', borderRadius:10, padding:'5px 14px', fontWeight:700,
                        cursor:'pointer', fontSize:11, marginTop:5 }}>Book</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column */}
        <div>
          <div style={{ marginBottom:16 }}>
            <MuhuratWidget />
          </div>

          {/* My Bookings */}
          <div style={{ ...dkCard, marginBottom:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontWeight:700, fontSize:14 }}>📋 My Bookings</div>
              <button onClick={() => navigate('/user/history')}
                style={{ background:'rgba(240,192,64,0.08)', color:'#F0C040', border:'1px solid rgba(240,192,64,0.2)',
                  borderRadius:14, padding:'4px 12px', fontWeight:700, cursor:'pointer', fontSize:11 }}>All →</button>
            </div>
            {!devoteeId ? (
              <div style={{ textAlign:'center', padding:'16px 0' }}>
                <div style={{ color:'rgba(255,248,240,0.4)', fontSize:13, marginBottom:10 }}>Login to see your bookings</div>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/user/booking')}>Book Now</button>
              </div>
            ) : bookings.length === 0 ? (
              <div style={{ textAlign:'center', padding:'16px 0' }}>
                <div style={{ fontSize:28, marginBottom:8 }}>🙏</div>
                <div style={{ color:'rgba(255,248,240,0.4)', fontSize:13, marginBottom:10 }}>No rituals yet</div>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/user/booking')}>Book First Ritual</button>
              </div>
            ) : bookings.map(b => (
              <div key={b.id} style={{ background:'rgba(255,248,240,0.03)', borderRadius:10, padding:'10px 12px',
                marginBottom:8, border:'1px solid rgba(240,192,64,0.08)' }}>
                <div style={{ color:'rgba(255,248,240,0.85)', fontWeight:700, fontSize:13 }}>{b.ritual_name||'Pooja'}</div>
                <div style={{ color:'rgba(255,248,240,0.35)', fontSize:11, marginTop:2 }}>
                  {b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : 'TBD'}
                  {' · '}₹{(b.total_amount||0).toLocaleString()}
                </div>
                <div style={{ fontSize:11, color:b.status==='confirmed'?'#4ade80':'#FF9F40',
                  marginTop:2, fontWeight:700, textTransform:'capitalize' }}>{b.status||'pending'}</div>
              </div>
            ))}
          </div>

          {/* Seva */}
          <div style={{ background:'linear-gradient(135deg,rgba(233,30,140,0.1),rgba(255,107,0,0.07))',
            border:'1px solid rgba(233,30,140,0.2)', borderRadius:18, padding:'20px', textAlign:'center' }}>
            <div style={{ fontSize:28, marginBottom:8 }}>❤️</div>
            <div style={{ color:'#F0C040', fontFamily:'Cinzel,serif', fontWeight:700, fontSize:14, marginBottom:6 }}>Seva & Donations</div>
            <div style={{ color:'rgba(255,248,240,0.4)', fontSize:12, marginBottom:14 }}>Support temples & sacred traditions</div>
            <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}
              onClick={() => navigate('/user/donations')}>Donate Now ❤️</button>
          </div>
        </div>
      </div>
    </div>
  );
}
