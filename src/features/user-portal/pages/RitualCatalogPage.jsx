import React, { useState, useEffect } from 'react';
import { useApp } from '../../../store/AppCtx';
import { bookingApi } from '../../../api/bookingApi';
import { Spinner } from '../../../components/common/UIElements';
import RitualFilters from '../components/RitualFilters';
import RitualGrid from '../components/RitualGrid';
import { useNavigate } from 'react-router-dom';

export default function RitualCatalogPage() {
  const { devoteeId, toast } = useApp();
  const navigate = useNavigate();
  const [rituals, setRituals] = useState([]);
  const [filteredRituals, setFilteredRituals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: 'All', maxPrice: 31000, samagriOnly: false });

  useEffect(() => {
    (async () => {
      const { data } = await bookingApi.getRituals();
      setRituals(data || []);
      setFilteredRituals(data || []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    let list = [...rituals];
    if (filters.category !== 'All') {
      list = list.filter(r => 
        r.name.toLowerCase().includes(filters.category.toLowerCase()) || 
        r.description?.toLowerCase().includes(filters.category.toLowerCase())
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
    // Navigate to booking wizard with selected ritual
    // We could pass state or use a query param
    navigate('/user/booking', { state: { selectedRitual: r } });
  };

  return (
    <div className="ritual-catalog-page">
      <div className="marketplace-content">
        <aside className="filters-sidebar">
          <RitualFilters onFilterChange={handleFilter} activeFilters={filters} />
        </aside>
        <main className="catalog-main">
          <div className="catalog-header" style={{ marginBottom: 30 }}>
            <h2 className="ph-title" style={{ color: '#F0C040' }}>Sacred Ritual Catalog</h2>
            <p className="ph-sub">Discover the perfect ceremony for your spiritual needs.</p>
          </div>
          {loading ? <Spinner /> : (
            <RitualGrid 
              rituals={filteredRituals} 
              onSelect={handleRitualSelect} 
            />
          )}
        </main>
      </div>
    </div>
  );
}
