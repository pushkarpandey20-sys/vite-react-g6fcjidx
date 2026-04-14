import React from 'react';
import { Stars } from '../../../components/common/UIElements';

export default function PanditCard({ p, onView }) {
  // Normalise experience field across schema versions
  const exp = p.years_of_experience ?? p.experience_years ?? p.experience ?? 0;

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
            <span>🎓 {exp} yrs exp.</span>
            <span>📍 {p.city}</span>
          </div>
        </div>

        <div className="pandit-rating-row">
          <Stars rating={p.rating} />
          <span className="rating-val">{p.rating}</span>
        </div>

        <div className="pandit-languages">
          {(p.languages || ["Hindi", "Sanskrit"]).slice(0, 3).map((l, i) => (
            <span key={i} className="lang-chip">{l}</span>
          ))}
        </div>

        <div className="pandit-footer">
          <div className="price-info">
            <span className="currency">₹</span>
            <span className="price">{(p.min_fee || p.price)?.toLocaleString() || '–'}</span>
            <span className="unit"> / Pooja</span>
          </div>
          {p.show_whatsapp && p.phone && (
            <a
              href={`https://wa.me/91${p.phone}?text=Namaste%20Pt.%20${encodeURIComponent(p.name)}%2C%20I%20found%20you%20on%20BhaktiGo%20and%20want%20to%20book%20a%20pooja.`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ background: '#25D366', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>

      <div className="card-hover-overlay">
        <span>View Full Profile</span>
      </div>
    </div>
  );
}
