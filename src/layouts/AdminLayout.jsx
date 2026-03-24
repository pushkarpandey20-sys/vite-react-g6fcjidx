import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MainLayout from './MainLayout';
import { AdminSidebar } from '../components/Sidebar';
import { useApp } from '../store/AppCtx';

export default function AdminLayout() {
  const { adminRole, setAdminRole, setShowAdminLogin, logout } = useApp();
  const location = useLocation();
  const path = location.pathname;

  if (!adminRole) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 20, background: '#0d0700' }}>
        <div style={{ fontSize: 64 }}>🛡️</div>
        <h2 style={{ fontFamily: "'Cinzel',serif", color: '#3498db' }}>Admin Command Centre</h2>
        <p style={{ color: '#888' }}>Authenticate to access the management panel</p>
        <button
          onClick={() => setShowAdminLogin(true)}
          style={{ background: 'linear-gradient(135deg,#2980B9,#3498db)', color: '#fff', border: 'none', borderRadius: 28, padding: '12px 36px', fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>
          🔐 Login as Admin
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
      <div style={{ background: '#1a0f07', padding: '8px 20px', display: 'flex', gap: '14px', alignItems: 'center', borderBottom: '1px solid rgba(212,160,23,0.3)', flexWrap: 'wrap' }}>
        <span style={{ color: '#F0C040', fontFamily: "'Cinzel', serif", fontWeight: 'bold', fontSize: 13 }}>⚙️ Admin Role</span>
        <select value={adminRole} onChange={e => setAdminRole(e.target.value)}
          style={{ padding: '5px 12px', borderRadius: '20px', background: '#3d2211', color: '#fff', border: '1px solid rgba(212,160,23,0.6)', outline: 'none', fontSize: 13 }}>
          <option value="viewer">Viewer</option>
          <option value="manager">Manager</option>
          <option value="superadmin">Super Admin</option>
        </select>
        <span style={{ color: 'rgba(255,248,240,0.6)', fontSize: '12px', fontStyle: 'italic', fontFamily: "'Crimson Pro',serif" }}>
          {adminRole === 'superadmin' ? 'Full Access: Payments, Approvals, Everything' : adminRole === 'manager' ? 'Manage Bookings & Verifications' : 'Read-only Analytics'}
        </span>
        <button onClick={logout} style={{ marginLeft: 'auto', background: 'none', border: '1px solid rgba(192,57,43,.4)', color: '#C0392B', borderRadius: 16, padding: '3px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
          Logout
        </button>
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
