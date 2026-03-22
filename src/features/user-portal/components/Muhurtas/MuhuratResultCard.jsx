import React from 'react';

export default function MuhuratResultCard({ m, onBook }) {
  const qualityColor = m.quality === "Excellent" ? "#27AE60" : m.quality === "Good" ? "#D4A017" : "#8B6347";

  return (
    <div className="muhurat-result-card card">
      <div className="m-card-date">
        <span className="m-day">{m.day}</span>
        <span className="m-month">{m.month}</span>
      </div>
      <div className="m-card-details">
        <h4 className="m-time">🕒 {m.time}</h4>
        <div className="m-panchang">
          <span className="m-tag">{m.tithi}</span>
          <span className="m-tag">{m.nakshatra}</span>
        </div>
        <p className="m-desc">Nakshatra: <b>{m.nakshatra}</b> | Tithi: <b>{m.tithi}</b></p>
      </div>
      <div className="m-card-quality" style={{ color: qualityColor }}>
        <div className="q-label">{m.quality}</div>
        <div className="q-sub">Auspiciousness</div>
      </div>
      <div className="m-card-actions">
        <button className="btn btn-primary btn-sm" onClick={() => onBook(m)}>Book for This Slot</button>
      </div>
    </div>
  );
}
