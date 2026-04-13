import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppCtx';
import { db } from '../../../services/supabase';
import { Spinner } from '../../../components/common/UIElements';

const SAMPLE_TEMPLES = [
  { id:'t1', name:'Kashi Vishwanath', city:'Varanasi', icon:'🔱', is_live:true, next_aarti:'5:30 AM', poojas:['Rudrabhishek','Mangala Aarti','Shringar Bhog','Sapta Rishis'], description:'One of the most sacred Shiva temples on the banks of the Ganges.' },
  { id:'t2', name:'Ram Janmabhoomi', city:'Ayodhya', icon:'🏹', is_live:false, next_aarti:'6:00 AM', poojas:['Ramlala Darshan','Parikrama','Ram Katha','Special Bhog'], description:'Sacred birthplace of Lord Ram — the grand new temple complex.' },
  { id:'t3', name:'Tirupati Balaji',  city:'Tirupati', icon:'🪔', is_live:true, next_aarti:'7:00 AM', poojas:['Suprabhatam','Archana','Kalyanam','Sahasranama'], description:'Most visited Vishnu shrine in the world, atop the Tirumala hills.' },
  { id:'t4', name:'Siddhivinayak',    city:'Mumbai',   icon:'🐘', is_live:false, next_aarti:'12:00 PM', poojas:['Ganesh Puja','Modak Naivedya','Sankashti','Gauri Puja'], description:'Revered Ganesh temple in Prabhadevi, Mumbai — blessings before new ventures.' },
  { id:'t5', name:'Mahakal Ujjain',   city:'Ujjain',   icon:'⚡', is_live:true, next_aarti:'4:00 AM', poojas:['Bhasma Aarti','Rudrabhishek','Mahashivratri','Panchakroshi'], description:'One of the 12 Jyotirlingas — ancient seat of Lord Shiva\'s divine light.' },
  { id:'t6', name:'Vaishno Devi',     city:'Katra',    icon:'🌸', is_live:false, next_aarti:'4:00 AM', poojas:['Maa Darshan','Ardh Kuwari','Bhawan Puja','Aarti'], description:'Sacred cave shrine of Goddess Vaishnavi in the Trikuta mountains.' },
];

export default function TempleListPage() {
  const { devoteeId, setShowLogin } = useApp();
  const navigate = useNavigate();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [liveOnly, setLiveOnly] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await db.temples().select('*');
        if (error) throw error;
        setTemples(data?.length ? data : SAMPLE_TEMPLES);
      } catch (e) {
        console.warn("Temple Fetch Error (using fallbacks):", e);
        setTemples(SAMPLE_TEMPLES);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = temples
    .filter(t => !filter || t.name.toLowerCase().includes(filter.toLowerCase()) || (t.city||'').toLowerCase().includes(filter.toLowerCase()))
    .filter(t => !liveOnly || t.is_live);

  const handleBook = (temple) => {
    if (!devoteeId) return setShowLogin(true);
    navigate(`/user/temples/book/${temple.id}`, { state: { temple } });
  };

  const C = {
    bg: '#fff8f0',
    card: '#ffffff',
    text: '#3d1f00',
    soft: '#9a8070',
    accent: '#FF6B00',
    gold: '#D4A017',
    border: 'rgba(212,160,23,0.15)'
  };

  const cardStyle = { 
    background: C.card, 
    border: `1px solid ${C.border}`, 
    borderRadius: 24, 
    overflow: 'hidden', 
    display: 'flex', 
    flexDirection: 'column',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
  };

  return (
    <div style={{ color: C.text, fontFamily: '"Inter", sans-serif' }}>
      {/* Hero */}
      <div style={{ ...cardStyle, padding: '32px', marginBottom: 24, background: 'linear-gradient(135deg, #fff5eb, #fff)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,107,0,0.08)',
          border: '1px solid rgba(255,107,0,0.15)', color: C.accent, fontSize: 10, fontWeight: 800,
          letterSpacing: '1.2px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 20, marginBottom: 12 }}>
          🛕 Sacred Sites of Bharat
        </div>
        <h2 style={{ fontFamily: 'Cinzel, serif', color: C.text, fontSize: 28, margin: '0 0 8px', fontWeight: 900 }}>Sacred Temples & Shrines</h2>
        <p style={{ color: C.soft, margin: 0, fontSize: 14, fontWeight: 500 }}>Book temple services, remote aarti darshan, and special poojas from across the subcontinent.</p>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search temple, deity or city..."
            style={{ width: '100%', padding: '12px 14px 12px 48px', background: '#fff',
              border: `1px solid ${C.border}`, borderRadius: 16, color: C.text,
              fontSize: 14, fontWeight: 600, outline: 'none' }} />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          background: liveOnly ? 'rgba(239,68,68,0.08)' : '#fff', 
          border: `1px solid ${liveOnly ? 'rgba(239,68,68,0.3)' : C.border}`,
          borderRadius: 16, padding: '10px 20px', whiteSpace: 'nowrap' }}>
          <input type="checkbox" checked={liveOnly} onChange={e => setLiveOnly(e.target.checked)}
            style={{ accentColor: '#ef4444', width: 16, height: 16 }} />
          <span style={{ color: liveOnly ? '#ef4444' : C.soft, fontWeight: 800, fontSize: 13 }}>🔴 LIVE DARSHAN</span>
        </label>
        <div style={{ color: C.soft, fontSize: 13, fontWeight: 700 }}>
          {loading ? '…' : `${filtered.length} temples active`}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}><Spinner /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {filtered.map(t => (
            <div key={t.id} style={{ ...cardStyle, transition: '0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)'; }}>

              {/* Decorative Area */}
              <div style={{ height: 180, position: 'relative', background: 'linear-gradient(135deg, #fef2e0, #fff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ fontSize: 80, lineHeight: 1, filter: 'drop-shadow(0 4px 12px rgba(255,107,0,0.15))' }}>{t.icon || '🛕'}</div>
                
                {t.is_live && (
                  <div style={{ position: 'absolute', top: 16, right: 16, background: '#ef4444',
                    color: '#fff', fontSize: 10, fontWeight: 940, padding: '5px 12px', borderRadius: 20,
                    display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>
                    <div style={{ width: 6, height: 6, background: '#fff', borderRadius: '50%' }} />
                    LIVE
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(10px)', color: C.text, padding: '6px 14px',
                  borderRadius: 20, fontSize: 12, fontWeight: 800, border: `1px solid ${C.border}` }}>
                  📍 {t.city}
                </div>
              </div>

              {/* Info Area */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 10px', fontFamily: 'Cinzel, serif', fontSize: 19, color: C.text, fontWeight: 900 }}>{t.name}</h3>
                <p style={{ color: C.soft, fontSize: 14, fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 20px' }}>
                  {t.description || 'Ancient shrine of divine grace and spiritual wisdom.'}
                </p>

                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, marginTop: 'auto' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                    {(t.poojas || []).slice(0, 3).map((p, i) => (
                      <span key={i} style={{ fontSize: 10, background: 'rgba(212,160,23,0.06)',
                        color: C.gold, padding: '4px 10px', borderRadius: 8,
                        border: `1px solid rgba(212,160,23,0.15)`, fontWeight: 800 }}>{p}</span>
                    ))}
                    {t.poojas?.length > 3 && (
                      <span style={{ fontSize: 10, color: C.soft, padding: '4px 6px', fontWeight: 600 }}>+{t.poojas.length - 3} more</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12, color: C.soft, fontWeight: 600 }}>
                      Next Aarti: <span style={{ color: C.accent, fontWeight: 900 }}>{t.next_aarti || 'Noon'}</span>
                    </div>
                    <button onClick={() => handleBook(t)}
                      style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 12, 
                        padding: '10px 20px', fontSize: 13, fontWeight: 840, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,107,0,0.2)' }}>
                      View Services →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: 24, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🛕</div>
          <h3 style={{ fontFamily: 'Cinzel, serif', color: C.text, fontSize: 24, marginBottom: 8, fontWeight: 900 }}>Shrine Not Found</h3>
          <p style={{ color: C.soft, fontSize: 15, fontWeight: 500 }}>We couldn't find any temples matching your search. Please try a broader term.</p>
          <button onClick={() => { setFilter(''); setLiveOnly(false); }} 
            style={{ marginTop: 20, background: 'rgba(255,107,0,0.1)', color: C.accent, border: `1px solid ${C.accent}`, borderRadius: 12, padding: '10px 24px', fontWeight: 800, cursor: 'pointer' }}>
            Reset Exploration
          </button>
        </div>
      )}
    </div>
  );
}
