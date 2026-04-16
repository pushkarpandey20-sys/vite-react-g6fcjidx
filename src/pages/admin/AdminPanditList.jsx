import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const C = { 
  page:'#fdfaf5', 
  card:'#ffffff', 
  border:'rgba(212,160,23,0.18)', 
  orange:'#FF6B00', 
  gold:'#D4A017', 
  dark:'#1a0f00', 
  mid:'#7a5c3a', 
  soft:'#9a8070', 
  green:'#16a34a', 
  red:'#dc2626',
  blue:'#2563eb'
};

export default function AdminPanditList() {
  const [pandits, setPandits] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [rejectModal, setRejectModal] = useState(null); // { id, name }
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchPandits();
  }, []);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPandits = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('pandits').select('*').order('created_at',{ascending:false});
      if (error) throw error;
      
      if (data && data.length > 0) {
        setPandits(data);
      } else {
        // Fallback to memory for demo if DB is empty
        const { SEED_PANDITS } = await import('../../data/seedData');
        setPandits(SEED_PANDITS || []);
      }
    } catch(e) {
      console.error("Fetch Error:", e);
      showToast("Failed to fetch registry from cloud", "error");
    }
    setLoading(false);
  };

  const updateStatus = async (id, status, extraFields = {}) => {
    const originalPandits = [...pandits];
    // Optimistic Update
    setPandits(prev => prev.map(p => p.id===id ? {...p, status, ...extraFields} : p));

    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      if (!isUUID) {
        console.warn("Local/Seed ID detected. Update skipped in DB, but applied locally.");
        showToast(`Schema Update: ${status.replace(/_/g,' ')} (Local Mode)`);
        return;
      }

      const { error } = await supabase.from('pandits').update({ status, ...extraFields }).eq('id', id);
      if (error) throw error;

      showToast(`Protocol Updated: ${status.replace(/_/g,' ')}`);
    } catch(e) {
      console.error("Update Error:", e);
      setPandits(originalPandits);
      showToast("Security Exception: DB update failed", "error");
    }
  };

  const handleApprove = (id) => updateStatus(id, 'verified', { is_verified: true });

  const handleRejectConfirm = async () => {
    if (!rejectModal) return;
    await updateStatus(rejectModal.id, 'rejected', { rejection_reason: rejectReason || 'No reason provided', is_verified: false });
    setRejectModal(null);
    setRejectReason('');
  };

  const counts = {
    all: pandits.length,
    active: pandits.filter(p=>p.status==='verified' || p.status==='approved').length,
    on_hold: pandits.filter(p=>p.status==='on_hold').length,
    pending: pandits.filter(p=>p.status==='pending_verification' || p.status==='pending').length,
    deboarded: pandits.filter(p=>p.status==='rejected' || p.status==='deboarded').length,
  };

  const displayed = pandits
    .filter(p => {
      if (filter==='all') return true;
      if (filter==='active') return p.status==='verified' || p.status==='approved';
      if (filter==='pending') return p.status==='pending_verification' || p.status==='pending';
      if (filter==='deboarded') return p.status==='rejected' || p.status==='deboarded';
      return p.status===filter;
    })
    .filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.city?.toLowerCase().includes(search.toLowerCase()));

  const tabBtn = (f, label, count, color) => (
    <button key={f} onClick={()=>setFilter(f)} style={{ 
      padding:'10px 20px', 
      borderRadius:12, 
      border:`1px solid ${filter===f?color:C.border}`, 
      background:filter===f?`${color}10`:'#fff', 
      color:filter===f?color:C.mid, 
      fontWeight:700, 
      fontSize:13, 
      cursor:'pointer',
      transition:'all 0.2s',
      display:'flex',
      alignItems:'center',
      gap:8
    }}>
      {label}
      <span style={{ background:filter===f?color:'rgba(0,0,0,0.05)', color:filter===f?'#fff':C.soft, fontSize:10, padding:'2px 8px', borderRadius:20 }}>{count}</span>
    </button>
  );

  return (
    <div style={{ fontFamily:'"Inter", sans-serif' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:32 }}>
        <div>
          <h2 style={{ fontFamily:'Cinzel, serif', color:C.dark, fontSize:28, margin:0, fontWeight:900 }}>Scholars & Partners</h2>
          <p style={{ color:C.soft, margin:'6px 0 0', fontSize:14, fontWeight:500 }}>Global verified scholar management and deboarding</p>
        </div>
        <button style={{ background:C.orange, color:'#fff', border:'none', borderRadius:12, padding:'12px 24px', fontWeight:700, cursor:'pointer', fontSize:14 }}>+ Add New Scholar</button>
      </div>

      <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:20, padding:'24px', boxShadow:'0 4px 20px rgba(0,0,0,0.02)' }}>
        <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
          {tabBtn('all','All Scholars',counts.all,C.dark)}
          {tabBtn('active','Active',counts.active,C.green)}
          {tabBtn('pending','Queue',counts.pending,C.gold)}
          {tabBtn('on_hold','On Hold',counts.on_hold,C.orange)}
          {tabBtn('deboarded','Deboarded',counts.deboarded,C.red)}
        </div>

        <div style={{ position:'relative', marginBottom:24 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search scholars by name, city, or specialty..."
            style={{ width:'100%', padding:'14px 14px 14px 44px', borderRadius:14, border:`1.5px solid ${C.border}`, background:'#fdfaf5', color:C.dark, fontSize:14, boxSizing:'border-box', outline:'none' }} />
          <span style={{ position:'absolute', left:16, top:16, opacity:0.5 }}>🔍</span>
        </div>

        {loading ? <div style={{ textAlign:'center', padding:60, color:C.soft, fontWeight:600 }}>📡 Synchronizing Scholar Registry...</div>
        : displayed.length === 0 ? <div style={{ textAlign:'center', padding:60, color:C.soft, background:'#fdfaf5', borderRadius:20, border:'1px dashed #ddd' }}>
            <div style={{ fontSize:40, marginBottom:16 }}>📭</div>
            <div style={{ fontWeight:600 }}>No scholars match your current filtration criteria.</div>
          </div>
        : (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {displayed.map(p => {
              const statusColors = {
                verified: {bg:'#ecfdf5', text:'#059669', dot:'#10b981'},
                approved: {bg:'#ecfdf5', text:'#059669', dot:'#10b981'},
                on_hold: {bg:'#fff7ed', text:'#ea580c', dot:'#f97316'},
                pending: {bg:'#fefce8', text:'#ca8a04', dot:'#eab308'},
                pending_verification: {bg:'#fefce8', text:'#ca8a04', dot:'#eab308'},
                rejected: {bg:'#fef2f2', text:'#dc2626', dot:'#ef4444'},
                deboarded: {bg:'#fef2f2', text:'#dc2626', dot:'#ef4444'}
              };
              const s = statusColors[p.status] || statusColors.pending;
              
              return (
                <div key={p.id} style={{ 
                  background:'#fff', 
                  border:`1px solid ${C.border}`, 
                  borderRadius:18, 
                  padding:'20px', 
                  transition:'all 0.3s',
                  display:'flex',
                  justifyContent:'space-between',
                  alignItems:'center'
                }} onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}>
                   <div style={{ display:'flex', gap:20, alignItems:'center' }}>
                      <div style={{ position:'relative' }}>
                        <div style={{ width:60, height:60, borderRadius:30, background:C.gold, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:900, color:'#fff', border:`4px solid ${s.bg}` }}>
                          {p.name[0]}
                        </div>
                        {p.is_online && <div style={{ position:'absolute', bottom:2, right:2, width:14, height:14, background:C.green, borderRadius:7, border:'3px solid #fff' }} />}
                      </div>
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4 }}>
                          <span style={{ color:C.dark, fontWeight:800, fontSize:18 }}>{p.name}</span>
                          <span style={{ 
                            background:s.bg, 
                            color:s.text, 
                            fontSize:11, 
                            padding:'4px 12px', 
                            borderRadius:20, 
                            fontWeight:800,
                            display:'flex',
                            alignItems:'center',
                            gap:6,
                            textTransform:'uppercase'
                          }}>
                            <div style={{ width:6, height:6, borderRadius:3, background:s.dot }} />
                            {p.status?.replace(/_/g,' ')}
                          </span>
                        </div>
                        <div style={{ color:C.soft, fontSize:13, fontWeight:500, display:'flex', gap:10 }}>
                          <span>📍 {p.city}</span>
                          <span>•</span>
                          <span>📜 {p.years_of_experience||5}y Experience</span>
                          <span>•</span>
                          <span>⭐ {p.rating||'4.8'} Avg Rating</span>
                        </div>
                        <div style={{ display:'flex', gap:6, marginTop:8 }}>
                          {(p.specializations||['Pooja','Havan','Katha']).slice(0,3).map(spec => (
                            <span key={spec} style={{ background:'rgba(0,0,0,0.04)', color:C.mid, fontSize:11, padding:'2px 8px', borderRadius:8, fontWeight:600 }}>{spec}</span>
                          ))}
                        </div>
                      </div>
                   </div>

                   <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                      <div style={{ textAlign:'right', marginRight:20 }}>
                        <div style={{ color:C.dark, fontWeight:900, fontSize:16 }}>₹{(p.min_fee||0).toLocaleString()}</div>
                        <div style={{ color:C.soft, fontSize:11, fontWeight:700 }}>MIN FEE / SERVICE</div>
                      </div>

                      <div style={{ display:'flex', gap:8, background:'#fdfaf5', padding:'8px', borderRadius:14, border:`1px solid ${C.border}`, flexWrap:'wrap' }}>
                         {(p.status === 'pending_verification' || p.status === 'pending') && (
                           <>
                             <button onClick={()=>handleApprove(p.id)} style={{ background:C.green, color:'#fff', border:'none', borderRadius:10, padding:'8px 16px', fontSize:12, fontWeight:800, cursor:'pointer' }}>✅ Approve</button>
                             <button onClick={()=>{ setRejectModal({id:p.id,name:p.name}); setRejectReason(''); }} style={{ background:'transparent', color:C.red, border:`1px solid ${C.red}`, borderRadius:10, padding:'8px 16px', fontSize:12, fontWeight:800, cursor:'pointer' }}>✗ Reject</button>
                           </>
                         )}
                         {(p.status === 'verified' || p.status === 'approved') && (
                           <button onClick={()=>updateStatus(p.id, 'on_hold')} style={{ background:'transparent', color:C.orange, border:`1px solid ${C.orange}30`, borderRadius:10, padding:'8px 16px', fontSize:12, fontWeight:800, cursor:'pointer' }}>Hold</button>
                         )}
                         {p.status === 'on_hold' && (
                           <button onClick={()=>handleApprove(p.id)} style={{ background:C.orange, color:'#fff', border:'none', borderRadius:10, padding:'8px 16px', fontSize:12, fontWeight:800, cursor:'pointer' }}>Unhold</button>
                         )}
                         {p.status !== 'pending_verification' && p.status !== 'pending' && p.status !== 'deboarded' && (
                           <button onClick={()=>updateStatus(p.id, 'deboarded')} style={{ background:'transparent', color:C.red, border:`1px solid ${C.red}30`, borderRadius:10, padding:'8px 16px', fontSize:12, fontWeight:800, cursor:'pointer' }}>Deboard</button>
                         )}
                         <button style={{ background:C.dark, color:'#fff', border:'none', borderRadius:10, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>⋮</button>
                      </div>
                   </div>
                </div>
              );
            })}
          </div>
        )
      }
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:1100,
          display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:'32px', maxWidth:420, width:'100%',
            boxShadow:'0 24px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontFamily:'Cinzel, serif', color:C.dark, fontSize:20, marginBottom:8, fontWeight:900 }}>
              Reject Application
            </h3>
            <p style={{ color:C.soft, fontSize:14, marginBottom:20 }}>
              Rejecting <strong style={{ color:C.dark }}>{rejectModal.name}</strong>. Please provide a reason so they can be notified.
            </p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (e.g. Incomplete documents, Invalid Aadhaar...)"
              style={{ width:'100%', minHeight:100, padding:'12px 14px', borderRadius:12,
                border:`1.5px solid ${C.border}`, fontSize:13, color:C.dark, resize:'vertical',
                fontFamily:'Inter, sans-serif', outline:'none', boxSizing:'border-box' }}
            />
            <div style={{ display:'flex', gap:12, marginTop:20 }}>
              <button onClick={()=>setRejectModal(null)}
                style={{ flex:1, background:'#f5f5f5', color:C.mid, border:`1px solid ${C.border}`,
                  borderRadius:12, padding:'12px', fontWeight:700, cursor:'pointer', fontSize:14 }}>
                Cancel
              </button>
              <button onClick={handleRejectConfirm}
                style={{ flex:1, background:C.red, color:'#fff', border:'none',
                  borderRadius:12, padding:'12px', fontWeight:800, cursor:'pointer', fontSize:14 }}>
                ✗ Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{ 
          position:'fixed', bottom:32, right:32, 
          background: toast.type==='error' ? '#ef4444' : '#1a0f00', 
          color:'#fff', padding:'16px 24px', borderRadius:16, 
          boxShadow:'0 12px 32px rgba(0,0,0,0.3)', 
          zIndex:1000, fontWeight:700,
          animation: 'slideUp 0.3s ease-out'
        }}>
          {toast.type==='error' ? '🚨' : '✅'} {toast.msg}
          <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
        </div>
      )}
    </div>
  );
}
