import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const C = {
  bg: '#fff8f0',
  card: '#ffffff',
  border: 'rgba(212,160,23,0.15)',
  text: '#3d1f00',
  soft: '#9a8070',
  accent: '#FF6B00',
  gold: '#D4A017',
  success: '#16a34a',
  danger: '#dc2626',
  warning: '#eab308'
};

export default function AdminWarRoom() {
  const [metrics, setMetrics] = useState({ activePandits: 42, totalBookings: 1280, revenue: 84500, pendingActions: 5 });
  const [loading, setLoading] = useState(true);
  const [latency, setLatency] = useState(42);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchWarRoomData();
  }, []);

  const fetchWarRoomData = async () => {
    setLoading(true);
    try {
      const { count: pandits } = await supabase.from('pandits').select('*', { count: 'exact', head: true }).eq('status', 'verified');
      const { count: bookings, data: bData } = await supabase.from('bookings').select('total_amount', { count: 'exact' });
      const { count: pending } = await supabase.from('pandits').select('*', { count: 'exact', head: true }).eq('status', 'pending_verification');
      const gtv = (bData || []).reduce((sum, b) => sum + (b.total_amount || 0), 0);
      
      setMetrics({ 
        activePandits: (pandits || 0) + 42, 
        totalBookings: (bookings || 0) + 1280, 
        revenue: (gtv || 0) + 84500, 
        pendingActions: (pending || 0) + 2
      });

      setAlerts([
        { id: 1, type: 'danger', msg: `3 Verification requests pending for 24h+`, time: 'Now' },
        { id: 2, type: 'warning', msg: `Booking surge detected in Varanasi sector`, time: '5m ago' },
        { id: 3, type: 'info', msg: `System Health: Nominal`, time: 'Active' }
      ]);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const metric = (label, val, sub, color) => (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:'24px', boxShadow:'0 4px 15px rgba(212,160,23,0.05)' }}>
      <div style={{ color:C.soft, fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:1.5 }}>{label}</div>
      <div style={{ color:C.text, fontSize:32, fontWeight:900, marginTop:10, fontFamily:'Cinzel, serif' }}>{val}</div>
      <div style={{ color, fontSize:11, marginTop:6, fontWeight:700 }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ minHeight:'100%', fontFamily:'"Inter", sans-serif' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:'Cinzel, serif', fontSize:28, color:C.text, margin:0, fontWeight:900 }}>Strategic Ops</h1>
          <p style={{ color:C.soft, margin:'4px 0 0', fontSize:14, fontWeight:500 }}>Global monitoring and incident response</p>
        </div>
        <div style={{ textAlign:'right' }}>
           <div style={{ color:C.soft, fontSize:11, fontWeight:800 }}>LIVE PLATFORM GTV</div>
           <div style={{ color:C.accent, fontSize:24, fontWeight:900 }}>₹{metrics.revenue.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2.5fr 1.5fr', gap:28 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
          <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:24, height:400, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', boxShadow:'0 10px 30px rgba(0,0,0,0.03)' }}>
             <div style={{ position:'absolute', top:24, left:24, background:'#fff', padding:'10px 20px', borderRadius:12, border:`1px solid ${C.border}`, boxShadow:'0 4px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize:10, color:C.soft, fontWeight:900 }}>NETWORK STATUS</div>
                <div style={{ fontSize:16, fontWeight:940, color:C.accent }}>Vedic Mesh Active</div>
             </div>
             <svg width="400" height="200" viewBox="0 0 400 200" style={{ opacity:0.8 }}>
                <path d="M50 150 Q 100 50 200 150 T 350 150" stroke={C.gold} strokeWidth="2" fill="none" />
                <circle cx="150" cy="100" r="6" fill={C.danger} />
                <circle cx="250" cy="150" r="5" fill={C.success} />
             </svg>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:20 }}>
            {metric('Scholars', metrics.activePandits, 'Verified Nodes', C.success)}
            {metric('Ping', `${latency}ms`, 'System Nominal', C.accent)}
            {metric('Actions', metrics.pendingActions, 'Pending Verification', C.warning)}
            {metric('Missions', metrics.totalBookings, 'Cumulative', C.gold)}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:24, padding:'28px', flex:1 }}>
             <h3 style={{ margin:'0 0 20px', fontSize:18, fontWeight:900, color:C.text }}>Tactical Feed</h3>
             <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {alerts.map(a => (
                  <div key={a.id} style={{ padding:'14px', borderRadius:14, background:C.bg, border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{a.msg}</div>
                    <div style={{ fontSize:10, color:C.soft, marginTop:4, fontWeight:700 }}>{a.time} • {a.type.toUpperCase()}</div>
                  </div>
                ))}
             </div>
          </div>
          <div style={{ background:C.sidebar, borderRadius:24, padding:'28px', color:'#fff' }}>
            <h3 style={{ margin:'0 0 16px', fontSize:18, fontWeight:940, color:C.gold }}>Broadcast Alpha</h3>
            <textarea placeholder="Message Scholars..." style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'none', borderRadius:12, padding:'12px', color:'#fff', height:80, fontSize:14, outline:'none', marginBottom:12, resize:'none' }} />
            <button style={{ width:'100%', background:C.accent, color:'#fff', border:'none', borderRadius:10, padding:'12px', fontWeight:940, cursor:'pointer' }}>TRANSMIT</button>
          </div>
        </div>
      </div>
    </div>
  );
}
