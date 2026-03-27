export default function RitualFilters({ onFilterChange, activeFilters, hideCategoryBar = false }) {

  return (
    <div className="rc-filter-bar">
      {/* Budget Slider */}
      <div className="rcf-group">
        <span className="rcf-label">💰 Budget</span>
        <div className="rcf-slider-wrap">
          <input
            type="range" min="500" max="31000" step="500"
            value={activeFilters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', parseInt(e.target.value))}
            className="rcf-slider"
          />
          <span className="rcf-price-val">
            ₹{Number(activeFilters.maxPrice).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Samagri Toggle */}
      <label className="rcf-toggle">
        <div className={`rcf-toggle-track ${activeFilters.samagriOnly ? 'rcf-toggle-track--on' : ''}`}
          onClick={() => onFilterChange('samagriOnly', !activeFilters.samagriOnly)}>
          <div className="rcf-toggle-thumb" />
        </div>
        <span className="rcf-toggle-label">📦 With Samagri</span>
      </label>

      {/* Reset */}
      {(activeFilters.maxPrice < 31000 || activeFilters.samagriOnly || activeFilters.search) && (
        <button
          className="rcf-reset"
          onClick={() => {
            onFilterChange('maxPrice', 31000);
            onFilterChange('samagriOnly', false);
            onFilterChange('search', '');
            onFilterChange('category', 'All');
          }}
        >
          Reset ✕
        </button>
      )}
    </div>
  );
}
