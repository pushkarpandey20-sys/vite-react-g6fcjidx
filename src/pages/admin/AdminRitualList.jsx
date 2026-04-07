import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const C = { card:'#ffffff', border:'rgba(212,160,23,0.2)', orange:'#FF6B00', gold:'#D4A017', dark:'#3d1f00', mid:'#7a5c3a', soft:'#9a8070' };

const RITUALS = [
  { id:1, name:'Griha Pravesh', category:'Housewarming', baseFee:2100, duration:'3-4 hrs', pandits:45, bookings:312 },
  { id:2, name:'Satyanarayan Katha', category:'Prosperity', baseFee:1500, duration:'2-3 hrs', pandits:67, bookings:489 },
  { id:3, name:'Vivah Ceremony', category:'Marriage', baseFee:8000, duration:'6-8 hrs', pandits:23, bookings:178 },
  { id:4, name:'Rudrabhishek', category:'Shiva Worship', baseFee:2500, duration:'1.5-2 hrs', pandits:34, bookings:267 },
  { id:5, name:'Navgrah Shanti', category:'Planetary', baseFee:1800, duration:'2 hrs', pandits:28, bookings:198 },
  { id:6, name:'Kaal Sarp Dosh', category:'Dosh Nivaran', baseFee:3500, duration:'2-3 hrs', pandits:19, bookings:145 },
  { id:7, name:'Mundan Ceremony', category:'Childhood', baseFee:1200, duration:'1 hr', pandits:41, bookings:223 },
  { id:8, name:'Namkaran Ceremony', category:'Childhood', baseFee:1000, duration:'45 min', pandits:38, bookings:189 },
  { id:9, name:'Antyesti Rites', category:'Last Rites', baseFee:2000, duration:'3-4 hrs', pandits:15, bookings:67 },
  { id:10, name:'Vastu Pooja', category:'Architecture', baseFee:3000, duration:'2 hrs', pandits:12, bookings:89 },
];

export default function AdminRitualList() {
  const [rituals, setRituals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('rituals').select('*').order('name');
        if (data?.length) setRituals(data);
        else setRituals(RITUALS); // Fallback to seed if empty
      } catch (e) {} finally { setLoading(false); }
    })();
  }, []);

  const displayed = rituals.filter(r => !search || r.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ fontFamily:'Nunito,sans-serif' }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontFamily:'Cinzel,serif', color:C.dark, fontSize:20, margin:0 }}>🕉️ Rituals Catalog</h2>
        <p style={{ color:C.soft, margin:'4px 0 0', fontSize:13 }}>{RITUALS.length} active rituals</p>
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search rituals..."
        style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid rgba(212,160,23,0.4)`, background:'#fff', color:C.dark, fontSize:13, marginBottom:14, boxSizing:'border-box', fontFamily:'inherit', outline:'none' }} />

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'rgba(212,160,23,0.08)' }}>
              {['Ritual','Category','Base Fee','Duration','Active Pandits','Bookings'].map(h=>(
                <th key={h} style={{ color:C.gold, fontSize:11, fontWeight:800, padding:'10px 14px', textAlign:'left', letterSpacing:0.8, borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map(r=>(
              <tr key={r.id} style={{ borderBottom:`1px solid ${C.border}` }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,107,0,0.03)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'12px 14px', color:C.dark, fontWeight:700 }}>{r.name}</td>
                <td style={{ padding:'12px 14px', color:C.soft, fontSize:13 }}>{r.category || 'General'}</td>
                <td style={{ padding:'12px 14px', color:C.orange, fontWeight:700 }}>₹{(r.price || r.baseFee || 0).toLocaleString()}</td>
                <td style={{ padding:'12px 14px', color:C.soft, fontSize:13 }}>{r.duration || '2 hrs'}</td>
                <td style={{ padding:'12px 14px', color:'#16a34a', fontWeight:700 }}>{r.active_pandits || 0}</td>
                <td style={{ padding:'12px 14px', color:C.mid, fontWeight:600 }}>{r.total_bookings || 0}</td>
              </tr>
            ))}
            {loading && <tr><td colSpan="6" style={{ textAlign:'center', padding:20, color:C.soft }}>Syncing with DevSetu Network...</td></tr>}
            {!loading && rituals.length === 0 && <tr><td colSpan="6" style={{ textAlign:'center', padding:20, color:C.soft }}>No rituals found in database.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
