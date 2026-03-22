import React, { useState } from 'react';
import { db } from '../../../services/supabase';
import { Spinner, Toggle, StatusBadge } from '../../../components/common/UIElements';

export default function TempleManagementModule({ temples, onUpdate }) {
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const handleUpdate = async (id, data) => {
    const { error } = await db.temples().update(data).eq('id', id);
    if (!error && onUpdate) onUpdate(id, data);
  };

  return (
    <div className="temple-management-module">
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="sh" style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <h3 className="sh-title" style={{ fontSize: '1.4rem' }}>Vedic Shrine Registry ({temples.length})</h3>
        </div>

        <div className="dtable">
          <div className="thead" style={{ gridTemplateColumns: "1.5fr 1fr 1.2fr 1.2fr 1.2fr 1fr" }}>
            {["Sacred Temple", "Location Hub", "Sacred Rituals", "Live Stream Status", "Prasad Courier", "Actions"].map(h => (
              <div key={h} className="th">{h}</div>
            ))}
          </div>
          <div className="tbody">
            {temples.map(t => (
              <div key={t.id} className="tr" style={{ gridTemplateColumns: "1.5fr 1fr 1.2fr 1.2fr 1.2fr 1fr" }}>
                <div className="td">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '28px' }}>{t.icon || "🛕"}</div>
                    <div>
                      <div style={{ fontWeight: 800 }}>{t.name}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>ID: #{t.id.slice(-6)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="td" style={{ fontWeight: 600 }}>📍 {t.city}</div>
                
                <div className="td">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {(t.poojas || []).slice(0, 2).map((p, i) => (
                      <span key={i} style={{ fontSize: '9px', background: '#F9F9F9', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ddd' }}>{p}</span>
                    ))}
                    {t.poojas?.length > 2 && <span style={{ fontSize: '9px', opacity: 0.5 }}>+{t.poojas.length - 2} More</span>}
                  </div>
                  <button className="btn btn-link btn-xs" style={{ padding: 0, marginTop: '4px', fontSize: '10px' }} onClick={() => setEditing({ type: 'rituals', item: t })}>Modify Catalog</button>
                </div>

                <div className="td">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Toggle on={t.is_live} onChange={() => handleUpdate(t.id, { is_live: !t.is_live })} />
                    <span style={{ fontSize: '10px', fontWeight: 800, color: t.is_live ? '#00C853' : '#888' }}>{t.is_live ? "ON AIR" : "OFFLINE"}</span>
                  </div>
                </div>

                <div className="td">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Toggle on={t.prasad_delivery} onChange={() => handleUpdate(t.id, { prasad_delivery: !t.prasad_delivery })} />
                    <StatusBadge status={t.prasad_delivery ? "active" : "inactive"} label={t.prasad_delivery ? "Supported" : "Disabled"}/>
                  </div>
                </div>

                <div className="td">
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline btn-xs" onClick={() => setEditing({ type: 'basic', item: t })}>Edit</button>
                    <button className="btn btn-outline btn-xs" style={{ borderColor: '#FF5252', color: '#FF5252' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editing && (
        <div className="overlay" style={{ zIndex: 3000 }} onClick={() => setEditing(null)}>
          <div className="modal card" style={{ padding: '30px', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <h3 className="ph-title" style={{ color: '#F0C040', marginBottom: '20px' }}>
              {editing.type === 'rituals' ? `${editing.item.name}: Ritual Catalog` : `Update Sacred Metadata`}
            </h3>
            
            {editing.type === 'rituals' ? (
              <div className="ritual-form">
                <p className="ph-sub" style={{ marginBottom: '20px' }}>Select rituals that are performed daily at this holy shrine.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
                  {["Aarti", "Abhishek", "Rudra Pooja", "Satyanarayan", "Maha Mrityunjay", "Havan", "Special Seva"].map(r => (
                    <label key={r} style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', padding: '10px', border: '1px solid #eee', borderRadius: '10px' }}>
                      <input type="checkbox" checked={editing.item.poojas?.includes(r)} onChange={(e) => {
                        const newRituals = e.target.checked 
                          ? [...(editing.item.poojas || []), r] 
                          : editing.item.poojas.filter(x => x !== r);
                        handleUpdate(editing.item.id, { poojas: newRituals });
                        setEditing({...editing, item: {...editing.item, poojas: newRituals}});
                      }} />
                      <span style={{ fontSize: '13px' }}>{r}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="basic-form">
                <div className="fg"><label className="fl">Icon Emoji</label><input className="fi" defaultValue={editing.item.icon} /></div>
                <div className="fg"><label className="fl">Temple Name</label><input className="fi" defaultValue={editing.item.name} /></div>
                <div className="fg"><label className="fl">Location City</label><input className="fi" defaultValue={editing.item.city} /></div>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
              <button className="btn btn-primary btn-full" onClick={() => setEditing(null)}>Save Sanctified Sync</button>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="overlay" style={{ zIndex: 3000 }} onClick={() => setShowAdd(false)}>
          <div className="modal card" style={{ padding: '30px', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <h3 className="ph-title" style={{ color: '#F0C040', marginBottom: '20px' }}>Onboard New Holy Shrine</h3>
            <div className="fg"><label className="fl">Sanctuary Name</label><input className="fi" placeholder="Ex: Shri Kashi Vishwanath Mandir" /></div>
            <div className="fg"><label className="fl">City / Tirtha</label><input className="fi" placeholder="Ex: Varanasi" /></div>
            <div className="fg"><label className="fl">Temple Icon</label><input className="fi" placeholder="Ex: 🕉️" /></div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
              <button className="btn btn-primary btn-full" onClick={() => setShowAdd(false)}>Initiate Temple Onboarding</button>
            </div>
          </div>
        </div>
      )}
      
      <button className="btn btn-primary btn-lg" style={{ position: 'fixed', bottom: '30px', right: '30px', boxShadow: '0 10px 30px rgba(240,192,64,0.3)' }} onClick={() => setShowAdd(true)}>+ Onboard New Temple</button>
    </div>
  );
}
