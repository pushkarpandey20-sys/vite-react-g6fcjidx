export default function RitualCard({ r, onSelect, active = false }) {
  const isSpecial = r.id === 'on-demand';
  const category = r._category || r.category || '';

  const durationLabel = r.duration || 'Flexible';
  const priceLabel = `₹${Number(r.price).toLocaleString('en-IN')}`;

  return (
    <div
      className={`rc2-card ${active ? 'rc2-card--active' : ''} ${isSpecial ? 'rc2-card--special' : ''}`}
      onClick={() => onSelect(r)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(r)}
    >
      {/* Glow layer on hover (CSS handles) */}
      <div className="rc2-glow" />

      {/* Top badges */}
      <div className="rc2-badges">
        {isSpecial && (
          <span className="rc2-badge rc2-badge--pro">⚡ Instant</span>
        )}
        {category && !isSpecial && (
          <span className="rc2-badge rc2-badge--cat">{category}</span>
        )}
        {r.samagriRequired && (
          <span className="rc2-badge rc2-badge--samagri">📦 Samagri</span>
        )}
      </div>

      {/* Icon */}
      <div className="rc2-icon-wrap">
        <div className="rc2-icon">{r.icon || '🕉️'}</div>
        <div className="rc2-icon-ring" />
      </div>

      {/* Content */}
      <div className="rc2-body">
        <h4 className="rc2-name">{r.name}</h4>
        <p className="rc2-desc">{r.description || 'Traditional Vedic ceremony with certified scholars.'}</p>
      </div>

      {/* Meta row */}
      <div className="rc2-meta">
        <span className="rc2-meta-item">
          <span className="rc2-meta-ic">🕒</span> {durationLabel}
        </span>
        {isSpecial && (
          <span className="rc2-meta-item" style={{ color: '#FFD700' }}>
            <span className="rc2-meta-ic">🌟</span> Custom
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="rc2-footer">
        <div className="rc2-price">
          <span className="rc2-price-label">Starting from</span>
          <span className="rc2-price-val">{priceLabel}</span>
        </div>
        <button className={`rc2-btn ${active ? 'rc2-btn--selected' : ''}`}>
          {active ? '✓ Selected' : 'Book Now →'}
        </button>
      </div>
    </div>
  );
}
