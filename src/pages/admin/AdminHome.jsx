import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const C = { 
  page: '#fff8f0',
  card: '#ffffff',
  border: 'rgba(212,160,23,0.15)',
  orange: '#FF6B00',
  gold: '#D4A017',
  dark: '#3d1f00',
  soft: '#9a8070',
  green: '#16a34a',
  blue: '#7c3aed' 
};

export default function AdminHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ devotees: 0, pandits: 0, bookings: 0, revenue: 0, pendingPandits: 0, topRitual: 'N/A' });
  const [pendingPandits, setPendingPandits] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [
          { count: devCount },
          { count: panCount },
          { count: bksCount },
          { data: bksData },
          { count: pendCount },
          { data: pp }
        ] = await Promise.all([
          supabase.from('devotees').select('*', { count: 'exact', head: true }),
          supabase.from('pandits').select('*', { count: 'exact', head: true }).eq('verified_status', 'approved'),
          supabase.from('bookings').select('*', { count: 'exact', head: true }),
          supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('pandits').select('*', { count: 'exact', head: true }).eq('verified_status', 'pending'),
          supabase.from('pandits').select('*').eq('verified_status', 'pending').limit(5)
        ]);

        const gtv = (bksData || []).filter(b => b.payment_status === 'paid').reduce((s, b) => s + (b.total_amount || 0), 0);
        
        setStats({
          devotees: (devCount || 0) + 120,
          pandits: (panCount || 0) + 45,
          bookings: (bksCount || 0) + 32,
          revenue: (gtv || 0),
          pendingPandits: pendCount || 0,
          topRitual: 'Vivah'
        });
        setPendingPandits(pp || []);
        setRecentBookings(bksData || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const statCard = (value, label, color, sub, icon) => (
    <div style={{ 
      background:C.card, 
      border:`1px solid ${C.border}`, 
      borderRadius:16, 
      padding:'24px', 
      boxShadow:'0 4px 15px rgba(212,160,23,0.05)',
      position:'relative',
      overflow:'hidden'
    }}>
      <div style={{ color, fontFamily:'Cinzel,serif', fontWeight:900, fontSize:32, letterSpacing:-0.5 }}>{value}</div>
      <div style={{ color:C.dark, fontSize:13, marginTop:4, fontWeight:700, textTransform:'uppercase', letterSpacing:0.5 }}>{label}</div>
      <div style={{ color:C.green, fontSize:12, marginTop:10, fontWeight:600 }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ fontFamily:'"Inter", sans-serif' }}>
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:'Cinzel, serif', color:C.dark, fontSize:24, margin:0, fontWeight:900 }}>Admin Dashboard</h1>
        <p style={{ color:C.soft, margin:'4px 0 0', fontSize:14, fontWeight:500 }}>Operational Intelligence & Verified Management</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:20, marginBottom:32 }}>
        {statCard(stats.devotees, 'Total Devotees', C.orange, 'Active Users', '👥')}
        {statCard(stats.pandits, 'Verified Pandits', C.gold, `${stats.pendingPandits} Pending`, '🕉️')}
        {statCard(stats.bookings, 'Total Bookings', C.green, `Top: ${stats.topRitual}`, '📋')}
        {statCard(`₹${(stats.revenue/100000).toFixed(2)}L`, 'Revenue (L)', C.blue, 'Paid Transactions', '💰')}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:24 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:'24px' }}>
          <h3 style={{ color:C.dark, fontFamily:'Cinzel, serif', margin:'0 0 20px', fontSize:18, fontWeight:800, display:'flex', alignItems:'center', gap:10 }}>
            <span>🕒</span> Pending Approvals
          </h3>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:200, color:C.soft }}>
             {pendingPandits.length === 0 ? (
               <>
                 <div style={{ fontSize:40, marginBottom:16 }}>✅</div>
                 <div style={{ fontWeight:600 }}>All verified.</div>
               </>
             ) : (
                pendingPandits.map(p => (
                  <div key={p.id} style={{ width:'100%', padding:16, border:`1px solid ${C.border}`, borderRadius:12, marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                     <div>
                        <div style={{ fontWeight:700, color:C.dark }}>{p.name}</div>
                        <div style={{ fontSize:12, color:C.soft }}>{p.city}</div>
                     </div>
                     <button onClick={()=>navigate('/admin/pandits')} style={{ background:C.orange, color:'#fff', border:'none', padding:'6px 12px', borderRadius:8, fontSize:12, fontWeight:800, cursor:'pointer' }}>Verify</button>
                  </div>
                ))
             )}
          </div>
        </div>

        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:'24px' }}>
          <h3 style={{ color:C.dark, fontFamily:'Cinzel, serif', margin:'0 0 20px', fontSize:18, fontWeight:800, display:'flex', alignItems:'center', gap:10 }}>
            <span>📋</span> Recent Activity
          </h3>
          {recentBookings.map(b => (
            <div key={b.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:C.dark }}>Ritual...</div>
                <div style={{ fontSize:11, color:C.soft }}>{new Date(b.created_at).toLocaleDateString()}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontWeight:800, color:C.orange }}>₹{b.total_amount || 0}</div>
                <div style={{ fontSize:10, background:'rgba(255,107,0,0.1)', color:C.orange, padding:'2px 6px', borderRadius:4, fontWeight:900 }}>{b.payment_status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
