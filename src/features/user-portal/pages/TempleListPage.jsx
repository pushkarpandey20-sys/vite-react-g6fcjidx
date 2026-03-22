import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppCtx';
import { db } from '../../services/supabase';
import { Spinner } from '../../components/common/UIElements';

export default function TempleListPage() {
  const { devoteeId, setShowLogin } = useApp();
  const navigate = useNavigate();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    db.temples().select("*").then(({ data }) => {
      setTemples(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = temples.filter(t => 
    t.name.toLowerCase().includes(filter.toLowerCase()) || 
    t.city.toLowerCase().includes(filter.toLowerCase())
  );

  const handleBook = (temple) => {
    if (!devoteeId) return setShowLogin(true);
    navigate(`/user/temples/book/${temple.id}`, { state: { temple } });
  };

  return (
    <div className="temple-list-page">
      <div className="marketplace-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 className="ph-title" style={{ color: '#F0C040' }}>Sacred Temples & Shrines</h2>
          <p className="ph-sub">Connect with divine energy through remote and in-person temple services.</p>
        </div>
        <div className="search-bar" style={{ width: '300px' }}>
          <input 
            className="fi" 
            placeholder="Search God or City..." 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            style={{ borderRadius: '15px' }}
          />
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '25px' }}>
          {filtered.map(t => (
            <div key={t.id} className="temple-card card" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(212,160,23,.1)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', background: 'linear-gradient(45deg, #FFFAF5, #FFF3E6)' }}>{t.icon || "🛕"}</div>
                {t.is_live && <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#FF0000', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%' }} />LIVE</div>}
                <div style={{ position: 'absolute', bottom: '15px', left: '15px', background: 'rgba(255,255,255,0.9)', padding: '5px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, color: '#FF6B00' }}>📍 {t.city}</div>
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{t.name}</h3>
                <p style={{ color: '#8B6347', fontSize: '13px', fontStyle: 'italic', marginBottom: '15px', lineHeight: 1.5 }}>{t.description || "Ancient shrine of divine grace and spiritual wisdom."}</p>
                
                <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '15px' }}>
                    {(t.poojas || []).slice(0, 3).map((p, i) => (
                      <span key={i} style={{ fontSize: '10px', background: '#f9f9f9', padding: '4px 8px', borderRadius: '6px', border: '1px solid #eee', fontWeight: 700 }}>{p}</span>
                    ))}
                    {t.poojas?.length > 3 && <span style={{ fontSize: '10px', opacity: 0.5 }}>+{t.poojas.length - 3} More</span>}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#8B6347' }}>Next Aarti: <span style={{ fontWeight: 800, color: '#FF6B00' }}>{t.next_aarti || "Noon"}</span></div>
                    <button className="btn btn-primary btn-sm" onClick={() => handleBook(t)}>View Services</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
