import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { SEED_PANDITS } from '../../data/seedData';

export default function AdminPanditList() {
  const [pandits, setPandits] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('pandits').select('*').order('created_at',{ascending:false});
      const dbIds = new Set((data||[]).map(p=>p.id));
      const combined = [...(data||[]), ...SEED_PANDITS.filter(p=>!dbIds.has(p.id))];
      setPandits(combined);
      setLoading(false);
    })();
  }, []);

  const updateStatus = async (id, status) => {
    if (String(id).startsWith('seed-')) {
      setPandits(p=>p.map(x=>x.id===id?{...x,status}:x));
      return;
    }
    await supabase.from('pandits').update({status,updated_at:new Date().toISOString()}).eq('id',id);
    setPandits(p=>p.map(x=>x.id===id?{...x,status}:x));
  };

  const filtered = pandits
    .filter(p => filter==='all' || p.status===filter)
    .filter(p => !search || (p.name||'').toLowerCase().includes(search.toLowerCase()) || (p.city||'').toLowerCase().includes(search.toLowerCase()));

  const statusStyle = s => s==='verified'
    ? {bg:'rgba(34,197,94,0.2)',c:'#22c55e'}
    : s==='pending_verification'
    ? {bg:'rgba(255,107,0,0.2)',c:'#FF6B00'}
    : {bg:'rgba(239,68,68,0.2)',c:'#ef4444'};

  return (
    <div style={{ color:'rgba(255,255,255,0.85)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h1 style={{ color:'#3498db', fontFamily:'Cinzel,serif', margin:0, fontSize:20 }}>🙏 Manage Pandits</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', margin:'4px 0 0', fontSize:13 }}>{pandits.length} total pandits</p>
        </div>
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or city..."
          style={{ padding:'8px 14px', borderRadius:8, border:'1px solid rgba(41,128,185,0.3)', background:'rgba(255,255,255,0.05)', color:'#fff', fontSize:13, outline:'none', flex:1, minWidth:200 }} />
        {['all','verified','pending_verification','rejected'].map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{ padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:600, fontSize:12, background:filter===s?'#3498db':'rgba(255,255,255,0.07)', color:filter===s?'#fff':'rgba(255,255,255,0.5)' }}>
            {s==='all'?'All':s==='verified'?'✓ Verified':s==='pending_verification'?'⏳ Pending':'✗ Rejected'}
          </button>
        ))}
      </div>

      <div style={{ background:'#0f0f1a', borderRadius:14, border:'1px solid rgba(41,128,185,0.2)', overflowX:'auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1.5fr 1fr 1.5fr', padding:'12px 16px', background:'rgba(41,128,185,0.1)', fontSize:11, color:'rgba(255,255,255,0.4)', letterSpacing:1, fontWeight:700, minWidth:700 }}>
          <span>PANDIT</span><span>CITY</span><span>EXP</span><span>SPECIALIZATION</span><span>RATING</span><span>ACTIONS</span>
        </div>
        {loading ? (
          <div style={{ textAlign:'center', padding:32, color:'rgba(255,255,255,0.3)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:32, color:'rgba(255,255,255,0.3)' }}>No pandits found</div>
        ) : filtered.map(p=>{
          const sc = statusStyle(p.status);
          return (
            <div key={p.id} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1.5fr 1fr 1.5fr', padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center', minWidth:700 }}>
              <div>
                <div style={{ color:'#fff', fontWeight:600, fontSize:14 }}>{p.name}</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>{(p.languages||[]).slice(0,2).join(', ')}</div>
                <span style={{ background:sc.bg, color:sc.c, fontSize:10, padding:'2px 8px', borderRadius:10, fontWeight:700 }}>{(p.status||'unknown').replace(/_/g,' ')}</span>
              </div>
              <div style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}>{p.city}</div>
              <div style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}>{p.years_of_experience||0} yrs</div>
              <div style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>{(p.specializations||[]).slice(0,2).join(', ')}</div>
              <div style={{ color:'#F0C040', fontWeight:700 }}>⭐ {p.rating||0}</div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {p.status!=='verified' && <button onClick={()=>updateStatus(p.id,'verified')} style={{ background:'rgba(34,197,94,0.2)', color:'#22c55e', border:'1px solid rgba(34,197,94,0.3)', borderRadius:6, padding:'5px 10px', fontSize:11, cursor:'pointer', fontWeight:700 }}>Approve</button>}
                {p.status==='verified' && <button onClick={()=>updateStatus(p.id,'suspended')} style={{ background:'rgba(239,68,68,0.15)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6, padding:'5px 10px', fontSize:11, cursor:'pointer' }}>Suspend</button>}
                {p.status!=='verified' && p.status!=='rejected' && <button onClick={()=>updateStatus(p.id,'rejected')} style={{ background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'5px 10px', fontSize:11, cursor:'pointer' }}>Reject</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
