export default function RitualFilters({ onFilterChange, activeFilters }) {
  const categories = ["All", "General", "Home", "Temple", "Life Event", "Wellness", "Special"];
  
  const barStyle = {
    padding: '20px 24px',
    background: 'rgba(26, 15, 7, 0.4)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(240, 192, 64, 0.1)',
    marginBottom: '40px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '30px',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const groupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  };

  const labelStyle = {
    fontFamily: 'Cinzel, serif',
    fontSize: '11px',
    color: '#F0C040',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    fontWeight: 800,
    whiteSpace: 'nowrap'
  };

  return (
    <div style={barStyle}>
      <div style={groupStyle}>
        <h5 style={labelStyle}>Categories:</h5>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', maxWidth: '400px' }}>
          {categories.map(c => (
            <button key={c} 
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: activeFilters.category === c ? 'none' : '1px solid rgba(255,248,240,0.1)',
                background: activeFilters.category === c ? 'linear-gradient(135deg, #FF6B00, #F0C040)' : 'transparent',
                color: activeFilters.category === c ? '#fff' : 'rgba(255,248,240,0.6)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap'
              }}
              onClick={() => onFilterChange('category', c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...groupStyle, flex: 1, minWidth: '200px', display: 'flex', justifyContent: 'center' }}>
        <h5 style={labelStyle}>Budget:</h5>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '250px' }}>
          <input 
            type="range" min="500" max="31000" step="500"
            value={activeFilters.maxPrice} 
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            style={{ width: '100%', accentColor: '#FF6B00' }}
          />
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#F0C040', minWidth: '60px', textAlign: 'right', fontFamily: 'Cinzel' }}>
            ₹{activeFilters.maxPrice}
          </div>
        </div>
      </div>

      <div style={groupStyle}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 700, color: 'rgba(255,248,240,0.7)' }}>
          <input 
            type="checkbox" 
            checked={activeFilters.samagriOnly} 
            onChange={(e) => onFilterChange('samagriOnly', e.target.checked)} 
            style={{ accentColor: '#FF6B00' }}
          />
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Samagri Only</span>
        </label>
      </div>
    </div>
  );
}


