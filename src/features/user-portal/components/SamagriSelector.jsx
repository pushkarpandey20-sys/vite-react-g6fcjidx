import React, { useState } from 'react';

export function SamagriSelector({ kits, selectedId, onYes, onNo }) {
  const [picked, setPicked] = useState('no'); // NO is default

  const handleYes = () => { setPicked('yes'); onYes(); };
  const handleNo  = () => { setPicked('no');  onNo();  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Question */}
      <p style={{ fontFamily: 'Cinzel,serif', fontSize: 16, color: '#F0C040', fontWeight: 800, textAlign: 'center', margin: 0 }}>
        Do you already have the samagri for this ritual?
      </p>

      {/* YES / NO toggle row */}
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>

        {/* YES — kept intentionally muted */}
        <button
          onClick={handleYes}
          style={{
            flex: 1, maxWidth: 200,
            padding: '16px 12px',
            borderRadius: 14,
            border: '2px solid rgba(255,248,240,0.1)',
            background: 'rgba(26,15,7,0.3)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'all 0.2s',
            fontFamily: 'Nunito,sans-serif',
            opacity: 0.7,
          }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
            border: '2px solid rgba(255,248,240,0.2)',
            background: picked === 'yes' ? 'rgba(255,248,240,0.2)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {picked === 'yes' && <span style={{ color: 'rgba(255,248,240,0.7)', fontSize: 12, fontWeight: 900 }}>✓</span>}
          </div>
          <span style={{ fontWeight: 600, fontSize: 15, color: 'rgba(255,248,240,0.45)' }}>Yes</span>
          <span style={{ fontSize: 12, color: 'rgba(255,248,240,0.3)' }}>— I'll arrange it</span>
        </button>

        {/* NO (default) */}
        <button
          onClick={handleNo}
          style={{
            flex: 1, maxWidth: 200,
            padding: '16px 12px',
            borderRadius: 14,
            border: picked === 'no' ? '2px solid #FF6B00' : '2px solid rgba(255,107,0,0.2)',
            background: picked === 'no' ? 'rgba(255,107,0,0.14)' : 'rgba(26,15,7,0.4)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'all 0.2s',
            fontFamily: 'Nunito,sans-serif',
          }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
            border: `2px solid ${picked === 'no' ? '#FF6B00' : 'rgba(255,107,0,0.3)'}`,
            background: picked === 'no' ? '#FF6B00' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {picked === 'no' && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>✓</span>}
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: picked === 'no' ? '#FF9F40' : 'rgba(255,248,240,0.6)' }}>No</span>
          <span style={{ fontSize: 12, color: 'rgba(255,248,240,0.4)' }}>— Send me a kit</span>
        </button>
      </div>

      {/* If a kit was selected (returned from store) — show it locked in */}
      {selectedId && kits.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,107,0,0.15), rgba(212,160,23,0.08))',
          border: '2px solid #FF6B00',
          borderRadius: 16,
          padding: '18px 20px',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <span style={{ fontSize: 32, flexShrink: 0 }}>📦</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#F0C040', fontWeight: 900, fontFamily: 'Cinzel,serif', fontSize: 15, marginBottom: 4 }}>
              Kit Selected for Delivery ✓
            </div>
            {kits.filter(k => k.id === selectedId).map(k => (
              <div key={k.id}>
                <div style={{ color: 'rgba(255,248,240,0.85)', fontWeight: 700, fontSize: 14 }}>{k.name}</div>
                <div style={{ color: '#FF9F40', fontWeight: 900, fontSize: 16, fontFamily: 'Cinzel,serif', marginTop: 2 }}>₹{k.price} · 🚚 {k.deliveryTime || '2 Days'}</div>
              </div>
            ))}
          </div>
          <div style={{ background: '#FF6B00', color: '#fff', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
            🔒 LOCKED
          </div>
        </div>
      )}
    </div>
  );
}

// Keep SamagriKitCard export for compatibility
export function SamagriKitCard({ kit, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(kit)}
      style={{
        padding: '18px 20px',
        border: selected ? '2px solid #FF6B00' : '1px solid rgba(240,192,64,0.2)',
        borderRadius: 14,
        cursor: 'pointer',
        background: selected ? 'rgba(255,107,0,0.08)' : 'rgba(26,15,7,0.5)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
        transition: 'all 0.22s',
      }}>
      <div>
        <div style={{ color: '#F0C040', fontWeight: 800, fontSize: 14, fontFamily: 'Cinzel,serif' }}>{kit.name}</div>
        <div style={{ color: 'rgba(255,248,240,0.45)', fontSize: 12, marginTop: 3 }}>🚚 {kit.deliveryTime || '2 Days'}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: '#FF9F40', fontWeight: 900, fontSize: 16, fontFamily: 'Cinzel,serif' }}>₹{kit.price}</span>
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          border: `2px solid ${selected ? '#FF6B00' : 'rgba(240,192,64,0.3)'}`,
          background: selected ? '#FF6B00' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {selected && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
        </div>
      </div>
    </div>
  );
}
