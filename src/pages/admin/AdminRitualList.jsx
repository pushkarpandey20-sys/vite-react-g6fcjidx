import React, { useState } from 'react';
import { supabase } from '../../services/supabase';

const RITUALS_DATA = [
  { id:1, name:'Griha Pravesh', category:'Home & Property', price_min:1500, price_max:8000, duration:'2-4 hrs', active:true, bookings:42 },
  { id:2, name:'Satyanarayan Katha', category:'Devotional', price_min:1100, price_max:5000, duration:'3-5 hrs', active:true, bookings:67 },
  { id:3, name:'Rudrabhishek', category:'Shiva Worship', price_min:2000, price_max:10000, duration:'2-3 hrs', active:true, bookings:38 },
  { id:4, name:'Navgrah Shanti', category:'Astrology & Planets', price_min:1800, price_max:7000, duration:'3-4 hrs', active:true, bookings:29 },
  { id:5, name:'Vivah Ceremony', category:'Marriage', price_min:5000, price_max:25000, duration:'4-8 hrs', active:true, bookings:21 },
  { id:6, name:'Naamkaran', category:'Birth Rites', price_min:1100, price_max:3500, duration:'1-2 hrs', active:true, bookings:31 },
  { id:7, name:'Mundan Ceremony', category:'Birth Rites', price_min:1000, price_max:4000, duration:'1-2 hrs', active:true, bookings:18 },
  { id:8, name:'Upanayana (Janeu)', category:'Coming of Age', price_min:3000, price_max:12000, duration:'4-6 hrs', active:true, bookings:9 },
  { id:9, name:'Antyesti (Last Rites)', category:'Death Rites', price_min:2500, price_max:8000, duration:'2-4 hrs', active:true, bookings:14 },
  { id:10, name:'Maha Mrityunjaya Jaap', category:'Health & Healing', price_min:1500, price_max:7000, duration:'2-3 hrs', active:false, bookings:23 },
  { id:11, name:'Lakshmi Puja', category:'Wealth & Prosperity', price_min:1200, price_max:5000, duration:'1-2 hrs', active:true, bookings:55 },
  { id:12, name:'Kaal Sarp Dosh Nivaran', category:'Astrology & Planets', price_min:3000, price_max:11000, duration:'3-5 hrs', active:false, bookings:16 },
];

const CATEGORIES = ['All', ...new Set(RITUALS_DATA.map(r => r.category))];

export default function AdminRitualList() {
  const [rituals, setRituals] = useState(RITUALS_DATA);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  const toggle = (id) => setRituals(r => r.map(x => x.id === id ? { ...x, active: !x.active } : x));

  const filtered = rituals
    .filter(r => statusFilter === 'all' || (statusFilter === 'active' ? r.active : !r.active))
    .filter(r => catFilter === 'All' || r.category === catFilter)
    .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase()));

  const inp = { padding:'8px 12px', borderRadius:8, border:'1px solid rgba(41,128,185,0.3)', background:'rgba(255,255,255,0.06)', color:'#fff', fontSize:13, outline:'none' };

  return (
    <div style={{ color:'rgba(255,255,255,0.85)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h1 style={{ color:'#3498db', fontFamily:'Cinzel,serif', margin:0, fontSize:20 }}>🕉️ Ritual Catalog</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', margin:'4px 0 0', fontSize:13 }}>{rituals.length} rituals · {rituals.filter(r=>r.active).length} active</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[
          { label:'Total Rituals', v:rituals.length, c:'#3498db' },
          { label:'Active', v:rituals.filter(r=>r.active).length, c:'#22c55e' },
          { label:'Hidden', v:rituals.filter(r=>!r.active).length, c:'#ef4444' },
          { label:'Total Bookings', v:rituals.reduce((s,r)=>s+r.bookings,0), c:'#F0C040' },
        ].map(s => (
          <div key={s.label} style={{ background:'#0f0f1a', border:'1px solid rgba(41,128,185,0.15)', borderRadius:10, padding:'14px 16px' }}>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11, letterSpacing:1 }}>{s.label}</div>
            <div style={{ color:s.c, fontFamily:'Cinzel,serif', fontWeight:700, fontSize:22, marginTop:4 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search rituals..."
          style={{ ...inp, minWidth:180 }} />
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={inp}>
          {CATEGORIES.map(c => <option key={c} value={c} style={{ background:'#0f0f1a' }}>{c}</option>)}
        </select>
        {['all','active','hidden'].map(s => (
          <button key={s} onClick={()=>setStatusFilter(s)} style={{ padding:'8px 14px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:600, fontSize:12, background:statusFilter===s?'#3498db':'rgba(255,255,255,0.07)', color:statusFilter===s?'#fff':'rgba(255,255,255,0.5)' }}>
            {s === 'all' ? 'All' : s === 'active' ? '✓ Active' : '✗ Hidden'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:'#0f0f1a', borderRadius:14, border:'1px solid rgba(41,128,185,0.2)', overflowX:'auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 1.5fr 1fr 1fr', padding:'12px 16px', background:'rgba(41,128,185,0.1)', fontSize:11, color:'rgba(255,255,255,0.4)', letterSpacing:1, fontWeight:700, minWidth:700 }}>
          <span>RITUAL NAME</span><span>CATEGORY</span><span>DURATION</span><span>PRICE RANGE</span><span>BOOKINGS</span><span>STATUS</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:32, color:'rgba(255,255,255,0.3)' }}>No rituals found</div>
        ) : filtered.map(r => (
          <div key={r.id} style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 1.5fr 1fr 1fr', padding:'13px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', alignItems:'center', minWidth:700 }}>
            <div style={{ color:'#fff', fontWeight:600, fontSize:14 }}>{r.name}</div>
            <div style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>
              <span style={{ background:'rgba(41,128,185,0.15)', color:'#3498db', fontSize:10, padding:'2px 8px', borderRadius:10 }}>{r.category}</span>
            </div>
            <div style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>⏱ {r.duration}</div>
            <div style={{ color:'#FF6B00', fontWeight:600, fontSize:13 }}>₹{r.price_min.toLocaleString()} – ₹{r.price_max.toLocaleString()}</div>
            <div style={{ color:'#F0C040', fontWeight:700 }}>{r.bookings}</div>
            <div>
              <button onClick={() => toggle(r.id)} style={{ background: r.active ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', color: r.active ? '#ef4444' : '#22c55e', border: `1px solid ${r.active ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, borderRadius:8, padding:'5px 12px', fontSize:11, cursor:'pointer', fontWeight:700 }}>
                {r.active ? 'Hide' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
