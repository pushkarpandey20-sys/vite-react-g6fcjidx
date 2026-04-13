import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppCtx';
import { bookingApi } from '../../../api/bookingApi';
import { Spinner } from '../../../components/common/UIElements';
import { ALL_RITUALS } from '../../../data/ritualsData';

/* ── Category inference ─────────────────────────────────── */
function inferCategory(r) {
  if (r.category) return r.category;
  const t = ((r.name || '') + ' ' + (r.description || '')).toLowerCase();
  if (/vivah|wedding|marriage|shaadi|mundan|namkaran|annaprasan|upanayan|birthday/.test(t)) return 'Life Event';
  if (/griha pravesh|vastu|home|ghar|house|bhoomi/.test(t)) return 'Home';
  if (/temple|mandir|seva/.test(t)) return 'Temple';
  if (/rudrabhishek|shiva|lakshmi|saraswati|durga|navratri|devi|vishnu|krishna|ram|hanuman|ganesh|satyanarayan/.test(t)) return 'Wellness';
  return 'General';
}

const CATS = [
  { key:'All',        icon:'🕉️', color:'#FF6B00' },
  { key:'General',    icon:'✨',  color:'#D4A017' },
  { key:'Home',       icon:'🏠',  color:'#27AE60' },
  { key:'Temple',     icon:'🛕',  color:'#E67E22' },
  { key:'Life Event', icon:'💍',  color:'#9B59B6' },
  { key:'Wellness',   icon:'🪔',  color:'#C0392B' },
  { key:'Special',    icon:'⭐',  color:'#2980B9' },
];

const PRICE_OPTIONS = [
  { label:'Any Budget', max:99999 },
  { label:'Under ₹2K',  max:2000  },
  { label:'₹2K – ₹5K',  max:5000  },
  { label:'₹5K – ₹10K', max:10000 },
];

/* ── Theme Constants ────────────────────────────────────── */
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
  const [rituals,   setRituals]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeCat, setActiveCat] = useState('All');
  const [activePri, setActivePri] = useState(0); 
  const [search,    setSearch]    = useState('');
  const [samagri,   setSamagri]   = useState(false);
  const [counts,    setCounts]    = useState({});

  useEffect(() => {
    (async () => {
      const localMapped = ALL_RITUALS.map(r => ({ ...r, _cat: inferCategory(r) }));
      const { data } = await bookingApi.getRituals();
      let list = data?.length > 0 ? [...data.map(r => ({ ...r, _cat: inferCategory(r) })), ...localMapped] : localMapped;
      
      const unique = Array.from(new Map(list.map(item => [item.id || item.name, item])).values());
      setRituals(unique);

      const ct = { All: unique.length };
      unique.forEach(r => { ct[r._cat] = (ct[r._cat] || 0) + 1; });
      ct['Special'] = unique.filter(r => r.samagriRequired).length;
      setCounts(ct);
      setLoading(false);
    })();
  }, []);

  const maxP = PRICE_OPTIONS[activePri].max;
  const filtered = rituals.filter(r => {
    if (activeCat !== 'All') {
      if (activeCat === 'Special' && !r.samagriRequired) return false;
      else if (activeCat !== 'Special' && r._cat !== activeCat) return false;
    }
    if ((r.price || 1500) > maxP) return false;
    if (search && !((r.name||'').toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  return (
    <div style={{ background: C.bg, minHeight:'100%', margin:'-20px', padding:'20px', color: C.text, fontFamily:'"Inter", sans-serif' }}>
      
      {/* ── 1. Premium Instant Strip (Matches Screenshot) ── */}
      <div style={{
        background: 'rgba(26,15,7,0.9)', border: `1.5px solid ${C.accent}44`, borderRadius: 32,
        padding: '24px 32px', marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: `0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px ${C.accent}15`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #FF6B00, #FF8C00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: `0 8px 24px ${C.accent}44` }}>⚡</div>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <h2 style={{ fontFamily: 'Cinzel, serif', color: C.gold, margin: 0, fontSize: 24, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Instant Spiritual Guidance</h2>
              <span style={{ background: C.accent, color: '#fff', fontSize: 10, fontWeight: 900, padding: '4px 12px', borderRadius: 20 }}>LIVE NOW</span>
            </div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, opacity: 0.8 }}>Connect with a verified Pandit instantly for Sankalp or Special Puja.</p>
          </div>
        </div>
        <button onClick={() => navigate('/user/instant-booking')} style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 50, padding: '16px 36px', fontSize: 16, fontWeight: 900, cursor: 'pointer', boxShadow: `0 10px 30px ${C.accent}44` }}>
          Book Instantly →
        </button>
      </div>

      {/* ── 2. Header & Search (Matches Screenshot) ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>🕉️</span>
            <h1 style={{ fontFamily: 'Cinzel, serif', color: C.gold, fontSize: 36, margin: 0, fontWeight: 900 }}>Sacred Ritual Catalog</h1>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.6 }}>{rituals.length} Authentic Rituals · 120+ Verified Acharyas</div>
        </div>
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, display: 'flex', alignItems: 'center', padding: '0 20px', width: 400, height: 56 }}>
          <span style={{ fontSize: 20, marginRight: 12, opacity: 0.4, color: '#000' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for a Pooja or Ceremony..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 16, color: '#000', fontWeight: 500 }} />
        </div>
      </div>

      {/* ── 3. Filter Section (Matches Screenshot) ── */}
      <div style={{ background: 'rgba(26,15,7,0.5)', border: `1px solid ${C.border}`, borderRadius: 24, padding: '32px', marginBottom: 40 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: C.gold, fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>Explore by Category</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {CATS.map(cat => {
              const isOn = activeCat === cat.key;
              return (
                <button key={cat.key} onClick={() => setActiveCat(cat.key)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '14px 24px', borderRadius: 40, border: `1.5px solid ${isOn ? C.accent : C.border}`,
                  background: isOn ? C.accent : 'rgba(30,15,5,0.7)', color: isOn ? '#fff' : C.text, fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: '0.2s',
                  boxShadow: isOn ? `0 10px 20px ${C.accent}33` : 'none'
                }}>
                  <span>{cat.icon}</span> {cat.key} 
                  <span style={{ fontSize: 11, opacity: 0.5 }}>{counts[cat.key] || 0}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             <span style={{ color: C.gold, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}>Budget</span>
             <div style={{ display: 'flex', gap: 8 }}>
               {PRICE_OPTIONS.map((pr, i) => (
                 <button key={i} onClick={() => setActivePri(i)} style={{ padding: '10px 20px', borderRadius: 30, border: `1.5px solid ${activePri === i ? C.accent : C.border}`, background: activePri === i ? C.accent : 'rgba(40,15,5,0.6)', color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>{pr.label}</button>
               ))}
             </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 24, background: 'rgba(139,99,71,0.2)', borderRadius: 20, position: 'relative' }}>
              <div style={{ width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, left: 3 }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1389cb' }}>📦 Include Samagri</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24, fontSize: 15, fontWeight: 600, color: C.text }}>
        Showing <span style={{ color: '#1389cb', fontWeight: 900 }}>{filtered.length}</span> divine options
      </div>

      {/* ── 4. Grid (Matches Screenshot) ── */}
      {loading ? <Spinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 32 }}>
          {filtered.map(r => (
            <div key={r.id || r.name} onClick={() => navigate('/user/booking', { state:{ selectedRitual:r } })} style={{ background: 'rgba(26,15,7,0.7)', border: `1.5px solid ${C.border}`, borderRadius: 24, padding: '24px', cursor: 'pointer', transition: '0.3s' }} onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(50,25,5,0.8)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{r.icon || '🕉️'}</div>
                <div style={{ background: 'rgba(10,5,0,0.5)', color: '#27AE60', fontSize: 11, fontWeight: 900, padding: '4px 12px', borderRadius: 8, height: 'fit-content', border: '1px solid rgba(39,174,96,0.3)' }}>HOME</div>
              </div>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: C.gold, margin: '0 0 10px', fontSize: 18, fontWeight: 900, textTransform: 'uppercase' }}>{r.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
