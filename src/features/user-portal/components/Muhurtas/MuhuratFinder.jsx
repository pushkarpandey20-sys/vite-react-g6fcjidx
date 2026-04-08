import React, { useState, useEffect } from 'react';
import MuhuratResultCard from './MuhuratResultCard';
import { useApp } from '../../../../store/AppCtx';
import { useNavigate } from 'react-router-dom';
import { PremiumIcon } from '../../../../components/Icons';

export default function MuhuratFinder() {
  const { MUHURTAS } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState({ occasion: '', city: 'Delhi', dateFrom: '', dateTo: '' });

  // Auto-detect city from geolocation
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.state_district || 'Delhi';
          setQuery(q => ({ ...q, city }));
        } catch {
          // keep default Delhi
        }
      },
      () => { /* permission denied — keep default Delhi */ }
    );
  }, []);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearching(true);
    // Simulation of Vedic Algorithm
    setTimeout(() => {
      // Logic would be complex; here we filter or adapt existing MUHURTAS to simulate a finder
      let list = [...MUHURTAS];
      // Basic mock filtering logic
      if (query.dateFrom) list = list.filter(m => m.day >= new Date(query.dateFrom).getDate());
      
      setResults(list.slice(0, 5)); // Just take first 5 matches for mock
      setSearching(false);
    }, 800);
  };

  const handleBook = (m) => {
    navigate('/user/booking', { 
      state: { 
        prefilledTime: m.time, 
        prefilledDate: `2024-${m.month === 'Jan' ? '01' : '02'}-${m.day.toString().padStart(2, '0')}` // Mock conversion
      } 
    });
  };

  const occasions = ["Mundan", "Griha Pravesh", "Wedding", "Vehicle Purchase", "Bhoomi Pujan", "Vidyarambha"];

  const sel = { padding:'8px 12px', borderRadius:8, border:'1.5px solid rgba(212,160,23,0.35)', background:'#fff', color:'#1a0f07', fontSize:12, outline:'none', cursor:'pointer' };

  return (
    <div className="muhurat-finder">
      <div style={{ background:'#ffffff', border:'1px solid rgba(212,160,23,0.2)', borderRadius:12, padding:'14px 16px', marginBottom:20, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
          <PremiumIcon src="/icons/muhurta.png" size={24} />
          <h3 style={{ color:'#1a0f07', fontFamily:'Cinzel,serif', margin:0, fontSize:16, fontWeight:700 }}>Find Your Shubh Muhurta</h3>
        </div>
        <form onSubmit={handleSearch} className="compact-filter">
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'flex-end' }}>
            <div style={{ flex:'1 1 140px' }}>
              <div style={{ color:'#9a8070', fontSize:10, fontWeight:700, marginBottom:3, letterSpacing:0.5 }}>OCCASION</div>
              <select style={sel} required value={query.occasion} onChange={e => setQuery({...query, occasion: e.target.value})}>
                <option value="">Select…</option>
                {occasions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ flex:'1 1 120px' }}>
              <div style={{ color:'#9a8070', fontSize:10, fontWeight:700, marginBottom:3, letterSpacing:0.5 }}>CITY</div>
              <input style={sel} required value={query.city} onChange={e => setQuery({...query, city: e.target.value})} placeholder="Delhi, Kashi…" />
            </div>
            <div style={{ flex:'1 1 120px' }}>
              <div style={{ color:'#9a8070', fontSize:10, fontWeight:700, marginBottom:3, letterSpacing:0.5 }}>FROM DATE</div>
              <input type="date" style={sel} required value={query.dateFrom} onChange={e => setQuery({...query, dateFrom: e.target.value})} />
            </div>
            <div style={{ flex:'1 1 120px' }}>
              <div style={{ color:'#9a8070', fontSize:10, fontWeight:700, marginBottom:3, letterSpacing:0.5 }}>TO DATE</div>
              <input type="date" style={sel} required value={query.dateTo} onChange={e => setQuery({...query, dateTo: e.target.value})} />
            </div>
            <button type="submit" disabled={searching} style={{ flex:'0 0 auto', background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff', border:'none', borderRadius:8, padding:'8px 18px', fontWeight:700, cursor:'pointer', fontSize:13, whiteSpace:'nowrap', height:36 }}>
              {searching ? '⏳ Calculating…' : 'Find Slots'}
            </button>
          </div>
        </form>
      </div>

      <div className="finder-results">
        {results.length > 0 && <h3 className="ph-title" style={{ marginBottom: 20 }}>🔮 Recommended Time Slots</h3>}
        <div className="results-grid">
          {results.map((m, i) => (
            <MuhuratResultCard key={i} m={m} onBook={() => handleBook(m)} />
          ))}
        </div>
      </div>
    </div>
  );
}
