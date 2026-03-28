import React, { useState } from 'react';

const C = {
  card:'#ffffff', border:'rgba(212,160,23,0.2)',
  orange:'#FF6B00', gold:'#D4A017',
  dark:'#3d1f00', mid:'#7a5c3a', soft:'#9a8070',
  green:'#16a34a', red:'#dc2626',
};

const INIT_ITEMS = [
  { id:1,  name:'Diwali Pooja Kit',    cat:'Festival Kits',   icon:'🪔', price:899,  mrp:1199, stock:245, sold:1234, active:true,  desc:'Complete Lakshmi-Ganesh puja — 61 items including diyas, rangoli, incense, sindoor, lotus flowers.' },
  { id:2,  name:'Ganesh Puja Kit',     cat:'Festival Kits',   icon:'🐘', price:349,  mrp:499,  stock:189, sold:876,  active:true,  desc:'29 items: modak, durva grass, red flowers, coconut, camphor, roli, moli, supari, banana.' },
  { id:3,  name:'Griha Pravesh Kit',   cat:'Festival Kits',   icon:'🏡', price:599,  mrp:799,  stock:167, sold:654,  active:true,  desc:'52 items: sacred thread, turmeric, rice, copper kalash, mango leaves, coconut, flowers.' },
  { id:4,  name:'Navratri Pooja Kit',  cat:'Festival Kits',   icon:'🌺', price:499,  mrp:699,  stock:134, sold:432,  active:true,  desc:'35 items for 9-day Durga puja: chunri, sindoor, fruits, incense, camphor, oil lamp.' },
  { id:5,  name:'Satyanarayan Kit',    cat:'Daily Worship',   icon:'🌟', price:299,  mrp:399,  stock:298, sold:1123, active:true,  desc:'24 items: panchamrit, banana, tulsi, yellow flowers, yellow cloth, akshat, camphor.' },
  { id:6,  name:'Rudrabhishek Kit',    cat:'Abhishek',        icon:'🔱', price:449,  mrp:599,  stock:156, sold:567,  active:true,  desc:'18 items: milk, honey, curd, ghee, gangajal, bel patra, dhatura, vibhuti, rudraksha.' },
  { id:7,  name:'Havan Samagri Kit',   cat:'Havan',           icon:'🔥', price:699,  mrp:899,  stock:89,  sold:234,  active:true,  desc:'42 items: pure ghee 500ml, havan kund, samagri mix, mango wood, camphor, herbs.' },
  { id:8,  name:'Daily Puja Kit',      cat:'Daily Worship',   icon:'🌸', price:199,  mrp:299,  stock:412, sold:2145, active:true,  desc:'15 daily essentials: incense, camphor, sindoor, roli, moli, flowers, ghee lamp, wick.' },
  { id:9,  name:'Premium Incense Set', cat:'Incense & Diyas', icon:'🕯️', price:249, mrp:349,  stock:567, sold:1876, active:true,  desc:'8 varieties: sandalwood, jasmine, rose, camphor, guggul, mogra — 120 sticks total.' },
  { id:10, name:'Diya & Lamp Set',     cat:'Incense & Diyas', icon:'✨', price:349,  mrp:499,  stock:234, sold:987,  active:true,  desc:'12 piece: 4 brass diyas, 4 clay diyas, oil lamp, 50 cotton wicks, mustard oil 200ml.' },
  { id:11, name:'Navgrah Shanti Kit',  cat:'Havan',           icon:'⭐', price:799,  mrp:999,  stock:67,  sold:145,  active:true,  desc:'54 items: 9 grains, 9 flowers, 9 fruits, 9 herbs, havan samagri, navgrah yantra.' },
  { id:12, name:'Laxmi Puja Kit',      cat:'Daily Worship',   icon:'🪷', price:399,  mrp:549,  stock:189, sold:543,  active:true,  desc:'28 items for Friday puja: red flowers, lotus, coins, betel leaves, laxmi yantra.' },
];

const CATS  = ['Festival Kits','Daily Worship','Abhishek','Havan','Incense & Diyas','Special'];
const ICONS = ['🪔','🐘','🏡','🌺','🌟','🔱','🔥','🌸','🕯️','✨','⭐','🪷','📿','🫙','💧','🏺','🍃','🌹'];
const EMPTY = { name:'', cat:'Festival Kits', icon:'🪔', price:'', mrp:'', stock:'', sold:0, active:true, desc:'' };

export default function AdminSamagriList() {
  const [items, setItems]             = useState(INIT_ITEMS);
  const [search, setSearch]           = useState('');
  const [catFilter, setCatFilter]     = useState('All');
  const [editItem, setEditItem]       = useState(null);
  const [showForm, setShowForm]       = useState(false);
  const [formData, setFormData]       = useState(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [view, setView]               = useState('table');

  const totalRevenue = items.reduce((s,i) => s + i.price * i.sold, 0);
  const totalStock   = items.reduce((s,i) => s + i.stock, 0);
  const totalSold    = items.reduce((s,i) => s + i.sold, 0);
  const lowStock     = items.filter(i => i.stock < 100).length;

  const displayed = items
    .filter(i => catFilter === 'All' || i.cat === catFilter)
    .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setFormData({ ...EMPTY, id: Date.now() });
    setEditItem(null);
    setShowForm(true);
  };
  const openEdit = (item) => {
    setFormData({ ...item });
    setEditItem(item.id);
    setShowForm(true);
  };
  const saveItem = () => {
    if (!formData.name || !formData.price) return;
    const cleaned = {
      ...formData,
      price: Number(formData.price),
      mrp:   Number(formData.mrp)   || Number(formData.price),
      stock: Number(formData.stock) || 0,
      sold:  Number(formData.sold)  || 0,
    };
    if (editItem) {
      setItems(prev => prev.map(i => i.id === editItem ? cleaned : i));
    } else {
      setItems(prev => [...prev, cleaned]);
    }
    setShowForm(false);
    setEditItem(null);
    setFormData(EMPTY);
  };
  const deleteItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setDeleteConfirm(null);
  };
  const toggleActive  = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i));
  const updateStock   = (id, delta) => setItems(prev => prev.map(i => i.id === id ? { ...i, stock: Math.max(0, i.stock + delta) } : i));
  const fld = (k, v) => setFormData(f => ({ ...f, [k]: v }));

  const inp = { width:'100%', padding:'9px 12px', borderRadius:8, border:`1.5px solid rgba(212,160,23,0.4)`, background:'#fffbf5', color:C.dark, fontSize:13, fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
  const btn = (bg, tc='#fff') => ({ background:bg, color:tc, border:'none', borderRadius:8, padding:'8px 16px', fontWeight:700, cursor:'pointer', fontSize:13, fontFamily:'inherit' });
  const iconBtn = (bg, tc) => ({ ...btn(bg, tc), padding:'5px 12px', fontSize:12 });

  const discount = (item) => item.mrp > item.price ? Math.round((1 - item.price / item.mrp) * 100) : 0;

  return (
    <div style={{ fontFamily:'Nunito,sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <h2 style={{ fontFamily:'Cinzel,serif', color:C.dark, fontSize:20, margin:0 }}>🛍️ Inventory Management</h2>
          <p style={{ color:C.soft, margin:'4px 0 0', fontSize:13 }}>{items.length} products · ₹{(totalRevenue/100000).toFixed(1)}L revenue</p>
        </div>
        <button onClick={openAdd} style={{ ...btn('linear-gradient(135deg,#FF6B00,#e55a00)'), display:'flex', alignItems:'center', gap:8, padding:'10px 20px', fontSize:14 }}>
          + Add New Product
        </button>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
        {[
          ['₹'+(totalRevenue/100000).toFixed(1)+'L', 'Total Revenue',    C.orange],
          [totalSold.toLocaleString(),               'Units Sold',        C.green],
          [totalStock.toLocaleString(),              'Current Stock',     '#2563eb'],
          [lowStock + ' items',                      'Low Stock (<100)',  C.red],
        ].map(([v,l,c]) => (
          <div key={l} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 18px' }}>
            <div style={{ color:c, fontWeight:800, fontSize:22 }}>{v}</div>
            <div style={{ color:C.soft, fontSize:11, marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={{ display:'flex', gap:10, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search products..."
          style={{ ...inp, flex:'1 1 180px', minWidth:140 }} />
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{ ...inp, flex:'0 0 auto', width:'auto' }}>
          <option value="All">All Categories</option>
          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{ display:'flex', gap:4 }}>
          {['table','grid'].map(v => (
            <button key={v} onClick={()=>setView(v)}
              style={{ ...btn(view===v ? C.orange : 'rgba(212,160,23,0.15)', view===v ? '#fff' : C.gold), padding:'8px 14px' }}>
              {v === 'table' ? '☰ Table' : '⊞ Grid'}
            </button>
          ))}
        </div>
        <span style={{ color:C.soft, fontSize:13, marginLeft:'auto' }}>{displayed.length} products</span>
      </div>

      {/* ── TABLE VIEW ── */}
      {view === 'table' && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'rgba(212,160,23,0.08)' }}>
                {['Product','Category','Price / MRP','Stock','Sold','Status','Actions'].map(h => (
                  <th key={h} style={{ color:C.gold, fontSize:11, fontWeight:800, padding:'10px 14px', textAlign:'left', letterSpacing:0.8, borderBottom:`1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map(item => (
                <tr key={item.id} style={{ borderBottom:`1px solid ${C.border}`, opacity:item.active ? 1 : 0.5 }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,107,0,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:22 }}>{item.icon}</span>
                      <div>
                        <div style={{ color:C.dark, fontWeight:700, fontSize:14 }}>{item.name}</div>
                        <div style={{ color:C.soft, fontSize:11, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.desc}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'12px 14px', color:C.mid, fontSize:13 }}>{item.cat}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <span style={{ color:C.orange, fontWeight:800, fontSize:15 }}>₹{item.price}</span>
                    <span style={{ color:C.soft, fontSize:11, textDecoration:'line-through', marginLeft:4 }}>₹{item.mrp}</span>
                    {discount(item) > 0 && <span style={{ color:C.green, fontSize:11, marginLeft:4, fontWeight:600 }}>{discount(item)}% off</span>}
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <button onClick={()=>updateStock(item.id,-1)} style={{ width:24,height:24,borderRadius:'50%',background:'rgba(239,68,68,0.1)',color:C.red,border:`1px solid rgba(239,68,68,0.3)`,cursor:'pointer',fontWeight:800,fontSize:14,display:'flex',alignItems:'center',justifyContent:'center' }}>−</button>
                      <span style={{ color:item.stock<100?C.red:C.dark, fontWeight:700, fontSize:14, minWidth:32, textAlign:'center' }}>{item.stock}</span>
                      <button onClick={()=>updateStock(item.id,1)} style={{ width:24,height:24,borderRadius:'50%',background:'rgba(34,197,94,0.1)',color:C.green,border:`1px solid rgba(34,197,94,0.3)`,cursor:'pointer',fontWeight:800,fontSize:14,display:'flex',alignItems:'center',justifyContent:'center' }}>+</button>
                    </div>
                    {item.stock < 100 && <div style={{ color:C.red, fontSize:10, marginTop:2, fontWeight:600 }}>⚠️ Low stock</div>}
                  </td>
                  <td style={{ padding:'12px 14px', color:C.green, fontWeight:700 }}>{item.sold.toLocaleString()}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <div onClick={()=>toggleActive(item.id)} style={{ display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer' }}>
                      <div style={{ width:38,height:22,borderRadius:11,background:item.active?C.green:'rgba(0,0,0,0.15)',position:'relative',transition:'background 0.3s' }}>
                        <div style={{ width:16,height:16,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:item.active?19:3,transition:'left 0.3s',boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                      </div>
                      <span style={{ fontSize:12, color:item.active?C.green:C.soft, fontWeight:600 }}>{item.active?'Active':'Hidden'}</span>
                    </div>
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={()=>openEdit(item)} style={{ ...iconBtn('rgba(255,107,0,0.1)',C.orange), border:`1px solid rgba(255,107,0,0.3)` }}>✏️ Edit</button>
                      <button onClick={()=>setDeleteConfirm(item.id)} style={{ ...iconBtn('rgba(239,68,68,0.1)',C.red), border:`1px solid rgba(239,68,68,0.3)` }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayed.length === 0 && <div style={{ textAlign:'center', padding:32, color:C.soft }}>No products match filters.</div>}
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {view === 'grid' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
          {displayed.map(item => (
            <div key={item.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, opacity:item.active?1:0.6 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <span style={{ fontSize:36 }}>{item.icon}</span>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={()=>openEdit(item)} style={{ ...iconBtn('rgba(255,107,0,0.1)',C.orange), border:`1px solid rgba(255,107,0,0.3)` }}>✏️</button>
                  <button onClick={()=>setDeleteConfirm(item.id)} style={{ ...iconBtn('rgba(239,68,68,0.1)',C.red), border:`1px solid rgba(239,68,68,0.3)` }}>🗑️</button>
                </div>
              </div>
              <div style={{ color:C.dark, fontWeight:700, fontSize:14, marginBottom:2 }}>{item.name}</div>
              <div style={{ color:C.soft, fontSize:11, marginBottom:8 }}>{item.cat}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                <span style={{ color:C.orange, fontWeight:800, fontSize:18 }}>₹{item.price}</span>
                <span style={{ color:C.soft, fontSize:12, textDecoration:'line-through' }}>₹{item.mrp}</span>
                {discount(item) > 0 && <span style={{ color:C.green, fontSize:11, fontWeight:600 }}>{discount(item)}% off</span>}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:10 }}>
                <span style={{ color:item.stock<100?C.red:C.mid }}>Stock: <b>{item.stock}</b>{item.stock<100?' ⚠️':''}</span>
                <span style={{ color:C.green }}>Sold: <b>{item.sold}</b></span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div onClick={()=>toggleActive(item.id)} style={{ width:36,height:20,borderRadius:10,background:item.active?C.green:'rgba(0,0,0,0.15)',position:'relative',cursor:'pointer',transition:'background 0.3s',flexShrink:0 }}>
                  <div style={{ width:14,height:14,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:item.active?19:3,transition:'left 0.3s' }}/>
                </div>
                <span style={{ fontSize:12, color:item.active?C.green:C.soft }}>{item.active?'Active':'Hidden'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ADD / EDIT MODAL ── */}
      {showForm && (
        <div onClick={()=>setShowForm(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:20, padding:28, maxWidth:560, width:'100%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ fontFamily:'Cinzel,serif', color:C.dark, margin:0, fontSize:18 }}>{editItem ? '✏️ Edit Product' : '+ Add New Product'}</h3>
              <button onClick={()=>setShowForm(false)} style={{ background:'rgba(0,0,0,0.08)', border:'none', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ color:C.mid, fontSize:12, fontWeight:700, display:'block', marginBottom:4 }}>PRODUCT NAME *</label>
                <input value={formData.name} onChange={e=>fld('name',e.target.value)} placeholder="e.g. Diwali Pooja Kit" style={inp} />
              </div>
              <div>
                <label style={{ color:C.mid, fontSize:12, fontWeight:700, display:'block', marginBottom:4 }}>CATEGORY *</label>
                <select value={formData.cat} onChange={e=>fld('cat',e.target.value)} style={inp}>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color:C.mid, fontSize:12, fontWeight:700, display:'block', marginBottom:4 }}>ICON</label>
                <select value={formData.icon} onChange={e=>fld('icon',e.target.value)} style={inp}>
                  {ICONS.map(i => <option key={i} value={i}>{i} {i}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color:C.mid, fontSize:12, fontWeight:700, display:'block', marginBottom:4 }}>SELLING PRICE (₹) *</label>
                <input type="number" value={formData.price} onChange={e=>fld('price',e.target.value)} placeholder="899" style={inp} />
              </div>
              <div>
                <label style={{ color:C.mid, fontSize:12, fontWeight:700, display:'block', marginBottom:4 }}>MRP (₹)</label>
                <input type="number" value={formData.mrp} onChange={e=>fld('mrp',e.target.value)} placeholder="1199" style={inp} />
              </div>
              <div>
                <label style={{ color:C.mid, fontSize:12, fontWeight:700, display:'block', marginBottom:4 }}>CURRENT STOCK</label>
                <input type="number" value={formData.stock} onChange={e=>fld('stock',e.target.value)} placeholder="100" style={inp} />
              </div>
              <div>
                <label style={{ color:C.mid, fontSize:12, fontWeight:700, display:'block', marginBottom:4 }}>UNITS SOLD (historical)</label>
                <input type="number" value={formData.sold} onChange={e=>fld('sold',e.target.value)} placeholder="0" style={inp} />
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ color:C.mid, fontSize:12, fontWeight:700, display:'block', marginBottom:4 }}>DESCRIPTION</label>
                <textarea value={formData.desc} onChange={e=>fld('desc',e.target.value)} placeholder="Describe what's included..." rows={3}
                  style={{ ...inp, resize:'vertical', height:80 }} />
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                  <input type="checkbox" checked={formData.active} onChange={e=>fld('active',e.target.checked)} style={{ width:'auto', accentColor:C.orange }} />
                  <span style={{ color:C.dark, fontSize:14, fontWeight:600 }}>Active (visible to customers)</span>
                </label>
              </div>
            </div>

            {/* Live Preview */}
            {formData.name && formData.price && (
              <div style={{ background:'rgba(255,107,0,0.06)', border:`1px solid rgba(255,107,0,0.2)`, borderRadius:10, padding:'12px 16px', marginTop:16 }}>
                <div style={{ color:C.soft, fontSize:11, fontWeight:700, marginBottom:6 }}>PREVIEW</div>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:36 }}>{formData.icon}</span>
                  <div>
                    <div style={{ color:C.dark, fontWeight:700, fontSize:15 }}>{formData.name}</div>
                    <div style={{ color:C.orange, fontWeight:800, fontSize:18 }}>
                      ₹{formData.price}
                      {formData.mrp && <span style={{ color:C.soft, fontSize:13, textDecoration:'line-through', marginLeft:6 }}>₹{formData.mrp}</span>}
                      {formData.mrp && formData.price && Number(formData.mrp) > Number(formData.price) && (
                        <span style={{ color:C.green, fontSize:12, marginLeft:6, fontWeight:700 }}>{Math.round((1-formData.price/formData.mrp)*100)}% OFF</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button onClick={saveItem} disabled={!formData.name || !formData.price}
                style={{ ...btn('linear-gradient(135deg,#FF6B00,#e55a00)'), flex:1, padding:'12px', fontSize:14, opacity:(!formData.name||!formData.price)?0.5:1 }}>
                {editItem ? '✓ Save Changes' : '+ Add Product'}
              </button>
              <button onClick={()=>setShowForm(false)} style={{ ...btn('rgba(0,0,0,0.08)',C.mid), border:`1px solid ${C.border}`, padding:'12px 20px', fontSize:14 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteConfirm && (
        <div onClick={()=>setDeleteConfirm(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:380, width:'100%', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🗑️</div>
            <h3 style={{ color:C.dark, fontFamily:'Cinzel,serif', margin:'0 0 8px' }}>Delete Product?</h3>
            <p style={{ color:C.mid, fontSize:14, margin:'0 0 24px' }}>
              "{items.find(i=>i.id===deleteConfirm)?.name}" will be permanently removed from inventory.
            </p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={()=>deleteItem(deleteConfirm)} style={{ ...btn(C.red), padding:'10px 24px', fontSize:14 }}>Yes, Delete</button>
              <button onClick={()=>setDeleteConfirm(null)} style={{ ...btn('rgba(0,0,0,0.08)',C.mid), border:`1px solid ${C.border}`, padding:'10px 24px', fontSize:14 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
