import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { SEED_TEMPLES } from '../../data/seedData';

const C = { card:'#ffffff', border:'rgba(212,160,23,0.2)', orange:'#FF6B00', gold:'#D4A017', dark:'#3d1f00', mid:'#7a5c3a', soft:'#9a8070', green:'#16a34a', red:'#dc2626' };

export default function AdminTempleList() {
  const [temples, setTemples] = useState(SEED_TEMPLES);

  useEffect(() => {
    (async () => {
      try {
        const { supabase } = await import('../../services/supabase');
        const { data } = await supabase.from('temples').select('*');
        if (data?.length) setTemples(data);
      } catch(e) {}
    })();
  }, []);

  const toggleLive = async (id, current) => {
    const next = !current;
    setTemples(prev => prev.map(t => t.id === id ? { ...t, is_live: next } : t));
    try {
      await supabase.from('temples').update({ is_live: next }).eq('id', id);
    } catch (e) {}
  };

  return (
    <div style={{ fontFamily:'Nunito,sans-serif' }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontFamily:'Cinzel,serif', color:C.dark, fontSize:20, margin:0 }}>🏛️ Temple Management</h2>
        <p style={{ color:C.soft, margin:'4px 0 0', fontSize:13 }}>{temples.length} temples · {temples.filter(t=>t.is_live).length} with live darshan</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
        {temples.map(t=>(
          <div key={t.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'16px 18px', boxShadow:'0 2px 8px rgba(212,160,23,0.06)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div>
                <div style={{ color:C.dark, fontWeight:700, fontSize:15 }}>{t.name}</div>
                <div style={{ color:C.soft, fontSize:13, marginTop:2 }}>📍 {t.city} · 🙏 {t.deity}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                {t.is_live && <span style={{ background:'rgba(239,68,68,0.12)', color:C.red, fontSize:10, padding:'2px 8px', borderRadius:10, fontWeight:800 }}>🔴 LIVE</span>}
                <button onClick={() => toggleLive(t.id, t.is_live)} style={{ background:t.is_live?'rgba(239,68,68,0.08)':'rgba(34,197,94,0.1)', color:t.is_live?C.red:'#15803d', border:`1px solid ${t.is_live?'rgba(239,68,68,0.25)':'rgba(34,197,94,0.3)'}`, borderRadius:8, padding:'4px 10px', cursor:'pointer', fontSize:11, fontWeight:700 }}>
                  {t.is_live?'Stop Live':'Go Live'}
                </button>
              </div>
            </div>
            <p style={{ color:C.mid, fontSize:12, lineHeight:1.5, margin:'0 0 10px' }}>{(t.description||'').substring(0,100)}...</p>
            <div style={{ color:C.soft, fontSize:12 }}>⏰ {t.timing}</div>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:8 }}>
              {(t.services||[]).slice(0,4).map(s=><span key={s} style={{ background:'rgba(212,160,23,0.12)', color:C.gold, fontSize:11, padding:'2px 8px', borderRadius:10 }}>{s}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
