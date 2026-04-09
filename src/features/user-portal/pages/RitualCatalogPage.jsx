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
  if (/navgrah|kaal sarp|mangal dosh|graha|shani|dosh|shraddha|pitru/.test(t)) return 'General';
  return 'General';
}

/* ── 7 categories ─────────────────────────────────────────── */
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


/* ─────────────────────────────────────────────────────────── */
export default function RitualCatalogPage() {
  const navigate = useNavigate();
  const [rituals,   setRituals]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeCat, setActiveCat] = useState('All');
  const [activePri, setActivePri] = useState(0);      // index in PRICE_OPTIONS
  const [search,    setSearch]    = useState('');
  const [samagri,   setSamagri]   = useState(false);
  const [counts,    setCounts]    = useState({});

  useEffect(() => {
    (async () => {
      const localMapped = ALL_RITUALS.map(r => ({
        ...r, description: r.desc || r.description,
        _cat: inferCategory({ name: r.name, description: r.desc })
      }));
      const { data } = await bookingApi.getRituals();
      let list;
      if (data?.length > 0) {
        const dbMapped = data.map(r => ({ ...r, _cat: inferCategory(r) }));
        const dbIds = new Set(dbMapped.map(r => r.id));
        list = [...dbMapped, ...localMapped.filter(r => !dbIds.has(r.id))];
      } else {
        list = localMapped;
      }
      setRituals(list);
      const c = { All: list.length };
      list.forEach(r => { c[r._cat] = (c[r._cat] || 0) + 1; });
      c['Special'] = list.filter(r => r.samagriRequired).length;
      setCounts(c);
      setLoading(false);
    })();
  }, []);

  const maxP = PRICE_OPTIONS[activePri].max;
  const filtered = rituals.filter(r => {
    if (activeCat !== 'All') {
      if (activeCat === 'Special' && !r.samagriRequired) return false;
      else if (activeCat !== 'Special' && r._cat !== activeCat) return false;
    }
    if (r.price > maxP) return false;
    if (samagri && !r.samagriRequired) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(r.name?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  return (
    /* Cream/warm light background — overrides ds-user-content dark bg */
    <div style={{ background:'#fff8f0', minHeight:'100%', margin:'-20px', padding:'20px', fontFamily:'Nunito,sans-serif' }}>

      {/* ── Premium On-Demand Strip ─────────────────────────── */}
      <div className="banner-glow" style={{
        background:'linear-gradient(135deg, #FFFDFB 0%, #FFF5E6 100%)',
        border:'1.5px solid #FF6B00',
        borderRadius:20, padding:'24px', marginBottom:28,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        gap:16, flexWrap:'wrap',
        boxShadow:'0 15px 35px rgba(255,107,0,0.12)',
        position:'relative', overflow:'hidden'
      }}>
        <div style={{ position:'absolute', top:-30, left:-30, width:120, height:120, background:'rgba(255,107,0,0.08)', borderRadius:'50%', filter:'blur(20px)' }} />
        
        <div style={{ display:'flex', alignItems:'center', gap:20, position:'relative', zIndex:1 }}>
          <div className="float-anim" style={{ 
            width:60, height:60, borderRadius:18,
            background:'#FF6B00',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:32, flexShrink:0, boxShadow: '0 8px 16px rgba(255,107,0,0.3)' 
          }}>⚡</div>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <span style={{ fontFamily:'Cinzel,serif', color:'#2C1A0E', fontWeight:900, fontSize:20, letterSpacing:0.5 }}>Instant Spiritual Guidance</span>
              <span style={{ background:'#FF6B00', color:'#fff', fontSize:9,
                fontWeight:900, padding:'3px 10px', borderRadius:20, boxShadow:'0 4px 10px rgba(255,107,0,0.3)',
                letterSpacing:1 }}>LIVE NOW</span>
            </div>
            <p style={{ color:'#5C3317', fontSize:14, margin:0, fontWeight:700 }}>
              Connect with a verified Pandit instantly for Sankalp or Special Puja.
            </p>
          </div>
        </div>
        <div style={{ display:'flex', gap:12, flexShrink:0, position:'relative', zIndex:1 }}>
          <button onClick={() => navigate('/user/instant-booking')} className="btn btn-primary" style={{
            padding:'14px 32px', borderRadius:30, fontWeight:900, cursor:'pointer', fontSize:15 }}>
            Book Instantly →
          </button>
        </div>
      </div>

      {/* ── Page Header + Search ─────────────────────────────── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, marginBottom:22, flexWrap:'wrap' }}>
        <div>
          <h1 style={{ fontFamily:'Cinzel,serif', color:'#126180', margin:'0 0 4px', fontSize:'clamp(18px,3vw,26px)', fontWeight:900 }}>
            🕉️ Sacred Ritual Catalog
          </h1>
          <p style={{ color:'#8B6347', margin:0, fontSize:13, fontWeight:600 }}>
            {loading ? 'Discovering divine ceremonies…' : `${rituals.length} Authentic Rituals · 120+ Verified Acharyas`}
          </p>
        </div>
        <div style={{ position:'relative', width:'min(100%,320px)' }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
            color:'#D4A017', fontSize:16, pointerEvents:'none' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for a Pooja or Ceremony..."
            style={{ width:'100%', padding:'12px 36px 12px 38px', borderRadius:30,
              background:'#fff', border:'2px solid rgba(212,160,23,0.15)',
              color:'#1a0f07', fontSize:14, outline:'none', boxSizing:'border-box',
              fontFamily:'Nunito,sans-serif', transition:'all 0.3s',
              boxShadow:'0 4px 15px rgba(0,0,0,0.03)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position:'absolute', right:12,
              top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.05)', border:'none',
              color:'#8B6347', cursor:'pointer', fontSize:10, width:20, height:20, borderRadius:'50%',
              display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          )}
        </div>
      </div>

      {/* ── Premium Filter Bar ──────────────────────────── */}
      <div style={{ 
        background:'#fff', border:'1px solid rgba(212,160,23,0.15)', borderRadius:20,
        padding:'16px 20px', marginBottom:28, boxShadow:'0 10px 25px rgba(0,0,0,0.03)',
        display:'flex', flexDirection:'column', gap:16
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:11, fontWeight:800, color:'#D4A017', letterSpacing:'1.5px', textTransform:'uppercase' }}>Explore by Category</span>
          <div style={{ flex:1, height:1, background:'rgba(212,160,23,0.1)' }} />
        </div>

        <div className="rc-cat-scroll" style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:4 }}>
          {CATS.map(cat => {
            const cnt = cat.key === 'All' ? rituals.length : (counts[cat.key] || 0);
            const isOn = activeCat === cat.key;
            return (
              <button key={cat.key} onClick={() => setActiveCat(cat.key)}
                style={{
                  padding:'10px 18px', borderRadius:25, fontSize:13, fontWeight:800, cursor:'pointer',
                  border:`2px solid ${isOn ? cat.color : 'rgba(139,99,71,0.1)'}`,
                  background: isOn ? cat.color : 'rgba(255,255,255,0.05)',
                  color: isOn ? '#fff' : '#5C3317',
                  transition:'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', outline:'none', whiteSpace:'nowrap', flexShrink:0,
                  boxShadow: isOn ? `0 8px 16px ${cat.color}30` : 'none',
                  display:'flex', alignItems:'center', gap:8
                }}>
                <span style={{ fontSize:16 }}>{cat.icon}</span>
                {cat.key}
                {cnt > 0 && <span style={{ opacity:0.6, fontSize:10, background:isOn ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)', padding:'2px 6px', borderRadius:8 }}>{cnt}</span>}
              </button>
            );
          })}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', paddingTop:8, borderTop:'1px solid rgba(212,160,23,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:11, fontWeight:800, color:'#D4A017', letterSpacing:'1.2px', textTransform:'uppercase' }}>Budget</span>
            <div style={{ display:'flex', gap:6 }}>
              {PRICE_OPTIONS.map((pr,i) => {
                const isOn = activePri === i;
                return (
                  <button key={i} onClick={() => setActivePri(i)}
                    style={{ 
                      padding:'6px 14px', borderRadius:15, fontSize:12, fontWeight:700, cursor:'pointer',
                      border:`1.5px solid ${isOn ? '#FF6B00' : 'rgba(139,99,71,0.15)'}`,
                      background: isOn ? '#FF6B00' : '#fff',
                      color: isOn ? '#fff' : '#8B6347', transition:'all 0.15s', outline:'none',
                    }}>{pr.label}</button>
                );
              })}
            </div>
          </div>
          
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:12 }}>
            <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
              <div onClick={() => setSamagri(s => !s)}
                style={{ 
                  width:40, height:22, borderRadius:12,
                  background: samagri ? '#27AE60' : 'rgba(139,99,71,0.15)',
                  position:'relative', cursor:'pointer', transition:'all 0.3s' 
                }}>
                <div style={{ position:'absolute', top:3, left: samagri ? 21 : 3,
                  width:16, height:16, borderRadius:'50%', background:'#fff',
                  transition:'left 0.2s', boxShadow:'0 2px 5px rgba(0,0,0,0.2)' }}/>
              </div>
              <span style={{ fontSize:13, fontWeight:800, color:'#126180' }}>📦 Include Samagri</span>
            </label>
          </div>
        </div>
      </div>

      {/* ── Results count ────────────────────────────────────── */}
      {!loading && (
        <div style={{ marginBottom:18, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:14, color:'#8B6347', fontWeight:600 }}>
            Showing <strong style={{ color:'#126180' }}>{filtered.length}</strong> divine options
            {activeCat !== 'All' && <span style={{ color:'#FF6B00' }}> in {activeCat}</span>}
          </span>
          {(activeCat !== 'All' || activePri !== 0 || samagri || search) && (
            <button onClick={() => { setActiveCat('All'); setActivePri(0); setSamagri(false); setSearch(''); }}
              style={{ fontSize:11, color:'#C0392B', background:'rgba(192,57,43,0.07)', border:'1px solid rgba(192,57,43,0.2)',
                borderRadius:12, padding:'4px 12px', cursor:'pointer', fontWeight:800, transition:'all 0.2s' }}>
              ✕ Reset Filters
            </button>
          )}
        </div>
      )}

      {/* ── Ritual Grid ──────────────────────────────────────── */}
      {loading ? (
        <div style={{ padding:'80px 0', display:'flex', justifyContent:'center' }}><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div className="banner-glow" style={{ 
          textAlign:'center', padding:'80px 20px', background:'#fff',
          borderRadius:24, border:'1px solid rgba(212,160,23,0.15)',
          boxShadow:'0 15px 40px rgba(0,0,0,0.04)' 
        }}>
          <div className="float-anim" style={{ fontSize:64, marginBottom:20 }}>🧘‍♂️</div>
          <div style={{ fontFamily:'Cinzel,serif', color:'#1a0f07', fontSize:22, fontWeight:900, marginBottom:8 }}>No Rituals Match Your Quiet</div>
          <div style={{ color:'#8B6347', fontSize:14, marginBottom:24, maxWidth:300, margin:'0 auto 24px' }}>
            We couldn't find rituals for these criteria. Try broadening your search or budget.
          </div>
          <button className="btn btn-primary" style={{ padding:'12px 30px', borderRadius:30 }}
            onClick={() => { setActiveCat('All'); setActivePri(0); setSearch(''); setSamagri(false); }}>
            Reset All Filters
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
          {filtered.map(r => <RitualCard key={r.id} r={r} onBook={() => navigate('/user/booking', { state:{ selectedRitual:r } })} />)}
        </div>
      )}
    </div>
  );
}

/* ── Ritual Card ─────────────────────────────────────────────── */
function RitualCard({ r, onBook }) {
  const [hov, setHov] = useState(false);
  const catMeta = CATS.find(c => c.key === r._cat) || CATS[0];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:'#fff',
        border:`1.5px solid ${hov ? catMeta.color+'50' : 'rgba(212,160,23,0.2)'}`,
        borderRadius:16,
        padding:'18px',
        transition:'all 0.22s',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov ? `0 12px 32px rgba(0,0,0,0.1), 0 0 0 1px ${catMeta.color}20` : '0 2px 10px rgba(0,0,0,0.05)',
        cursor:'default',
        display:'flex',
        flexDirection:'column',
      }}>
      {/* Icon row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <div style={{ width:50, height:50, borderRadius:14,
          background:`${catMeta.color}12`, border:`1.5px solid ${catMeta.color}25`,
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>
          {r.icon || '🕉️'}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'flex-end' }}>
          <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:8,
            background:`${catMeta.color}12`, color:catMeta.color, border:`1px solid ${catMeta.color}25` }}>
            {r._cat}
          </span>
          {r.samagriRequired && (
            <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:8,
              background:'rgba(255,107,0,0.08)', color:'#FF6B00', border:'1px solid rgba(255,107,0,0.2)' }}>
              📦 Samagri
            </span>
          )}
        </div>
      </div>

      {/* Name + desc */}
      <h3 style={{ fontFamily:'Cinzel,serif', color:'#1a0f07', margin:'0 0 7px',
        fontSize:14, fontWeight:800, lineHeight:1.3 }}>{r.name}</h3>
      <p style={{ color:'#8B6347', fontSize:12, lineHeight:1.6, margin:'0 0 14px', flex:1,
        display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        {r.description}
      </p>

      {/* Price + CTA */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
        paddingTop:12, borderTop:'1px solid rgba(212,160,23,0.12)' }}>
        <div>
          <div style={{ fontSize:10, color:'#C7A96B', fontWeight:600 }}>Starting from</div>
          <div style={{ fontFamily:'Cinzel,serif', color:'#FF6B00', fontWeight:900, fontSize:17 }}>
            {r.price ? `₹${r.price.toLocaleString('en-IN')}` : 'Custom'}
          </div>
        </div>
        <button onClick={onBook} style={{
          background: hov ? 'linear-gradient(135deg,#FF6B00,#FF8C35)' : 'rgba(255,107,0,0.08)',
          border:`1.5px solid ${hov ? 'transparent' : 'rgba(255,107,0,0.3)'}`,
          color: hov ? '#fff' : '#FF6B00',
          padding:'8px 16px', borderRadius:10, fontWeight:800, fontSize:12, cursor:'pointer',
          transition:'all 0.18s', whiteSpace:'nowrap',
          boxShadow: hov ? '0 4px 14px rgba(255,107,0,0.35)' : 'none',
        }}>
          Book Now →
        </button>
      </div>
    </div>
  );
}
