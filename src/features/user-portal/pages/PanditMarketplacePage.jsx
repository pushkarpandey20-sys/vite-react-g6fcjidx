import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppCtx';
import { supabase } from '../../../services/supabase';
import { Spinner } from '../../../components/common/UIElements';
import { SEED_PANDITS } from '../../../data/seedData';

const QUICK_RITUALS = [
  'Griha Pravesh','Satyanarayan Katha','Rudrabhishek','Navgrah Shanti',
  'Vivah','Mundan','Namkaran','Lakshmi Puja','Kaal Sarp Dosh','Custom Pooja'
];

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
    <div className="pm-modal-overlay" onClick={onClose}>
      <div className="pm-modal-box" onClick={e => e.stopPropagation()}>
        <div className="pm-modal-header">
          <span>{pandit.name} — 60s Intro</span>
          <button className="pm-modal-close" onClick={onClose}>✕</button>
        </div>
        {pandit.intro_video_url ? (
          <video src={pandit.intro_video_url} controls autoPlay style={{ width:'100%', borderRadius:10 }} />
        ) : (
          <div className="pm-modal-bio">
            <div className="pm-modal-avatar">🙏</div>
            <div className="pm-modal-bio-name">{pandit.name}</div>
            <div className="pm-modal-bio-text">
              {pandit.bio || `${pandit.name} is a verified Vedic scholar with ${pandit.years_of_experience || 5}+ years of experience. Specializes in ${(pandit.specializations||['Pooja']).join(', ')}.`}
            </div>
            <div className="pm-modal-stats">
              {[['⭐', `${pandit.rating || 4.8} Rating`], ['📍', pandit.city || 'India'], ['🗓️', `${pandit.years_of_experience || 5}+ yrs`]].map(([ic, lb]) => (
                <div key={lb} className="pm-modal-stat">
                  <div style={{ fontSize: 22 }}>{ic}</div>
                  <div style={{ color:'#9a8070', fontSize:11, marginTop:4 }}>{lb}</div>
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

  const ratingStars = Math.round((p.rating || 4.8) * 2) / 2;
  const fullStars = Math.floor(ratingStars);

  return (
    <div className={`pm-card ${isNearby ? 'pm-card--nearby' : ''}`}>
      {isNearby && (
        <div className="pm-nearby-tag">📍 Near You</div>
      )}

      {/* Header area */}
      <div className="pm-card-head">
        <div className="pm-avatar">🙏</div>
        <div className="pm-card-info">
          <div className="pm-name">{p.name}</div>
          <div className="pm-location">📍 {p.city || 'India'} · {p.years_of_experience || 5}+ yrs</div>
          {p.is_online && (
            <span className="pm-online-badge">🟢 Available Now</span>
          )}
        </div>
        <div className="pm-rating-box">
          <div className="pm-rating-val">⭐ {p.rating || 4.8}</div>
          <div className="pm-review-count">{p.review_count || 0} reviews</div>
        </div>
      </div>

      {/* Specializations */}
      <div className="pm-specs">
        {specs.slice(0, 3).map(s => (
          <span key={s} className="pm-spec-chip">{s}</span>
        ))}
        {specs.length > 3 && (
          <span className="pm-spec-more">+{specs.length - 3}</span>
        )}
      </div>

      {/* Fee row */}
      <div className="pm-fee-row">
        <div className="pm-fee">
          <span className="pm-fee-label">Fee Range</span>
          <span className="pm-fee-val">₹{(p.min_fee || 500).toLocaleString('en-IN')} – ₹{(p.max_fee || 2000).toLocaleString('en-IN')}</span>
        </div>
        <div className="pm-fee-unit">per ritual</div>
      </div>

      {/* Actions */}
      <div className="pm-actions">
        <button className="pm-btn-intro" onClick={() => onVideoClick(p)}>
          ▶ 60s Intro
        </button>
        <button className="pm-btn-book" onClick={() => onView(p)}>
          View & Book →
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

  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [specFilter, setSpecFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('0');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sortBy, setSortBy] = useState('nearby');

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

  useEffect(() => {
    setLoading(true);
    (async () => {
      const { data } = await supabase.from('pandits').select('*').eq('status', 'verified').order('rating', { ascending: false });
      const list = (data && data.length > 0) ? data : SEED_PANDITS;
      setPandits(list);
      setLoading(false);
    })();
  }, []);

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

  const hasFilters = search || cityFilter !== 'All' || specFilter !== 'All' || expFilter !== '0' || onlineOnly;
  const resetFilters = () => { setSearch(''); setCityFilter('All'); setSpecFilter('All'); setExpFilter('0'); setOnlineOnly(false); setSortBy('nearby'); };

  const selStyle = {
    padding:'8px 12px', borderRadius:10,
    border:'1.5px solid rgba(212,160,23,0.25)',
    background:'rgba(26,15,7,0.6)', backdropFilter:'blur(10px)',
    color:'rgba(255,248,240,0.85)', fontSize:12, cursor:'pointer',
    outline:'none', fontWeight:600,
  };

  return (
    <div className="pm-page">
      {/* ── Hero ── */}
      <div className="pm-hero">
        <div className="pm-hero-glow" />
        <div className="pm-hero-badge">🙏 DevSetu Verified Pandits</div>
        <h1 className="pm-hero-title">Find Your Pandit</h1>
        <p className="pm-hero-sub">
          Connect with learned Vedic scholars — verified, rated, and ready for any ceremony.
        </p>

        {/* Quick booking strip */}
        <div className="pm-quick-book">
          <div className="pm-qb-label">⚡ Book Any Available Pandit Instantly</div>
          <div className="pm-qb-row">
            <select
              value={quickRitual}
              onChange={e => setQuickRitual(e.target.value)}
              className="pm-qb-select"
            >
              <option value="">🕉️ Choose a Ritual / Package</option>
              {QUICK_RITUALS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <input
              type="date"
              value={quickDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setQuickDate(e.target.value)}
              className="pm-qb-date"
            />
            <button
              className="pm-qb-btn"
              onClick={() => {
                if (!quickRitual) return;
                navigate('/user/booking', { state: { prefilledRitual: quickRitual, prefilledDate: quickDate } });
              }}
            >
              Book Now →
            </button>
          </div>
        </div>

        {nearbyCity && (
          <div className="pm-nearby-notice">
            📍 Showing pandits near <strong>{nearbyCity}</strong> first
          </div>
        )}
      </div>

      {/* ── Filter Bar ── */}
      <div className="pm-filter-bar">
        <div className="pm-filter-inner">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search pandit name..."
            style={{ ...selStyle, minWidth: 160 }}
          />

          <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} style={selStyle}>
            <option value="All">📍 All Cities</option>
            {['Delhi','Noida','Gurgaon','Mumbai','Bengaluru','Ayodhya','Varanasi','Ujjain','Faridabad','Ghaziabad'].map(c=>
              <option key={c}>{c}</option>
            )}
          </select>

          <select value={specFilter} onChange={e => setSpecFilter(e.target.value)} style={selStyle}>
            <option value="All">🕉️ All Rituals</option>
            {['Griha Pravesh','Satyanarayan','Vivah','Rudrabhishek','Navgrah','Kaal Sarp','Mundan','Namkaran','Vastu Shastra','Astrology'].map(s=>
              <option key={s}>{s}</option>
            )}
          </select>

          <select value={expFilter} onChange={e => setExpFilter(e.target.value)} style={selStyle}>
            <option value="0">⏳ Any Experience</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years</option>
            <option value="15">15+ years</option>
            <option value="20">20+ years</option>
          </select>

          <label className="pm-online-toggle">
            <input type="checkbox" checked={onlineOnly} onChange={e => setOnlineOnly(e.target.checked)} style={{ accentColor:'#22c55e' }} />
            <span>🟢 Online Now</span>
          </label>

          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...selStyle, marginLeft:'auto' }}>
            <option value="nearby">📍 Nearest First</option>
            <option value="rating">⭐ Top Rated</option>
            <option value="fee_low">₹ Low → High</option>
            <option value="fee_high">₹ High → Low</option>
          </select>

          {hasFilters && (
            <button onClick={resetFilters} className="pm-filter-reset">Reset ✕</button>
          )}

          <div className="pm-filter-count">
            {loading ? 'Loading...' : `${filtered.length} pandits`}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="pm-grid-wrap">
        {loading ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}><Spinner /></div>
        ) : filtered.length === 0 ? (
          <div className="pm-empty">
            <div style={{ fontSize:52, marginBottom:16 }}>🕉️</div>
            <h3 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', marginBottom:8 }}>No Pandits Found</h3>
            <p style={{ color:'rgba(255,248,240,0.55)' }}>Try resetting your filters to explore all verified pandits.</p>
            <button className="pm-empty-reset" onClick={resetFilters}>Reset Filters</button>
          </div>
        ) : (
          <div className="pm-grid">
            {filtered.map(p => (
              <PanditCard
                key={p.id}
                p={p}
                isNearby={!!(nearbyCity && p.city === nearbyCity)}
                onView={setViewPandit}
                onVideoClick={setVideoModal}
              />
            ))}
          </div>
        )}
      </div>

      {videoModal && <PanditVideoModal pandit={videoModal} onClose={() => setVideoModal(null)} />}
    </div>
  );
}
