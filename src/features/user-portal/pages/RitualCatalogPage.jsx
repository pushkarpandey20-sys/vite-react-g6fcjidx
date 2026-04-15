import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppCtx';
import { bookingApi } from '../../../api/bookingApi';
import { Spinner } from '../../../components/common/UIElements';
import { ALL_RITUALS, RITUAL_CATEGORIES } from '../../../data/ritualsData';

const PRICE_OPTIONS = [
  { label:'Any Budget', max:99999 },
  { label:'Under ₹2K',  max:2000  },
  { label:'₹2K – ₹5K',  max:5000  },
  { label:'₹5K – ₹10K', max:10000 },
];

const C = {
  bg: '#0a0500',
  dk: '#160d05',
  glass: 'rgba(26,15,7,0.85)',
  text: 'rgba(255,248,240,0.85)',
  gold: '#F0C040',
  accent: '#FF6B00',
  border: 'rgba(212,160,23,0.15)'
};

export default function RitualCatalogPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [budget,         setBudget]         = useState('Any Budget'); 
  const [searchQuery,    setSearchQuery]    = useState('');
  const [samagri,        setSamagri]        = useState(false);

  const displayed = ALL_RITUALS
    .filter(r =>
      activeCategory === 'All' || r.category === activeCategory
    )
    .filter(r => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return r.name.toLowerCase().includes(q)
          || r.desc?.toLowerCase().includes(q);
    })
    .filter(r => {
      if (!budget || budget === 'Any Budget') return true;
      if (budget === 'Under ₹2K')   return r.price < 2000;
      if (budget === '₹2K – ₹5K') return r.price >= 2000 && r.price <= 5000;
      if (budget === '₹5K – ₹10K') return r.price > 5000 && r.price <= 10000;
      return true;
    });

  return (
    <div style={{ background: C.bg, minHeight:'100%', margin:'-20px', padding:'20px', color: C.text, fontFamily:'"Inter", sans-serif' }}>
      
      {/* ── 1. Premium Instant Strip ── */}
      <div style={{
        background: 'rgba(26,15,7,0.9)', border: `1.5px solid ${C.accent}44`, borderRadius: 32,
        padding: window.innerWidth < 640 ? '20px' : '24px 32px', marginBottom: 40, 
        display: 'flex', alignItems: window.innerWidth < 640 ? 'stretch' : 'center', 
        flexDirection: window.innerWidth < 640 ? 'column' : 'row',
        justifyContent: 'space-between', gap: window.innerWidth < 640 ? 20 : 32,
        boxShadow: `0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px ${C.accent}15`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: window.innerWidth < 480 ? 16 : 24 }}>
          <div style={{ width: window.innerWidth < 480 ? 50 : 64, height: window.innerWidth < 480 ? 50 : 64, borderRadius: window.innerWidth < 480 ? 16 : 20, background: 'linear-gradient(135deg, #FF6B00, #FF8C00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: window.innerWidth < 480 ? 24 : 32, boxShadow: `0 8px 24px ${C.accent}44`, flexShrink: 0 }}>⚡</div>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
              <h2 style={{ fontFamily: 'Cinzel, serif', color: C.gold, margin: 0, fontSize: window.innerWidth < 480 ? 18 : 24, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Instant Guidance</h2>
              <span style={{ background: C.accent, color: '#fff', fontSize: 9, fontWeight: 900, padding: '3px 10px', borderRadius: 20 }}>LIVE</span>
            </div>
            <p style={{ margin: 0, fontSize: window.innerWidth < 480 ? 12 : 14, fontWeight: 600, opacity: 0.7, lineHeight: 1.3 }}>Connect with a verified Pandit instantly for any urgent Sankalp.</p>
          </div>
        </div>
        <button onClick={() => navigate('/user/instant-booking')} style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 50, padding: window.innerWidth < 640 ? '14px' : '16px 36px', fontSize: 15, fontWeight: 900, cursor: 'pointer', boxShadow: `0 10px 30px ${C.accent}44`, width: window.innerWidth < 640 ? '100%' : 'auto' }}>
          Book Instantly →
        </button>
      </div>

      {/* ── 2. Header & Search ── */}
      <div style={{
        display:'flex',
        flexDirection: window.innerWidth < 640 ? 'column' : 'row',
        alignItems: window.innerWidth < 640 ? 'flex-start' : 'center',
        justifyContent:'space-between',
        gap:12,
        marginBottom:40,
        flexWrap:'wrap',
      }}>
        {/* Om icon + title left side */}
        <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
          <div style={{
            width:48, height:48, borderRadius:16, flexShrink:0,
            background:'linear-gradient(135deg, #FF6B00, #D4A017)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:24,
          }}>🕉️</div>
          <div style={{ minWidth:0 }}>
            <h2 style={{
              fontFamily:'Cinzel, serif', color:C.gold,
              margin:0, fontWeight:900,
              fontSize: 'clamp(18px, 4vw, 28px)',
              lineHeight:1.2, whiteSpace:'nowrap',
              overflow:'hidden', textOverflow:'ellipsis',
            }}>
              Sacred Ritual Catalog
            </h2>
            <div style={{ color:'rgba(255,248,240,0.55)', fontSize:13, marginTop:2 }}>
              {ALL_RITUALS.length} Authentic Rituals · 120+ Verified Acharyas
            </div>
          </div>
        </div>

        {/* Search bar right side */}
        <div style={{
          display:'flex', alignItems:'center', gap:10,
          background:'rgba(255,255,255,0.07)',
          border:'1px solid rgba(212,160,23,0.25)',
          borderRadius:12, padding:'10px 14px',
          width: window.innerWidth < 640 ? '100%' : 340,
          flexShrink:0,
        }}>
          <span style={{ fontSize:16, opacity:0.5 }}>🔍</span>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for a Pooja or Ceremony..."
            style={{
              flex:1, background:'transparent', border:'none',
              outline:'none', color:'rgba(255,248,240,0.85)',
              fontSize:14, fontFamily:'inherit',
            }}
          />
        </div>
      </div>

      {/* ── 3. Filter Section ── */}
      <div style={{ background: 'rgba(26,15,7,0.5)', border: `1px solid ${C.border}`, borderRadius: 24, padding: window.innerWidth < 640 ? '20px' : '32px', marginBottom: 40 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: C.gold, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Explore by Category</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {RITUAL_CATEGORIES.map(cat => {
              const count = cat === 'All' ? ALL_RITUALS.length
                : ALL_RITUALS.filter(r => r.category === cat).length;
              const active = activeCategory === cat;
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  style={{
                    padding:'7px 14px', borderRadius:24, cursor:'pointer',
                    fontFamily:'inherit', fontSize:12, fontWeight: active?700:500,
                    whiteSpace:'nowrap', transition:'all 0.18s',
                    border: active ? '2px solid #FF6B00'
                                   : '1px solid rgba(212,160,23,0.2)',
                    background: active ? '#FF6B00' : 'rgba(255,255,255,0.05)',
                    color:       active ? '#fff'    : 'rgba(255,248,240,0.85)',
                  }}>
                  {cat} {count > 0 && <span style={{opacity:0.6,fontSize:10}}>{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: `1px solid ${C.border}`, flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
             <span style={{ color: C.gold, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}>Budget</span>
             <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
               {PRICE_OPTIONS.map((pr, i) => (
                 <button key={i} onClick={() => setBudget(pr.label)} style={{ padding: '6px 14px', borderRadius: 30, border: `1.5px solid ${budget === pr.label ? C.accent : C.border}`, background: budget === pr.label ? C.accent : 'rgba(40,15,5,0.6)', color: '#fff', fontSize: 11, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}>{pr.label}</button>
               ))}
             </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div onClick={() => setSamagri(s => !s)} style={{ width: 40, height: 22, background: samagri ? '#27AE60' : 'rgba(139,99,71,0.2)', borderRadius: 20, position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
              <div style={{ width: 16, height: 16, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, left: samagri ? 21 : 3, transition: '0.2s' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1389cb' }}>📦 Samagri Kit</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24, fontSize: 15, fontWeight: 600, color: C.text }}>
        Showing <span style={{ color: '#1389cb', fontWeight: 900 }}>{displayed.length}</span> divine options
      </div>

      {/* ── 4. Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 32 }}>
        {displayed.map(r => (
          <div key={r.id || r.name} onClick={() => navigate('/user/booking', { state:{ selectedRitual:r } })} style={{ background: 'rgba(26,15,7,0.7)', border: `1.5px solid ${C.border}`, borderRadius: 24, padding: '24px', cursor: 'pointer', transition: '0.3s' }} onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(50,25,5,0.8)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>{r.icon || '🕉️'}</div>
              <span style={{
                background:'rgba(212,160,23,0.12)', color:'#D4A017',
                fontSize:10, padding:'4px 12px', borderRadius:20,
                border: '1px solid rgba(212,160,23,0.18)',
                fontWeight:800, whiteSpace:'nowrap', textTransform: 'uppercase', letterSpacing: 0.5
              }}>
                {r.category}
              </span>
            </div>
            <h3 style={{ fontFamily: 'Cinzel, serif', color: C.gold, margin: '0 0 10px', fontSize: 18, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>{r.name}</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,248,240,0.6)', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.desc}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
               <div style={{ fontSize: 12, fontWeight: 800, color: C.accent }}>⏱️ {r.duration || '2 hrs'}</div>
               <div style={{ fontSize: 18, fontWeight: 900, color: C.gold, fontFamily: 'Cinzel,serif' }}>₹{(r.price || 0).toLocaleString('en-IN')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
