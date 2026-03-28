import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import { AdminSidebar } from '../components/Sidebar';
import { useApp } from '../store/AppCtx';

export default function AdminLayout() {
  const { adminRole, setAdminRole, setShowAdminLogin, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  if (!adminRole) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        height:'100vh', gap:20, background:'linear-gradient(160deg,#0a0500,#130a04,#1a0f07)',
        fontFamily:'Nunito,sans-serif' }}>
        <div style={{ width:80, height:80, borderRadius:22,
          background:'linear-gradient(135deg,rgba(52,152,219,0.18),rgba(41,128,185,0.1))',
          border:'2px solid rgba(52,152,219,0.3)',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:38 }}>🛡️</div>
        <h2 style={{ fontFamily:"'Cinzel',serif", color:'#3498db', margin:0 }}>Admin Command Centre</h2>
        <p style={{ color:'rgba(255,255,255,0.35)', margin:0, fontSize:14 }}>Secure authentication required</p>
        <div style={{ display:'flex', gap:12 }}>
          <button
            onClick={() => navigate('/admin-login')}
            style={{ background:'linear-gradient(135deg,#2980B9,#3498db)', color:'#fff', border:'none',
              borderRadius:28, padding:'12px 32px', fontWeight:800, cursor:'pointer', fontSize:15,
              boxShadow:'0 6px 20px rgba(41,128,185,0.35)' }}>
            🔐 Admin Login
          </button>
          <button
            onClick={() => setShowAdminLogin(true)}
            style={{ background:'rgba(52,152,219,0.1)', color:'#3498db', border:'1px solid rgba(52,152,219,0.3)',
              borderRadius:28, padding:'12px 24px', fontWeight:700, cursor:'pointer', fontSize:14 }}>
            Quick Access
          </button>
        </div>
        <button onClick={() => navigate('/')}
          style={{ background:'none', border:'none', color:'rgba(255,255,255,0.25)', cursor:'pointer', fontSize:13 }}>
          ← Back to DevSetu
        </button>
      </div>
    );
  }

  let title = 'Admin Command Centre';
  let sub = 'DevSetu Platform Analytics & Operations';
  if (path.includes('pandits')) { title = 'Pandit Management'; sub = 'Verify and manage pandit profiles'; }
  else if (path.includes('rituals')) { title = 'Ritual Catalog'; sub = 'Manage available rituals and services'; }
  else if (path.includes('bookings')) { title = 'All Transactions'; sub = 'View and manage all platform bookings'; }
  else if (path.includes('temples')) { title = 'Temple Network'; sub = 'Manage the sacred temple directory'; }
  else if (path.includes('samagri')) { title = 'Inventory Control'; sub = 'Manage pooja samagri stock and listings'; }
  else if (path.includes('settings')) { title = 'System Settings'; sub = 'Super admin platform configuration'; }

  return (
    <div>
      <div style={{ background:'rgba(10,5,0,0.95)', padding:'7px 20px', display:'flex', gap:'14px',
        alignItems:'center', borderBottom:'1px solid rgba(52,152,219,0.2)', flexWrap:'wrap',
        backdropFilter:'blur(10px)' }}>
        <span style={{ fontSize:18 }}>🛡️</span>
        <span style={{ color:'#3498db', fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:13 }}>DevSetu Admin</span>
        <div style={{ display:'flex', alignItems:'center', gap:6,
          background: adminRole==='superadmin' ? 'rgba(240,192,64,0.12)' : adminRole==='manager' ? 'rgba(52,152,219,0.1)' : 'rgba(34,197,94,0.08)',
          border: `1px solid ${adminRole==='superadmin' ? 'rgba(240,192,64,0.3)' : adminRole==='manager' ? 'rgba(52,152,219,0.25)' : 'rgba(34,197,94,0.25)'}`,
          borderRadius:20, padding:'4px 12px' }}>
          <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.8px', textTransform:'uppercase',
            color: adminRole==='superadmin' ? '#F0C040' : adminRole==='manager' ? '#3498db' : '#22c55e' }}>
            {adminRole === 'superadmin' ? '👑 Super Admin' : adminRole === 'manager' ? '🛡️ Manager' : '👁 Viewer'}
          </span>
        </div>
        <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'11px' }}>
          {adminRole === 'superadmin' ? 'Full access — payments, approvals, settings' : adminRole === 'manager' ? 'Manage bookings & verifications' : 'Read-only analytics'}
        </span>
        <div style={{ display:'flex', gap:8, marginLeft:'auto', alignItems:'center' }}>
          <select value={adminRole} onChange={e => setAdminRole(e.target.value)}
            style={{ padding:'4px 10px', borderRadius:'16px', background:'rgba(255,255,255,0.05)',
              color:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.1)', outline:'none', fontSize:12 }}>
            <option value="viewer">Viewer</option>
            <option value="manager">Manager</option>
            <option value="superadmin">Super Admin</option>
          </select>
          <button onClick={logout} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)',
            color:'#ef4444', borderRadius:14, padding:'4px 12px', cursor:'pointer', fontSize:11, fontWeight:700 }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ pointerEvents: adminRole === 'viewer' ? 'none' : 'auto' }}>
        <MainLayout sidebar={<AdminSidebar />} portalLabel="🛡️ Admin Panel" portalColor="#2980B9">
          <header className="ph">
            <h1 className="ph-title">{title}</h1>
            <p className="ph-sub">{sub}</p>
          </header>
          <main className="cb">
            <Outlet />
          </main>
        </MainLayout>
      </div>
    </div>
  );
}
