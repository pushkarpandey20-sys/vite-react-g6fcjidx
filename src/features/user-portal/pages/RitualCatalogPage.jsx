import React, { useState, useEffect } from 'react';
import { useApp } from '../../../store/AppCtx';
import { bookingApi } from '../../../api/bookingApi';
import { Spinner } from '../../../components/common/UIElements';
import { useNavigate } from 'react-router-dom';

/* ── Category inference ───────────────────────────────── */
function inferCategory(r) {
  if (r.category) return r.category;
  const text = ((r.name || '') + ' ' + (r.description || '')).toLowerCase();
  if (/vivah|wedding|marriage|shaadi|mundan|namkaran|annaprasan|upanayan|birthday|janamdin/.test(text)) return 'Life Event';
  if (/griha pravesh|vastu|home|ghar|house|bhoomi/.test(text)) return 'Home';
  if (/temple|mandir|seva/.test(text)) return 'Temple';
  if (/lakshmi|saraswati|durga|navratri|devi|mata|rudrabhishek|shiva|vishnu|krishna|ram|hanuman|ganesh|satyanarayan/.test(text)) return 'Wellness';
  if (/navgrah|kaal sarp|mangal dosh|graha|planet|shani|dosh|shraddha|pitru/.test(text)) return 'General';
  return 'General';
}

/* ── Category metadata (7 tabs, matching user request) ── */
const CATS = [
  { key: 'All',        icon: '🕉️',  label: 'All',         color: '#F0C040', bg: 'rgba(240,192,64,0.12)' },
  { key: 'General',    icon: '✨',   label: 'General',     color: '#FF9F40', bg: 'rgba(255,159,64,0.1)'  },
  { key: 'Home',       icon: '🏠',   label: 'Home',        color: '#4ECDC4', bg: 'rgba(78,205,196,0.1)'  },
  { key: 'Temple',     icon: '🛕',   label: 'Temple',      color: '#E67E22', bg: 'rgba(230,126,34,0.1)'  },
  { key: 'Life Event', icon: '💍',   label: 'Life Event',  color: '#FF6B6B', bg: 'rgba(255,107,107,0.1)' },
  { key: 'Wellness',   icon: '🪔',   label: 'Wellness',    color: '#9B59B6', bg: 'rgba(155,89,182,0.1)'  },
  { key: 'Special',    icon: '⭐',   label: 'Special',     color: '#F0C040', bg: 'rgba(240,192,64,0.1)'  },
];

/* ── Seed ritual data as fallback ──────────────────────── */
const SEED_RITUALS = [
  { id:'r1', name:'Griha Pravesh', icon:'🏠', price:5100, description:'Sacred house warming ceremony with Vastu puja and havan.', samagriRequired:true, category:'Home' },
  { id:'r2', name:'Satyanarayan Katha', icon:'🌟', price:2100, description:'Vishnu puja for blessings, peace and prosperity in family.', samagriRequired:true, category:'Wellness' },
  { id:'r3', name:'Vivah Puja', icon:'💍', price:11000, description:'Complete Vedic wedding ceremony with all rituals and samagri.', samagriRequired:true, category:'Life Event' },
  { id:'r4', name:'Namkaran Ceremony', icon:'👶', price:3100, description:'Baby naming ceremony as per Vedic tradition and family gotra.', samagriRequired:false, category:'Life Event' },
  { id:'r5', name:'Rudrabhishek', icon:'🔱', price:2500, description:'Sacred Shivalinga abhishek for removing doshas and blessings.', samagriRequired:true, category:'Wellness' },
  { id:'r6', name:'Navgrah Shanti', icon:'⭐', price:4500, description:'Nine-planet pacification ritual to reduce malefic planetary effects.', samagriRequired:true, category:'General' },
  { id:'r7', name:'Kaal Sarp Dosh Nivaran', icon:'🐍', price:5500, description:'Powerful ritual to neutralize Kaal Sarp dosh in the birth chart.', samagriRequired:true, category:'General' },
  { id:'r8', name:'Ganesh Puja', icon:'🐘', price:1500, description:'Remove obstacles before any new venture, job, or auspicious event.', samagriRequired:false, category:'Wellness' },
  { id:'r9', name:'Temple Abhishek Seva', icon:'🛕', price:2200, description:'Personal abhishek seva at a nearby temple on your behalf.', samagriRequired:false, category:'Temple' },
  { id:'r10', name:'Vastu Shanti Puja', icon:'🧿', price:6500, description:'Full Vastu correction and grih shanti puja for your home or office.', samagriRequired:true, category:'Home' },
  { id:'r11', name:'Pitru Paksha Shraddha', icon:'🙏', price:3500, description:'Annual ancestor appeasement rituals performed by trained Vedic scholars.', samagriRequired:true, category:'General' },
  { id:'r12', name:'Mundan Ceremony', icon:'✂️', price:2100, description:'First hair cutting ceremony (chuda karma) for your baby.', samagriRequired:false, category:'Life Event' },
  { id:'r13', name:'Laxmi Puja', icon:'🪷', price:1800, description:'Goddess of wealth puja for financial prosperity and good fortune.', samagriRequired:true, category:'Wellness' },
  { id:'r14', name:'Bhoomi Puja', icon:'🌱', price:4200, description:'Land consecration ritual before construction of home or building.', samagriRequired:true, category:'Home' },
  { id:'r15', name:'Durga Saptashati Path', icon:'🌸', price:5500, description:'Complete recitation of Durga Saptashati for protection and blessings.', samagriRequired:false, category:'Wellness' },
  { id:'r16', name:'Ram Navami Puja', icon:'🏹', price:1800, description:'Special puja on Ram Navami or any day for Lord Ram\'s blessings.', samagriRequired:false, category:'Wellness' },
  { id:'r17', name:'Upanayan Ceremony', icon:'🎓', price:8500, description:'Sacred thread (janeu) ceremony for young boys entering Vedic education.', samagriRequired:true, category:'Life Event' },
  { id:'r18', name:'Annaprasan Ceremony', icon:'🍚', price:2500, description:'First rice feeding ceremony for your baby — important life milestone.', samagriRequired:false, category:'Life Event' },
];

const PRICE_RANGES = [
  { label: 'Under ₹2K',   max: 2000  },
  { label: '₹2K–5K',      max: 5000  },
  { label: '₹5K–10K',     max: 10000 },
  { label: 'Any Budget',  max: 99999 },
];

export default function RitualCatalogPage() {
  const { toast } = useApp();
  const navigate = useNavigate();
  const [rituals, setRituals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePriceRange, setActivePriceRange] = useState(3); // 'Any Budget' default
  const [searchQuery, setSearchQuery] = useState('');
  const [samagriOnly, setSamagriOnly] = useState(false);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    (async () => {
      const { data } = await bookingApi.getRituals();
      const list = (data && data.length > 0)
        ? data.map(r => ({ ...r, _cat: inferCategory(r) }))
        : SEED_RITUALS.map(r => ({ ...r, _cat: r.category }));
      setRituals(list);
      const c = { All: list.length };
      list.forEach(r => { c[r._cat] = (c[r._cat] || 0) + 1; });
      // also count 'Special' for featured/samagriRequired
      c['Special'] = list.filter(r => r.samagriRequired).length;
      setCounts(c);
      setLoading(false);
    })();
  }, []);

  const maxPrice = PRICE_RANGES[activePriceRange].max;
  const filtered = rituals.filter(r => {
    if (activeCategory !== 'All') {
      if (activeCategory === 'Special') { if (!r.samagriRequired) return false; }
      else { if (r._cat !== activeCategory) return false; }
    }
    if (r.price > maxPrice) return false;
    if (samagriOnly && !r.samagriRequired) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(r.name?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  const handleBook = (r) => navigate('/user/booking', { state: { selectedRitual: r } });

  return (
    <div style={{ paddingBottom: 60 }}>

      {/* ── On-Demand Highlight Strip (mirrors Find Pandits quick-booking) ── */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(255,107,0,0.14),rgba(212,160,23,0.06))',
        border: '1px solid rgba(255,107,0,0.28)',
        borderRadius: 20,
        padding: '20px 24px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140,
          background:'radial-gradient(ellipse,rgba(255,107,0,0.12) 0%,transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ width:52, height:52, borderRadius:16,
            background:'linear-gradient(135deg,rgba(255,107,0,0.25),rgba(212,160,23,0.15))',
            border:'1px solid rgba(255,107,0,0.4)',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>⚡</div>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <h3 style={{ fontFamily:'Cinzel,serif', color:'#FF9F40', margin:0, fontSize:17, fontWeight:900 }}>Book On-Demand Pandit</h3>
              <span style={{ background:'rgba(255,107,0,0.2)', color:'#FF9F40', fontSize:10,
                fontWeight:800, padding:'2px 8px', borderRadius:10, border:'1px solid rgba(255,107,0,0.3)', letterSpacing:1 }}>INSTANT</span>
            </div>
            <p style={{ color:'rgba(255,248,240,0.5)', fontSize:13, margin:0 }}>
              Need a certified pandit immediately? Book a scholar for any custom ritual, consultation, or urgent Vedic guidance.
            </p>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, flexShrink:0 }}>
          <button
            onClick={() => navigate('/user/instant-booking')}
            style={{ background:'linear-gradient(135deg,#FF6B00,#F0C040)', border:'none', color:'#fff',
              padding:'13px 26px', borderRadius:14, fontWeight:800, cursor:'pointer', fontSize:14,
              boxShadow:'0 6px 20px rgba(255,107,0,0.35)', whiteSpace:'nowrap' }}>
            Book Now →
          </button>
          <button
            onClick={() => navigate('/user/marketplace')}
            style={{ background:'rgba(255,248,240,0.06)', border:'1px solid rgba(240,192,64,0.2)', color:'rgba(255,248,240,0.7)',
              padding:'13px 20px', borderRadius:14, fontWeight:700, cursor:'pointer', fontSize:13, whiteSpace:'nowrap' }}>
            Browse Pandits
          </button>
        </div>
      </div>

      {/* ── Hero + Search ── */}
      <div style={{ marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
        <div>
          <h1 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', margin:'0 0 4px', fontSize:'clamp(18px,3vw,26px)', fontWeight:900 }}>
            🕉️ Sacred Ritual Catalog
          </h1>
          <p style={{ color:'rgba(255,248,240,0.45)', margin:0, fontSize:13 }}>
            108+ Vedic ceremonies · Verified scholars · Pan India
          </p>
        </div>
        {/* Search */}
        <div style={{ position:'relative', flexShrink:0, width:'min(100%,320px)' }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
            color:'rgba(255,248,240,0.35)', fontSize:16, pointerEvents:'none' }}>🔍</span>
          <input
            style={{ width:'100%', padding:'11px 38px 11px 38px', borderRadius:28,
              background:'rgba(255,248,240,0.05)', border:'1.5px solid rgba(240,192,64,0.18)',
              color:'rgba(255,248,240,0.88)', fontSize:14, outline:'none', boxSizing:'border-box',
              transition:'border-color 0.2s', fontFamily:'Nunito,sans-serif' }}
            placeholder="Search rituals, poojas…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={e => e.target.style.borderColor='rgba(240,192,64,0.45)'}
            onBlur={e => e.target.style.borderColor='rgba(240,192,64,0.18)'}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                background:'none', border:'none', color:'rgba(255,248,240,0.4)', cursor:'pointer', fontSize:16 }}>✕</button>
          )}
        </div>
      </div>

      {/* ── Category Cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:10, marginBottom:20 }}>
        {CATS.map(cat => {
          const count = cat.key === 'All' ? rituals.length : (counts[cat.key] || 0);
          const isActive = activeCategory === cat.key;
          return (
            <button key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                background: isActive ? cat.bg : 'rgba(26,15,7,0.7)',
                border: `1.5px solid ${isActive ? cat.color : 'rgba(240,192,64,0.1)'}`,
                borderRadius: 16,
                padding: '14px 8px 12px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                boxShadow: isActive ? `0 4px 18px ${cat.color}30` : 'none',
                backdropFilter: 'blur(10px)',
                outline: 'none',
              }}>
              <div style={{ fontSize: 22, marginBottom: 5 }}>{cat.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 11, color: isActive ? cat.color : 'rgba(255,248,240,0.65)',
                fontFamily:'Cinzel,serif', letterSpacing:'0.3px', lineHeight:1.2 }}>{cat.label}</div>
              {count > 0 && (
                <div style={{ marginTop: 5, fontSize: 10, fontWeight: 700,
                  color: isActive ? cat.color : 'rgba(255,248,240,0.3)',
                  background: isActive ? `${cat.color}15` : 'rgba(255,255,255,0.04)',
                  borderRadius: 8, padding: '2px 6px', display:'inline-block' }}>{count}</div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Filter Bar ── */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24, flexWrap:'wrap' }}>
        {/* Budget range pills */}
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ color:'rgba(240,192,64,0.6)', fontSize:11, fontWeight:700, letterSpacing:'0.5px', whiteSpace:'nowrap' }}>💰 BUDGET</span>
          {PRICE_RANGES.map((pr, i) => (
            <button key={i}
              onClick={() => setActivePriceRange(i)}
              style={{
                padding: '7px 14px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                border: `1.5px solid ${activePriceRange === i ? '#F0C040' : 'rgba(240,192,64,0.15)'}`,
                background: activePriceRange === i ? 'rgba(240,192,64,0.12)' : 'rgba(26,15,7,0.7)',
                color: activePriceRange === i ? '#F0C040' : 'rgba(255,248,240,0.5)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                outline: 'none',
              }}>{pr.label}</button>
          ))}
        </div>

        {/* Samagri toggle */}
        <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', marginLeft:'auto', userSelect:'none' }}>
          <div
            onClick={() => setSamagriOnly(s => !s)}
            style={{ width:38, height:22, borderRadius:11,
              background: samagriOnly ? '#FF6B00' : 'rgba(255,248,240,0.1)',
              border: `1.5px solid ${samagriOnly ? '#FF6B00' : 'rgba(240,192,64,0.2)'}`,
              position:'relative', cursor:'pointer', transition:'all 0.2s', flexShrink:0 }}>
            <div style={{ position:'absolute', top:2, left: samagriOnly ? 18 : 2, width:14, height:14,
              borderRadius:'50%', background:'#fff', transition:'left 0.2s' }}/>
          </div>
          <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,248,240,0.65)' }}>📦 With Samagri</span>
        </label>

        {/* Results count */}
        <div style={{ fontSize:13, color:'rgba(255,248,240,0.45)', marginLeft:8, whiteSpace:'nowrap' }}>
          {!loading && <><strong style={{ color:'rgba(255,248,240,0.8)' }}>{filtered.length}</strong> rituals</>}
        </div>
      </div>

      {/* ── Ritual Grid ── */}
      {loading ? (
        <div style={{ padding:'80px 0', display:'flex', justifyContent:'center' }}><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px',
          background:'rgba(26,15,7,0.6)', borderRadius:18, border:'1px solid rgba(240,192,64,0.1)' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
          <div style={{ fontFamily:'Cinzel,serif', color:'#F0C040', marginBottom:8 }}>No Rituals Found</div>
          <div style={{ color:'rgba(255,248,240,0.4)', fontSize:13, marginBottom:20 }}>Try a different category or budget range</div>
          <button className="btn btn-outline" onClick={() => { setActiveCategory('All'); setActivePriceRange(3); setSearchQuery(''); setSamagriOnly(false); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
          {filtered.map(r => <RitualCard key={r.id} r={r} onBook={handleBook} />)}
        </div>
      )}
    </div>
  );
}

/* ── Ritual Card Component ────────────────────────────── */
function RitualCard({ r, onBook }) {
  const [hovered, setHovered] = useState(false);
  const catColor = CATS.find(c => c.key === r._cat)?.color || '#F0C040';
  const priceLabel = r.price ? `₹${r.price.toLocaleString('en-IN')}` : 'Custom';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(44,26,14,0.9)' : 'rgba(26,15,7,0.75)',
        border: `1.5px solid ${hovered ? 'rgba(240,192,64,0.3)' : 'rgba(240,192,64,0.12)'}`,
        borderRadius: 18,
        padding: '20px',
        transition: 'all 0.25s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 12px 36px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.25)',
        backdropFilter: 'blur(14px)',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>
      {/* Icon + Badges */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <div style={{ width:52, height:52, borderRadius:16,
          background:`${catColor}18`, border:`1px solid ${catColor}30`,
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>
          {r.icon || '🕉️'}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:5, alignItems:'flex-end' }}>
          {r.samagriRequired && (
            <span style={{ fontSize:10, fontWeight:800, padding:'3px 8px', borderRadius:8,
              background:'rgba(255,107,0,0.12)', color:'#FF9F40', border:'1px solid rgba(255,107,0,0.2)',
              letterSpacing:'0.5px' }}>📦 SAMAGRI</span>
          )}
          <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:8,
            background:`${catColor}12`, color:catColor, border:`1px solid ${catColor}25` }}>
            {r._cat}
          </span>
        </div>
      </div>

      {/* Name */}
      <h3 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', margin:'0 0 8px',
        fontSize:15, fontWeight:700, lineHeight:1.3 }}>{r.name}</h3>

      {/* Description */}
      <p style={{ color:'rgba(255,248,240,0.5)', fontSize:12, lineHeight:1.6,
        margin:'0 0 16px', flex:1, display:'-webkit-box', WebkitLineClamp:2,
        WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        {r.description}
      </p>

      {/* Price + CTA */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12,
        borderTop:'1px solid rgba(240,192,64,0.08)' }}>
        <div>
          <div style={{ fontSize:10, color:'rgba(255,248,240,0.35)', fontWeight:600 }}>Starting from</div>
          <div style={{ fontFamily:'Cinzel,serif', color:'#FF9F40', fontWeight:900, fontSize:18 }}>{priceLabel}</div>
        </div>
        <button
          onClick={() => onBook(r)}
          style={{
            background: hovered ? 'linear-gradient(135deg,#FF6B00,#F0C040)' : 'rgba(255,107,0,0.12)',
            border: `1.5px solid ${hovered ? 'transparent' : 'rgba(255,107,0,0.3)'}`,
            color: hovered ? '#fff' : '#FF9F40',
            padding: '9px 18px',
            borderRadius: 12,
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
            boxShadow: hovered ? '0 4px 16px rgba(255,107,0,0.4)' : 'none',
          }}>
          Book Now →
        </button>
      </div>
    </div>
  );
}
