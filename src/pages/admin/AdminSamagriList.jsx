import React, { useState } from 'react';

const C = { card:'#ffffff', border:'rgba(212,160,23,0.2)', orange:'#FF6B00', gold:'#D4A017', dark:'#3d1f00', mid:'#7a5c3a', soft:'#9a8070', green:'#16a34a', red:'#dc2626' };

const ITEMS = [
  { id:1, name:'Diwali Pooja Kit', price:899, mrp:1199, stock:245, sold:1234, cat:'Festival Kits' },
  { id:2, name:'Ganesh Puja Kit', price:349, mrp:499, stock:189, sold:876, cat:'Festival Kits' },
  { id:3, name:'Griha Pravesh Kit', price:599, mrp:799, stock:167, sold:654, cat:'Festival Kits' },
  { id:4, name:'Navratri Pooja Kit', price:499, mrp:699, stock:134, sold:432, cat:'Festival Kits' },
  { id:5, name:'Satyanarayan Kit', price:299, mrp:399, stock:298, sold:1123, cat:'Daily Worship' },
  { id:6, name:'Rudrabhishek Kit', price:449, mrp:599, stock:156, sold:567, cat:'Abhishek' },
  { id:7, name:'Havan Samagri Kit', price:699, mrp:899, stock:89, sold:234, cat:'Havan' },
  { id:8, name:'Daily Puja Kit', price:199, mrp:299, stock:412, sold:2145, cat:'Daily Worship' },
  { id:9, name:'Premium Incense Set', price:249, mrp:349, stock:567, sold:1876, cat:'Incense & Diyas' },
  { id:10, name:'Diya & Lamp Set', price:349, mrp:499, stock:234, sold:987, cat:'Incense & Diyas' },
  { id:11, name:'Navgrah Shanti Kit', price:799, mrp:999, stock:67, sold:145, cat:'Havan' },
  { id:12, name:'Laxmi Puja Kit', price:399, mrp:549, stock:189, sold:543, cat:'Daily Worship' },
];

export default function AdminSamagriList() {
  const [search, setSearch] = useState('');
  const displayed = ITEMS.filter(i=>!search||i.name.toLowerCase().includes(search.toLowerCase()));
  const totalRev = ITEMS.reduce((s,i)=>s+i.price*i.sold,0);

  return (
    <div style={{ fontFamily:'Nunito,sans-serif' }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontFamily:'Cinzel,serif', color:C.dark, fontSize:20, margin:0 }}>🛍️ Samagri Inventory</h2>
        <p style={{ color:C.soft, margin:'4px 0 0', fontSize:13 }}>{ITEMS.length} products · ₹{(totalRev/100000).toFixed(1)}L total sales</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
        {[
          ['₹'+(totalRev/100000).toFixed(1)+'L','Revenue',C.orange],
          [ITEMS.reduce((s,i)=>s+i.sold,0).toLocaleString(),'Units Sold',C.green],
          [ITEMS.reduce((s,i)=>s+i.stock,0).toLocaleString(),'In Stock','#2563eb'],
          [ITEMS.filter(i=>i.stock<100).length,'Low Stock ⚠️',C.red],
        ].map(([v,l,c])=>(
          <div key={l} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 18px' }}>
            <div style={{ color:c, fontWeight:800, fontSize:22 }}>{v}</div>
            <div style={{ color:C.soft, fontSize:11, marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search products..."
        style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid rgba(212,160,23,0.4)`, background:'#fff', color:C.dark, fontSize:13, marginBottom:14, boxSizing:'border-box', fontFamily:'inherit', outline:'none' }} />

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'rgba(212,160,23,0.08)' }}>
              {['Product','Category','Price','Stock','Units Sold','Revenue'].map(h=>(
                <th key={h} style={{ color:C.gold, fontSize:11, fontWeight:800, padding:'10px 14px', textAlign:'left', letterSpacing:0.8, borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map(i=>(
              <tr key={i.id} style={{ borderBottom:`1px solid ${C.border}` }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,107,0,0.03)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'12px 14px', color:C.dark, fontWeight:600 }}>{i.name}</td>
                <td style={{ padding:'12px 14px', color:C.soft, fontSize:13 }}>{i.cat}</td>
                <td style={{ padding:'12px 14px', color:C.orange, fontWeight:700 }}>₹{i.price}<span style={{ color:C.soft, textDecoration:'line-through', fontSize:11, marginLeft:4 }}>₹{i.mrp}</span></td>
                <td style={{ padding:'12px 14px', color:i.stock<100?C.red:C.mid, fontWeight:i.stock<100?700:400 }}>{i.stock}{i.stock<100?' ⚠️':''}</td>
                <td style={{ padding:'12px 14px', color:C.green, fontWeight:700 }}>{i.sold.toLocaleString()}</td>
                <td style={{ padding:'12px 14px', color:C.mid }}>₹{(i.price*i.sold).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
