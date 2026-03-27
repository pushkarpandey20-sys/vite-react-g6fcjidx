export default function RitualCard({ r, onSelect, active = false }) {
  const isSpecial = r.id === 'on-demand';
  
  return (
    <div className={`ritual-card ${active ? 'active' : ''} ${isSpecial ? 'special-card' : ''}`} onClick={() => onSelect(r)}>
      {isSpecial && <div style={{ position: 'absolute', top: 12, right: 12, background: 'linear-gradient(135deg, #FFD700, #FF8C00)', color: '#fff', fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: '20px', zIndex: 5, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>PRO</div>}
      <div className="ritual-card-head">
        <div className="ritual-icon">{r.icon || "🕉️"}</div>
        <div className="ritual-price">₹{r.price}</div>
      </div>
      <div className="ritual-card-body">
        <h4 className="ritual-name">{r.name}</h4>
        <div className="ritual-meta">
          <span>🕒 {r.duration || 'Flexible'}</span>
          {r.samagriRequired && <span className="samagri-tag">📦 Samagri Included</span>}
          {isSpecial && <span style={{ color: '#FFD700' }}>⚡ Instant Booking</span>}
        </div>
        <p className="ritual-desc">{r.description || "Traditional Vedic ceremony with certified scholars."}</p>
      </div>
      <div className="ritual-card-footer">
        <button className="btn btn-sm btn-full">{active ? "Selected" : "Confirm Choice"}</button>
      </div>
    </div>
  );
}

