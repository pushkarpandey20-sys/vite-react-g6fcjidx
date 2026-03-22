import React, { useState, useEffect } from 'react';
import { db } from '../../../services/supabase';
import { Spinner, StatusBadge } from '../../../components/common/UIElements';

export default function SamagriInventoryManager() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchInventory = async () => {
      // Mocking inventory data based on samagri table + inventory fields
      const { data, error } = await db.samagri().select('*').order('name');
      
      // Injecting simulated inventory data if fields don't exist in DB yet
      if (!error) {
        const enhancedData = data.map(item => ({
          ...item,
          stock: item.stock ?? Math.floor(Math.random() * 100),
          warehouse: item.warehouse || 'Kashi Central Hub',
          threshold: item.threshold || 15,
          supplier: item.supplier || 'Vedic Artisans Guild'
        }));
        setInventory(enhancedData);
      }
      setLoading(false);
    };
    fetchInventory();
  }, [db]);

  const updateStock = async (id, delta) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.stock + delta);
        // In real app, we'd update DB here
        return { ...item, stock: newStock };
      }
      return item;
    }));
  };

  if (loading) return <Spinner />;

  const filtered = filter === 'Low Stock' 
    ? inventory.filter(i => i.stock <= i.threshold) 
    : inventory;

  return (
    <div className="samagri-inventory-manager">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid #F0C040' }}>
          <div className="stat-val">{inventory.length}</div>
          <div className="stat-lbl">Active SKUs</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #FF5252' }}>
          <div className="stat-val">{inventory.filter(i => i.stock <= i.threshold).length}</div>
          <div className="stat-lbl">Critical Low Stock</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #00C853' }}>
          <div className="stat-val">₹{inventory.reduce((acc, curr) => acc + (curr.stock * curr.price), 0).toLocaleString()}</div>
          <div className="stat-lbl">Inventory Asset Value</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="sh" style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <div className="sh-title">Sacred Inventory Ledger</div>
          <div className="sh-controls">
            <button className={`chip ${filter === 'All' ? 'on' : ''}`} onClick={() => setFilter('All')}>All items</button>
            <button className={`chip ${filter === 'Low Stock' ? 'on' : ''}`} onClick={() => setFilter('Low Stock')}>Alerts</button>
          </div>
        </div>

        <div className="dtable">
          <div className="thead" style={{ gridTemplateColumns: "1.5fr 1fr 1.2fr 1fr 1.5fr 1.2fr" }}>
            {["Product Offering", "Stock Level", "Warehouse Location", "Reorder Threshold", "Supreme Supplier", "Management"].map(h => (
              <div key={h} className="th">{h}</div>
            ))}
          </div>
          <div className="tbody">
            {filtered.map(i => {
              const isLow = i.stock <= i.threshold;
              return (
                <div key={i.id} className="tr" style={{ gridTemplateColumns: "1.5fr 1fr 1.2fr 1fr 1.5fr 1.2fr", background: isLow ? 'rgba(255, 82, 82, 0.05)' : 'transparent' }}>
                  <div className="td">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ fontSize: '24px' }}>{i.icon}</div>
                      <div>
                        <div style={{ fontWeight: 800 }}>{i.name}</div>
                        <div style={{ fontSize: '10px', color: '#888' }}>₹{i.price} / unit</div>
                      </div>
                    </div>
                  </div>
                  <div className="td">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        fontWeight: 900, 
                        fontSize: '1.1rem', 
                        color: isLow ? '#FF5252' : '#2C1A0E' 
                      }}>
                        {i.stock}
                      </span>
                      {isLow && <span title="Low Stock Alert" style={{ cursor: 'help' }}>⚠️</span>}
                    </div>
                    <div style={{ fontSize: '9px', textTransform: 'uppercase', opacity: 0.6 }}>Current Units</div>
                  </div>
                  <div className="td" style={{ fontSize: '13px' }}>📍 {i.warehouse}</div>
                  <div className="td" style={{ fontWeight: 700, color: '#8B6347' }}>{i.threshold} units</div>
                  <div className="td" style={{ fontSize: '13px', fontWeight: 600 }}>🏛️ {i.supplier}</div>
                  <div className="td">
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button className="btn btn-outline btn-xs" onClick={() => updateStock(i.id, -1)} style={{ padding: '0 8px', minWidth: '30px' }}>-</button>
                      <button className="btn btn-outline btn-xs" onClick={() => updateStock(i.id, 1)} style={{ padding: '0 8px', minWidth: '30px' }}>+</button>
                      <button className="btn btn-primary btn-xs" style={{ marginLeft: '5px' }}>Refill</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
