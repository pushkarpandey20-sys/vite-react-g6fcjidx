import React from 'react';
import { Stars } from '../../../components/common/UIElements';

export default function PanditCard({ p, onView }) {
  return (
    <div className="card pandit-card" onClick={() => onView && onView(p)}>
      <div className="card-top" style={{ position: 'relative' }}>
        <div className="pandit-avatar-container">
          <div className="pandit-emoji">{p.emoji || "🕉️"}</div>
          {p.verified && <div className="verified-seal">✓</div>}
        </div>
        <div className="pandit-badge">{p.specialization}</div>
      </div>
      
      <div className="card-p">
        <div className="pandit-header">
          <h3 className="pandit-name">{p.name}</h3>
          <div className="pandit-meta">
            <span>🎓 {p.experience} yrs exp.</span>
            <span>📍 {p.city}</span>
          </div>
        </div>

        <div className="pandit-rating-row">
          <Stars rating={p.rating} />
          <span className="rating-val">{p.rating}</span>
        </div>

        <div className="pandit-languages">
          {(p.languages || ["Hindi", "Sanskrit"]).map((l, i) => (
            <span key={i} className="lang-chip">{l}</span>
          ))}
        </div>

        <div className="pandit-footer">
          <div className="price-info">
            <span className="currency">₹</span>
            <span className="price">{p.price?.toLocaleString()}</span>
            <span className="unit"> / Pooja</span>
          </div>
          {p.introVideo && (
            <button className="btn-video" title="Watch Intro Video">🎬</button>
          )}
        </div>
      </div>
      
      <div className="card-hover-overlay">
        <span>View Full Profile</span>
      </div>
    </div>
  );
}
