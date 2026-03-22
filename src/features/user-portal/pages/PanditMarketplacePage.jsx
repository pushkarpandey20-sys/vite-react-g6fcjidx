import React, { useState, useEffect } from 'react';
import { useApp } from '../../../store/AppCtx';
import PanditFilters from '../components/PanditFilters';
import PanditGrid from '../components/PanditGrid';
import { Spinner } from '../../../components/common/UIElements';

export default function PanditMarketplacePage() {
  const { db, setViewPandit } = useApp();
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    spec: 'All',
    city: 'All',
    minExp: 0,
    minRating: 0
  });

  useEffect(() => {
    (async () => {
      let query = db.pandits().select("*");
      
      if (filters.spec !== 'All') query = query.eq('specialization', filters.spec);
      if (filters.city !== 'All') query = query.eq('city', filters.city);
      if (filters.minExp > 0) query = query.gte('experience', filters.minExp);
      if (filters.minRating > 0) query = query.gte('rating', filters.minRating);

      const { data } = await query.order('rating', { ascending: false });
      setPandits(data || []);
      setLoading(false);
    })();
  }, [filters]);

  const handleFilter = (key, val) => {
    if (key === 'reset') {
      setFilters({ spec: 'All', city: 'All', minExp: 0, minRating: 0 });
    } else {
      setFilters(prev => ({ ...prev, [key]: val }));
    }
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
          {loading ? <Spinner /> : <PanditGrid pandits={pandits} onView={setViewPandit} />}
        </section>
      </div>
    </div>
  );
}
