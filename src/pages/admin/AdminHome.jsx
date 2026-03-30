import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const C = { page:'#fff8f0', card:'#ffffff', border:'rgba(212,160,23,0.2)', orange:'#FF6B00', gold:'#D4A017', dark:'#3d1f00', mid:'#7a5c3a', soft:'#9a8070', green:'#16a34a', red:'#dc2626' };

export default function AdminHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ devotees:0, pandits:0, bookings:0, revenue:0, pendingPandits:0, topRitual: 'N/A' });
  const [pendingPandits, setPendingPandits] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [
          { count: devotees },
          { count: pandits },
          { count: bookingsCount },
          { data: bookingsData },
          { count: pendingCount },
          { data: pp }
        ] = await Promise.all([
          supabase.from('devotees').select('*',{count:'exact',head:true}),
          supabase.from('pandits').select('*',{count:'exact',head:true}).eq('verified_status','approved'),
          supabase.from('bookings').select('*',{count:'exact',head:true}),
          supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('pandits').select('*',{count:'exact',head:true}).eq('verified_status','pending'),
          supabase.from('pandits').select('*').eq('verified_status','pending').limit(5)
        ]);

        const totalRevenue = (bookingsData || []).filter(b => b.payment_status === 'paid').reduce((s,b)=>s+(b.total_amount||0),0);
        
        // Count top rituals
        const { data: allBookings } = await supabase.from('bookings').select('ritual');
        const counts = (allBookings||[]).reduce((acc, b) => { acc[b.ritual] = (acc[b.ritual]||0)+1; return acc; }, {});
        const top = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'N/A';

        setStats({
          devotees: devotees || 0,
          pandits: pandits || 0,
          bookings: bookingsCount || 0,
          revenue: totalRevenue || 0,
          pendingPandits: pendingCount || 0,
          topRitual: top
        });
        setPendingPandits(pp || []);
        setRecentBookings(bookingsData || []);
      } catch(e) {
        console.error(e);
      }
    })();
  }, []);

  const approvePandit = async (id) => {
    try {
      const { error } = await supabase.from('pandits').update({ verified_status: 'approved' }).eq('id', id);
      if (error) throw error;
      setPendingPandits(prev => prev.filter(p => p.id !== id));
      setStats(s => ({ ...s, pandits: s.pandits + 1, pendingPandits: s.pendingPandits - 1 }));
    } catch(e) {
      alert("Error approving pandit");
    }
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
        <h1 style={{ fontFamily:'Cinzel,serif', color:C.dark, fontSize:22, margin:0 }}>Admin Dashboard</h1>
        <p style={{ color:C.soft, margin:'4px 0 0', fontSize:13 }}>Operational Intelligence & Verified Management</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {statCard(stats.devotees.toLocaleString(), 'TOTAL DEVOTEES', C.orange, 'Active Users')}
        {statCard(stats.pandits, 'VERIFIED PANDITS', C.gold, `${stats.pendingPandits} PENDING`)}
        {statCard(stats.bookings.toLocaleString(), 'TOTAL BOOKINGS', '#16a34a', `Top: ${stats.topRitual}`)}
        {statCard(`₹${(stats.revenue/100000).toFixed(2)}L`, 'REVENUE (L)', '#7c3aed', 'Paid Transactions')}
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
              <div>All verified.</div>
            </div>
          ) : pendingPandits.map(p => (
            <div key={p.id} style={{ background:'#fffbf5', border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 14px', marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ color:C.dark, fontWeight:700, fontSize:14 }}>{p.name}</div>
                  <div style={{ color:C.soft, fontSize:12, marginTop:2 }}>📍 {p.city} · {p.experience_years||5} yrs</div>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <button onClick={()=>approvePandit(p.id)} className="btn btn-success btn-sm">Approve</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'18px 20px' }}>
          <div style={{ marginBottom:14 }}>
            <h3 style={{ color:C.dark, fontFamily:'Cinzel,serif', margin:0, fontSize:15 }}>📋 Recent Activity</h3>
          </div>
          {recentBookings.map(b => (
            <div key={b.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
              <div>
                <div style={{ color:C.dark, fontWeight:600, fontSize:13 }}>{(b.ritual || 'Ritual').slice(0, 20)}...</div>
                <div style={{ color:C.soft, fontSize:11 }}>{new Date(b.created_at).toLocaleDateString()}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color:C.orange, fontWeight:700, fontSize:13 }}>₹{(b.total_amount||0).toLocaleString()}</div>
                <span style={{ background:b.payment_status==='paid'?SC.bg:PC.bg, color:b.payment_status==='paid'?SC.color:PC.color, fontSize:10, padding:'1px 6px', borderRadius:8, fontWeight:700 }}>
                  {b.payment_status || 'unpaid'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
