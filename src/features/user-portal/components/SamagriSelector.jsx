import React from 'react';

export function SamagriSelector({ kits, selectedId, onYes, onNo }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Question */}
      <p style={{
        fontFamily: 'Cinzel,serif', fontSize: 17, color: '#F0C040',
        fontWeight: 800, textAlign: 'center', margin: 0,
      }}>
        Do you already have the samagri for this ritual?
      </p>

      {/* YES / NO big cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* YES */}
        <button
          onClick={onYes}
          style={{
            padding: '24px 16px',
            borderRadius: 18,
            border: '2px solid rgba(74,222,128,0.4)',
            background: 'rgba(74,222,128,0.08)',
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            transition: 'all 0.22s',
            fontFamily: 'Nunito,sans-serif',
          }}
          onMouseEnter={e => { e.currentTarget.style.border = '2px solid #4ade80'; e.currentTarget.style.background = 'rgba(74,222,128,0.14)'; }}
          onMouseLeave={e => { e.currentTarget.style.border = '2px solid rgba(74,222,128,0.4)'; e.currentTarget.style.background = 'rgba(74,222,128,0.08)'; }}
        >
          <span style={{ fontSize: 38 }}>✅</span>
          <span style={{ fontWeight: 900, fontSize: 20, color: '#4ade80', fontFamily: 'Cinzel,serif' }}>Yes</span>
          <span style={{ fontSize: 12, color: 'rgba(255,248,240,0.5)', textAlign: 'center', lineHeight: 1.5 }}>
            I have all items.<br />I'll arrange it myself.
          </span>
          <span style={{ marginTop: 6, background: 'rgba(74,222,128,0.2)', color: '#4ade80', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 20 }}>
            → Go to Timing
          </span>
        </button>

        {/* NO */}
        <button
          onClick={onNo}
          style={{
            padding: '24px 16px',
            borderRadius: 18,
            border: '2px solid rgba(255,107,0,0.4)',
            background: 'rgba(255,107,0,0.08)',
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            transition: 'all 0.22s',
            fontFamily: 'Nunito,sans-serif',
          }}
          onMouseEnter={e => { e.currentTarget.style.border = '2px solid #FF6B00'; e.currentTarget.style.background = 'rgba(255,107,0,0.14)'; }}
          onMouseLeave={e => { e.currentTarget.style.border = '2px solid rgba(255,107,0,0.4)'; e.currentTarget.style.background = 'rgba(255,107,0,0.08)'; }}
        >
          <span style={{ fontSize: 38 }}>🛍️</span>
          <span style={{ fontWeight: 900, fontSize: 20, color: '#FF9F40', fontFamily: 'Cinzel,serif' }}>No</span>
          <span style={{ fontSize: 12, color: 'rgba(255,248,240,0.5)', textAlign: 'center', lineHeight: 1.5 }}>
            I need a kit<br />delivered to my door.
          </span>
          <span style={{ marginTop: 6, background: 'rgba(255,107,0,0.2)', color: '#FF9F40', fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 20 }}>
            → Samagri Store
          </span>
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
