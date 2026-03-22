import React from 'react';

export default function PanditFilters({ onFilterChange, activeFilters }) {
  const specializations = ["Vivah", "Griha Pravesh", "Astrology", "Rudrabhishek", "Satyanarayan", "Vastu Shastra"];
  const cities = ["Agra", "All", "Ayodhya", "Bangalore", "Delhi", "Gurgaon", "Haridwar", "Kasol", "Kashi", "Lucknow", "Mumbai", "Pune", "Rishikesh", "Ujjain", "Varanasi"];
  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className="card filter-card">
      <div className="filter-section">
        <h4 className="filter-title">Specialization</h4>
        <div className="filter-chips">
          {specializations.map(s => (
            <button key={s} 
              className={`chip ${activeFilters.spec === s ? 'on' : ''}`} 
              onClick={() => onFilterChange('spec', s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4 className="filter-title">Preferred City</h4>
        <select 
          className="fs" 
          value={activeFilters.city} 
          onChange={(e) => onFilterChange('city', e.target.value)}
        >
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="filter-section">
        <h4 className="filter-title">Experience (Min yrs)</h4>
        <div className="filter-range">
          <input 
            type="range" min="0" max="40" step="5"
            value={activeFilters.minExp} 
            onChange={(e) => onFilterChange('minExp', e.target.value)}
            className="f-range"
          />
          <span className="exper-val">{activeFilters.minExp}+ Yrs</span>
        </div>
      </div>

      <div className="filter-section">
        <h4 className="filter-title">Minimum Rating</h4>
        <div className="rating-filters">
          {ratings.map(r => (
            <button key={r} 
              className={`rating-chip ${activeFilters.minRating === r ? 'active' : ''}`}
              onClick={() => onFilterChange('minRating', r)}
            >
              {r}★ & Up
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <button className="btn btn-outline btn-full" onClick={() => onFilterChange('reset', null)}>🔄 Reset All</button>
      </div>
    </div>
  );
}
