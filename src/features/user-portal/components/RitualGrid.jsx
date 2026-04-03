import React from 'react';
import RitualCard from './RitualCard';

export default function RitualGrid({ rituals, onSelect, activeId, samagriOnly = false }) {
  if (rituals.length === 0) {
    return (
      <div className="rc-empty-state">
        <div className="rc-empty-icon">📿</div>
        <h4 className="rc-empty-title">No rituals found</h4>
        <p className="rc-empty-desc">
          Try a different category or adjust your budget to explore our sacred ceremonies.
        </p>
      </div>
    );
  }

  return (
    <div className="ritual-grid">
      {rituals.map(r => (
        <RitualCard key={r.id} r={r} onSelect={onSelect} active={activeId === r.id} samagriOnly={samagriOnly} />
      ))}
    </div>
  );
}
