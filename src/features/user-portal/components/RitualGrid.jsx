import React from 'react';
import RitualCard from './RitualCard';

export default function RitualGrid({ rituals, onSelect, activeId }) {
  if (rituals.length === 0) {
    return (
      <div className="grid-empty-state">
        <div className="empty-icon">📿</div>
        <h4 className="empty-title">No matching rituals</h4>
        <p className="empty-desc">Try a different category or budget to explore our sacred services.</p>
        <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => window.location.reload()}>Reset All</button>
      </div>
    );
  }

  return (
    <div className="ritual-grid">
      {rituals.map(r => (
        <RitualCard key={r.id} r={r} onSelect={onSelect} active={activeId === r.id} />
      ))}
    </div>
  );
}
