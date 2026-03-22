import React from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';
import { AdminSidebar } from '../components/Sidebar';
import { useApp } from '../store/AppCtx';

export default function AdminLayout() {
  const { adminRole, setAdminRole } = useApp();

  return (
    <div>
      <div style={{ background: '#1a0f07', padding: '10px 24px', display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid rgba(212,160,23,0.3)' }}>
        <span style={{ color: '#F0C040', fontFamily: "'Cinzel', serif", fontWeight: 'bold' }}>⚙️ Admin Role Demo</span>
        <select 
          value={adminRole} 
          onChange={e => setAdminRole(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: '20px', background: '#3d2211', color: '#fff', border: '1px solid rgba(212,160,23,0.6)', outline: 'none' }}
        >
          <option value="viewer">Viewer</option>
          <option value="manager">Manager</option>
          <option value="superadmin">Super Admin</option>
        </select>
        <span style={{ color: 'rgba(255,248,240,0.6)', fontSize: '13px', fontStyle: 'italic', fontFamily: "'Crimson Pro',serif" }}>
          {adminRole === 'superadmin' ? 'Full Access: Payments, Approvals, Everything' 
            : adminRole === 'manager' ? 'Manage Bookings & Verifications' 
            : 'Read-only viewing of Analytics'}
        </span>
      </div>

      <div style={{ pointerEvents: adminRole === 'viewer' ? 'none' : 'auto' }}>
        <MainLayout sidebar={<AdminSidebar />}>
          <header className="ph">
            <h1 className="ph-title">{path.includes('pandits') ? 'Pandit Management' : path.includes('rituals') ? 'Ritual Catalog' : path.includes('bookings') ? 'All Transactions' : path.includes('temples') ? 'Temple Network' : path.includes('samagri') ? 'Inventory Control' : path.includes('settings') ? 'System Settings' : 'Admin Command Centre'}</h1>
            <p className="ph-sub">{path.includes('overview') ? 'DevSetu Platform Analytics & Operations' : 'Platform management with administrative controls'}</p>
          </header>
          <main className="cb">
            <Outlet />
          </main>
        </MainLayout>
      </div>
    </div>
  );
}

