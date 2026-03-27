import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../store/AppCtx';
import { bookingApi } from '../../../api/bookingApi';
import { Spinner } from '../../../components/common/UIElements';
import RitualFilters from '../components/RitualFilters';
import RitualGrid from '../components/RitualGrid';
import { useNavigate } from 'react-router-dom';

// Maps ritual name/desc keywords → category
function inferCategory(r) {
  if (r.category) return r.category;
  const text = ((r.name || '') + ' ' + (r.description || '')).toLowerCase();
  if (/vivah|wedding|marriage|shaadi|saptapadi/.test(text)) return 'Life Events';
  if (/mundan|namkaran|annaprasan|janamdin|birthday|upanayan|janm/.test(text)) return 'Life Events';
  if (/griha pravesh|vastu|home|ghar|house/.test(text)) return 'Home & Vastu';
  if (/rudrabhishek|shiva|mahashivratri|lingarchana/.test(text)) return 'Shiva';
  if (/lakshmi|diwali|saraswati|durga|navratri|devi|mata/.test(text)) return 'Devi Puja';
  if (/satyanarayan|vishnu|ram|krishna|hanuman|ganesh|ganpati/.test(text)) return 'Devata Puja';
  if (/navgrah|kaal sarp|mangal dosh|graha|planet|shani/.test(text)) return 'Dosh Nivaran';
  if (/shraddha|pitru|antim|death|funeral|ancestor/.test(text)) return 'Pitru & Shraddha';
  if (/temple|mandir|seva/.test(text)) return 'Temple Seva';
  return 'General';
}

const CATEGORY_META = {
  'All':              { icon: '🕉️', color: '#F0C040' },
  'Life Events':      { icon: '💍', color: '#FF6B6B' },
  'Home & Vastu':     { icon: '🏠', color: '#4ECDC4' },
  'Shiva':            { icon: '🔱', color: '#9B59B6' },
  'Devi Puja':        { icon: '🌸', color: '#E91E8C' },
  'Devata Puja':      { icon: '🪔', color: '#FF9F40' },
  'Dosh Nivaran':     { icon: '🐍', color: '#27AE60' },
  'Pitru & Shraddha': { icon: '🙏', color: '#8B9DC3' },
  'Temple Seva':      { icon: '🛕', color: '#E67E22' },
  'General':          { icon: '✨', color: '#F0C040' },
};

export default function RitualCatalogPage() {
  const { devoteeId, toast } = useApp();
  const navigate = useNavigate();
  const [rituals, setRituals] = useState([]);
  const [filteredRituals, setFilteredRituals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: 'All', maxPrice: 31000, samagriOnly: false, search: '' });
  const [categoryCounts, setCategoryCounts] = useState({});
  const headerRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { data } = await bookingApi.getRituals();
      const enriched = (data || []).map(r => ({ ...r, _category: inferCategory(r) }));
      setRituals(enriched);
      setFilteredRituals(enriched);

      // Build counts
      const counts = { All: enriched.length };
      enriched.forEach(r => {
        counts[r._category] = (counts[r._category] || 0) + 1;
      });
      setCategoryCounts(counts);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    let list = [...rituals];
    if (filters.category !== 'All') {
      list = list.filter(r => r._category === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(r =>
        r.name?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
      );
    }
    list = list.filter(r => r.price <= filters.maxPrice);
    if (filters.samagriOnly) {
      list = list.filter(r => r.samagriRequired);
    }
    setFilteredRituals(list);
  }, [filters, rituals]);

  const handleFilter = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  };

  const handleRitualSelect = (r) => {
    navigate('/user/booking', { state: { selectedRitual: r } });
  };

  const activeMeta = CATEGORY_META[filters.category] || CATEGORY_META['All'];

  return (
    <div className="ritual-catalog-page-v2">
      {/* ── Hero Banner ── */}
      <div className="rc-hero" ref={headerRef}>
        <div className="rc-hero-glow" />
        <div className="rc-hero-content">
          <div className="rc-hero-badge">
            <span>🕉️</span> 108+ Sacred Ceremonies
          </div>
          <h1 className="rc-hero-title">Sacred Ritual Catalog</h1>
          <p className="rc-hero-sub">
            Discover the perfect Vedic ceremony for every life moment — performed by verified pandits.
          </p>
          {/* Search bar in hero */}
          <div className="rc-hero-search">
            <span className="rc-search-icon">🔍</span>
            <input
              className="rc-search-input"
              placeholder="Search rituals, ceremonies, poojas…"
              value={filters.search}
              onChange={e => handleFilter('search', e.target.value)}
            />
            {filters.search && (
              <button className="rc-search-clear" onClick={() => handleFilter('search', '')}>✕</button>
            )}
          </div>
        </div>
        {/* Decorative mandalas */}
        <div className="rc-mandala rc-mandala-l">✦</div>
        <div className="rc-mandala rc-mandala-r">✦</div>
      </div>

      {/* ── Category Pills ── */}
      <div className="rc-cat-strip">
        {Object.entries(CATEGORY_META).map(([cat, meta]) => {
          const count = categoryCounts[cat] || 0;
          const isActive = filters.category === cat;
          if (cat !== 'All' && count === 0) return null;
          return (
            <button
              key={cat}
              className={`rc-cat-pill ${isActive ? 'rc-cat-pill--active' : ''}`}
              style={isActive ? { '--pill-color': meta.color, borderColor: meta.color, boxShadow: `0 0 16px ${meta.color}40` } : { '--pill-color': meta.color }}
              onClick={() => handleFilter('category', cat)}
            >
              <span className="rc-cat-pill-icon">{meta.icon}</span>
              <span className="rc-cat-pill-label">{cat}</span>
              {count > 0 && <span className="rc-cat-pill-count">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* ── Filter Bar + Results ── */}
      <div className="rc-filter-results-row">
        <RitualFilters onFilterChange={handleFilter} activeFilters={filters} hideCategoryBar />
        <div className="rc-results-info">
          {!loading && (
            <>
              <span className="rc-results-icon">{activeMeta.icon}</span>
              <span className="rc-results-count">
                <strong>{filteredRituals.length}</strong> ritual{filteredRituals.length !== 1 ? 's' : ''}
                {filters.category !== 'All' && <span className="rc-results-cat"> in {filters.category}</span>}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="rc-grid-wrap">
        {loading
          ? <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}><Spinner /></div>
          : <RitualGrid rituals={filteredRituals} onSelect={handleRitualSelect} />
        }
      </div>
    </div>
  );
}
