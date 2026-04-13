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
import { IconBook, IconShoppingBag, IconPhone, IconTemple, IconHeart, IconCalendar, IconTrendingUp, IconMapPin, IconStar, IconOm, IconUserCheck, IconAward } from '../../components/icons/Icons';

const SERVICES = [
  { Icon: IconBook,        label: 'Book Pandit',  path: '/user/booking',      bg: '#FF6B00' },
  { Icon: IconShoppingBag, label: 'Buy Samagri',  path: '/user/samagri',      bg: '#D4A017' },
  { Icon: IconPhone,       label: 'Virtual Puja', path: '/user/virtual-pooja',bg: '#7c3aed' },
  { Icon: IconTemple,      label: 'Temples',      path: '/user/temples',      bg: '#0891b2' },
  { Icon: IconHeart,       label: 'Donate/Seva',  path: '/user/donations',    bg: '#dc2626' },
  { Icon: IconCalendar,    label: 'Muhurta',      path: '/user/muhurta',      bg: '#16a34a' },
];

const RITUALS = [
  { name:'Satyanarayan Katha', icon:'🌟', price:'₹1,500', desc: 'Sacred storytelling for health, wealth & prosperity.', dur:'2-3 hrs' },
  { name:'Rudrabhishek',  icon:'🔱', price:'₹2,500', desc: 'Divine Shiva ritual for liberation and inner power.', dur:'1.5 hrs' },
  { name:'Griha Pravesh', icon:'🏠', price:'₹3,101', desc: 'Auspicious housewarming to invite divine energies.', dur:'3-4 hrs' },
  { name:'Navgraha Shanti', icon:'⭐', price:'₹2,100', desc: 'Harmonize the nine planets for a balanced life.', dur:'2 hrs' },
  { name:'Pitru Dosh Puja', icon:'🙏', price:'₹5,100', desc: 'Ancestral blessings for lineage and family peace.', dur:'4 hrs' },
  { name:'Vastu Shanti',  icon:'📐', price:'₹4,500', desc: 'Rectify energy imbalances in your living space.', dur:'3 hrs' },
];

const SAMAGRI_KITS = [
  { name:'Satyanarayan Kit', icon:'📦', price:'₹899', items:'61 items', badge:'COMPLETE' },
  { name:'Rudrabhishek Kit', icon:'📦', price:'₹1,299', items:'45 items', badge:'PREMIUM' },
  { name:'Navgraha Kit',    icon:'📦', price:'₹1,001', items:'52 items', badge:'ESSENTIAL' },
  { name:'Griha Pravesh Kit',icon:'📦', price:'₹2,100', items:'108 items', badge:'FULL' },
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma', city: 'Delhi', text: 'DevSetu made my griha pravesh booking so easy. The pandit was highly professional.', rating: 5 },
  { name: 'Priya Verma', city: 'Mumbai', text: 'Amazing experience with the Rudrabhishek puja. The real-time updates were helpful.', rating: 5 },
  { name: 'Sanjay Gupta', city: 'Bangalore', text: 'High quality samagri kit. Saved me hours of shopping in the market.', rating: 5 },
];

const SANKALPS = [
  { name: 'Amit K.', ritual: 'Satyanarayan', intent: 'Health & Long life of Parents' },
  { name: 'Deepa S.', ritual: 'Rudrabhishek', intent: 'Success in new venture' },
  { name: 'Vijay R.', ritual: 'Navgraha Shanti', intent: 'Family harmony' },
];

const SAMPLE_PANDITS = [
  { id:'1', name:'Pt. Ram Sharma',    city:'Varanasi', exp:15, lang: ['Sanskrit','Hindi'], rating:4.9, spec:'Vedic Mantras' },
  { id:'2', name:'Pt. Anil Mishra',   city:'Ayodhya',  exp:12, lang: ['Hindi','English'],  rating:4.8, spec:'Karmakand' },
  { id:'3', name:'Pt. Suresh Tiwari', city:'Haridwar', exp:20, lang: ['Sanskrit','Hindi'], rating:5.0, spec:'Astrology' },
  { id:'4', name:'Pt. Alok Nath',     city:'Ujjain',   exp:10, lang: ['Hindi'],            rating:4.7, spec:'Mahakal Seva' },
  { id:'5', name:'Pt. Rajesh Jha',    city:'Mathura',  exp:18, lang: ['Braij','Hindi'],    rating:4.9, spec:'Krishna Bhakti' },
  { id:'6', name:'Pt. Sunil Shastri', city:'Prayagraj',exp:22, lang: ['Sanskrit','Hindi'], rating:4.9, spec:'Pitru Rituals' },
];

/* ── Contextual Theme Constants ─────────────────────────── */
const C = {
  bg: '#0a0400',
  dk: 'rgba(26,15,7,0.85)',
  border: 'rgba(212,160,23,0.18)',
  text: 'rgba(255,248,240,0.9)',
  textMuted: 'rgba(255,248,240,0.6)',
  accent: '#FF6B00',
  gold: '#F0C040'
};

const dkStyle = { background: C.dk, border: `1px solid ${C.border}`, borderRadius: 18, boxShadow: '0 4px 20px rgba(0,0,0,0.4)', padding: '20px' };

/* ── Horizontal scroll container ─────────────────────────── */
const hscroll = {
  display:'flex', overflowX:'auto', gap:12,
  paddingBottom:6, WebkitOverflowScrolling:'touch',
  scrollbarWidth:'none', msOverflowStyle:'none',
};

/* ── Section wrapper ──────────────────────────────────────── */
function Section({ title, onViewAll, viewLabel, children, style }) {
  return (
    <div style={{ ...dkStyle, ...style }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <div style={{ fontFamily:'Cinzel,serif', color:C.gold, fontWeight:900, fontSize:17 }}>{title}</div>
        {onViewAll && (
          <button onClick={onViewAll}
            style={{ background:'rgba(255,107,0,0.1)', color:C.accent, border:`1px solid ${C.accent}44`,
              borderRadius:16, padding:'4px 12px', fontWeight:800, cursor:'pointer', fontSize:11, fontFamily:'Nunito,sans-serif' }}>
            {viewLabel || 'View All →'}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export default function UserHome() {
  const navigate = useNavigate();
  const { devoteeName, devoteeId, festivals } = useApp();
  const [pandits, setPandits]   = useState(SAMPLE_PANDITS);
  const [bookings, setBookings] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [homeSearch, setHomeSearch] = useState('');
  const BG_IMAGES = ['/temple-bg.png', '/temple-bg-2.png', '/temple-bg-3.png'];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    supabase.from('pandits').select('id,name,city,experience_years,rating,specialization,min_fee')
      .eq('status','verified').order('rating',{ascending:false}).limit(6)
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

  return (
    <div style={{ background: C.bg, minHeight:'100%', margin:'-20px', padding:'20px 20px 80px', color: C.text, display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* ── 1. Hero Section ─────────────────────────────────── */}
      <div className="hero-section" style={{
        position:'relative', overflow:'hidden', borderRadius:28, minHeight:420,
        display:'flex', flexDirection:'column', justifyContent:'center',
        padding:'60px 24px', textAlign:'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        background: '#1a0a00'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          {BG_IMAGES.map((img, idx) => (
            <img key={img} src={img} alt="Heritage" style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover', opacity: bgIndex === idx ? 0.6 : 0, transition:'opacity 1.5s' }} />
          ))}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(26,10,0,0.2) 0%, rgba(26,10,0,0.95) 90%)' }} />
        </div>

        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-block', background:'rgba(255,107,0,0.15)', border:`1.5px solid ${C.accent}44`, color:C.accent, fontSize:11, fontWeight:900, textTransform:'uppercase', padding:'5px 16px', borderRadius:50, marginBottom:20, letterSpacing:1.5 }}>
            ✨ Transcending Rituals into Digital Era
          </div>
          <h1 style={{ fontFamily:'Cinzel,serif', color:C.gold, fontSize:'clamp(36px,8vw,56px)', margin:'0 0 12px', fontWeight:900, lineHeight:1.1, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
             Bridge to Divine Services
          </h1>
          <p style={{ color:C.text, fontSize:19, maxWidth:600, margin:'0 auto 36px', fontWeight:600, lineHeight:1.5 }}>
             Book Verified Pandits & Sacred Rituals Across Bharat
          </p>

          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap', marginBottom:32 }}>
            <button onClick={() => navigate('/user/booking')} className="btn btn-primary" style={{ padding:'16px 36px', borderRadius:50, fontSize:16, boxShadow:`0 10px 25px ${C.accent}44` }}>⚡ Book Pandit Now</button>
            <button onClick={() => navigate('/user/rituals')} style={{ background:'rgba(255,255,255,0.08)', color:'#fff', border:'1px solid rgba(255,255,255,0.25)', borderRadius:50, padding:'16px 36px', fontWeight:800, cursor:'pointer', fontSize:15 }}>🕉️ View Rituals</button>
          </div>

          <div style={{ maxWidth:540, margin:'0 auto', position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', background:'rgba(255,255,255,0.08)', border:`1.5px solid ${C.border}`, borderRadius:50, padding:'12px 24px', backdropFilter:'blur(20px)', boxShadow:'0 10px 30px rgba(0,0,0,0.4)' }}>
              <span style={{ fontSize:22, marginRight:12, opacity:0.8 }}>🔍</span>
              <input value={homeSearch} onChange={e => setHomeSearch(e.target.value)} onKeyDown={e => { 
                if (e.key === 'Enter' && homeSearch.trim()) {
                  navigate(`/user/marketplace?q=${encodeURIComponent(homeSearch.trim())}`);
                  setHomeSearch('');
                }
              }} placeholder="Search for rituals, pandits or temples..." style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#fff8f0', fontSize:16, fontFamily:'inherit' }} />
              {homeSearch.trim() && (
                <button onClick={() => {
                  navigate(`/user/marketplace?q=${encodeURIComponent(homeSearch.trim())}`);
                  setHomeSearch('');
                }} style={{ background:C.accent, color:'#fff', border:'none', borderRadius:24, padding:'8px 20px', fontWeight:900, cursor:'pointer', fontSize:13 }}>Search</button>
              )}
            </div>
            <div style={{ color:'rgba(255,255,255,0.3)', fontSize:12, marginTop:10, display:'flex', gap:16, justifyContent:'center', fontWeight:700 }}>
              <span style={{ cursor:'pointer' }} onClick={() => { navigate(`/user/rituals?q=Rudrabhishek`); setHomeSearch(''); }}>"Rudrabhishek"</span>
              <span style={{ cursor:'pointer' }} onClick={() => { navigate(`/user/rituals?q=Griha+Pravesh`); setHomeSearch(''); }}>"Griha Pravesh"</span>
              <span style={{ cursor:'pointer' }} onClick={() => { navigate(`/user/marketplace?q=Pandit`); setHomeSearch(''); }}>"Pandit"</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Trust Metrics Section ────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginTop:-10 }}>
         {[
           { val:'180+', lbl:'EXPERTS', sub:'Verified Pandits', icon:IconUserCheck, color:C.accent },
           { val:'80+', lbl:'VARIETIES', sub:'Sacred Rituals', icon:IconOm, color:C.gold },
           { val:'25+', lbl:'LOCATIONS', sub:'Cities Covered', icon:IconMapPin, color:'#7c3aed' },
           { val:'5000+', lbl:'SUCCESS', sub:'Rituals Completed', icon:IconAward, color:'#16a34a' }
         ].map(s => (
           <div key={s.lbl} style={{ ...dkStyle, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', background: 'linear-gradient(135deg, #1a0f07 0%, #0a0400 100%)' }}>
              <div style={{ marginBottom:10 }}><s.icon size={32} color={s.color} /></div>
              <div style={{ color:s.color, fontSize:22, fontWeight:900, fontFamily:'Cinzel,serif' }}>{s.val}</div>
              <div style={{ fontSize:11, fontWeight:900, letterSpacing:1.5, color:C.gold, margin:'4px 0' }}>{s.lbl}</div>
              <div style={{ fontSize:10, color:C.textMuted, fontWeight:700 }}>{s.sub}</div>
           </div>
         ))}
      </div>

      {/* ── 2b. Primary Services Grid ─────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {SERVICES.map((s) => (
          <div key={s.label} onClick={() => navigate(s.path)} style={{ ...dkStyle, display:'flex', flexDirection:'column', alignItems:'center', gap:12, cursor:'pointer', transition:'all 0.3s', background: 'rgba(30,15,5,0.7)' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-6px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ width:64, height:64, borderRadius:20, background:`${s.bg}15`, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${s.bg}33`, boxShadow: `0 8px 16px ${s.bg}10` }}>
              <s.Icon size={32} color={s.bg} />
            </div>
            <span style={{ color:C.text, fontWeight:900, fontSize:15, textAlign:'center', fontFamily:'Cinzel,serif' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── 3. Popular Rituals Section ──────────────────────── */}
      <Section title="🕉️ Popular Sacred Rituals" onViewAll={() => navigate('/user/rituals')} viewLabel="View All Rituals">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:20 }}>
          {RITUALS.map(r => (
            <div key={r.name} onClick={() => navigate(`/user/booking?ritual=${encodeURIComponent(r.name)}`)} style={{ ...dkStyle, padding:24, cursor:'pointer', background:'linear-gradient(135deg,rgba(40,15,5,0.8),rgba(20,5,0,0.9))', transition:'0.3s' }} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.background='rgba(50,20,5,0.95)';}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background='linear-gradient(135deg,rgba(40,15,5,0.8),rgba(20,5,0,0.9))';}}>
              <div style={{ fontSize:40, marginBottom:16 }}>{r.icon}</div>
              <h3 style={{ fontFamily:'Cinzel,serif', fontSize:19, fontWeight:900, margin:'0 0 8px', color:C.gold }}>{r.name}</h3>
              <p style={{ fontSize:14, color:C.textMuted, marginBottom:16, lineHeight:1.6, minHeight:44 }}>{r.desc}</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:`1px solid ${C.border}`, paddingTop:16 }}>
                <div style={{ fontSize:13, fontWeight:800, color:C.accent }}>⏱️ {r.dur}</div>
                <div style={{ fontSize:18, fontWeight:900, color:C.gold, fontFamily:'Cinzel,serif' }}>{r.price}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 4. Pandit Marketplace Preview ───────────────────── */}
      <Section title="🙏 Featured Vedic Scholars" onViewAll={() => navigate('/user/marketplace')} viewLabel="View All Scholars">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:16 }}>
          {SAMPLE_PANDITS.slice(0, 6).map(p => (
            <div key={p.id} onClick={() => navigate('/user/marketplace')} style={{ ...dkStyle, padding:20, cursor:'pointer', background:'rgba(30,15,5,0.5)' }}>
               <div style={{ display:'flex', gap:16, alignItems:'center', marginBottom:14 }}>
                  <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#FF6B00,#D4A017)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, boxShadow:'0 4px 15px rgba(0,0,0,0.3)' }}>🙏</div>
                  <div>
                    <div style={{ fontWeight:900, fontSize:17, color:C.gold }}>{p.name}</div>
                    <div style={{ fontSize:12, color:C.textMuted }}>⭐ {p.rating} · {p.exp}y Exp</div>
                  </div>
               </div>
               <div style={{ fontSize:13, color:C.text, fontWeight:800, borderTop:`1px solid ${C.border}`, paddingTop:10 }}>Specialization: <span style={{ color:C.accent }}>{p.spec}</span></div>
               <div style={{ fontSize:12, color:C.textMuted, marginTop:6 }}>Languages: {p.lang.join(', ')}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 5. Festival Pujas ───────────────────────────────── */}
      <Section title="🪔 Divine Festival Celebrations">
        <div style={hscroll}>
          {['Navratri Durga Puja', 'Deepavali Lakshmi Puja', 'Mahashivratri Abhishek', 'Ganesh Chaturthi Seva'].map(f => (
            <div key={f} style={{ ...dkStyle, padding:24, minWidth:260, textAlign:'center', background:'linear-gradient(135deg,#2a1505,#0a0400)', position:'relative', overflow:'hidden' }}>
               <div style={{ position:'absolute', top:-20, right:-20, fontSize:100, opacity:0.05, color:C.accent }}>🕉️</div>
               <div style={{ fontSize:44, marginBottom:16 }}>🕉️</div>
               <div style={{ fontWeight:900, fontSize:18, fontFamily:'Cinzel,serif', color:C.gold, marginBottom:8 }}>{f}</div>
               <div style={{ display:'flex', justifyContent:'center', gap:4, marginBottom:16 }}>
                  {[1,2,3,4,5].map(i=><span key={i} style={{ color:C.accent }}>⭐</span>)}
               </div>
               <button className="btn btn-outline" style={{ width:'100%', justifyContent:'center', border:`1.5px solid ${C.accent}`, color:C.accent, fontWeight:900 }}>Check Schedule</button>
            </div>
          ))}
        </div>
      </Section>

      {/* ── How DevSetu Works ───────────────────────────── */}
      <Section title="🛠️ Your Path to Spiritual Fulfillment">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:24, padding:'20px 0' }}>
           {[
             { step:1, label:'Select Ritual', desc:'Browse our sacred catalog of 80+ ceremonies.', icon:'✨' },
             { step:2, label:'Verified Pandit', desc:'Choose a scholar who resonates with your journey.', icon:'🎓' },
             { step:3, label:'Experience Divine', desc:'Perform pooja in the comforts of your home.', icon:'🙏' }
           ].map(s => (
             <div key={s.step} style={{ textAlign:'center' }}>
                <div style={{ position:'relative', display:'inline-block' }}>
                  <div style={{ width:64, height:64, borderRadius:'50%', background:C.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:24, fontWeight:900, boxShadow:`0 10px 20px ${C.accent}44` }}>{s.icon}</div>
                  <div style={{ position:'absolute', top:0, right:-8, width:24, height:24, borderRadius:'50%', background:C.gold, color:'#0a0400', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900 }}>{s.step}</div>
                </div>
                <div style={{ fontWeight:900, fontSize:18, marginBottom:8, color:C.gold, fontFamily:'Cinzel,serif' }}>{s.label}</div>
                <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.5 }}>{s.desc}</div>
             </div>
           ))}
        </div>
      </Section>

      {/* ── Final Call To Action ────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg,#3d1f00,#111)', borderRadius:32, padding:'60px 40px', textAlign:'center', color:'#fff', boxShadow:'0 25px 60px rgba(0,0,0,0.5)', border:`1px solid ${C.accent}33`, position:'relative', overflow:'hidden' }}>
         <div style={{ position:'absolute', left:-40, bottom:-40, fontSize:200, opacity:0.03, transform:'rotate(20deg)' }}>🕉️</div>
         <h2 style={{ fontFamily:'Cinzel,serif', fontSize:38, color:C.gold, marginBottom:16, fontWeight:900 }}>Ready to Elevate Your Spiritual Journey?</h2>
         <p style={{ color:C.textMuted, fontSize:18, marginBottom:40, maxWidth:550, margin:'0 auto 40px', fontWeight:600 }}>Join thousands of devotees establishing their direct connection with the divine through DevSetu.</p>
         <div style={{ display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/user/booking')} style={{ padding:'18px 40px', fontSize:18, fontWeight:900, borderRadius:50 }}>Book Your First Ritual 🙏</button>
            <button className="btn btn-outline" style={{ color:'#fff', borderColor:'#fff', padding:'18px 40px', fontSize:17, fontWeight:800, borderRadius:50 }}>Download DevSetu App 📱</button>
         </div>
      </div>

    </div>
  );
}
