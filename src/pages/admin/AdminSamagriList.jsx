import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const SAMAGRI_DATA = [
  { id:'sm1', name:'Puja Thali Set', category:'Essentials', price:599, stock:45, sold:128, image:'🪔' },
  { id:'sm2', name:'Pure Ghee (500ml)', category:'Offerings', price:349, stock:82, sold:234, image:'🫙' },
  { id:'sm3', name:'Camphor Tablets (50g)', category:'Aromatics', price:89, stock:200, sold:412, image:'⬜' },
  { id:'sm4', name:'Incense Sticks Combo', category:'Aromatics', price:149, stock:150, sold:389, image:'🪄' },
  { id:'sm5', name:'Kumkum & Turmeric Set', category:'Essentials', price:129, stock:95, sold:276, image:'🔴' },
  { id:'sm6', name:'Flowers Garland Pack', category:'Offerings', price:199, stock:30, sold:185, image:'🌼' },
  { id:'sm7', name:'Coconut (Pack of 5)', category:'Offerings', price:249, stock:60, sold:147, image:'🥥' },
  { id:'sm8', name:'Mango Leaves String', category:'Decoration', price:79, stock:40, sold:98, image:'🌿' },
  { id:'sm9', name:'Kalash (Brass)', category:'Vessels', price:799, stock:22, sold:67, image:'🏺' },
  { id:'sm10', name:'Red Cloth (1m)', category:'Decoration', price:119, stock:75, sold:143, image:'🟥' },
  { id:'sm11', name:'Sandalwood Paste', category:'Essentials', price:299, stock:55, sold:201, image:'🌰' },
  { id:'sm12', name:'Complete Puja Kit', category:'Kits', price:1499, stock:18, sold:89, image:'🎁' },
];

const CATEGORIES = ['All', ...new Set(SAMAGRI_DATA.map(s => s.category))];

export default function AdminSamagriList() {
  const [items, setItems] = useState(SAMAGRI_DATA);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  const filtered = items
    .filter(i => catFilter === 'All' || i.category === catFilter)
    .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()));

  const totalRevenue = items.reduce((s, i) => s + i.price * i.sold, 0);
  const lowStock = items.filter(i => i.stock < 25).length;

  const inp = { padding:'8px 12px', borderRadius:8, border:'1px solid rgba(41,128,185,0.3)', background:'rgba(255,255,255,0.06)', color:'#fff', fontSize:13, outline:'none' };

  return (
    <div style={{ color:'rgba(255,255,255,0.85)' }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ color:'#3498db', fontFamily:'Cinzel,serif', margin:0, fontSize:20 }}>🛍️ Samagri Store</h1>
        <p style={{ color:'rgba(255,255,255,0.4)', margin:'4px 0 0', fontSize:13 }}>{items.length} products · ₹{(totalRevenue/1000).toFixed(1)}K revenue</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[
          { label:'Total Products', v:items.length, c:'#3498db' },
          { label:'Total Units Sold', v:items.reduce((s,i)=>s+i.sold,0).toLocaleString(), c:'#22c55e' },
          { label:'Low Stock Items', v:lowStock, c: lowStock > 0 ? '#ef4444' : '#22c55e' },
          { label:'Gross Revenue', v:`₹${(totalRevenue/1000).toFixed(0)}K`, c:'#F0C040' },
        ].map(s => (
          <div key={s.label} style={{ background:'#0f0f1a', border:'1px solid rgba(41,128,185,0.15)', borderRadius:10, padding:'14px 16px' }}>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11, letterSpacing:1 }}>{s.label}</div>
            <div style={{ color:s.c, fontFamily:'Cinzel,serif', fontWeight:700, fontSize:22, marginTop:4 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search items..."
          style={{ ...inp, minWidth:180 }} />
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={inp}>
          {CATEGORIES.map(c => <option key={c} value={c} style={{ background:'#0f0f1a' }}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background:'#0f0f1a', borderRadius:14, border:'1px solid rgba(41,128,185,0.2)', overflowX:'auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2.5fr 1.5fr 1fr 1fr 1fr 1fr', padding:'12px 16px', background:'rgba(41,128,185,0.1)', fontSize:11, color:'rgba(255,255,255,0.4)', letterSpacing:1, fontWeight:700, minWidth:700 }}>
          <span>PRODUCT</span><span>CATEGORY</span><span>PRICE</span><span>IN STOCK</span><span>SOLD</span><span>REVENUE</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:32, color:'rgba(255,255,255,0.3)' }}>No items found</div>
        ) : filtered.map(item => {
          const isLow = item.stock < 25;
          return (
            <div key={item.id} style={{ display:'grid', gridTemplateColumns:'2.5fr 1.5fr 1fr 1fr 1fr 1fr', padding:'13px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', alignItems:'center', minWidth:700 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:22 }}>{item.image}</span>
                <div>
                  <div style={{ color:'#fff', fontWeight:600, fontSize:14 }}>{item.name}</div>
                </div>
              </div>
              <div>
                <span style={{ background:'rgba(41,128,185,0.15)', color:'#3498db', fontSize:10, padding:'2px 8px', borderRadius:10 }}>{item.category}</span>
              </div>
              <div style={{ color:'#FF6B00', fontWeight:700 }}>₹{item.price}</div>
              <div>
                <span style={{ color: isLow ? '#ef4444' : '#22c55e', fontWeight:700 }}>{item.stock}</span>
                {isLow && <span style={{ color:'#ef4444', fontSize:10, marginLeft:4 }}>⚠ Low</span>}
              </div>
              <div style={{ color:'rgba(255,255,255,0.6)' }}>{item.sold}</div>
              <div style={{ color:'#F0C040', fontWeight:600 }}>₹{(item.price * item.sold).toLocaleString()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
