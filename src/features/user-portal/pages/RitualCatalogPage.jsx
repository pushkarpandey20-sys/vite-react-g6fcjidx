import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppCtx';
import { bookingApi } from '../../../api/bookingApi';
import { Spinner } from '../../../components/common/UIElements';

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

/* ── Seed ritual data ──────────────────────────────────────── */
const SEED = [
  { id:'r1',  name:'Griha Pravesh',        icon:'🏠', price:5100,  description:'Sacred house warming with Vastu puja and havan.', samagriRequired:true,  category:'Home'       },
  { id:'r2',  name:'Satyanarayan Katha',   icon:'🌟', price:2100,  description:'Vishnu puja for blessings, peace and prosperity.', samagriRequired:true,  category:'Wellness'   },
  { id:'r3',  name:'Vivah Puja',           icon:'💍', price:11000, description:'Complete Vedic wedding ceremony with all rituals.', samagriRequired:true,  category:'Life Event' },
  { id:'r4',  name:'Namkaran Ceremony',    icon:'👶', price:3100,  description:'Baby naming ceremony as per Vedic tradition.',      samagriRequired:false, category:'Life Event' },
  { id:'r5',  name:'Rudrabhishek',         icon:'🔱', price:2500,  description:'Shivalinga abhishek for removing doshas.',         samagriRequired:true,  category:'Wellness'   },
  { id:'r6',  name:'Navgrah Shanti',       icon:'⭐', price:4500,  description:'Nine-planet ritual to reduce malefic effects.',    samagriRequired:true,  category:'General'    },
  { id:'r7',  name:'Kaal Sarp Dosh Niv.', icon:'🐍', price:5500,  description:'Neutralize Kaal Sarp dosh in the birth chart.',    samagriRequired:true,  category:'General'    },
  { id:'r8',  name:'Ganesh Puja',          icon:'🐘', price:1500,  description:'Remove obstacles before any new venture.',         samagriRequired:false, category:'Wellness'   },
  { id:'r9',  name:'Temple Abhishek Seva', icon:'🛕', price:2200,  description:'Personal abhishek seva at a nearby temple.',       samagriRequired:false, category:'Temple'     },
  { id:'r10', name:'Vastu Shanti Puja',    icon:'🧿', price:6500,  description:'Full Vastu correction puja for home or office.',   samagriRequired:true,  category:'Home'       },
  { id:'r11', name:'Pitru Shraddha',       icon:'🙏', price:3500,  description:'Ancestor appeasement rituals by Vedic scholars.',  samagriRequired:true,  category:'General'    },
  { id:'r12', name:'Mundan Ceremony',      icon:'✂️', price:2100,  description:'First hair cutting ceremony (chuda karma).',       samagriRequired:false, category:'Life Event' },
  { id:'r13', name:'Laxmi Puja',           icon:'🪷', price:1800,  description:'Goddess of wealth puja for prosperity.',           samagriRequired:true,  category:'Wellness'   },
  { id:'r14', name:'Bhoomi Puja',          icon:'🌱', price:4200,  description:'Land consecration before home construction.',      samagriRequired:true,  category:'Home'       },
  { id:'r15', name:'Durga Saptashati',     icon:'🌸', price:5500,  description:'Complete Durga Saptashati for protection.',        samagriRequired:false, category:'Wellness'   },
  { id:'r16', name:'Annaprasan',           icon:'🍚', price:2500,  description:'First rice feeding ceremony for your baby.',        samagriRequired:false, category:'Life Event' },
  { id:'r17', name:'Upanayan Ceremony',    icon:'🎓', price:8500,  description:'Sacred thread ceremony for young boys.',           samagriRequired:true,  category:'Life Event' },
  { id:'r18', name:'Ram Navami Puja',      icon:'🏹', price:1800,  description:'Special puja for Lord Ram\'s blessings.',          samagriRequired:false, category:'Wellness'   },
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
      const { data } = await bookingApi.getRituals();
      const list = (data?.length > 0)
        ? data.map(r => ({ ...r, _cat: inferCategory(r) }))
        : SEED.map(r  => ({ ...r, _cat: r.category }));
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
    <div style={{ background:'#fff8f0', minHeight:'100%', margin:'-20px', padding:'20px' }}>

      {/* ── On-Demand Strip ─────────────────────────────────── */}
      <div style={{
        background:'linear-gradient(135deg,#fff3e0,#fff8f0)',
        border:'1.5px solid rgba(255,107,0,0.25)',
        borderRadius:16, padding:'16px 20px', marginBottom:22,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        gap:16, flexWrap:'wrap',
        boxShadow:'0 2px 12px rgba(255,107,0,0.08)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:46, height:46, borderRadius:12,
            background:'linear-gradient(135deg,#FF6B00,#FF8C35)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:22, flexShrink:0, boxShadow:'0 4px 12px rgba(255,107,0,0.35)' }}>⚡</div>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
              <span style={{ fontFamily:'Cinzel,serif', color:'#FF6B00', fontWeight:900, fontSize:15 }}>On-Demand Pandit Booking</span>
              <span style={{ background:'rgba(255,107,0,0.1)', color:'#FF6B00', fontSize:9,
                fontWeight:800, padding:'2px 8px', borderRadius:8, border:'1px solid rgba(255,107,0,0.25)',
                letterSpacing:'1px' }}>INSTANT</span>
            </div>
            <p style={{ color:'#8B6347', fontSize:12, margin:0 }}>
              Certified pandit for any custom ritual, consultation, or urgent Vedic guidance — available now.
            </p>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, flexShrink:0 }}>
          <button onClick={() => navigate('/user/instant-booking')} style={{
            background:'linear-gradient(135deg,#FF6B00,#FF8C35)', border:'none', color:'#fff',
            padding:'10px 22px', borderRadius:12, fontWeight:800, cursor:'pointer', fontSize:13,
            boxShadow:'0 4px 14px rgba(255,107,0,0.3)', whiteSpace:'nowrap' }}>
            Book Now →
          </button>
          <button onClick={() => navigate('/user/marketplace')} style={{
            background:'#fff', border:'1.5px solid rgba(212,160,23,0.35)', color:'#8B6347',
            padding:'10px 18px', borderRadius:12, fontWeight:700, cursor:'pointer', fontSize:12, whiteSpace:'nowrap' }}>
            Browse Pandits
          </button>
        </div>
      </div>

      {/* ── Page Header + Search ─────────────────────────────── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, marginBottom:18, flexWrap:'wrap' }}>
        <div>
          <h1 style={{ fontFamily:'Cinzel,serif', color:'#1a0f07', margin:'0 0 3px', fontSize:'clamp(17px,2.5vw,24px)', fontWeight:900 }}>
            🕉️ Sacred Ritual Catalog
          </h1>
          <p style={{ color:'#8B6347', margin:0, fontSize:12 }}>
            {loading ? 'Loading rituals…' : `${rituals.length} Vedic ceremonies · Verified pandits · Pan India`}
          </p>
        </div>
        <div style={{ position:'relative', width:'min(100%,300px)' }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)',
            color:'#C7A96B', fontSize:14, pointerEvents:'none' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search poojas, ceremonies…"
            style={{ width:'100%', padding:'10px 32px 10px 34px', borderRadius:24,
              background:'#fff', border:'1.5px solid rgba(212,160,23,0.3)',
              color:'#1a0f07', fontSize:13, outline:'none', boxSizing:'border-box',
              fontFamily:'Nunito,sans-serif', transition:'border-color 0.2s',
              boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}
            onFocus={e => e.target.style.borderColor='rgba(255,107,0,0.5)'}
            onBlur={e => e.target.style.borderColor='rgba(212,160,23,0.3)'}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position:'absolute', right:10,
              top:'50%', transform:'translateY(-50%)', background:'none', border:'none',
              color:'#C7A96B', cursor:'pointer', fontSize:14 }}>✕</button>
          )}
        </div>
      </div>

      {/* ── Filter Bar ── categories + budget + samagri ─────── */}
      <div style={{ background:'#fff', border:'1px solid rgba(212,160,23,0.2)', borderRadius:14,
        padding:'12px 16px', marginBottom:22, boxShadow:'0 2px 10px rgba(0,0,0,0.04)' }}>

        {/* Category label + horizontal-scroll row */}
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
          <span style={{ fontSize:10, fontWeight:800, color:'#D4A017', letterSpacing:'1px',
            textTransform:'uppercase', flexShrink:0 }}>Categories:</span>
        </div>
        <div className="rc-cat-scroll" style={{ marginBottom:10 }}>
          {CATS.map(cat => {
            const cnt = cat.key === 'All' ? rituals.length : (counts[cat.key] || 0);
            const isOn = activeCat === cat.key;
            return (
              <button key={cat.key} onClick={() => setActiveCat(cat.key)}
                style={{
                  padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:700, cursor:'pointer',
                  border:`1.5px solid ${isOn ? cat.color : 'rgba(139,99,71,0.2)'}`,
                  background: isOn ? cat.color : '#fff',
                  color: isOn ? '#fff' : '#5C3317',
                  transition:'all 0.15s', outline:'none', whiteSpace:'nowrap', flexShrink:0,
                  boxShadow: isOn ? `0 3px 10px ${cat.color}40` : 'none',
                }}>
                {cat.icon} {cat.label}
                {cnt > 0 && <span style={{ marginLeft:5, opacity:0.75, fontSize:10 }}>({cnt})</span>}
              </button>
            );
          })}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>

        {/* Budget divider */}
        <div style={{ width:1, height:22, background:'rgba(212,160,23,0.2)', margin:'0 4px', flexShrink:0 }}/>
        <span style={{ fontSize:10, fontWeight:800, color:'#D4A017', letterSpacing:'1px',
          textTransform:'uppercase', flexShrink:0 }}>Budget:</span>

        {/* Budget pills */}
        {PRICE_OPTIONS.map((pr,i) => {
          const isOn = activePri === i;
          return (
            <button key={i} onClick={() => setActivePri(i)}
              style={{ padding:'6px 12px', borderRadius:20, fontSize:11, fontWeight:700, cursor:'pointer',
                border:`1.5px solid ${isOn ? '#D4A017' : 'rgba(139,99,71,0.2)'}`,
                background: isOn ? '#D4A017' : '#fff',
                color: isOn ? '#fff' : '#5C3317', transition:'all 0.15s', outline:'none',
              }}>{pr.label}</button>
          );
        })}

        {/* Samagri toggle */}
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          <label style={{ display:'flex', alignItems:'center', gap:7, cursor:'pointer', userSelect:'none' }}>
            <div onClick={() => setSamagri(s => !s)}
              style={{ width:36, height:20, borderRadius:10,
                background: samagri ? '#FF6B00' : 'rgba(139,99,71,0.15)',
                border:`1.5px solid ${samagri ? '#FF6B00' : 'rgba(139,99,71,0.25)'}`,
                position:'relative', cursor:'pointer', transition:'all 0.2s', flexShrink:0 }}>
              <div style={{ position:'absolute', top:2, left: samagri ? 16 : 2,
                width:12, height:12, borderRadius:'50%', background:'#fff',
                transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }}/>
            </div>
            <span style={{ fontSize:12, fontWeight:700, color:'#5C3317', whiteSpace:'nowrap' }}>📦 Samagri Only</span>
          </label>
        </div>
        </div>{/* end budget+samagri row */}
      </div>{/* end filter bar */}

      {/* ── Results count ────────────────────────────────────── */}
      {!loading && (
        <div style={{ marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:13, color:'#8B6347' }}>
            Showing <strong style={{ color:'#1a0f07' }}>{filtered.length}</strong> ritual{filtered.length !== 1 ? 's' : ''}
            {activeCat !== 'All' && <span style={{ color:'#D4A017' }}> · {activeCat}</span>}
            {PRICE_OPTIONS[activePri].max < 99999 && <span style={{ color:'#D4A017' }}> · {PRICE_OPTIONS[activePri].label}</span>}
          </span>
          {(activeCat !== 'All' || activePri !== 0 || samagri || search) && (
            <button onClick={() => { setActiveCat('All'); setActivePri(0); setSamagri(false); setSearch(''); }}
              style={{ fontSize:11, color:'#C0392B', background:'rgba(192,57,43,0.07)', border:'1px solid rgba(192,57,43,0.2)',
                borderRadius:12, padding:'3px 10px', cursor:'pointer', fontWeight:700 }}>
              ✕ Reset
            </button>
          )}
        </div>
      )}

      {/* ── Ritual Grid ──────────────────────────────────────── */}
      {loading ? (
        <div style={{ padding:'80px 0', display:'flex', justifyContent:'center' }}><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', background:'#fff',
          borderRadius:16, border:'1px solid rgba(212,160,23,0.15)',
          boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
          <div style={{ fontFamily:'Cinzel,serif', color:'#1a0f07', marginBottom:6 }}>No Rituals Found</div>
          <div style={{ color:'#8B6347', fontSize:13, marginBottom:18 }}>Try a different category or budget</div>
          <button className="btn btn-primary" onClick={() => { setActiveCat('All'); setActivePri(0); setSearch(''); setSamagri(false); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:14 }}>
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
