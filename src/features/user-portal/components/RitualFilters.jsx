import React from 'react';

export default function RitualFilters({ onFilterChange, activeFilters }) {
  const categories = ["All", "Home", "Temple", "Life Event", "Wellness", "Special"];
  
  return (
    <div className="ritual-filters-card card">
      <div className="filter-group">
        <h5 className="filter-label">Category</h5>
        <div className="filter-chips">
          {categories.map(c => (
            <button key={c} 
              className={`chip ${activeFilters.category === c ? 'on' : ''}`}
              onClick={() => onFilterChange('category', c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h5 className="filter-label">Max Budget</h5>
        <div className="price-range">
          <input 
            type="range" min="500" max="31000" step="500"
            value={activeFilters.maxPrice} 
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="f-range"
          />
          <div className="price-val">Up to ₹{activeFilters.maxPrice}</div>
        </div>
      </div>

      <div className="filter-group">
        <label className="checkbox-filter">
          <input 
            type="checkbox" 
            checked={activeFilters.samagriOnly} 
            onChange={(e) => onFilterChange('samagriOnly', e.target.checked)} 
          />
          <span>Include Samagri Required</span>
        </label>
      </div>
    </div>
  );
}
