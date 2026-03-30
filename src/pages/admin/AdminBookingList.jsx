import React, { useState, useEffect } from 'react';

const C = { card:'#ffffff', border:'rgba(212,160,23,0.2)', orange:'#FF6B00', gold:'#D4A017', dark:'#3d1f00', mid:'#7a5c3a', soft:'#9a8070', green:'#16a34a', red:'#dc2626' };

const SAMPLE = [
  { id:'b1', ritual_name:'Griha Pravesh', devotee_name:'Rahul Sharma', booking_date:'2025-03-28', total_amount:2100, status:'confirmed' },
  { id:'b2', ritual_name:'Satyanarayan Katha', devotee_name:'Priya Singh', booking_date:'2025-03-26', total_amount:1500, status:'confirmed' },
  { id:'b3', ritual_name:'Rudrabhishek', devotee_name:'Amit Gupta', booking_date:'2025-04-02', total_amount:2500, status:'pending_payment' },
  { id:'b4', ritual_name:'Navgrah Shanti', devotee_name:'Sunita Verma', booking_date:'2025-03-20', total_amount:1800, status:'confirmed' },
  { id:'b5', ritual_name:'Vivah Ceremony', devotee_name:'Vikram Patel', booking_date:'2025-04-10', total_amount:8000, status:'confirmed' },
  { id:'b6', ritual_name:'Kaal Sarp Dosh', devotee_name:'Neha Gupta', booking_date:'2025-03-22', total_amount:3500, status:'cancelled' },
  { id:'b7', ritual_name:'Mundan Ceremony', devotee_name:'Suresh Kumar', booking_date:'2025-03-30', total_amount:1200, status:'confirmed' },
];

export default function AdminBookingList() {
  const [bookings, setBookings] = useState(SAMPLE);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { supabase } = await import('../../services/supabase');
        const { data } = await supabase.from('bookings').select('*').order('created_at',{ascending:false}).limit(100);
        if (data?.length) setBookings(data);
      } catch(e) {}
    })();
  }, []);

  const displayed = bookings
    .filter(b => filter==='all' || b.status===filter)
    .filter(b => !search || b.ritual_name?.toLowerCase().includes(search.toLowerCase()) || b.devotee_name?.toLowerCase().includes(search.toLowerCase()));

  const totalRevenue = bookings.filter(b=>b.status==='confirmed').reduce((s,b)=>s+(b.total_amount||0),0);

  const SC = { confirmed:{bg:'rgba(34,197,94,0.12)',color:'#15803d'}, pending_payment:{bg:'rgba(255,107,0,0.12)',color:'#c2410c'}, cancelled:{bg:'rgba(239,68,68,0.12)',color:C.red} };

  const tabBtn = (f,l,count,color) => (
    <button key={f} onClick={()=>setFilter(f)} style={{ padding:'7px 16px', borderRadius:20, border:`1px solid ${filter===f?color:'rgba(212,160,23,0.3)'}`, background:filter===f?`${color}18`:'transparent', color:filter===f?color:C.mid, fontWeight:700, fontSize:13, cursor:'pointer' }}>
      {l} ({count})
    </button>
  );

  return (
    <div style={{ fontFamily:'Nunito,sans-serif' }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontFamily:'Cinzel,serif', color:C.dark, fontSize:20, margin:0 }}>📋 Booking Log</h2>
        <p style={{ color:C.soft, margin:'4px 0 0', fontSize:13 }}>{bookings.length} bookings · ₹{(totalRevenue/100000).toFixed(1)}L confirmed revenue</p>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
        {tabBtn('all','All',bookings.length,C.orange)}
        {tabBtn('confirmed','Confirmed',bookings.filter(b=>b.status==='confirmed').length,C.green)}
        {tabBtn('pending_payment','Pending',bookings.filter(b=>b.status==='pending_payment').length,'#d97706')}
        {tabBtn('cancelled','Cancelled',bookings.filter(b=>b.status==='cancelled').length,C.red)}
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search ritual or devotee..."
        style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid rgba(212,160,23,0.4)`, background:'#fff', color:C.dark, fontSize:13, marginBottom:14, boxSizing:'border-box', fontFamily:'inherit', outline:'none' }} />

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden' }}>
        <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth:600 }}>
          <thead>
            <tr style={{ background:'rgba(212,160,23,0.08)' }}>
              {['Ritual','Devotee','Date','Amount','Status','Action'].map(h=>(
                <th key={h} style={{ color:C.gold, fontSize:11, fontWeight:800, padding:'10px 16px', textAlign:'left', letterSpacing:0.8, borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map(b => {
              const sc = SC[b.status] || {bg:'rgba(0,0,0,0.06)',color:C.soft};
              return (
                <tr key={b.id} style={{ borderBottom:`1px solid ${C.border}` }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,107,0,0.03)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'12px 16px', color:C.dark, fontWeight:600, fontSize:14 }}>{b.ritual_name||'Pooja'}</td>
                  <td style={{ padding:'12px 16px', color:C.mid, fontSize:13 }}>{b.devotee_name||'—'}</td>
                  <td style={{ padding:'12px 16px', color:C.soft, fontSize:13 }}>{b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—'}</td>
                  <td style={{ padding:'12px 16px', color:C.orange, fontWeight:700, fontSize:14 }}>₹{(b.total_amount||0).toLocaleString()}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{ background:sc.bg, color:sc.color, fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:700 }}>{b.status?.replace(/_/g,' ')}</span>
                  </td>
                  <td style={{ padding:'12px 16px' }}>
                    {b.status==='pending_payment' && (
                      <button onClick={async()=>{ setBookings(prev=>prev.map(x=>x.id===b.id?{...x,status:'confirmed'}:x)); try{const{supabase}=await import('../../services/supabase');await supabase.from('bookings').update({status:'confirmed'}).eq('id',b.id);}catch(e){} }}
                        style={{ background:'rgba(34,197,94,0.12)', color:'#15803d', border:'1px solid rgba(34,197,94,0.3)', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontSize:12, fontWeight:700 }}>Mark Paid</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
        {displayed.length === 0 && <div style={{ textAlign:'center', padding:32, color:C.soft }}>No bookings found.</div>}
      </div>
    </div>
  );
}
