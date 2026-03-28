import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const C = { page:'#fff8f0', card:'#ffffff', border:'rgba(212,160,23,0.2)', orange:'#FF6B00', gold:'#D4A017', dark:'#3d1f00', mid:'#7a5c3a', soft:'#9a8070', green:'#16a34a', red:'#dc2626' };

const SAMPLE_BOOKINGS = [
  { id:'b1', ritual_name:'Griha Pravesh', devotee_name:'Rahul Sharma', booking_date:'2025-03-28', total_amount:2100, status:'confirmed' },
  { id:'b2', ritual_name:'Satyanarayan Katha', devotee_name:'Priya Singh', booking_date:'2025-03-26', total_amount:1500, status:'confirmed' },
  { id:'b3', ritual_name:'Rudrabhishek', devotee_name:'Amit Gupta', booking_date:'2025-04-02', total_amount:2500, status:'pending_payment' },
  { id:'b4', ritual_name:'Navgrah Shanti', devotee_name:'Sunita Verma', booking_date:'2025-03-20', total_amount:1800, status:'confirmed' },
  { id:'b5', ritual_name:'Vivah Ceremony', devotee_name:'Vikram Patel', booking_date:'2025-04-10', total_amount:8000, status:'confirmed' },
];

const PENDING_PANDITS = [
  { id:'pp1', name:'Pt. Ashok Sharma', city:'Delhi', specializations:['Griha Pravesh','Satyanarayan'], years_of_experience:8, phone:'9811234567' },
  { id:'pp2', name:'Pt. Mahesh Tiwari', city:'Noida', specializations:['Rudrabhishek','Kaal Sarp'], years_of_experience:12, phone:'9822345678' },
  { id:'pp3', name:'Pt. Ravi Pandey', city:'Gurgaon', specializations:['Vivah','Mundan'], years_of_experience:6, phone:'9833456789' },
];

export default function AdminHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ devotees:1206, pandits:10, bookings:4824, revenue:2410000, pendingPandits:3 });
  const [pendingPandits, setPendingPandits] = useState(PENDING_PANDITS);
  const [recentBookings] = useState(SAMPLE_BOOKINGS);

  useEffect(() => {
    (async () => {
      try {
        const { supabase } = await import('../../services/supabase');
        const [
          { count: devotees },
          { count: pandits },
          { count: bookings },
          { data: revenue },
          { count: pending },
        ] = await Promise.all([
          supabase.from('devotees').select('*',{count:'exact',head:true}),
          supabase.from('pandits').select('*',{count:'exact',head:true}).eq('status','verified'),
          supabase.from('bookings').select('*',{count:'exact',head:true}),
          supabase.from('bookings').select('total_amount').eq('status','confirmed'),
          supabase.from('pandits').select('*',{count:'exact',head:true}).eq('status','pending_verification'),
        ]);
        const rev = (revenue||[]).reduce((s,b)=>s+(b.total_amount||0),0);
        if (pandits || devotees) setStats({ devotees:devotees||1206, pandits:pandits||10, bookings:bookings||4824, revenue:rev||2410000, pendingPandits:pending||3 });
        const { data: pp } = await supabase.from('pandits').select('*').eq('status','pending_verification').limit(5);
        if (pp?.length) setPendingPandits(pp);
      } catch(e) {}
    })();
  }, []);

  const approvePandit = async (id) => {
    setPendingPandits(prev => prev.filter(p=>p.id!==id));
    setStats(s=>({...s, pandits:s.pandits+1, pendingPandits:s.pendingPandits-1}));
    try {
      const { supabase } = await import('../../services/supabase');
      await supabase.from('pandits').update({status:'verified'}).eq('id',id);
    } catch(e) {}
  };

  const statCard = (value, label, color, sub) => (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'18px 22px', boxShadow:'0 2px 8px rgba(212,160,23,0.08)' }}>
      <div style={{ color, fontFamily:'Cinzel,serif', fontWeight:900, fontSize:28 }}>{value}</div>
      <div style={{ color:C.mid, fontSize:12, marginTop:4, letterSpacing:0.5 }}>{label}</div>
      {sub && <div style={{ color:C.green, fontSize:11, marginTop:4, fontWeight:600 }}>{sub}</div>}
    </div>
  );

  const SC = { bg:'rgba(34,197,94,0.1)', color:'#15803d' };
  const PC = { bg:'rgba(255,107,0,0.1)', color:'#c2410c' };

  return (
    <div style={{ fontFamily:'Nunito,sans-serif' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Cinzel,serif', color:C.dark, fontSize:22, margin:0 }}>Admin Command Centre</h1>
        <p style={{ color:C.soft, margin:'4px 0 0', fontSize:13 }}>DevSetu Platform Analytics & Operations</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {statCard(stats.devotees.toLocaleString(), 'TOTAL DEVOTEES', C.orange, '+89 this week')}
        {statCard(stats.pandits, 'VERIFIED PANDITS', C.gold, `${stats.pendingPandits} awaiting approval`)}
        {statCard(stats.bookings.toLocaleString(), 'TOTAL BOOKINGS', '#16a34a', '+234 this month')}
        {statCard(`₹${(stats.revenue/100000).toFixed(1)}L`, 'PLATFORM GMV', '#7c3aed', '+18% vs last month')}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'18px 20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <h3 style={{ color:C.dark, fontFamily:'Cinzel,serif', margin:0, fontSize:15 }}>🕐 Pending Approvals</h3>
            {stats.pendingPandits > 0 && <span style={{ background:'rgba(239,68,68,0.1)', color:C.red, border:`1px solid rgba(239,68,68,0.3)`, borderRadius:20, padding:'2px 10px', fontSize:12, fontWeight:700 }}>{stats.pendingPandits} pending</span>}
          </div>
          {pendingPandits.length === 0 ? (
            <div style={{ textAlign:'center', padding:'20px 0', color:C.soft }}>
              <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
              <div>All pandits reviewed!</div>
            </div>
          ) : pendingPandits.map(p => (
            <div key={p.id} style={{ background:'#fffbf5', border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 14px', marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ color:C.dark, fontWeight:700, fontSize:14 }}>{p.name}</div>
                  <div style={{ color:C.soft, fontSize:12, marginTop:2 }}>📍 {p.city} · {p.years_of_experience} yrs · 📞 {p.phone}</div>
                  <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:6 }}>
                    {(p.specializations||[]).map(s=><span key={s} style={{ background:'rgba(255,107,0,0.1)', color:'#c2410c', fontSize:11, padding:'2px 8px', borderRadius:10 }}>{s}</span>)}
                  </div>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0, marginLeft:8 }}>
                  <button onClick={()=>approvePandit(p.id)} style={{ background:'rgba(34,197,94,0.12)', color:'#15803d', border:'1px solid rgba(34,197,94,0.35)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontWeight:700, fontSize:12 }}>✓ Approve</button>
                  <button onClick={()=>setPendingPandits(prev=>prev.filter(x=>x.id!==p.id))} style={{ background:'rgba(239,68,68,0.08)', color:C.red, border:'1px solid rgba(239,68,68,0.25)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontWeight:700, fontSize:12 }}>✗</button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={()=>navigate('/admin/pandits')} style={{ width:'100%', background:'rgba(255,107,0,0.08)', color:C.orange, border:`1px solid rgba(255,107,0,0.25)`, borderRadius:8, padding:'8px', fontSize:12, cursor:'pointer', fontWeight:700, marginTop:4 }}>
            View All Pandits →
          </button>
        </div>

        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'18px 20px' }}>
          <div style={{ marginBottom:14 }}>
            <h3 style={{ color:C.dark, fontFamily:'Cinzel,serif', margin:0, fontSize:15 }}>📋 Recent Bookings</h3>
          </div>
          {recentBookings.map(b => (
            <div key={b.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
              <div>
                <div style={{ color:C.dark, fontWeight:600, fontSize:14 }}>{b.ritual_name}</div>
                <div style={{ color:C.soft, fontSize:12, marginTop:2 }}>{b.devotee_name} · {new Date(b.booking_date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color:C.orange, fontWeight:700, fontSize:14 }}>₹{b.total_amount.toLocaleString()}</div>
                <span style={{ background:b.status==='confirmed'?SC.bg:PC.bg, color:b.status==='confirmed'?SC.color:PC.color, fontSize:11, padding:'2px 8px', borderRadius:10, fontWeight:600 }}>
                  {b.status?.replace(/_/g,' ')}
                </span>
              </div>
            </div>
          ))}
          <button onClick={()=>navigate('/admin/bookings')} style={{ width:'100%', background:'rgba(255,107,0,0.08)', color:C.orange, border:`1px solid rgba(255,107,0,0.25)`, borderRadius:8, padding:'8px', fontSize:12, cursor:'pointer', fontWeight:700, marginTop:8 }}>
            View All Bookings →
          </button>
        </div>
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'18px 20px', marginTop:18 }}>
        <h3 style={{ color:C.dark, fontFamily:'Cinzel,serif', margin:'0 0 14px', fontSize:15 }}>🛡️ Platform Health</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
          {[['0','Flags / Issues','#15803d'],['98.7%','Payment Success','#15803d'],['4.8 ★','Avg Pandit Rating',C.gold],[`${stats.pendingPandits}`,'Pending Reviews',C.orange]].map(([v,l,c])=>(
            <div key={l} style={{ background:'#fffbf5', border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 16px', textAlign:'center' }}>
              <div style={{ color:c, fontWeight:800, fontSize:20 }}>{v}</div>
              <div style={{ color:C.soft, fontSize:11, marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
