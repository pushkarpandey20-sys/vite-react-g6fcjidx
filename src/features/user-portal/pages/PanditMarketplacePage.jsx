import React, { useState, useEffect } from 'react';
import { useApp } from '../../../store/AppCtx';
import { supabase } from '../../../services/supabase';
import { Spinner } from '../../../components/common/UIElements';
import { SEED_PANDITS } from '../../../data/seedData';

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
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={onClose}>
      <div style={{ background:'#1a0f07', border:'1px solid rgba(212,160,23,0.3)', borderRadius:16, padding:24, maxWidth:560, width:'100%' }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontWeight:700 }}>{pandit.name} — 60s Intro</div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:16 }}>✕</button>
        </div>
        {pandit.intro_video_url ? (
          <video src={pandit.intro_video_url} controls autoPlay style={{ width:'100%', borderRadius:10, background:'#000' }} />
        ) : (
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,160,23,0.15)', borderRadius:12, padding:24 }}>
            <div style={{ fontSize:48, textAlign:'center', marginBottom:12 }}>🙏</div>
            <div style={{ color:'#F0C040', fontWeight:700, fontSize:16, textAlign:'center', marginBottom:8 }}>{pandit.name}</div>
            <div style={{ color:'rgba(255,248,240,0.6)', fontSize:13, lineHeight:1.7, textAlign:'center' }}>
              {pandit.bio || `${pandit.name} is a verified Vedic scholar with ${pandit.years_of_experience || 5}+ years of experience. Specializes in ${(pandit.specializations||['Pooja']).join(', ')}.`}
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:24, marginTop:16, flexWrap:'wrap' }}>
              {[['⭐', `${pandit.rating || 4.8} Rating`], ['📍', pandit.city || 'India'], ['🗓️', `${pandit.years_of_experience || 5}+ yrs`]].map(([i,l]) => (
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:20 }}>{i}</div>
                  <div style={{ color:'rgba(255,248,240,0.5)', fontSize:11, marginTop:4 }}>{l}</div>
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
    <div style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${isNearby?'rgba(255,107,0,0.4)':'rgba(212,160,23,0.12)'}`, borderRadius:14, padding:20, position:'relative', transition:'all 0.2s' }}
      onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor=isNearby?'rgba(255,107,0,0.7)':'rgba(212,160,23,0.35)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor=isNearby?'rgba(255,107,0,0.4)':'rgba(212,160,23,0.12)'; }}>

      {isNearby && (
        <div style={{ position:'absolute', top:-1, left:16, background:'linear-gradient(135deg,#FF6B00,#FF8C35)', color:'#fff', fontSize:10, fontWeight:800, padding:'4px 12px', borderRadius:'0 0 8px 8px', letterSpacing:0.5 }}>
          📍 Near You
        </div>
      )}

      <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:14, marginTop: isNearby ? 12 : 0 }}>
        <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,rgba(212,160,23,0.3),rgba(255,107,0,0.2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
          🙏
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ color:'#F0C040', fontFamily:'Cinzel,serif', fontWeight:700, fontSize:15, marginBottom:3 }}>{p.name}</div>
          <div style={{ color:'rgba(255,248,240,0.5)', fontSize:12 }}>📍 {p.city || 'India'} · {p.years_of_experience || 5}+ yrs</div>
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div style={{ color:'#F0C040', fontWeight:800, fontSize:15 }}>⭐ {p.rating || 4.8}</div>
          <div style={{ color:'rgba(255,248,240,0.4)', fontSize:10 }}>{p.review_count || 0} reviews</div>
        </div>
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
        {specs.slice(0,3).map(s=>(
          <span key={s} style={{ background:'rgba(212,160,23,0.12)', color:'#D4A017', fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:600 }}>{s}</span>
        ))}
        {specs.length > 3 && <span style={{ color:'rgba(255,248,240,0.4)', fontSize:11, padding:'3px 6px' }}>+{specs.length-3} more</span>}
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div style={{ color:'#FF6B00', fontWeight:800, fontSize:15 }}>
          ₹{p.min_fee || 500} – ₹{p.max_fee || 2000}
        </div>
        <div style={{ color:'rgba(255,248,240,0.4)', fontSize:11 }}>per ritual</div>
      </div>

      <div style={{ display:'flex', gap:8 }}>
        <button onClick={()=>onVideoClick(p)}
          style={{ background:'rgba(138,43,226,0.2)', color:'#c084fc', border:'1px solid rgba(138,43,226,0.35)', borderRadius:20, padding:'7px 14px', cursor:'pointer', fontSize:12, fontWeight:700, flexShrink:0 }}>
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

const SPECS = ['All','Vivah','Griha Pravesh','Satyanarayan','Rudrabhishek','Navgrah','Kaal Sarp','Mundan','Vastu Shastra','Astrology'];
const CITIES = ['All','Delhi','Gurgaon','Noida','Mumbai','Bengaluru','Ayodhya','Varanasi','Ujjain'];

export default function PanditMarketplacePage() {
  const { setViewPandit } = useApp();
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ spec:'All', city:'All', minRating:0 });
  const [nearbyCity, setNearbyCity] = useState(null);
  const [videoModal, setVideoModal] = useState(null);

  // Detect nearest city via geolocation
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

  // Fetch pandits from Supabase, fall back to seed data
  useEffect(() => {
    setLoading(true);
    (async () => {
      const { data } = await supabase.from('pandits').select('*').eq('status', 'verified').order('rating', { ascending: false });
      const list = (data && data.length > 0) ? data : SEED_PANDITS;

      // Sort: nearbyCity first, then by rating desc
      const sorted = [...list].sort((a, b) => {
        const aClose = nearbyCity && a.city === nearbyCity ? 0 : 1;
        const bClose = nearbyCity && b.city === nearbyCity ? 0 : 1;
        if (aClose !== bClose) return aClose - bClose;
        return (b.rating || 0) - (a.rating || 0);
      });
      setPandits(sorted);
      setLoading(false);
    })();
  }, [nearbyCity]);

  // Client-side filter after fetch
  const filtered = pandits.filter(p => {
    if (filters.spec !== 'All') {
      const specs = Array.isArray(p.specializations) ? p.specializations :
        (typeof p.specializations === 'string' ? p.specializations.split(',').map(s=>s.trim()) : []);
      if (!specs.includes(filters.spec)) return false;
    }
    if (filters.city !== 'All' && p.city !== filters.city) return false;
    if (filters.minRating > 0 && (p.rating || 0) < filters.minRating) return false;
    return true;
  });

  const selectStyle = { padding:'8px 14px', borderRadius:20, border:'1px solid rgba(212,160,23,0.3)', background:'rgba(26,15,7,0.9)', color:'#fff8f0', fontSize:13, cursor:'pointer' };

  return (
    <div>
      {nearbyCity && (
        <div style={{ background:'rgba(255,107,0,0.1)', border:'1px solid rgba(255,107,0,0.3)', borderRadius:12, padding:'10px 16px', marginBottom:20, fontSize:13, color:'#FF6B00', display:'flex', alignItems:'center', gap:8 }}>
          📍 Showing pandits near <strong style={{ marginLeft:4, marginRight:4 }}>{nearbyCity}</strong> first.
          <span style={{ color:'rgba(255,248,240,0.5)' }}>Location detected automatically.</span>
        </div>
      )}

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap', alignItems:'center' }}>
        <select value={filters.spec} onChange={e=>setFilters(f=>({...f,spec:e.target.value}))} style={selectStyle}>
          {SPECS.map(s=><option key={s} value={s} style={{background:'#1a0f07'}}>{s==='All'?'All Specializations':s}</option>)}
        </select>
        <select value={filters.city} onChange={e=>setFilters(f=>({...f,city:e.target.value}))} style={selectStyle}>
          {CITIES.map(c=><option key={c} value={c} style={{background:'#1a0f07'}}>{c==='All'?'All Cities':c}</option>)}
        </select>
        <select value={filters.minRating} onChange={e=>setFilters(f=>({...f,minRating:Number(e.target.value)}))} style={selectStyle}>
          <option value={0} style={{background:'#1a0f07'}}>Any Rating</option>
          <option value={4} style={{background:'#1a0f07'}}>4+ Stars</option>
          <option value={4.5} style={{background:'#1a0f07'}}>4.5+ Stars</option>
        </select>
        {(filters.spec !== 'All' || filters.city !== 'All' || filters.minRating > 0) && (
          <button onClick={()=>setFilters({spec:'All',city:'All',minRating:0})}
            style={{ background:'rgba(239,68,68,0.15)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.3)', borderRadius:20, padding:'8px 16px', cursor:'pointer', fontSize:12, fontWeight:700 }}>
            Reset ✕
          </button>
        )}
        <div style={{ marginLeft:'auto', color:'rgba(255,248,240,0.4)', fontSize:12 }}>
          {loading ? 'Loading...' : `${filtered.length} pandits found`}
        </div>
      </div>

      {loading ? <Spinner /> : (
        filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🕉️</div>
            <h3 style={{ fontFamily:'Cinzel,serif', color:'#D4A017', marginBottom:8 }}>No Pandits Available</h3>
            <p style={{ color:'#8B6347' }}>No verified pandits match your filters. Try resetting.</p>
            <button className="btn btn-outline" style={{ marginTop:20 }} onClick={()=>setFilters({spec:'All',city:'All',minRating:0})}>Reset Filters</button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
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
