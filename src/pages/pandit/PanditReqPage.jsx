import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';

const SAMPLE_BOOKINGS = [
  { id:'b-demo-1', ritual_name:'Griha Pravesh',     booking_date:'2025-04-15', total_amount:2100, status:'confirmed', address:'Sector 21, Dwarka, Delhi',  devotee_name:'Rahul Sharma',  created_at:'2025-04-08T10:00:00Z' },
  { id:'b-demo-2', ritual_name:'Satyanarayan Katha',booking_date:'2025-04-18', total_amount:1500, status:'confirmed', address:'Vasant Kunj, Delhi',        devotee_name:'Priya Singh',   created_at:'2025-04-07T14:00:00Z' },
  { id:'b-demo-3', ritual_name:'Rudrabhishek',      booking_date:'2025-04-20', total_amount:2500, status:'accepted',  address:'Noida Sector 62',           devotee_name:'Amit Gupta',    created_at:'2025-04-06T09:00:00Z' },
  { id:'b-demo-4', ritual_name:'Navgrah Shanti',    booking_date:'2025-03-28', total_amount:1800, status:'completed', address:'Gurgaon Sector 56',         devotee_name:'Sunita Verma',  created_at:'2025-03-25T11:00:00Z' },
];

const STATUS = {
  confirmed: { bg:'rgba(59,130,246,0.15)',  color:'#60a5fa',  label:'New — Action Needed' },
  accepted:  { bg:'rgba(34,197,94,0.15)',   color:'#4ade80',  label:'Accepted ✓' },
  rejected:  { bg:'rgba(239,68,68,0.15)',   color:'#f87171',  label:'Rejected' },
  completed: { bg:'rgba(34,197,94,0.2)',    color:'#4ade80',  label:'Completed ✅' },
  cancelled: { bg:'rgba(255,255,255,0.08)', color:'rgba(255,248,240,0.4)', label:'Cancelled' },
};

export default function PanditReqPage({ propFilter }) {
  const { panditId } = useApp();
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState(propFilter || 'all');
  const [actioning, setActioning] = useState(null);

  useEffect(() => {
    (async () => {
      if (!panditId) { setBookings(SAMPLE_BOOKINGS); setLoading(false); return; }
      try {
        const { supabase } = await import('../../services/supabase');
        const { data } = await supabase.from('bookings').select('*')
          .eq('pandit_id', panditId).order('created_at',{ascending:false});
        setBookings(data?.length ? data : SAMPLE_BOOKINGS);
      } catch(e) { setBookings(SAMPLE_BOOKINGS); }
      setLoading(false);
    })();
  }, [panditId]);

  const updateStatus = async (bookingId, newStatus) => {
    setActioning(bookingId);
    if (!String(bookingId).startsWith('b-demo-')) {
      try {
        const { supabase } = await import('../../services/supabase');
        const update = { status: newStatus };
        if (newStatus === 'accepted') update.pandit_accepted_at = new Date().toISOString();
        if (newStatus === 'rejected') update.pandit_rejected_at = new Date().toISOString();
        await supabase.from('bookings').update(update).eq('id', bookingId);
      } catch(e) {}
    }
    setBookings(prev => prev.map(b => b.id===bookingId ? {...b, status:newStatus} : b));
    setActioning(null);
  };

  const newCount = bookings.filter(b=>b.status==='confirmed').length;
  const FILTERS = [
    { key:'all',       label:'All',       count:bookings.length },
    { key:'confirmed', label:'🔔 New',    count:newCount },
    { key:'accepted',  label:'Accepted',  count:bookings.filter(b=>b.status==='accepted').length },
    { key:'completed', label:'Completed', count:bookings.filter(b=>b.status==='completed').length },
  ];

  const displayed = filter==='all' ? bookings : bookings.filter(b=>b.status===filter);

  const card = (isNew) => ({
    background: isNew ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${isNew ? 'rgba(59,130,246,0.3)' : 'rgba(212,160,23,0.12)'}`,
    borderRadius:14, padding:'18px 20px', marginBottom:12,
    boxShadow: isNew ? '0 4px 16px rgba(59,130,246,0.1)' : 'none',
  });
  const btn = (bg, tc, border='none') => ({
    background:bg, color:tc, border, borderRadius:10, padding:'9px 18px',
    fontWeight:700, cursor:'pointer', fontSize:13, fontFamily:'inherit',
    whiteSpace:'nowrap', transition:'opacity 0.2s',
  });

  return (
    <div style={{ fontFamily:'Nunito,sans-serif' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontSize:20, margin:0 }}>📋 Booking Requests</h2>
          <p style={{ color:'rgba(255,248,240,0.5)', margin:'4px 0 0', fontSize:13 }}>
            {bookings.length} total
            {newCount > 0 && <span style={{color:'#ef4444', fontWeight:700}}> · {newCount} need your response</span>}
          </p>
        </div>
        {newCount > 0 && (
          <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.35)', borderRadius:20, padding:'6px 16px', color:'#f87171', fontWeight:700, fontSize:13 }}>
            🔔 {newCount} New Request{newCount>1?'s':''}
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={()=>setFilter(f.key)}
            style={{ ...btn(filter===f.key?'#FF6B00':'rgba(255,255,255,0.06)',filter===f.key?'#fff':'rgba(255,248,240,0.6)',`1px solid ${filter===f.key?'transparent':'rgba(212,160,23,0.2)'}`), borderRadius:20, padding:'7px 16px' }}>
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:48, color:'rgba(255,248,240,0.4)' }}>Loading requests...</div>
      ) : displayed.length===0 ? (
        <div style={{ textAlign:'center', padding:48 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🙏</div>
          <div style={{ color:'#F0C040', fontWeight:700, fontSize:16, marginBottom:8 }}>No bookings here</div>
          <div style={{ color:'rgba(255,248,240,0.5)', fontSize:14 }}>New bookings appear when devotees book you.</div>
        </div>
      ) : displayed.map(b => {
        const isNew = b.status==='confirmed';
        const sc = STATUS[b.status] || STATUS.confirmed;
        return (
          <div key={b.id} style={card(isNew)}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:6 }}>
                  <span style={{ color:'#F0C040', fontWeight:700, fontSize:17 }}>{b.ritual_name || 'Pooja'}</span>
                  <span style={{ background:sc.bg, color:sc.color, fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:700 }}>{sc.label}</span>
                  {isNew && <span style={{ background:'rgba(239,68,68,0.15)', color:'#f87171', fontSize:10, padding:'2px 8px', borderRadius:20, fontWeight:800 }}>NEW</span>}
                </div>
                <div style={{ color:'rgba(255,248,240,0.55)', fontSize:13, marginBottom:4 }}>
                  👤 {b.devotee_name || 'Devotee'}&nbsp;&nbsp;·&nbsp;&nbsp;
                  📅 {b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'}) : '—'}
                </div>
                {b.address && <div style={{ color:'rgba(255,248,240,0.45)', fontSize:13 }}>📍 {b.address}</div>}
                <div style={{ color:'#FF6B00', fontWeight:800, fontSize:20, marginTop:8 }}>₹{(b.total_amount||0).toLocaleString()}</div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:8, flexShrink:0 }}>
                {isNew && (<>
                  <button onClick={()=>updateStatus(b.id,'accepted')} disabled={actioning===b.id}
                    style={{ ...btn('rgba(34,197,94,0.15)','#4ade80','1px solid rgba(34,197,94,0.4)'), opacity:actioning===b.id?0.6:1 }}>
                    {actioning===b.id?'⏳ ...':'✓ Accept'}
                  </button>
                  <button onClick={()=>updateStatus(b.id,'rejected')} disabled={actioning===b.id}
                    style={btn('rgba(239,68,68,0.1)','#f87171','1px solid rgba(239,68,68,0.35)')}>
                    ✕ Reject
                  </button>
                </>)}
                {b.status==='accepted' && (
                  <button onClick={()=>updateStatus(b.id,'completed')}
                    style={btn('rgba(34,197,94,0.12)','#4ade80','1px solid rgba(34,197,94,0.3)')}>
                    ✓ Mark Complete
                  </button>
                )}
              </div>
            </div>

            {b.status==='accepted' && (
              <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid rgba(212,160,23,0.1)', display:'flex', gap:12, flexWrap:'wrap' }}>
                <div style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:8, padding:'8px 14px' }}>
                  <div style={{ color:'#4ade80', fontSize:11, fontWeight:700, marginBottom:2 }}>CONTACT DEVOTEE</div>
                  <div style={{ color:'rgba(255,248,240,0.8)', fontSize:13, fontWeight:600 }}>{b.devotee_phone || 'Contact via BhaktiGo'}</div>
                </div>
                <div style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.25)', borderRadius:8, padding:'8px 14px' }}>
                  <div style={{ color:'#60a5fa', fontSize:11, fontWeight:700, marginBottom:2 }}>CEREMONY LOCATION</div>
                  <div style={{ color:'rgba(255,248,240,0.8)', fontSize:13, fontWeight:600 }}>{b.address || 'Confirm with devotee'}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {!panditId && (
        <div style={{ marginTop:16, background:'rgba(212,160,23,0.08)', border:'1px solid rgba(212,160,23,0.25)', borderRadius:12, padding:'14px 18px' }}>
          <div style={{ color:'#D4A017', fontWeight:700, marginBottom:4 }}>📝 Demo Mode</div>
          <div style={{ color:'rgba(255,248,240,0.5)', fontSize:13 }}>These are sample requests. Register as pandit to see real bookings.</div>
        </div>
      )}
    </div>
  );
}
