import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppCtx';
import { supabase } from '../../../services/supabase';
import { Spinner } from '../../../components/common/UIElements';
import { SEED_PANDITS } from '../../../data/seedData';

const QUICK_RITUALS = ['Griha Pravesh','Satyanarayan Katha','Rudrabhishek','Navgrah Shanti','Vivah','Mundan','Namkaran','Lakshmi Puja','Kaal Sarp Dosh','Custom Pooja'];

const CITY_COORDS = {
  'Delhi':     { lat: 28.6139, lng: 77.2090 },
  'Gurgaon':   { lat: 28.4595, lng: 77.0266 },
  'Noida':     { lat: 28.5355, lng: 77.3910 },
  'Faridabad': { lat: 28.4089, lng: 77.3178 },
  'Ghaziabad': { lat: 28.6692, lng: 77.4538 },
  'Mumbai':    { lat: 19.0760, lng: 72.8777 },
  'Bengaluru': { lat: 12.9716, lng: 77.5946 },
  'Ayodhya':   { lat: 26.7922, lng: 82.1998 },
  'Varanasi':  { lat: 25.3176, lng: 82.9739 },
  'Ujjain':    { lat: 23.1765, lng: 75.7885 },
};

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
    Math.sin(dLon/2)*Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function PanditVideoModal({ pandit, onClose }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={onClose}>
      <div style={{ background:'#fff', borderRadius:16, padding:24, maxWidth:540, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{ fontFamily:'Cinzel,serif', color:'#1a0f07', fontWeight:700, fontSize:16 }}>{pandit.name} — 60s Intro</div>
          <button onClick={onClose} style={{ background:'#f5f5f5', border:'none', color:'#666', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:16 }}>✕</button>
        </div>
        {pandit.intro_video_url ? (
          <video src={pandit.intro_video_url} controls autoPlay style={{ width:'100%', borderRadius:10 }} />
        ) : (
          <div style={{ background:'#fff8f0', border:'1px solid rgba(212,160,23,0.2)', borderRadius:12, padding:24, textAlign:'center' }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🙏</div>
            <div style={{ color:'#1a0f07', fontWeight:700, fontSize:16, marginBottom:8 }}>{pandit.name}</div>
            <div style={{ color:'#4a3728', fontSize:13, lineHeight:1.7 }}>
              {pandit.bio || `${pandit.name} is a verified Vedic scholar with ${pandit.years_of_experience || 5}+ years of experience. Specializes in ${(pandit.specializations||['Pooja']).join(', ')}.`}
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:24, marginTop:16 }}>
              {[['⭐', `${pandit.rating || 4.8} Rating`], ['📍', pandit.city || 'India'], ['🗓️', `${pandit.years_of_experience || 5}+ yrs`]].map(([i,l]) => (
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:20 }}>{i}</div>
                  <div style={{ color:'#9a8070', fontSize:11, marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PanditCard({ p, isNearby, onView, onVideoClick }) {
  const specs = Array.isArray(p.specializations) ? p.specializations :
    (typeof p.specializations === 'string' ? p.specializations.split(',').map(s=>s.trim()) : []);

  return (
    <div style={{ background:'#ffffff', border:`1px solid ${isNearby?'rgba(34,197,94,0.4)':'rgba(212,160,23,0.2)'}`, borderRadius:14, padding:18, position:'relative', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', transition:'all 0.2s' }}
      onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.06)'; }}>

      {isNearby && (
        <div style={{ position:'absolute', top:-1, left:16, background:'rgba(34,197,94,0.15)', color:'#166534', fontSize:10, fontWeight:800, padding:'4px 12px', borderRadius:'0 0 8px 8px', border:'1px solid rgba(34,197,94,0.3)', borderTop:'none' }}>
          📍 Near You
        </div>
      )}

      <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12, marginTop: isNearby ? 12 : 0 }}>
        <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,rgba(255,107,0,0.15),rgba(212,160,23,0.2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
          🙏
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ color:'#1a0f07', fontFamily:'Cinzel,serif', fontWeight:700, fontSize:15, marginBottom:2 }}>{p.name}</div>
          <div style={{ color:'#9a8070', fontSize:12 }}>📍 {p.city || 'India'} · {p.years_of_experience || 5}+ yrs</div>
          {p.is_online && <span style={{ background:'rgba(34,197,94,0.12)', color:'#15803d', fontSize:10, padding:'2px 8px', borderRadius:10, fontWeight:700, marginTop:3, display:'inline-block' }}>🟢 Online</span>}
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div style={{ color:'#FF6B00', fontWeight:800, fontSize:15 }}>⭐ {p.rating || 4.8}</div>
          <div style={{ color:'#9a8070', fontSize:10 }}>{p.review_count || 0} reviews</div>
        </div>
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:12 }}>
        {specs.slice(0,3).map(s=>(
          <span key={s} style={{ background:'#fff8f0', color:'#D4A017', fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:600, border:'1px solid rgba(212,160,23,0.2)' }}>{s}</span>
        ))}
        {specs.length > 3 && <span style={{ color:'#9a8070', fontSize:11, padding:'3px 6px' }}>+{specs.length-3} more</span>}
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <div style={{ color:'#FF6B00', fontWeight:800, fontSize:16 }}>
          ₹{p.min_fee || 500} – ₹{p.max_fee || 2000}
        </div>
        <div style={{ color:'#9a8070', fontSize:11 }}>per ritual</div>
      </div>

      <div style={{ display:'flex', gap:8 }}>
        <button onClick={()=>onVideoClick(p)}
          style={{ background:'rgba(109,40,217,0.08)', color:'#6d28d9', border:'1px solid rgba(109,40,217,0.25)', borderRadius:20, padding:'7px 12px', cursor:'pointer', fontSize:12, fontWeight:700, flexShrink:0 }}>
          ▶ 60s Intro
        </button>
        <button onClick={()=>onView(p)}
          style={{ flex:1, background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff', border:'none', borderRadius:20, padding:'7px 14px', cursor:'pointer', fontSize:13, fontWeight:700 }}>
          View & Book
        </button>
      </div>
    </div>
  );
}

export default function PanditMarketplacePage() {
  const { setViewPandit } = useApp();
  const navigate = useNavigate();
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearbyCity, setNearbyCity] = useState(null);
  const [videoModal, setVideoModal] = useState(null);
  const [quickRitual, setQuickRitual] = useState('');
  const [quickDate, setQuickDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter state
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [specFilter, setSpecFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('0');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sortBy, setSortBy] = useState('nearby');

  // Detect nearest city
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      let closest = null, minDist = Infinity;
      Object.entries(CITY_COORDS).forEach(([city, coords]) => {
        const d = getDistanceKm(latitude, longitude, coords.lat, coords.lng);
        if (d < minDist) { minDist = d; closest = city; }
      });
      if (closest) setNearbyCity(closest);
    }, () => {});
  }, []);

  // Fetch pandits
  useEffect(() => {
    setLoading(true);
    (async () => {
      const { data } = await supabase.from('pandits').select('*').eq('status', 'verified').order('rating', { ascending: false });
      const list = (data && data.length > 0) ? data : SEED_PANDITS;
      setPandits(list);
      setLoading(false);
    })();
  }, []);

  // Client-side filter + sort
  const filtered = pandits
    .filter(p => !search || (p.name||'').toLowerCase().includes(search.toLowerCase()))
    .filter(p => cityFilter === 'All' || p.city === cityFilter)
    .filter(p => specFilter === 'All' || (Array.isArray(p.specializations) ? p.specializations : []).includes(specFilter))
    .filter(p => (p.years_of_experience || 0) >= parseInt(expFilter))
    .filter(p => !onlineOnly || p.is_online)
    .sort((a, b) => {
      if (sortBy === 'nearby') {
        const aN = a.city === nearbyCity ? 0 : 1, bN = b.city === nearbyCity ? 0 : 1;
        if (aN !== bN) return aN - bN;
        return (b.rating||0) - (a.rating||0);
      }
      if (sortBy === 'rating') return (b.rating||0) - (a.rating||0);
      if (sortBy === 'fee_low') return (a.min_fee||0) - (b.min_fee||0);
      if (sortBy === 'fee_high') return (b.min_fee||0) - (a.min_fee||0);
      return 0;
    });

  const selStyle = { padding:'7px 10px', borderRadius:8, border:'1.5px solid rgba(212,160,23,0.3)', background:'#fff', color:'#1a0f07', fontSize:12, cursor:'pointer', outline:'none' };
  const hasFilters = search || cityFilter !== 'All' || specFilter !== 'All' || expFilter !== '0' || onlineOnly;

  return (
    <div style={{ background:'#fff8f0', minHeight:'100vh' }}>
      {/* Page Header */}
      <div style={{ padding:'20px 0 0' }}>
        <h1 style={{ color:'#1a0f07', fontFamily:'Cinzel,serif', margin:'0 0 4px', fontSize:22 }}>🙏 Find Your Pandit</h1>
        <p style={{ color:'#9a8070', margin:'0 0 12px', fontSize:13 }}>Verified Vedic scholars · DevSetu certified</p>

        {/* On-Demand Quick Booking */}
        <div style={{ background:'linear-gradient(135deg,rgba(255,107,0,0.08),rgba(212,160,23,0.06))', border:'1px solid rgba(255,107,0,0.2)', borderRadius:12, padding:'14px 16px', marginBottom:16 }}>
          <div style={{ color:'#FF6B00', fontWeight:800, fontSize:13, marginBottom:10 }}>⚡ Book Any Available Pandit Instantly</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'flex-end' }}>
            <select value={quickRitual} onChange={e=>setQuickRitual(e.target.value)}
              style={{ flex:'1 1 160px', padding:'8px 12px', borderRadius:8, border:'1.5px solid rgba(255,107,0,0.3)', background:'#fff', color:'#1a0f07', fontSize:13, outline:'none' }}>
              <option value="">🕉️ Select Ritual / Package</option>
              {QUICK_RITUALS.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
            <input type="date" value={quickDate} onChange={e=>setQuickDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
              style={{ flex:'1 1 130px', padding:'8px 12px', borderRadius:8, border:'1.5px solid rgba(255,107,0,0.3)', background:'#fff', color:'#1a0f07', fontSize:13, outline:'none' }} />
            <button onClick={() => { if (!quickRitual) return; navigate('/user/booking', { state: { prefilledRitual: quickRitual, prefilledDate: quickDate } }); }}
              style={{ flex:'0 0 auto', background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff', border:'none', borderRadius:8, padding:'9px 20px', fontWeight:800, cursor:'pointer', fontSize:13, whiteSpace:'nowrap' }}>
              Book Now →
            </button>
          </div>
        </div>

        {nearbyCity && (
          <div style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:10, padding:'8px 14px', marginBottom:12, display:'inline-flex', alignItems:'center', gap:8 }}>
            <span>📍</span>
            <span style={{ fontSize:13, color:'#166534', fontWeight:600 }}>Showing pandits near {nearbyCity} first</span>
          </div>
        )}

        {/* Compact Filter Bar */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', padding:'12px 16px', background:'#ffffff', borderRadius:12, border:'1px solid rgba(212,160,23,0.2)', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', marginBottom:20 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name..."
            style={{ ...selStyle, width:140 }} />

          <select value={cityFilter} onChange={e=>setCityFilter(e.target.value)} style={selStyle}>
            <option value="All">📍 All Cities</option>
            {['Delhi','Noida','Gurgaon','Mumbai','Bengaluru','Ayodhya','Varanasi','Ujjain','Faridabad','Ghaziabad'].map(c=><option key={c}>{c}</option>)}
          </select>

          <select value={specFilter} onChange={e=>setSpecFilter(e.target.value)} style={selStyle}>
            <option value="All">🕉️ All Rituals</option>
            {['Griha Pravesh','Satyanarayan','Vivah','Rudrabhishek','Navgrah','Kaal Sarp','Mundan','Namkaran','Vastu Shastra','Astrology'].map(s=><option key={s}>{s}</option>)}
          </select>

          <select value={expFilter} onChange={e=>setExpFilter(e.target.value)} style={selStyle}>
            <option value="0">⏳ Any Exp</option>
            <option value="5">5+ yrs</option>
            <option value="10">10+ yrs</option>
            <option value="15">15+ yrs</option>
            <option value="20">20+ yrs</option>
          </select>

          <label style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer', fontSize:12, color:'#4a3728', fontWeight:600, whiteSpace:'nowrap' }}>
            <input type="checkbox" checked={onlineOnly} onChange={e=>setOnlineOnly(e.target.checked)} style={{ width:'auto', accentColor:'#22c55e' }} />
            🟢 Online Now
          </label>

          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ ...selStyle, marginLeft:'auto' }}>
            <option value="nearby">📍 Nearest First</option>
            <option value="rating">⭐ Top Rated</option>
            <option value="fee_low">₹ Low → High</option>
            <option value="fee_high">₹ High → Low</option>
          </select>

          {hasFilters && (
            <button onClick={()=>{setSearch('');setCityFilter('All');setSpecFilter('All');setExpFilter('0');setOnlineOnly(false);setSortBy('nearby');}}
              style={{ padding:'7px 12px', borderRadius:8, border:'1px solid #ddd', background:'#f5f5f5', color:'#666', fontSize:12, cursor:'pointer', whiteSpace:'nowrap' }}>
              Reset ✕
            </button>
          )}

          <div style={{ color:'#9a8070', fontSize:12, whiteSpace:'nowrap' }}>
            {loading ? 'Loading...' : `${filtered.length} pandits`}
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? <Spinner /> : (
        filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px', background:'#ffffff', borderRadius:14, border:'1px solid rgba(212,160,23,0.2)' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🕉️</div>
            <h3 style={{ fontFamily:'Cinzel,serif', color:'#D4A017', marginBottom:8 }}>No Pandits Found</h3>
            <p style={{ color:'#9a8070' }}>Try resetting your filters.</p>
            <button style={{ background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff', border:'none', borderRadius:20, padding:'10px 24px', fontWeight:700, cursor:'pointer', marginTop:16 }}
              onClick={()=>{setSearch('');setCityFilter('All');setSpecFilter('All');setExpFilter('0');setOnlineOnly(false);}}>Reset Filters</button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
            {filtered.map(p=>(
              <PanditCard
                key={p.id}
                p={p}
                isNearby={!!(nearbyCity && p.city === nearbyCity)}
                onView={setViewPandit}
                onVideoClick={setVideoModal}
              />
            ))}
          </div>
        )
      )}

      {videoModal && <PanditVideoModal pandit={videoModal} onClose={()=>setVideoModal(null)} />}
    </div>
  );
}
