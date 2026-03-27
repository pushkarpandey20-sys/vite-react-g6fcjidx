import React from 'react';

export function SamagriKitCard({ kit, selected, onSelect }) {
  const [customItems, setCustomItems] = React.useState(kit.itemsIncluded || []);
  
  const toggleItem = (e, item) => {
    e.stopPropagation();
    if (customItems.includes(item)) setCustomItems(p => p.filter(i => i !== item));
    else setCustomItems(p => [...p, item]);
  };

  return (
    <div className={`samagri-kit-card card ${selected ? 'selected' : ''}`} 
      onClick={() => onSelect({...kit, customizedItems: customItems})}
      style={{ 
        padding: '20px', 
        border: selected ? '2px solid #FF6B00' : '1px solid #eee', 
        borderRadius: '15px', 
        cursor: 'pointer',
        background: selected ? 'rgba(255,107,0,0.02)' : '#fff',
        transition: 'all 0.3s'
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#5C3317' }}>{kit.name}</h4>
          <p style={{ margin: '5px 0', fontSize: '13px', color: '#8B6347' }}>Estimated Delivery: {kit.deliveryTime || '2 Days'}</p>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FF6B00' }}>₹{kit.price}</div>
      </div>
      
      <div className="kit-includes" style={{ background: '#f9f9f9', padding: '12px', borderRadius: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#8B6347', letterSpacing: '0.5px' }}>Customizable Items ({customItems.length}/{kit.itemsIncluded?.length})</div>
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          {kit.itemsIncluded?.map((item, idx) => (
            <li key={idx} 
              onClick={(e) => toggleItem(e, item)}
              style={{ 
                fontSize: '12px', 
                color: customItems.includes(item) ? '#2C1A0E' : '#ccc', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px',
                textDecoration: customItems.includes(item) ? 'none' : 'line-through'
              }}>
              <span style={{ color: customItems.includes(item) ? '#FF6B00' : '#ccc' }}>{customItems.includes(item) ? '✓' : '○'}</span> {item}
            </li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className={`checkbox-circle ${selected ? 'active' : ''}`} 
          style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #FF6B00', background: selected ? '#FF6B00' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {selected && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
        </div>
        <span style={{ fontSize: '13px', fontWeight: 700 }}>{selected ? 'Bundle Applied' : 'Select this Bundle'}</span>
      </div>
    </div>
  );
}


export function SamagriSelector({ kits, selectedId, onSelect, onSkip }) {
  return (
    <div className="samagri-selector-step">
      <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
        <div className="option-card card" onClick={() => onSkip()} 
          style={{ padding: '20px', border: !selectedId ? '2px solid #FF6B00' : '1px solid #eee', cursor: 'pointer', borderRadius: '15px', position: 'relative' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>I will arrange samagri myself</div>
          <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#666' }}>I have all the items mentioned in the ritual list.</p>
          {!selectedId && <div style={{ position: 'absolute', top: '20px', right: '20px', color: '#FF6B00' }}>✓ Selected</div>}
        </div>

        {kits.map(kit => (
          <SamagriKitCard 
            key={kit.id} 
            kit={kit} 
            selected={selectedId === kit.id} 
            onSelect={onSelect} 
          />
        ))}
      </div>
    </div>
  );
}
