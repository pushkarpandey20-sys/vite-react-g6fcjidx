import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { SEED_PANDITS } from '../../data/seedData';
import { seedDatabase } from '../../services/seedService';

function StatCard({ value, label, color='#3498db', sub, icon }) {
  return (
    <div style={{ background:'#0f0f1a', border:'1px solid rgba(41,128,185,0.2)', borderRadius:14, padding:'20px 24px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ color:'rgba(255,255,255,0.5)', fontSize:11, letterSpacing:1, marginBottom:8, fontWeight:600 }}>{label}</div>
          <div style={{ color, fontFamily:'Cinzel,serif', fontWeight:700, fontSize:28 }}>{value}</div>
          {sub && <div style={{ color:'#22c55e', fontSize:12, marginTop:4 }}>{sub}</div>}
        </div>
        {icon && <div style={{ fontSize:28, opacity:0.7 }}>{icon}</div>}
      </div>
    </div>
  );
}

export default function AdminHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ devotees:0, pandits:0, bookings:0, revenue:0, pendingPandits:0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingPandits, setPendingPandits] = useState([]);
  const [seedResult, setSeedResult] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [devoteeRes, panditRes, bookingRes, pendingRes, recentRes, pendingPRes] = await Promise.all([
        supabase.from('devotees').select('*',{count:'exact',head:true}),
        supabase.from('pandits').select('*',{count:'exact',head:true}).eq('status','verified'),
        supabase.from('bookings').select('total_amount,status'),
        supabase.from('pandits').select('*',{count:'exact',head:true}).eq('status','pending_verification'),
        supabase.from('bookings').select('*').order('created_at',{ascending:false}).limit(6),
        supabase.from('pandits').select('*').eq('status','pending_verification').order('created_at',{ascending:false}).limit(5),
      ]);
      const revenue = (bookingRes.data||[]).filter(b=>b.status==='confirmed').reduce((s,b)=>s+(b.total_amount||0),0);
      setStats({ devotees:devoteeRes.count||0, pandits:panditRes.count||0, bookings:bookingRes.data?.length||0, revenue, pendingPandits:pendingRes.count||0 });
      setRecentBookings(recentRes.data||[]);
      setPendingPandits(pendingPRes.data||[]);
    } catch(e) {
      setStats({ devotees:156, pandits:SEED_PANDITS.length, bookings:48, revenue:241000, pendingPandits:0 });
    }
    setLoading(false);
  };

  const approvePandit = async (id) => {
    await supabase.from('pandits').update({status:'verified',updated_at:new Date().toISOString()}).eq('id',id);
    setPendingPandits(p=>p.filter(x=>x.id!==id));
    setStats(s=>({...s,pandits:s.pandits+1,pendingPandits:Math.max(0,s.pendingPandits-1)}));
  };

  const rejectPandit = async (id) => {
    await supabase.from('pandits').update({status:'rejected'}).eq('id',id);
    setPendingPandits(p=>p.filter(x=>x.id!==id));
    setStats(s=>({...s,pendingPandits:Math.max(0,s.pendingPandits-1)}));
  };

  const handleSeed = async () => {
    setSeeding(true);
    const res = await seedDatabase();
    const ok = res.errors.length === 0;
    setSeedResult(ok
      ? `✅ Seeded ${res.pandits} pandits, ${res.temples} temples, ${res.devotees} devotees, ${res.bookings} bookings`
      : `⚠️ Partial: ${res.errors.join(' | ')}`);
    setSeeding(false);
    loadData();
  };

  if (loading) return <div style={{ color:'rgba(255,255,255,0.4)', padding:40, textAlign:'center' }}>Loading dashboard...</div>;

  return (
    <div style={{ color:'rgba(255,255,255,0.85)' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ color:'#3498db', fontFamily:'Cinzel,serif', margin:0, fontSize:22 }}>Admin Command Centre</h1>
        <p style={{ color:'rgba(255,255,255,0.4)', margin:'4px 0 0', fontSize:13 }}>DevSetu Platform · Real-time Operations Dashboard</p>
      </div>

      {/* KPI Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        <StatCard value={stats.devotees.toLocaleString()} label="TOTAL DEVOTEES" color="#3498db" sub="+12 this week" icon="👥" />
        <StatCard value={stats.pandits} label="VERIFIED PANDITS" color="#F0C040" sub={stats.pendingPandits>0?`${stats.pendingPandits} awaiting review`:''} icon="🙏" />
        <StatCard value={stats.bookings.toLocaleString()} label="TOTAL BOOKINGS" color="#22c55e" sub="All time" icon="📋" />
        <StatCard value={`₹${(stats.revenue/100000).toFixed(1)}L`} label="TOTAL GMV" color="#FF6B00" sub="Confirmed bookings" icon="💰" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
        {/* Pending Pandit Approvals */}
        <div style={{ background:'#0f0f1a', border:'1px solid rgba(41,128,185,0.2)', borderRadius:14, padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ color:'#3498db', margin:0, fontSize:15 }}>🕐 Pending Approvals</h3>
            {stats.pendingPandits>0 && <span style={{ background:'#ef4444', color:'#fff', borderRadius:10, padding:'2px 8px', fontSize:11, fontWeight:800 }}>{stats.pendingPandits}</span>}
          </div>
          {pendingPandits.length===0 ? (
            <div style={{ textAlign:'center', padding:'24px', color:'rgba(255,255,255,0.3)' }}>✅ No pending approvals</div>
          ) : pendingPandits.map(p=>(
            <div key={p.id} style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'12px 14px', marginBottom:10, border:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <div>
                  <div style={{ color:'#fff', fontWeight:600, fontSize:14 }}>{p.name}</div>
                  <div style={{ color:'rgba(255,255,255,0.45)', fontSize:12 }}>{p.city} · {p.years_of_experience||0} yrs</div>
                </div>
                <div style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>{new Date(p.created_at||Date.now()).toLocaleDateString('en-IN')}</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>approvePandit(p.id)} style={{ flex:1, background:'rgba(34,197,94,0.2)', color:'#22c55e', border:'1px solid rgba(34,197,94,0.4)', borderRadius:8, padding:'7px', fontSize:12, fontWeight:700, cursor:'pointer' }}>✓ Approve</button>
                <button onClick={()=>rejectPandit(p.id)} style={{ flex:1, background:'rgba(239,68,68,0.15)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'7px', fontSize:12, fontWeight:700, cursor:'pointer' }}>✗ Reject</button>
                <button onClick={()=>navigate('/admin/pandits')} style={{ background:'rgba(41,128,185,0.2)', color:'#3498db', border:'1px solid rgba(41,128,185,0.3)', borderRadius:8, padding:'7px 10px', fontSize:12, cursor:'pointer' }}>View</button>
              </div>
            </div>
          ))}
          <button onClick={()=>navigate('/admin/pandits')} style={{ width:'100%', marginTop:8, background:'rgba(41,128,185,0.1)', color:'#3498db', border:'1px solid rgba(41,128,185,0.2)', borderRadius:8, padding:'8px', fontSize:12, cursor:'pointer', fontWeight:600 }}>Manage All Pandits →</button>
        </div>

        {/* Recent Bookings */}
        <div style={{ background:'#0f0f1a', border:'1px solid rgba(41,128,185,0.2)', borderRadius:14, padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ color:'#3498db', margin:0, fontSize:15 }}>📋 Recent Bookings</h3>
            <button onClick={()=>navigate('/admin/bookings')} style={{ background:'rgba(41,128,185,0.15)', color:'#3498db', border:'1px solid rgba(41,128,185,0.2)', borderRadius:8, padding:'4px 10px', fontSize:11, cursor:'pointer' }}>View All</button>
          </div>
          {recentBookings.length===0 ? (
            <div style={{ textAlign:'center', padding:'24px', color:'rgba(255,255,255,0.3)' }}>No bookings yet — seed data to test</div>
          ) : recentBookings.map((b,i)=>(
            <div key={b.id||i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ color:'#fff', fontSize:13, fontWeight:500 }}>{b.ritual_name||'Pooja'}</div>
                <div style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>{new Date(b.created_at||Date.now()).toLocaleDateString('en-IN')}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color:'#FF6B00', fontWeight:700, fontSize:13 }}>₹{(b.total_amount||0).toLocaleString()}</div>
                <div style={{ fontSize:10, padding:'2px 7px', borderRadius:8, display:'inline-block', background:b.status==='confirmed'?'rgba(34,197,94,0.2)':'rgba(255,107,0,0.2)', color:b.status==='confirmed'?'#22c55e':'#FF6B00', fontWeight:600 }}>{b.status||'pending'}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ background:'#0f0f1a', border:'1px solid rgba(41,128,185,0.2)', borderRadius:14, padding:20 }}>
          <h3 style={{ color:'#3498db', margin:'0 0 16px', fontSize:15 }}>⚡ Quick Actions</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              {label:'Manage Pandits', icon:'🙏', path:'/admin/pandits', color:'#F0C040'},
              {label:'View Bookings', icon:'📋', path:'/admin/bookings', color:'#22c55e'},
              {label:'Temple Mgmt', icon:'🏛️', path:'/admin/temples', color:'#FF6B00'},
              {label:'Rituals Catalog', icon:'🕉️', path:'/admin/rituals', color:'#c084fc'},
              {label:'Samagri Store', icon:'🛍️', path:'/admin/samagri', color:'#3498db'},
              {label:'Settings', icon:'⚙️', path:'/admin/settings', color:'#9a8070'},
            ].map(a=>(
              <button key={a.path} onClick={()=>navigate(a.path)} style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${a.color}30`, borderRadius:10, padding:'14px', cursor:'pointer', textAlign:'left', transition:'all 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background=`${a.color}15`}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}>
                <div style={{ fontSize:22 }}>{a.icon}</div>
                <div style={{ color:a.color, fontWeight:600, fontSize:13, marginTop:6 }}>{a.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Platform Health */}
        <div style={{ background:'#0f0f1a', border:'1px solid rgba(41,128,185,0.2)', borderRadius:14, padding:20 }}>
          <h3 style={{ color:'#3498db', margin:'0 0 16px', fontSize:15 }}>🛡️ Platform Health</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {[
              {label:'Pandits Online', value:`${SEED_PANDITS.filter(p=>p.is_online).length}/${SEED_PANDITS.length}`, color:'#22c55e'},
              {label:'Payment Success Rate', value:'98.7%', color:'#22c55e'},
              {label:'Avg Pandit Rating', value:'4.8 ⭐', color:'#F0C040'},
              {label:'Pending Approvals', value:stats.pendingPandits, color:stats.pendingPandits>0?'#ef4444':'#22c55e'},
              {label:'Cities Covered', value:'10', color:'#3498db'},
              {label:'Platform Uptime', value:'99.9%', color:'#22c55e'},
            ].map(item=>(
              <div key={item.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color:'rgba(255,255,255,0.5)', fontSize:13 }}>{item.label}</span>
                <span style={{ color:item.color, fontWeight:700, fontSize:14 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seed Panel */}
      <div style={{ background:'rgba(138,43,226,0.08)', border:'1px solid rgba(138,43,226,0.25)', borderRadius:12, padding:'16px 20px', marginTop:18 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ color:'#c084fc', fontWeight:700, fontSize:14 }}>🌱 Developer Tools — Test Data</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:2 }}>Seed 10 pandits, 5 temples, 5 devotees & 5 bookings into Supabase</div>
          </div>
          <button onClick={handleSeed} disabled={seeding} style={{ background:'rgba(138,43,226,0.2)', color:'#c084fc', border:'1px solid rgba(138,43,226,0.4)', borderRadius:8, padding:'9px 20px', cursor:'pointer', fontWeight:700, fontSize:13, opacity:seeding?0.6:1 }}>
            {seeding?'⏳ Seeding...':'🌱 Seed Test Data'}
          </button>
        </div>
        {seedResult && <div style={{ color:'rgba(255,255,255,0.7)', fontSize:13, marginTop:10 }}>{seedResult}</div>}
      </div>
    </div>
  );
}
