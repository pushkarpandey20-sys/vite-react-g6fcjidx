import React from 'react';

export default function RitualCard({ r, onSelect, active = false }) {
  return (
    <div className={`ritual-card card ${active ? 'active' : ''}`} onClick={() => onSelect(r)}>
      <div className="ritual-card-head">
        <div className="ritual-icon">{r.icon || "🕉️"}</div>
        <div className="ritual-price">₹{r.price}</div>
      </div>
      <div className="ritual-card-body">
        <h4 className="ritual-name">{r.name}</h4>
        <div className="ritual-meta">
          <span>🕒 {r.duration}</span>
          {r.samagriRequired && <span className="samagri-tag">📦 Samagri Included</span>}
        </div>
        <p className="ritual-desc">{r.description || "Traditional Vedic ceremony with certified scholars."}</p>
      </div>
      <div className="ritual-card-footer">
        <button className="btn btn-outline btn-sm btn-full">{active ? "Selected" : "Select Ritual"}</button>
      </div>
    </div>
  );
}
