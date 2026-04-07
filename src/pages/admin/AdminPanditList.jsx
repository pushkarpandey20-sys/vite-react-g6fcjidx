import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { SEED_PANDITS } from '../../data/seedData';

const C = { page:'#fff8f0', card:'#ffffff', border:'rgba(212,160,23,0.2)', orange:'#FF6B00', gold:'#D4A017', dark:'#3d1f00', mid:'#7a5c3a', soft:'#9a8070', green:'#16a34a', red:'#dc2626' };

export default function AdminPanditList() {
  const [pandits, setPandits] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPandits();
  }, []);

  const fetchPandits = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('pandits').select('*').order('created_at',{ascending:false});
      if (data?.length) setPandits(data);
      else setPandits(SEED_PANDITS);
    } catch(e) {}
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    setPandits(prev => prev.map(p => p.id===id ? {...p,status} : p));
    try {
      await supabase.from('pandits').update({status}).eq('id',id);
    } catch(e) {}
  };

  const displayed = pandits
    .filter(p => filter==='all' || p.status===filter)
    .filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.city?.toLowerCase().includes(search.toLowerCase()));

  const counts = {
    all: pandits.length,
    verified: pandits.filter(p=>p.status==='verified').length,
    pending_verification: pandits.filter(p=>p.status==='pending_verification').length,
    rejected: pandits.filter(p=>p.status==='rejected').length,
  };

  const tabBtn = (f, label, count, color) => (
    <button key={f} onClick={()=>setFilter(f)} style={{ padding:'7px 16px', borderRadius:20, border:`1px solid ${filter===f?color:'rgba(212,160,23,0.3)'}`, background:filter===f?`${color}18`:'transparent', color:filter===f?color:C.mid, fontWeight:700, fontSize:13, cursor:'pointer' }}>
      {label} ({count})
    </button>
  );

  return (
    <div style={{ fontFamily:'Nunito,sans-serif' }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontFamily:'Cinzel,serif', color:C.dark, fontSize:20, margin:0 }}>🙏 Manage Pandits</h2>
        <p style={{ color:C.soft, margin:'4px 0 0', fontSize:13 }}>{pandits.length} registered · {counts.verified} verified</p>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
        {tabBtn('all','All',counts.all,C.orange)}
        {tabBtn('verified','Verified',counts.verified,C.green)}
        {tabBtn('pending_verification','Pending',counts.pending_verification,'#d97706')}
        {tabBtn('rejected','Rejected',counts.rejected,C.red)}
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search by name or city..."
        style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid rgba(212,160,23,0.4)`, background:'#fff', color:C.dark, fontSize:13, marginBottom:14, boxSizing:'border-box', fontFamily:'inherit', outline:'none' }} />

      {loading ? <div style={{ textAlign:'center', padding:40, color:C.soft }}>Loading pandits...</div>
      : displayed.length === 0 ? <div style={{ textAlign:'center', padding:40, color:C.soft }}>No pandits match filters.</div>
      : displayed.map(p => {
        const sc = p.status==='verified' ? {bg:'rgba(34,197,94,0.12)',color:'#15803d'} : p.status==='rejected' ? {bg:'rgba(239,68,68,0.12)',color:C.red} : {bg:'rgba(255,107,0,0.12)',color:'#c2410c'};
        return (
          <div key={p.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 18px', marginBottom:10, boxShadow:'0 1px 4px rgba(212,160,23,0.06)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                  <span style={{ color:C.dark, fontWeight:700, fontSize:16 }}>{p.name}</span>
                  <span style={{ background:sc.bg, color:sc.color, fontSize:11, padding:'2px 8px', borderRadius:10, fontWeight:700 }}>{p.status?.replace(/_/g,' ')}</span>
                  {p.is_online && <span style={{ background:'rgba(34,197,94,0.12)', color:'#15803d', fontSize:11, padding:'2px 8px', borderRadius:10 }}>🟢 Online</span>}
                </div>
                <div style={{ color:C.soft, fontSize:13 }}>📍 {p.city} · {p.years_of_experience||0} yrs · ⭐ {p.rating||'New'} · {p.total_bookings||0} bookings</div>
                <div style={{ color:C.soft, fontSize:13 }}>📞 {p.phone} · ₹{p.min_fee||0}–₹{p.max_fee||0}</div>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:8 }}>
                  {(p.specializations||[]).slice(0,5).map(s=>(
                    <span key={s} style={{ background:'rgba(255,107,0,0.1)', color:'#c2410c', fontSize:11, padding:'2px 8px', borderRadius:10 }}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', gap:8, flexShrink:0, marginLeft:12 }}>
                {p.status!=='verified' && <button onClick={()=>updateStatus(p.id,'verified')} style={{ background:'rgba(34,197,94,0.1)', color:'#15803d', border:'1px solid rgba(34,197,94,0.3)', borderRadius:8, padding:'6px 14px', cursor:'pointer', fontWeight:700, fontSize:12 }}>✓ Approve</button>}
                {p.status!=='rejected' && <button onClick={()=>updateStatus(p.id,'rejected')} style={{ background:'rgba(239,68,68,0.08)', color:C.red, border:'1px solid rgba(239,68,68,0.25)', borderRadius:8, padding:'6px 14px', cursor:'pointer', fontWeight:700, fontSize:12 }}>✗ Reject</button>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
