import React, { useState } from 'react';
import { IconPlus, IconEdit, IconTrash, IconCheck, IconX, IconEye } from '../../components/icons/Icons';
import { ALL_RITUALS, RITUAL_CATEGORIES } from '../../data/ritualsData';

const C = { card:'#fff', border:'rgba(212,160,23,0.2)', orange:'#FF6B00', gold:'#D4A017', dark:'#3d1f00', mid:'#7a5c3a', soft:'#9a8070', green:'#16a34a', red:'#dc2626' };

const CATEGORIES = RITUAL_CATEGORIES.filter(c => c !== 'All');

const INIT_RITUALS = ALL_RITUALS.map(r => ({
  id: r.id, name: r.name, category: r.category,
  baseFee: r.price, duration: r.duration,
  pandits: r.popular ? Math.floor(Math.random() * 40 + 10) : Math.floor(Math.random() * 20 + 5),
  bookings: r.popular ? Math.floor(Math.random() * 300 + 100) : Math.floor(Math.random() * 100 + 10),
  active: true, desc: r.desc, icon: r.icon,
}));

const EMPTY = { name:'', category:'Grih & Vastu', baseFee:'', duration:'', pandits:0, bookings:0, active:true, desc:'', icon:'🕉️' };

export default function AdminRitualList() {
  const [rituals, setRituals]         = useState(INIT_RITUALS);
  const [search, setSearch]           = useState('');
  const [catFilter, setCatFilter]     = useState('All');
  const [showForm, setShowForm]       = useState(false);
  const [editId, setEditId]           = useState(null);
  const [formData, setFormData]       = useState(EMPTY);
  const [deleteId, setDeleteId]       = useState(null);
  const [viewDetail, setViewDetail]   = useState(null);

  const displayed = rituals
    .filter(r => catFilter === 'All' || r.category === catFilter)
    .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setFormData({ ...EMPTY, id: Date.now() });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (r) => {
    setFormData({ ...r });
    setEditId(r.id);
    setShowForm(true);
  };

  const save = () => {
    if (!formData.name || !formData.baseFee) return;
    const cleaned = { ...formData, baseFee: Number(formData.baseFee), pandits: Number(formData.pandits)||0, bookings: Number(formData.bookings)||0 };
    if (editId) {
      setRituals(prev => prev.map(r => r.id === editId ? cleaned : r));
    } else {
      setRituals(prev => [...prev, cleaned]);
    }
    setShowForm(false);
    setEditId(null);
    setFormData(EMPTY);
  };

  const toggleActive = (id) => setRituals(prev => prev.map(r => r.id === id ? {...r, active: !r.active} : r));
  const deleteRitual = (id) => { setRituals(prev => prev.filter(r => r.id !== id)); setDeleteId(null); };

  const inp = { width:'100%', padding:'9px 12px', borderRadius:8, border:`1.5px solid rgba(212,160,23,0.4)`, background:'#fffbf5', color:C.dark, fontSize:13, fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
  const btn = (bg, tc='#fff', border='none') => ({ background:bg, color:tc, border, borderRadius:8, padding:'8px 16px', fontWeight:700, cursor:'pointer', fontSize:13, fontFamily:'inherit', display:'flex', alignItems:'center', gap:6 });

  return (
    <div style={{ fontFamily:'Nunito,sans-serif' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <h2 style={{ fontFamily:'Cinzel,serif', color:C.dark, fontSize:20, margin:0 }}>🕉️ Rituals Catalog</h2>
          <p style={{ color:C.soft, margin:'4px 0 0', fontSize:13 }}>{rituals.filter(r=>r.active).length} active · {rituals.length} total</p>
        </div>
        <button onClick={openAdd} style={btn('linear-gradient(135deg,#FF6B00,#e55a00)')}>
          <IconPlus size={16} color="#fff" /> Add Ritual
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search rituals..."
          style={{ ...inp, flex:'1 1 200px', minWidth:140 }} />
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{ ...inp, flex:'0 0 auto', width:'auto' }}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ color:C.soft, fontSize:13 }}>{displayed.length} rituals</span>
      </div>

      {/* Table */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:700 }}>
            <thead>
              <tr style={{ background:'rgba(212,160,23,0.08)' }}>
                {['Ritual','Category','Base Fee','Duration','Pandits','Bookings','Status','Actions'].map(h=>(
                  <th key={h} style={{ color:C.gold, fontSize:11, fontWeight:800, padding:'10px 14px', textAlign:'left', letterSpacing:0.8, borderBottom:`1px solid ${C.border}`, whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map(r=>(
                <tr key={r.id} style={{ borderBottom:`1px solid ${C.border}`, opacity: r.active ? 1 : 0.55, transition:'background 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,107,0,0.03)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:22 }}>{r.icon}</span>
                      <div>
                        <div style={{ color:C.dark, fontWeight:700, fontSize:14 }}>{r.name}</div>
                        <div style={{ color:C.soft, fontSize:11, maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.desc}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <span style={{ background:'rgba(212,160,23,0.12)', color:C.gold, fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:600, whiteSpace:'nowrap' }}>{r.category}</span>
                  </td>
                  <td style={{ padding:'12px 14px', color:C.orange, fontWeight:800, fontSize:15 }}>₹{r.baseFee?.toLocaleString()}</td>
                  <td style={{ padding:'12px 14px', color:C.mid, fontSize:13, whiteSpace:'nowrap' }}>{r.duration}</td>
                  <td style={{ padding:'12px 14px', color:C.green, fontWeight:700 }}>{r.pandits}</td>
                  <td style={{ padding:'12px 14px', color:C.mid, fontWeight:600 }}>{r.bookings?.toLocaleString()}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <div onClick={()=>toggleActive(r.id)} style={{ display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer' }}>
                      <div style={{ width:38, height:22, borderRadius:11, background: r.active ? C.green : 'rgba(0,0,0,0.15)', position:'relative', transition:'background 0.3s', flexShrink:0 }}>
                        <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left: r.active ? 19 : 3, transition:'left 0.3s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                      </div>
                      <span style={{ fontSize:12, color: r.active ? C.green : C.soft, fontWeight:600 }}>{r.active ? 'Active' : 'Hidden'}</span>
                    </div>
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={()=>setViewDetail(r)} style={{ ...btn('rgba(59,130,246,0.1)','#2563eb',`1px solid rgba(59,130,246,0.3)`), padding:'5px 10px', fontSize:12 }}>
                        <IconEye size={13} color="#2563eb" />
                      </button>
                      <button onClick={()=>openEdit(r)} style={{ ...btn('rgba(255,107,0,0.1)',C.orange,`1px solid rgba(255,107,0,0.3)`), padding:'5px 10px', fontSize:12 }}>
                        <IconEdit size={13} color={C.orange} />
                      </button>
                      <button onClick={()=>setDeleteId(r.id)} style={{ ...btn('rgba(239,68,68,0.08)',C.red,`1px solid rgba(239,68,68,0.25)`), padding:'5px 10px', fontSize:12 }}>
                        <IconTrash size={13} color={C.red} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {displayed.length === 0 && <div style={{ textAlign:'center', padding:32, color:C.soft }}>No rituals match filters.</div>}
      </div>

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div onClick={()=>setShowForm(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:20, padding:28, maxWidth:560, width:'100%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ fontFamily:'Cinzel,serif', color:C.dark, margin:0, fontSize:18 }}>
                {editId ? 'Edit Ritual' : 'Add New Ritual'}
              </h3>
              <button onClick={()=>setShowForm(false)} style={{ background:'rgba(0,0,0,0.08)', border:'none', borderRadius:'50%', width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <IconX size={16} color={C.mid} />
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ color:C.mid, fontSize:11, fontWeight:700, display:'block', marginBottom:4, letterSpacing:0.8 }}>RITUAL NAME *</label>
                <input style={inp} value={formData.name} onChange={e=>setFormData(f=>({...f,name:e.target.value}))} placeholder="e.g. Griha Pravesh" />
              </div>
              <div>
                <label style={{ color:C.mid, fontSize:11, fontWeight:700, display:'block', marginBottom:4, letterSpacing:0.8 }}>CATEGORY *</label>
                <select style={inp} value={formData.category} onChange={e=>setFormData(f=>({...f,category:e.target.value}))}>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color:C.mid, fontSize:11, fontWeight:700, display:'block', marginBottom:4, letterSpacing:0.8 }}>ICON (emoji)</label>
                <input style={inp} value={formData.icon} onChange={e=>setFormData(f=>({...f,icon:e.target.value}))} placeholder="🕉️" />
              </div>
              <div>
                <label style={{ color:C.mid, fontSize:11, fontWeight:700, display:'block', marginBottom:4, letterSpacing:0.8 }}>BASE FEE (₹) *</label>
                <input type="number" style={inp} value={formData.baseFee} onChange={e=>setFormData(f=>({...f,baseFee:e.target.value}))} placeholder="1500" />
              </div>
              <div>
                <label style={{ color:C.mid, fontSize:11, fontWeight:700, display:'block', marginBottom:4, letterSpacing:0.8 }}>DURATION</label>
                <input style={inp} value={formData.duration} onChange={e=>setFormData(f=>({...f,duration:e.target.value}))} placeholder="2-3 hrs" />
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ color:C.mid, fontSize:11, fontWeight:700, display:'block', marginBottom:4, letterSpacing:0.8 }}>DESCRIPTION</label>
                <textarea style={{ ...inp, height:80, resize:'vertical' }} value={formData.desc} onChange={e=>setFormData(f=>({...f,desc:e.target.value}))} placeholder="Describe this ritual..." />
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                  <input type="checkbox" checked={formData.active} onChange={e=>setFormData(f=>({...f,active:e.target.checked}))} style={{ width:'auto', accentColor:C.orange }} />
                  <span style={{ color:C.dark, fontSize:14, fontWeight:600 }}>Active (visible to devotees)</span>
                </label>
              </div>
            </div>
            {/* Preview */}
            {formData.name && formData.baseFee && (
              <div style={{ background:'rgba(255,107,0,0.05)', border:`1px solid rgba(255,107,0,0.2)`, borderRadius:10, padding:'12px 16px', marginTop:16 }}>
                <div style={{ color:C.soft, fontSize:11, fontWeight:700, marginBottom:6, letterSpacing:0.8 }}>PREVIEW</div>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:32 }}>{formData.icon}</span>
                  <div>
                    <div style={{ color:C.dark, fontWeight:700, fontSize:15 }}>{formData.name}</div>
                    <div style={{ color:C.orange, fontWeight:800, fontSize:16 }}>₹{Number(formData.baseFee).toLocaleString()} · {formData.duration || '—'}</div>
                  </div>
                </div>
              </div>
            )}
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button onClick={save} disabled={!formData.name||!formData.baseFee}
                style={{ ...btn('linear-gradient(135deg,#FF6B00,#e55a00)'), flex:1, padding:'12px', fontSize:14, justifyContent:'center', opacity:(!formData.name||!formData.baseFee)?0.5:1 }}>
                <IconCheck size={16} color="#fff" />
                {editId ? 'Save Changes' : 'Add Ritual'}
              </button>
              <button onClick={()=>setShowForm(false)} style={{ ...btn('rgba(0,0,0,0.06)',C.mid,`1px solid ${C.border}`), padding:'12px 20px', fontSize:14 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div onClick={()=>setDeleteId(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:16, padding:32, maxWidth:380, width:'100%', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(239,68,68,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <IconTrash size={24} color={C.red} />
            </div>
            <h3 style={{ color:C.dark, fontFamily:'Cinzel,serif', margin:'0 0 8px' }}>Delete Ritual?</h3>
            <p style={{ color:C.mid, fontSize:14, margin:'0 0 24px' }}>
              "<strong>{rituals.find(r=>r.id===deleteId)?.name}</strong>" will be removed from the catalog.
              Existing bookings will not be affected.
            </p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={()=>deleteRitual(deleteId)} style={{ ...btn(C.red), padding:'10px 24px', fontSize:14, justifyContent:'center' }}>Delete</button>
              <button onClick={()=>setDeleteId(null)} style={{ ...btn('rgba(0,0,0,0.06)',C.mid,`1px solid ${C.border}`), padding:'10px 24px', fontSize:14 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAIL MODAL */}
      {viewDetail && (
        <div onClick={()=>setViewDetail(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:20, padding:28, maxWidth:440, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ textAlign:'center', marginBottom:20 }}>
              <div style={{ fontSize:56, marginBottom:10 }}>{viewDetail.icon}</div>
              <h2 style={{ fontFamily:'Cinzel,serif', color:C.dark, margin:0, fontSize:20 }}>{viewDetail.name}</h2>
              <span style={{ background:'rgba(212,160,23,0.12)', color:C.gold, fontSize:12, padding:'4px 14px', borderRadius:20, fontWeight:600 }}>{viewDetail.category}</span>
            </div>
            <p style={{ color:C.mid, fontSize:14, lineHeight:1.6, textAlign:'center', marginBottom:20 }}>{viewDetail.desc}</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
              {[['Base Fee',`₹${viewDetail.baseFee?.toLocaleString()}`,C.orange],['Duration',viewDetail.duration,C.mid],['Active Pandits',viewDetail.pandits,C.green],['Total Bookings',viewDetail.bookings?.toLocaleString(),C.mid]].map(([l,v,c])=>(
                <div key={l} style={{ background:'#fffbf5', border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 14px', textAlign:'center' }}>
                  <div style={{ color:c, fontWeight:800, fontSize:20 }}>{v}</div>
                  <div style={{ color:C.soft, fontSize:11, marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>{openEdit(viewDetail);setViewDetail(null);}} style={{ ...btn('linear-gradient(135deg,#FF6B00,#e55a00)'), flex:1, padding:'11px', justifyContent:'center', fontSize:14 }}>
                <IconEdit size={15} color="#fff" /> Edit Ritual
              </button>
              <button onClick={()=>setViewDetail(null)} style={{ ...btn('rgba(0,0,0,0.06)',C.mid,`1px solid ${C.border}`), padding:'11px 20px', fontSize:14 }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
