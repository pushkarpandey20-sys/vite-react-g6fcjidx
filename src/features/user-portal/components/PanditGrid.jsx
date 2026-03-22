import React from 'react';
import PanditCard from './PanditCard';

export default function PanditGrid({ pandits, onView }) {
  if (pandits.length === 0) {
    return (
      <div className="grid-empty-state">
        <div className="empty-icon">🕉️</div>
        <h4 className="empty-title">No Pandits Found</h4>
        <p className="empty-desc">Adjust your filters to discover other sacred scholars in our divine network.</p>
        <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => window.location.reload()}>Reset Defaults</button>
      </div>
    );
  }

  return (
    <div className="pandit-grid">
      {pandits.map(p => (
        <PanditCard key={p.id} p={p} onView={() => onView(p)} />
      ))}
    </div>
  );
}
