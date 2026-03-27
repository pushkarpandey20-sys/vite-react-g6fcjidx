import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppCtx';
import SmartRecommendations from '../../components/SmartRecommendations';
import MuhuratWidget from '../../components/MuhuratWidget';
import notificationStore from '../../services/notificationService';
import { supabase } from '../../services/supabase';

const SERVICES = [
  { icon:'📿', label:'Book Pandit',  path:'/user/booking' },
  { icon:'🛍️', label:'Buy Samagri', path:'/user/samagri' },
  { icon:'📱', label:'Virtual Puja', path:'/user/virtual-pooja' },
  { icon:'🏛️', label:'Temples',      path:'/user/temples' },
  { icon:'❤️', label:'Donate/Seva',  path:'/user/donations' },
  { icon:'📅', label:'Muhurta',      path:'/user/muhurta' },
];

const RITUALS = [
  { name:'Griha Pravesh', icon:'🏠', price:'₹2,100' },
  { name:'Satyanarayan',  icon:'🌟', price:'₹1,500' },
  { name:'Rudrabhishek',  icon:'🔱', price:'₹2,500' },
  { name:'Navgrah Puja',  icon:'⭐', price:'₹1,800' },
  { name:'Vivah',         icon:'💍', price:'₹8,000' },
  { name:'Custom Pooja',  icon:'✨', price:'Custom'  },
];

const SAMPLE_PANDITS = [
  { id:'1', name:'Pt. Ram Sharma',    city:'Delhi',   specializations:['Satyanarayan','Griha Pravesh'], years_of_experience:15, min_fee:1800, rating:4.9 },
  { id:'2', name:'Pt. Anil Mishra',   city:'Noida',   specializations:['Rudrabhishek','Navgrah'],       years_of_experience:12, min_fee:1500, rating:4.8 },
  { id:'3', name:'Pt. Suresh Tiwari', city:'Gurgaon', specializations:['Vivah','Mundan'],               years_of_experience:20, min_fee:2500, rating:4.7 },
];

export default function UserHome() {
  const navigate = useNavigate();
  const { devoteeName, devoteeId } = useApp();
  const [pandits, setPandits]   = useState(SAMPLE_PANDITS);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    supabase.from('pandits').select('id,name,city,years_of_experience,rating,specializations,min_fee')
      .eq('status','verified').order('rating',{ascending:false}).limit(3)
      .then(({data})=>{ if(data?.length) setPandits(data); });
    if(devoteeId) {
      supabase.from('bookings').select('*').eq('devotee_id',devoteeId)
        .order('created_at',{ascending:false}).limit(3)
        .then(({data})=>setBookings(data||[]));
    }
  }, [devoteeId]);

  const handleRitualClick = (ritualName) => {
    notificationStore.recordSearch(ritualName);
    navigate('/user/booking');
  };

  const card = {
    background:'#ffffff',
    border:'1px solid rgba(212,160,23,0.2)',
    borderRadius:14,
    padding:'20px',
    boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
  };
  const btn = (bg='#FF6B00') => ({ background:bg, color:'#fff', border:'none', borderRadius:20, padding:'8px 18px', fontWeight:700, cursor:'pointer', fontSize:13 });

  return (
    <div style={{ background:'#fff8f0', minHeight:'100vh' }}>
      {/* Hero Banner */}
      <div style={{ background:'linear-gradient(135deg,#FF6B00,#D4A017)', borderRadius:16, padding:'24px 28px', marginBottom:24, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h1 style={{ fontFamily:'Cinzel,serif', color:'#fff', fontSize:22, margin:0, marginBottom:6 }}>
            {devoteeName ? `Namaste, ${devoteeName.split(' ')[0]} 🙏` : 'Namaste, Devotee 🙏'}
          </h1>
          <p style={{ color:'rgba(255,255,255,0.9)', margin:0, fontSize:14 }}>Book a certified pandit in under 60 seconds</p>
        </div>
        <button style={{ background:'rgba(255,255,255,0.25)', color:'#fff', border:'1px solid rgba(255,255,255,0.5)', borderRadius:20, padding:'10px 24px', fontWeight:700, cursor:'pointer', fontSize:14 }}
          onClick={()=>navigate('/user/booking')}>⚡ Book Now</button>
      </div>

      {/* 6 Service Icons */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10, marginBottom:24 }}>
        {SERVICES.map(({icon,label,path})=>(
          <div key={label} onClick={()=>navigate(path)}
            style={{ background:'#ffffff', border:'1px solid rgba(212,160,23,0.2)', borderRadius:12, padding:'16px 8px', textAlign:'center', cursor:'pointer', transition:'all 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(255,107,0,0.5)'; e.currentTarget.style.background='#fff7f0'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(212,160,23,0.2)'; e.currentTarget.style.background='#ffffff'; }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{icon}</div>
            <div style={{ color:'#1a0f07', fontSize:12, fontWeight:700 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Smart Recommendations */}
      <SmartRecommendations bookingHistory={bookings} />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20 }}>
        <div>
          {/* Rituals Grid */}
          <div style={{ ...card, marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h3 style={{ color:'#1a0f07', fontFamily:'Cinzel,serif', margin:0, fontSize:16 }}>🕉️ Most Booked Rituals</h3>
              <button style={btn()} onClick={()=>navigate('/user/rituals')}>View All</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {RITUALS.map(r=>(
                <div key={r.name} onClick={()=>handleRitualClick(r.name)}
                  style={{ background:'#fff8f0', border:'1px solid rgba(212,160,23,0.15)', borderRadius:10, padding:'14px', textAlign:'center', cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(255,107,0,0.4)'; e.currentTarget.style.background='#fff3e8'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(212,160,23,0.15)'; e.currentTarget.style.background='#fff8f0'; }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{r.icon}</div>
                  <div style={{ color:'#1a0f07', fontSize:13, fontWeight:600, marginBottom:4 }}>{r.name}</div>
                  <div style={{ color:'#FF6B00', fontSize:12, fontWeight:700 }}>from {r.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Samagri Store */}
          <div style={{ ...card, marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h3 style={{ color:'#1a0f07', fontFamily:'Cinzel,serif', margin:0, fontSize:16 }}>🛍️ Pooja Samagri Store</h3>
              <button style={btn()} onClick={()=>navigate('/user/samagri')}>Shop All</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[{name:'Diwali Kit',icon:'🪔',price:'₹899',items:'61 items'},{name:'Ganesh Kit',icon:'🐘',price:'₹349',items:'29 items'},{name:'Griha Kit',icon:'🏡',price:'₹599',items:'52 items'}].map(s=>(
                <div key={s.name} onClick={()=>navigate('/user/samagri')}
                  style={{ background:'#fff8f0', border:'1px solid rgba(212,160,23,0.15)', borderRadius:10, padding:'14px', textAlign:'center', cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(255,107,0,0.4)'; e.currentTarget.style.background='#fff3e8'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(212,160,23,0.15)'; e.currentTarget.style.background='#fff8f0'; }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ color:'#1a0f07', fontSize:13, fontWeight:600, marginBottom:2 }}>{s.name}</div>
                  <div style={{ color:'#9a8070', fontSize:11, marginBottom:4 }}>{s.items}</div>
                  <div style={{ color:'#FF6B00', fontSize:13, fontWeight:700 }}>{s.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Virtual Pooja Banner */}
          <div style={{ background:'linear-gradient(135deg,rgba(109,40,217,0.85),rgba(75,0,130,0.9))', borderRadius:14, padding:'20px 24px', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ color:'#e9d5ff', fontWeight:700, fontSize:11, letterSpacing:2, marginBottom:6 }}>NEW FEATURE</div>
              <h3 style={{ color:'#fff', fontFamily:'Cinzel,serif', margin:0, fontSize:18 }}>📱 Virtual Pooja</h3>
              <p style={{ color:'rgba(255,255,255,0.8)', fontSize:13, margin:'6px 0 0' }}>Attend sacred rituals live from anywhere. Prasad delivered home.</p>
            </div>
            <button style={{ background:'rgba(255,255,255,0.2)', color:'#fff', border:'1px solid rgba(255,255,255,0.4)', borderRadius:20, padding:'10px 20px', fontWeight:700, cursor:'pointer', fontSize:14, flexShrink:0 }}
              onClick={()=>navigate('/user/virtual-pooja')}>Book Virtual →</button>
          </div>

          {/* Pandits */}
          <div style={card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h3 style={{ color:'#1a0f07', fontFamily:'Cinzel,serif', margin:0, fontSize:16 }}>🙏 Highly Rated Scholars</h3>
              <button style={btn()} onClick={()=>navigate('/user/marketplace')}>All Pandits</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {pandits.map(p=>(
                <div key={p.id} onClick={()=>navigate('/user/marketplace')}
                  style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'#fff8f0', borderRadius:10, padding:'12px 16px', cursor:'pointer', border:'1px solid rgba(212,160,23,0.12)', transition:'all 0.2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(255,107,0,0.3)'; e.currentTarget.style.background='#fff3e8'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(212,160,23,0.12)'; e.currentTarget.style.background='#fff8f0'; }}>
                  <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#FF6B00,#D4A017)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🙏</div>
                    <div>
                      <div style={{ color:'#1a0f07', fontWeight:700, fontSize:14 }}>{p.name}</div>
                      <div style={{ color:'#9a8070', fontSize:12 }}>{(p.specializations||[]).slice(0,2).join(' · ')} · {p.city}</div>
                      <div style={{ color:'#9a8070', fontSize:11, marginTop:2 }}>{p.years_of_experience} yrs · ⭐ {p.rating||'New'}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ color:'#FF6B00', fontWeight:800 }}>₹{(p.min_fee||1500).toLocaleString()}</div>
                    <button style={{ ...btn(), marginTop:6, fontSize:11, padding:'4px 12px' }} onClick={e=>{e.stopPropagation();navigate('/user/booking');}}>Book</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div style={{ marginBottom:16 }}>
            <MuhuratWidget />
          </div>
          <div style={card}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <h3 style={{ color:'#1a0f07', fontFamily:'Cinzel,serif', margin:0, fontSize:14 }}>My Bookings</h3>
              <button style={btn()} onClick={()=>navigate('/user/history')}>All</button>
            </div>
            {!devoteeId ? (
              <div style={{ textAlign:'center', padding:'16px 0' }}>
                <div style={{ color:'#9a8070', fontSize:13, marginBottom:10 }}>Login to see your bookings</div>
                <button style={btn()} onClick={()=>navigate('/user/booking')}>Book Now</button>
              </div>
            ) : bookings.length===0 ? (
              <div style={{ textAlign:'center', padding:'16px 0' }}>
                <div style={{ fontSize:28, marginBottom:8 }}>🙏</div>
                <div style={{ color:'#9a8070', fontSize:13, marginBottom:10 }}>No rituals scheduled yet</div>
                <button style={btn()} onClick={()=>navigate('/user/booking')}>Book First Ritual</button>
              </div>
            ) : bookings.map(b=>(
              <div key={b.id} style={{ background:'#fff8f0', borderRadius:8, padding:'10px 12px', marginBottom:8, border:'1px solid rgba(212,160,23,0.1)' }}>
                <div style={{ color:'#1a0f07', fontWeight:600, fontSize:13 }}>{b.ritual_name||'Pooja'}</div>
                <div style={{ color:'#9a8070', fontSize:11, marginTop:2 }}>
                  {b.booking_date?new Date(b.booking_date).toLocaleDateString('en-IN',{day:'numeric',month:'short'}):'TBD'} · ₹{(b.total_amount||0).toLocaleString()}
                </div>
                <div style={{ fontSize:11, color:b.status==='confirmed'?'#15803d':'#FF6B00', marginTop:2, fontWeight:600 }}>{b.status||'pending'}</div>
              </div>
            ))}
          </div>
          <div style={{ ...card, marginTop:16, textAlign:'center', background:'linear-gradient(135deg,rgba(255,107,0,0.06),rgba(212,160,23,0.08))', borderColor:'rgba(255,107,0,0.2)' }}>
            <div style={{ fontSize:28, marginBottom:8 }}>❤️</div>
            <div style={{ color:'#1a0f07', fontWeight:700, fontSize:14, marginBottom:6 }}>Seva & Donations</div>
            <div style={{ color:'#9a8070', fontSize:12, marginBottom:12 }}>Support temples, pandits & sacred traditions</div>
            <button style={btn()} onClick={()=>navigate('/user/donations')}>Donate Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
