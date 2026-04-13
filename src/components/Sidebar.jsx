import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../store/AppCtx';
import {
  IconHome, IconCalendar, IconSearch, IconBook,
  IconShoppingBag, IconHeart, IconTemple
} from './icons/Icons';

const NAV_ITEMS = [
  { path:'/user/home',        Icon:IconHome,        label:'Dashboard' },
  { path:'/user/muhurta',     Icon:IconCalendar,    label:'Panchang' },
  { path:'/user/marketplace', Icon:IconSearch,      label:'Find Pandits' },
  { path:'/user/rituals',     Icon:IconBook,        label:'Book Now' },
  { path:'/user/history',     Icon:IconBook,        label:'My Bookings' },
  { path:'/user/temples',     Icon:IconTemple,      label:'Temples' },
  { path:'/user/samagri',     Icon:IconShoppingBag, label:'Buy Samagri' },
  { path:'/user/donations',   Icon:IconHeart,       label:'Seva/Donations' },
];

export function UserSidebar({ onNavClick }) {
  const { devoteeId, setShowLogin } = useApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleProtectedNav = (e, path) => {
    const isProtected = path.includes('booking') || path.includes('history');
    if (isProtected && !devoteeId) {
      e.preventDefault();
      setShowLogin(true);
    }
    onNavClick?.();
  };

  return (
    <div className="sidebar" style={{ background: '#3d1f00', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 12 }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div style={{ fontFamily: 'Cinzel,serif', color: '#F0C040', fontSize: 16, fontWeight: 900 }}>🕉️ DevSetu</div>
          <div style={{ fontSize: 10, color: 'rgba(255,248,240,0.5)', letterSpacing: 2, marginTop: 2 }}>DEVOTEE PORTAL</div>
        </div>
      </div>
      
      <nav style={{ flex: 1, padding: '8px 0' }}>
        {NAV_ITEMS.map(({ path, Icon, label }) => {
          const active = pathname === path;
          return (
            <div key={path} onClick={(e) => {
              const isProtected = path.includes('booking') || path.includes('history');
              if (isProtected && !devoteeId) {
                handleProtectedNav(e, path);
              } else {
                onNavClick?.();
                navigate(path);
              }
            }} style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'9px 16px', cursor:'pointer', borderRadius:8,
              margin:'2px 8px',
              background: active ? 'rgba(255,107,0,0.15)' : 'transparent',
              color: active ? '#FF6B00' : 'rgba(255,248,240,0.7)',
              fontWeight: active ? 700 : 500,
              transition:'all 0.18s',
            }}>
              <Icon size={17} color={active ? '#FF6B00' : 'rgba(255,248,240,0.6)'} />
              <span style={{ fontSize:14 }}>{label}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
}


export function PanditSidebar({ onNavClick }) {
  const { panditId, panditName, setShowPanditOnboarding } = useApp();
  const navigate = useNavigate();

  const logoutPandit = () => {
    localStorage.removeItem('devsetu_pandit');
    window.location.href = '/pandit/dashboard'; // hard reload clears state
  };

  const handleProtectedNav = (e) => {
    if (!panditId) {
      e.preventDefault();
      setShowPanditOnboarding(true);
    }
    onNavClick?.();
  };

  const handleNav = () => onNavClick?.();

  return (
    <div className="sidebar">
      <div className="s-section-title">MY ACTIVITIES</div>
      <NavLink to="/pandit/dashboard" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}>
        <span className="s-icon">🏛️</span>Dashboard
      </NavLink>
      <NavLink to="/pandit/requests" onClick={handleProtectedNav} className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`}>
        <span className="s-icon">📬</span>All Requests
      </NavLink>
      <NavLink to="/pandit/history" onClick={handleProtectedNav} className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`}>
        <span className="s-icon"><IconCalendar size={18} /></span>Booking Log
      </NavLink>
      <div className="s-div" />
      <div className="s-section-title">MY PROFILE</div>
      <NavLink to="/pandit/profile" onClick={handleProtectedNav} className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`}>
        <span className="s-icon">👤</span>Edit Profile
      </NavLink>
      <NavLink to="/pandit/earnings" onClick={handleProtectedNav} className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`}>
        <span className="s-icon">💰</span>Earnings
      </NavLink>
      <NavLink to="/pandit/schedule" onClick={handleProtectedNav} className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`}>
        <span className="s-icon">⏰</span>Availability
      </NavLink>
      {panditId && <>
        <div className="s-div" />
        <div style={{ padding: '8px 16px' }}>
          <div style={{ fontSize: 11, color: 'rgba(240,192,64,0.5)', fontWeight: 700, marginBottom: 6, letterSpacing: 0.5 }}>LOGGED IN AS</div>
          <div style={{ fontSize: 12, color: 'rgba(255,248,240,0.75)', fontWeight: 700, marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🪔 {panditName || 'Pandit'}</div>
          <button onClick={logoutPandit}
            style={{ width: '100%', background: 'rgba(255,107,0,0.1)', color: '#FF6B00', border: '1px solid rgba(255,107,0,0.3)', borderRadius: 10, padding: '8px 12px', fontWeight: 700, cursor: 'pointer', fontSize: 12, fontFamily: 'Nunito,sans-serif', textAlign: 'left' }}>
            🚪 Logout
          </button>
        </div>
      </>}
    </div>
  );
}

export function AdminSidebar({ onNavClick }) {
  const { adminRole } = useApp();
  const handleNav = () => onNavClick?.();

  return (
    <div className="sidebar">
      <div className="s-section-title">NETWORK OPS</div>
      <NavLink to="/admin/overview" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}>
        <span className="s-icon">📊</span>Platform Overview
      </NavLink>
      <NavLink to="/admin/pandits" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}>
        <span className="s-icon">🕉️</span>Manage Pandits
      </NavLink>
      <NavLink to="/admin/bookings" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}>
        <span className="s-icon"><IconBadge size={18} /></span>Booking Log
      </NavLink>
      <div className="s-div" />
      <div className="s-section-title">INVENTORY</div>
      <NavLink to="/admin/rituals" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}>
        <span className="s-icon">📿</span>Rituals Catalog
      </NavLink>
      <NavLink to="/admin/samagri" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}>
        <span className="s-icon">🔥</span>Pooja Samagri
      </NavLink>
      <NavLink to="/admin/temples" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}>
        <span className="s-icon">🛕</span>Temple Mgmt
      </NavLink>
      {adminRole === "superadmin" && (
        <>
          <div className="s-div" />
          <div className="s-section-title">SYSTEM</div>
          <NavLink to="/admin/settings" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}>
            <span className="s-icon">🛡️</span>Platform Settings
          </NavLink>
        </>
      )}
    </div>
  );
}
