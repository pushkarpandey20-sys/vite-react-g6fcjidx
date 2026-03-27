import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { SEED_TEMPLES } from '../../data/seedData';

export default function AdminTempleList() {
  const [temples, setTemples] = useState([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name:'', city:'', deity:'', description:'', timing:'', services:'', is_live:false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('temples').select('*').order('created_at',{ascending:false});
      setTemples(data?.length ? data : SEED_TEMPLES);
      setLoading(false);
    })();
  }, []);

  const addTemple = async () => {
    const temple = { ...form, services: form.services.split(',').map(s=>s.trim()).filter(Boolean), created_at: new Date().toISOString() };
    const { data, error } = await supabase.from('temples').insert(temple).select().single();
    if (!error && data) setTemples(t=>[data,...t]);
    else setTemples(t=>[{...temple,id:'local_'+Date.now()},...t]);
    setAdding(false);
    setForm({ name:'', city:'', deity:'', description:'', timing:'', services:'', is_live:false });
  };

  const toggleLive = async (id, current) => {
    if (String(id).startsWith('temple-') || String(id).startsWith('local')) {
      setTemples(t=>t.map(x=>x.id===id?{...x,is_live:!current}:x));
      return;
    }
    await supabase.from('temples').update({is_live:!current}).eq('id',id);
    setTemples(t=>t.map(x=>x.id===id?{...x,is_live:!current}:x));
  };

  const inp = { width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(41,128,185,0.3)', background:'rgba(255,255,255,0.05)', color:'#fff', fontSize:13, marginBottom:10, boxSizing:'border-box', outline:'none' };

  return (
    <div style={{ color:'rgba(255,255,255,0.85)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h1 style={{ color:'#3498db', fontFamily:'Cinzel,serif', margin:0, fontSize:20 }}>🏛️ Temple Management</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', margin:'4px 0 0', fontSize:13 }}>{temples.length} temples</p>
        </div>
        <button onClick={()=>setAdding(a=>!a)} style={{ background:'#3498db', color:'#fff', border:'none', borderRadius:10, padding:'10px 20px', fontWeight:700, cursor:'pointer', fontSize:13 }}>
          {adding?'✕ Cancel':'+ Add Temple'}
        </button>
      </div>

      {adding && (
        <div style={{ background:'#0f0f1a', border:'1px solid rgba(41,128,185,0.3)', borderRadius:14, padding:20, marginBottom:20 }}>
          <h3 style={{ color:'#3498db', margin:'0 0 14px', fontSize:15 }}>Add New Temple</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label style={{ color:'rgba(255,255,255,0.5)', fontSize:11, display:'block', marginBottom:4 }}>TEMPLE NAME *</label><input style={inp} placeholder="e.g. Kashi Vishwanath" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
            <div><label style={{ color:'rgba(255,255,255,0.5)', fontSize:11, display:'block', marginBottom:4 }}>CITY *</label><input style={inp} placeholder="Varanasi" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))}/></div>
            <div><label style={{ color:'rgba(255,255,255,0.5)', fontSize:11, display:'block', marginBottom:4 }}>DEITY</label><input style={inp} placeholder="Lord Shiva" value={form.deity} onChange={e=>setForm(f=>({...f,deity:e.target.value}))}/></div>
            <div><label style={{ color:'rgba(255,255,255,0.5)', fontSize:11, display:'block', marginBottom:4 }}>TIMING</label><input style={inp} placeholder="4:00 AM – 11:00 PM" value={form.timing} onChange={e=>setForm(f=>({...f,timing:e.target.value}))}/></div>
            <div style={{ gridColumn:'1/-1' }}><label style={{ color:'rgba(255,255,255,0.5)', fontSize:11, display:'block', marginBottom:4 }}>DESCRIPTION</label><textarea style={{...inp,height:60,resize:'none'}} placeholder="Temple description..." value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/></div>
            <div><label style={{ color:'rgba(255,255,255,0.5)', fontSize:11, display:'block', marginBottom:4 }}>SERVICES (comma separated)</label><input style={inp} placeholder="Darshan, Abhishek, Aarti" value={form.services} onChange={e=>setForm(f=>({...f,services:e.target.value}))}/></div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', color:'rgba(255,255,255,0.7)' }}>
                <input type="checkbox" checked={form.is_live} onChange={e=>setForm(f=>({...f,is_live:e.target.checked}))} style={{ width:'auto', accentColor:'#ef4444' }}/>
                🔴 LIVE Darshan Available
              </label>
            </div>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <button onClick={addTemple} style={{ background:'#3498db', color:'#fff', border:'none', borderRadius:8, padding:'9px 24px', fontWeight:700, cursor:'pointer' }}>Add Temple</button>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
        {temples.map(t=>(
          <div key={t.id} style={{ background:'#0f0f1a', border:'1px solid rgba(41,128,185,0.2)', borderRadius:12, padding:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div>
                <div style={{ color:'#F0C040', fontFamily:'Cinzel,serif', fontWeight:700, fontSize:15 }}>{t.icon || '🛕'} {t.name}</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:2 }}>📍 {t.city} · {t.deity}</div>
              </div>
              {t.is_live && <span style={{ background:'rgba(239,68,68,0.2)', color:'#ef4444', fontSize:10, padding:'2px 8px', borderRadius:8, fontWeight:800 }}>🔴 LIVE</span>}
            </div>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, lineHeight:1.5, margin:'0 0 10px' }}>{(t.description||'').substring(0,100)}{(t.description||'').length>100?'...':''}</p>
            {t.timing && <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11, marginBottom:10 }}>⏰ {t.timing}</div>}
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
              {(t.services||[]).slice(0,3).map(s=><span key={s} style={{ background:'rgba(41,128,185,0.15)', color:'#3498db', fontSize:10, padding:'2px 8px', borderRadius:10 }}>{s}</span>)}
            </div>
            <button onClick={()=>toggleLive(t.id,t.is_live)} style={{ width:'100%', background:t.is_live?'rgba(239,68,68,0.15)':'rgba(34,197,94,0.15)', color:t.is_live?'#ef4444':'#22c55e', border:`1px solid ${t.is_live?'rgba(239,68,68,0.3)':'rgba(34,197,94,0.3)'}`, borderRadius:8, padding:'8px', fontSize:12, cursor:'pointer', fontWeight:600 }}>
              {t.is_live?'Disable Live Darshan':'Enable Live Darshan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
