import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const C = { page:'#fff8f0', card:'#ffffff', border:'rgba(212,160,23,0.2)', orange:'#FF6B00', gold:'#D4A017', dark:'#3d1f00', mid:'#7a5c3a', soft:'#9a8070', green:'#16a34a', red:'#dc2626' };

export default function AdminHome() {
  const navigate = useNavigate();
  const mobile = window.innerWidth < 768;
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

      <div style={{ display:'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap:18 }}>
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

      {/* ── Analytics Charts ── */}
      <div style={{ marginTop:20 }}>
        <h3 style={{ fontFamily:'Cinzel,serif', color:C.dark, fontSize:16, margin:'0 0 14px' }}>📈 Platform Analytics</h3>
        <div style={{ display:'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap:18 }}>

          {/* Booking trend */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'18px 20px' }}>
            <div style={{ color:C.dark, fontWeight:700, fontSize:14, marginBottom:14 }}>📅 Bookings This Month</div>
            {(() => {
              const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
              const data = [12, 8, 15, 22, 18, 35, 28];
              const max = Math.max(...data);
              return (
                <div style={{ display:'flex', gap:8, alignItems:'flex-end', height:100 }}>
                  {days.map((d,i) => (
                    <div key={d} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                      <div style={{ fontSize:10, color:C.soft }}>{data[i]}</div>
                      <div style={{ width:'100%', height: Math.max(4,(data[i]/max)*80), background:'linear-gradient(180deg,#FF6B00,#e55a00)', borderRadius:'4px 4px 0 0' }}/>
                      <div style={{ fontSize:10, color:C.soft }}>{d}</div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Revenue by ritual */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'18px 20px' }}>
            <div style={{ color:C.dark, fontWeight:700, fontSize:14, marginBottom:14 }}>🕉️ Top Rituals by Revenue</div>
            {[
              { name:'Vivah Ceremony',    pct:35, rev:'₹84,000', color:'#FF6B00' },
              { name:'Griha Pravesh',     pct:25, rev:'₹52,500', color:'#D4A017' },
              { name:'Satyanarayan Katha',pct:20, rev:'₹30,000', color:'#22c55e' },
              { name:'Rudrabhishek',      pct:12, rev:'₹25,200', color:'#7c3aed' },
              { name:'Others',            pct:8,  rev:'₹16,800', color:'#9a8070' },
            ].map(r => (
              <div key={r.name} style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ color:C.dark, fontSize:13, fontWeight:600 }}>{r.name}</span>
                  <span style={{ color:C.orange, fontSize:13, fontWeight:700 }}>{r.rev}</span>
                </div>
                <div style={{ height:8, background:'rgba(0,0,0,0.06)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${r.pct}%`, background:r.color, borderRadius:4, transition:'width 0.5s' }}/>
                </div>
              </div>
            ))}
          </div>

          {/* City demand */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'18px 20px' }}>
            <div style={{ color:C.dark, fontWeight:700, fontSize:14, marginBottom:14 }}>📍 Demand by City</div>
            {[
              { city:'Delhi',     bookings:1842, pct:38 },
              { city:'Gurgaon',   bookings:967,  pct:20 },
              { city:'Noida',     bookings:724,  pct:15 },
              { city:'Mumbai',    bookings:580,  pct:12 },
              { city:'Bengaluru', bookings:435,  pct:9  },
              { city:'Others',    bookings:276,  pct:6  },
            ].map(c => (
              <div key={c.city} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <span style={{ color:C.mid, fontSize:13, width:80, flexShrink:0 }}>📍 {c.city}</span>
                <div style={{ flex:1, height:10, background:'rgba(0,0,0,0.06)', borderRadius:5, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${c.pct}%`, background:`linear-gradient(90deg,#FF6B00,#D4A017)`, borderRadius:5 }}/>
                </div>
                <span style={{ color:C.soft, fontSize:12, width:40, textAlign:'right' }}>{c.pct}%</span>
              </div>
            ))}
          </div>

          {/* Growth metrics */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'18px 20px' }}>
            <div style={{ color:C.dark, fontWeight:700, fontSize:14, marginBottom:14 }}>🚀 Growth Metrics</div>
            {[
              ['New Devotees (MTD)',    '+89',    '+23%',  C.green],
              ['New Pandits (MTD)',     '+3',     '+15%',  C.gold],
              ['Avg Booking Value',    '₹2,340', '+8%',   C.orange],
              ['Platform Revenue',     '₹2.4L',  '+18%',  '#7c3aed'],
              ['Repeat Bookings',      '34%',    '+5pts', C.green],
              ['Avg Pandit Rating',    '4.8 ★',  '+0.2',  C.gold],
            ].map(([l,v,chg,c]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:`1px solid ${C.border}` }}>
                <span style={{ color:C.mid, fontSize:13 }}>{l}</span>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <span style={{ color:C.dark, fontWeight:700, fontSize:14 }}>{v}</span>
                  <span style={{ background:`${c}15`, color:c, fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:700 }}>{chg}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
