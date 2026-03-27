import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PHASES = [
  {
    phase: 1,
    label: 'Phase 1',
    title: 'Foundation',
    period: 'Live Now ✅',
    color: '#22c55e',
    icon: '🕉️',
    features: [
      { icon: '🙏', name: 'Pandit Booking', desc: 'Book verified Vedic scholars for 100+ rituals across India' },
      { icon: '🛍️', name: 'Samagri Store', desc: 'Complete pooja kits delivered to your doorstep' },
      { icon: '📱', name: 'Virtual Pooja', desc: 'Live-streamed rituals with personal sankalp and prasad delivery' },
      { icon: '📅', name: 'Panchang & Muhurta', desc: 'Real-time Vedic calendar with auspicious timing guidance' },
      { icon: '🛕', name: 'Temple Network', desc: 'Book poojas at sacred temples across Bharat' },
      { icon: '❤️', name: 'Seva & Donations', desc: 'Support temples, pandits, anna daan, and Veda pathshalas' },
      { icon: '🔔', name: 'Smart Notifications', desc: 'Tithi alerts, festival reminders, and muhurat suggestions' },
      { icon: '🪔', name: 'Pandit Portal', desc: 'Full dashboard for pandits to manage bookings and earnings' },
    ],
  },
  {
    phase: 2,
    label: 'Phase 2',
    title: 'Deepening',
    period: 'Q2–Q3 2026',
    color: '#FF6B00',
    icon: '⭐',
    features: [
      { icon: '🔮', name: 'Astrology Consultations', desc: 'Live 1:1 jyotish sessions with certified Vedic astrologers' },
      { icon: '🤖', name: 'AI Muhurat Engine', desc: 'Personalized muhurat recommendations based on your kundali and location' },
      { icon: '🎥', name: 'Video Pandit Intros', desc: '60-second pandit intro videos to build trust before booking' },
      { icon: '📖', name: 'Kundali Generator', desc: 'Free Vedic birth chart with planetary positions and dashas' },
      { icon: '🗓️', name: 'Ritual Subscriptions', desc: 'Monthly/weekly pooja plans with auto-booking and reminders' },
      { icon: '💬', name: 'Pandit Chat', desc: 'Real-time messaging between devotees and booked pandits' },
      { icon: '🏆', name: 'Devotee Rewards', desc: 'Earn karma points for bookings, referrals, and donations' },
      { icon: '🌐', name: 'NRI Support', desc: 'Virtual poojas and deliveries for Indian diaspora worldwide' },
    ],
  },
  {
    phase: 3,
    label: 'Phase 3',
    title: 'Sacred Journeys',
    period: 'Q4 2026',
    color: '#c084fc',
    icon: '🛕',
    features: [
      { icon: '🏔️', name: 'Char Dham Yatra', desc: 'Complete pilgrimage packages — Badrinath, Kedarnath, Gangotri, Yamunotri' },
      { icon: '🚌', name: 'Yatra Bookings', desc: 'End-to-end pilgrimage planning: transport, stays, and pandit escorts' },
      { icon: '📡', name: 'Temple Live Streaming', desc: 'Watch live aarti from Kashi Vishwanath, Mahakaleshwar, and more' },
      { icon: '🌺', name: 'Navdha Bhakti Path', desc: 'Guided 9-day spiritual retreats and intensive sadhana programs' },
      { icon: '🎓', name: 'Veda Pathshala', desc: 'Online Sanskrit and Vedic scripture courses for devotees and youth' },
      { icon: '🤝', name: 'Pandit Community', desc: 'Peer network for pandits — training, certifications, and forums' },
      { icon: '📍', name: 'Nearby Rituals Map', desc: 'Find community yagyas, temple events, and satsangs near you' },
      { icon: '🎁', name: 'Prasad Delivery', desc: 'Authentic temple prasad shipped from 50+ major shrines across India' },
    ],
  },
  {
    phase: 4,
    label: 'Phase 4',
    title: 'Transformation',
    period: '2027 & Beyond',
    color: '#F0C040',
    icon: '🌟',
    features: [
      { icon: '🥽', name: 'AR/VR Temple Tours', desc: 'Immersive virtual darshan — experience sacred temples from home' },
      { icon: '🌍', name: 'Global Expansion', desc: 'Serving Hindu diaspora in USA, UK, Canada, Singapore, and UAE' },
      { icon: '⚡', name: 'DevSetu App v2', desc: 'Native iOS & Android app with offline Panchang and ritual guides' },
      { icon: '🏛️', name: 'Temple OS', desc: 'Full management platform for temples — bookings, donations, prasad' },
      { icon: '🧬', name: 'Wellness Integration', desc: 'Ayurvedic consultations, yoga scheduling, and holistic health rituals' },
      { icon: '🤖', name: 'DevSetu AI Guru', desc: 'Personal Vedic AI assistant for scripture queries, remedies, and guidance' },
      { icon: '💳', name: 'DevSetu Wallet', desc: 'Unified spiritual wallet for bookings, donations, and ritual credits' },
      { icon: '🕊️', name: 'Antyesti & Shraddha', desc: 'Dignified last rites and ancestral rituals with certified pandits' },
    ],
  },
];

export default function Roadmap() {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState(0);

  const phase = PHASES[activePhase];

  return (
    <div style={{ background:'linear-gradient(135deg,#1a0f07 0%,#2d1505 50%,#1a0f07 100%)', minHeight:'100%', margin:'-20px', padding:'20px', borderRadius:0 }}>
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,rgba(212,160,23,0.15),rgba(255,107,0,0.1))', border:'1px solid rgba(212,160,23,0.2)', borderRadius:16, padding:'28px 32px', marginBottom:32, textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🗺️</div>
        <h1 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontSize:28, margin:'0 0 10px' }}>DevSetu Product Roadmap</h1>
        <p style={{ color:'rgba(255,248,240,0.6)', fontSize:15, maxWidth:560, margin:'0 auto 20px', lineHeight:1.6 }}>
          Our mission: make every spiritual need accessible to every devotee in Bharat and beyond.
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:24, flexWrap:'wrap' }}>
          {[['✅','Phase 1 Live'],['🔨','Phase 2 Building'],['📋','Phase 3 Planned'],['🌟','Phase 4 Vision']].map(([i,l])=>(
            <div key={l} style={{ display:'flex', alignItems:'center', gap:6, color:'rgba(255,248,240,0.5)', fontSize:12 }}>
              <span>{i}</span><span>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Tabs */}
      <div style={{ display:'flex', gap:6, background:'rgba(255,255,255,0.04)', borderRadius:14, padding:6, marginBottom:28, flexWrap:'wrap' }}>
        {PHASES.map((p, i) => (
          <button key={p.phase} onClick={() => setActivePhase(i)}
            style={{ flex:1, minWidth:140, padding:'12px 16px', borderRadius:10, border:'none', cursor:'pointer', fontWeight:700, fontSize:13, transition:'all 0.2s',
              background: activePhase===i ? `linear-gradient(135deg,${p.color}dd,${p.color}88)` : 'transparent',
              color: activePhase===i ? '#fff' : 'rgba(255,248,240,0.4)' }}>
            <div>{p.icon} {p.label}</div>
            <div style={{ fontSize:10, fontWeight:600, marginTop:2, opacity:0.8 }}>{p.period}</div>
          </button>
        ))}
      </div>

      {/* Active Phase */}
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:`${phase.color}22`, border:`2px solid ${phase.color}66`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>
            {phase.icon}
          </div>
          <div>
            <h2 style={{ fontFamily:'Cinzel,serif', color: phase.color, margin:0, fontSize:22 }}>{phase.label}: {phase.title}</h2>
            <div style={{ color:'rgba(255,248,240,0.5)', fontSize:13, marginTop:3 }}>{phase.period}</div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
          {phase.features.map(f => (
            <div key={f.name} style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${phase.color}22`, borderRadius:12, padding:'18px 20px', display:'flex', gap:14, alignItems:'flex-start', transition:'all 0.2s' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${phase.color}55`; e.currentTarget.style.background='rgba(255,255,255,0.05)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=`${phase.color}22`; e.currentTarget.style.background='rgba(255,255,255,0.03)'; }}>
              <div style={{ fontSize:28, flexShrink:0 }}>{f.icon}</div>
              <div>
                <div style={{ color: phase.color, fontWeight:700, fontSize:14, marginBottom:5 }}>{f.name}</div>
                <div style={{ color:'rgba(255,248,240,0.5)', fontSize:12, lineHeight:1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ marginTop:40, background:'rgba(255,107,0,0.08)', border:'1px solid rgba(255,107,0,0.2)', borderRadius:16, padding:'28px', textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:12 }}>💬</div>
        <h3 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', margin:'0 0 10px', fontSize:18 }}>Shape the Roadmap</h3>
        <p style={{ color:'rgba(255,248,240,0.5)', fontSize:13, maxWidth:480, margin:'0 auto 20px', lineHeight:1.6 }}>
          Have a feature request or feedback? We build DevSetu with our community. Your input directly shapes what we build next.
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
          <button onClick={()=>navigate('/user/home')} style={{ background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff', border:'none', borderRadius:24, padding:'11px 28px', fontWeight:800, cursor:'pointer', fontSize:14 }}>
            Explore DevSetu →
          </button>
          <button onClick={()=>navigate('/user/donations')} style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,248,240,0.6)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:24, padding:'11px 28px', fontWeight:700, cursor:'pointer', fontSize:14 }}>
            Support Our Mission 🙏
          </button>
        </div>
      </div>
    </div>
  );
}
