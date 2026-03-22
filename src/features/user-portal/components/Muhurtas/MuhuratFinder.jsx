import React, { useState } from 'react';
import MuhuratResultCard from './MuhuratResultCard';
import { useApp } from '../../../../store/AppCtx';
import { useNavigate } from 'react-router-dom';

export default function MuhuratFinder() {
  const { MUHURTAS } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState({ occasion: '', city: 'Kashi', dateFrom: '', dateTo: '' });
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

  return (
    <div className="muhurat-finder">
      <div className="finder-form card card-p" style={{ marginBottom: 30 }}>
        <h3 className="ph-title" style={{ color: '#F0C040' }}>Find Your Shubh Muhurta</h3>
        <p className="ph-sub">Our Vedic algorithm calculates the most auspicious timings based on your specific location and occasion.</p>
        
        <form onSubmit={handleSearch} className="fgrid" style={{ marginTop: 20 }}>
          <div className="fg">
            <label className="fl">Vedic Occasion</label>
            <select className="fs" required value={query.occasion} onChange={e => setQuery({...query, occasion: e.target.value})}>
              <option value="">Select Occasion</option>
              {occasions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="fg">
            <label className="fl">City for Accurate Panchang</label>
            <input className="fi" required value={query.city} onChange={e => setQuery({...query, city: e.target.value})} placeholder="e.g. Kashi, Delhi..." />
          </div>
          <div className="fg">
            <label className="fl">From Date</label>
            <input type="date" className="fi" required value={query.dateFrom} onChange={e => setQuery({...query, dateFrom: e.target.value})} />
          </div>
          <div className="fg">
            <label className="fl">To Date</label>
            <input type="date" className="fi" required value={query.dateTo} onChange={e => setQuery({...query, dateTo: e.target.value})} />
          </div>
          <div className="fg ffw ac" style={{ marginTop: 10 }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 40px' }} disabled={searching}>
              {searching ? 'Calculating Graha Dashas...' : '🔮 Find Auspicious Slots'}
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
