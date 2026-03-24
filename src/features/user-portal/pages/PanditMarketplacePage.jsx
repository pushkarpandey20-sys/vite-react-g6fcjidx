import React, { useState, useEffect } from 'react';
import { useApp } from '../../../store/AppCtx';
import PanditFilters from '../components/PanditFilters';
import PanditGrid from '../components/PanditGrid';
import { Spinner } from '../../../components/common/UIElements';

export default function PanditMarketplacePage() {
  const { db, setViewPandit } = useApp();
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ spec: 'All', city: 'All', minExp: 0, minRating: 0 });

  useEffect(() => {
    setLoading(true);
    (async () => {
      let query = db.pandits().select("*").eq('status', 'verified');

      if (filters.spec !== 'All') query = query.eq('specialization', filters.spec);
      if (filters.city !== 'All') query = query.eq('city', filters.city);
      if (filters.minExp > 0) query = query.gte('years_of_experience', filters.minExp);
      if (filters.minRating > 0) query = query.gte('rating', filters.minRating);

      const { data } = await query.order('rating', { ascending: false });
      setPandits(data || []);
      setLoading(false);
    })();
  }, [filters]);

  const handleFilter = (key, val) => {
    if (key === 'reset') setFilters({ spec: 'All', city: 'All', minExp: 0, minRating: 0 });
    else setFilters(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <h2 className="ph-title" style={{ color: '#F0C040' }}>Find Your Guru</h2>
        <p className="ph-sub">Our divine network only features certified Vedic scholars across Bharat.</p>
      </div>
      <div className="marketplace-content">
        <aside className="filters-sidebar">
          <PanditFilters onFilterChange={handleFilter} activeFilters={filters} />
        </aside>
        <section className="marketplace-main">
          {loading ? <Spinner /> : (
            pandits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🕉️</div>
                <h3 style={{ fontFamily: "'Cinzel',serif", color: '#D4A017', marginBottom: 8 }}>No Pandits Available</h3>
                <p style={{ color: '#8B6347' }}>No verified pandits found in {filters.city !== 'All' ? filters.city : 'this area'} yet.<br />Try a different city or reset filters.</p>
                <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => handleFilter('reset')}>Reset Filters</button>
              </div>
            ) : (
              <PanditGrid pandits={pandits} onView={setViewPandit} />
            )
          )}
        </section>
      </div>
    </div>
  );
}
