import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const SAMPLE_BOOKINGS = [
  { id:'b1', ritual_name:'Griha Pravesh', status:'confirmed', total_amount:2100, booking_date:'2026-03-28', created_at:'2026-03-25T10:00:00Z', devotee_name:'Rahul Sharma', devotee_phone:'9711101101', razorpay_payment_id:'pay_test_001abc' },
  { id:'b2', ritual_name:'Satyanarayan Katha', status:'confirmed', total_amount:1500, booking_date:'2026-03-26', created_at:'2026-03-24T14:00:00Z', devotee_name:'Priya Singh', devotee_phone:'9722202202', razorpay_payment_id:'pay_test_002def' },
  { id:'b3', ritual_name:'Rudrabhishek', status:'pending_payment', total_amount:2500, booking_date:'2026-04-02', created_at:'2026-03-26T09:00:00Z', devotee_name:'Amit Gupta', devotee_phone:'9733303303' },
  { id:'b4', ritual_name:'Navgrah Shanti', status:'confirmed', total_amount:1800, booking_date:'2026-03-20', created_at:'2026-03-18T16:00:00Z', devotee_name:'Sunita Verma', devotee_phone:'9744404404', razorpay_payment_id:'pay_test_004ghi' },
  { id:'b5', ritual_name:'Vivah Ceremony', status:'confirmed', total_amount:8000, booking_date:'2026-03-15', created_at:'2026-03-10T11:00:00Z', devotee_name:'Vikram Patel', devotee_phone:'9755505505', razorpay_payment_id:'pay_test_005jkl' },
];

export default function AdminBookingList() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('bookings').select('*').order('created_at',{ascending:false});
      setBookings(data?.length ? data : SAMPLE_BOOKINGS);
      setLoading(false);
    })();
  }, []);

  const filtered = filter==='all' ? bookings : bookings.filter(b=>b.status===filter);
  const totalRevenue = bookings.filter(b=>b.status==='confirmed').reduce((s,b)=>s+(b.total_amount||0),0);
  const sc = s => s==='confirmed'?'#22c55e':s==='pending_payment'?'#FF6B00':'#ef4444';

  return (
    <div style={{ color:'rgba(255,255,255,0.85)' }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ color:'#3498db', fontFamily:'Cinzel,serif', margin:0, fontSize:20 }}>📋 Booking Log</h1>
        <p style={{ color:'rgba(255,255,255,0.4)', margin:'4px 0 0', fontSize:13 }}>
          {bookings.length} total · ₹{totalRevenue.toLocaleString()} confirmed revenue
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[
          {label:'Total Bookings', v:bookings.length, c:'#3498db'},
          {label:'Confirmed', v:bookings.filter(b=>b.status==='confirmed').length, c:'#22c55e'},
          {label:'Pending Payment', v:bookings.filter(b=>b.status==='pending_payment').length, c:'#FF6B00'},
          {label:'Revenue', v:`₹${(totalRevenue/1000).toFixed(1)}K`, c:'#F0C040'},
        ].map(s=>(
          <div key={s.label} style={{ background:'#0f0f1a', border:'1px solid rgba(41,128,185,0.15)', borderRadius:10, padding:'14px 16px' }}>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11, letterSpacing:1 }}>{s.label}</div>
            <div style={{ color:s.c, fontFamily:'Cinzel,serif', fontWeight:700, fontSize:22, marginTop:4 }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {['all','confirmed','pending_payment','cancelled'].map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{ padding:'7px 16px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:600, fontSize:12, background:filter===s?'#3498db':'rgba(255,255,255,0.07)', color:filter===s?'#fff':'rgba(255,255,255,0.5)' }}>
            {s==='all'?'All':s.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
          </button>
        ))}
      </div>

      <div style={{ background:'#0f0f1a', borderRadius:14, border:'1px solid rgba(41,128,185,0.2)', overflowX:'auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1.2fr 1fr 1fr 1fr 1fr', padding:'12px 16px', background:'rgba(41,128,185,0.1)', fontSize:11, color:'rgba(255,255,255,0.4)', letterSpacing:1, fontWeight:700, minWidth:700 }}>
          <span>RITUAL</span><span>DEVOTEE</span><span>DATE</span><span>AMOUNT</span><span>STATUS</span><span>PAYMENT ID</span>
        </div>
        {loading ? (
          <div style={{ textAlign:'center', padding:32, color:'rgba(255,255,255,0.3)' }}>Loading...</div>
        ) : filtered.map((b,i)=>(
          <div key={b.id||i} style={{ display:'grid', gridTemplateColumns:'1.5fr 1.2fr 1fr 1fr 1fr 1fr', padding:'13px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', alignItems:'center', minWidth:700 }}>
            <div style={{ color:'#fff', fontWeight:500, fontSize:13 }}>{b.ritual_name||'Pooja'}</div>
            <div>
              <div style={{ color:'rgba(255,255,255,0.7)', fontSize:13 }}>{b.devotee_name||'—'}</div>
              <div style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>{b.devotee_phone||'—'}</div>
            </div>
            <div style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>{b.booking_date?new Date(b.booking_date).toLocaleDateString('en-IN'):'—'}</div>
            <div style={{ color:'#FF6B00', fontWeight:700 }}>₹{(b.total_amount||0).toLocaleString()}</div>
            <div><span style={{ background:`${sc(b.status)}22`, color:sc(b.status), fontSize:11, padding:'3px 8px', borderRadius:8, fontWeight:600 }}>{(b.status||'pending').replace(/_/g,' ')}</span></div>
            <div style={{ color:'rgba(255,255,255,0.3)', fontSize:11, fontFamily:'monospace' }}>{b.razorpay_payment_id?b.razorpay_payment_id.substring(0,14)+'...':'—'}</div>
          </div>
        ))}
        {filtered.length===0 && !loading && <div style={{ textAlign:'center', padding:32, color:'rgba(255,255,255,0.3)' }}>No bookings found</div>}
      </div>
    </div>
  );
}
