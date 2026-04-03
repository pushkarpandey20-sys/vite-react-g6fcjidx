import React, { useState } from 'react';

export function SamagriKitCard({ kit, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(kit)}
      style={{
        padding: '20px',
        border: selected ? '2px solid #FF6B00' : '1px solid rgba(240,192,64,0.2)',
        borderRadius: '15px',
        cursor: 'pointer',
        background: selected ? 'rgba(255,107,0,0.08)' : 'rgba(26,15,7,0.5)',
        transition: 'all 0.3s',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
      }}>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#F0C040', fontFamily: 'Cinzel,serif' }}>{kit.name}</h4>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,248,240,0.5)' }}>
          🚚 Delivery: {kit.deliveryTime || '2 Days'} &nbsp;·&nbsp; {kit.itemsIncluded?.length || 0} items included
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FF9F40', fontFamily: 'Cinzel,serif' }}>₹{kit.price}</span>
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          border: `2px solid ${selected ? '#FF6B00' : 'rgba(240,192,64,0.3)'}`,
          background: selected ? '#FF6B00' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {selected && <span style={{ color: '#fff', fontSize: 13 }}>✓</span>}
        </div>
      </div>
    </div>
  );
}


export function SamagriSelector({ kits, selectedId, onSelect, onSkip }) {
  // null = not decided yet, 'yes' = have it, 'no' = need to buy
  const [answer, setAnswer] = useState(
    selectedId ? 'no' : selectedId === null ? null : 'yes'
  );

  const handleYes = () => {
    setAnswer('yes');
    onSkip();
  };

  const handleNo = () => {
    setAnswer('no');
  };

  return (
    <div className="samagri-selector-step">

      {/* YES / NO Question */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontFamily: 'Cinzel,serif', fontSize: 16, color: '#F0C040', fontWeight: 700, textAlign: 'center', marginBottom: 18 }}>
          Do you already have the samagri for this ritual?
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          {/* YES */}
          <button
            onClick={handleYes}
            style={{
              flex: 1, maxWidth: 220,
              padding: '18px 0',
              borderRadius: 16,
              border: `2px solid ${answer === 'yes' ? '#4ade80' : 'rgba(74,222,128,0.25)'}`,
              background: answer === 'yes' ? 'rgba(74,222,128,0.12)' : 'rgba(26,15,7,0.5)',
              cursor: 'pointer',
              transition: 'all 0.25s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}>
            <span style={{ fontSize: 32 }}>✅</span>
            <span style={{ fontWeight: 900, fontSize: 18, color: answer === 'yes' ? '#4ade80' : 'rgba(255,248,240,0.7)', fontFamily: 'Cinzel,serif' }}>Yes</span>
            <span style={{ fontSize: 12, color: 'rgba(255,248,240,0.4)', textAlign: 'center', paddingInline: 12 }}>I have all the items. I'll arrange it myself.</span>
          </button>

          {/* NO */}
          <button
            onClick={handleNo}
            style={{
              flex: 1, maxWidth: 220,
              padding: '18px 0',
              borderRadius: 16,
              border: `2px solid ${answer === 'no' ? '#FF6B00' : 'rgba(255,107,0,0.25)'}`,
              background: answer === 'no' ? 'rgba(255,107,0,0.1)' : 'rgba(26,15,7,0.5)',
              cursor: 'pointer',
              transition: 'all 0.25s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}>
            <span style={{ fontSize: 32 }}>🛍️</span>
            <span style={{ fontWeight: 900, fontSize: 18, color: answer === 'no' ? '#FF9F40' : 'rgba(255,248,240,0.7)', fontFamily: 'Cinzel,serif' }}>No</span>
            <span style={{ fontSize: 12, color: 'rgba(255,248,240,0.4)', textAlign: 'center', paddingInline: 12 }}>I need a kit delivered to my door.</span>
          </button>
        </div>
      </div>

      {/* Kit list — only shown when NO */}
      {answer === 'no' && kits.length > 0 && (
        <div style={{ display: 'grid', gap: 14, marginBottom: 10 }}>
          <p style={{ color: 'rgba(255,248,240,0.5)', fontSize: 13, margin: '0 0 6px', textAlign: 'center' }}>
            🎁 Select a curated kit — <span style={{ color: '#FF6B00', fontWeight: 800 }}>Save 10%</span> when bundled with your booking
          </p>
          {kits.map(kit => (
            <SamagriKitCard
              key={kit.id}
              kit={kit}
              selected={selectedId === kit.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      {/* Confirmation chips */}
      {answer === 'yes' && (
        <div style={{ textAlign: 'center', color: '#4ade80', fontWeight: 700, fontSize: 14, padding: '10px 0' }}>
          ✓ Great! You'll bring your own samagri. Pandit will confirm the checklist.
        </div>
      )}
      {answer === 'no' && !selectedId && (
        <div style={{ textAlign: 'center', color: 'rgba(255,248,240,0.4)', fontSize: 13, paddingTop: 8 }}>
          Please select a kit above, or go back and choose YES to continue without ordering.
        </div>
      )}
    </div>
  );
}
