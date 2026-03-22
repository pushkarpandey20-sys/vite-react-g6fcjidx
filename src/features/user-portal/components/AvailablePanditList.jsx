import React from 'react';

export function InstantBookingCard({ pandit, onSelect }) {
  return (
    <div className="pandit-pick-card" onClick={() => onSelect(pandit)} 
      style={{ padding: '20px', border: '1px solid #eee', borderRadius: '15px', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ fontSize: '40px', background: '#fef3e9', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
          {pandit.emoji || "🕉️"}
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{pandit.name} {pandit.verified && <span style={{ color: '#F0C040' }}>✓</span>}</h4>
          <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>{pandit.experience_years}y Exp · {pandit.languages?.join(', ')}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ color: '#F0C040' }}>★</span>
            <span style={{ fontWeight: 700 }}>{pandit.rating}</span>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '12px', color: '#8B6347', marginBottom: '5px' }}>Starting Dakshina</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FF6B00' }}>₹501/-</div>
        <button className="btn btn-primary btn-sm" style={{ marginTop: '10px' }}>Book Now</button>
      </div>
    </div>
  );
}

export function AvailablePanditList({ pandits, loading, onSelect }) {
  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Searching for available scholars...</div>;
  if (pandits.length === 0) return <div style={{ textAlign: 'center', padding: '50px' }}>No available Pt. Ji found in your city. Select another city.</div>;

  return (
    <div style={{ display: 'grid', gap: '15px' }}>
      {pandits.map(p => (
        <InstantBookingCard key={p.id} pandit={p} onSelect={onSelect} />
      ))}
    </div>
  );
}
