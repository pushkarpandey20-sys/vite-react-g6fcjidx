import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppCtx';

export function UserSidebar({ onNavClick }) {
  const { devoteeId, setShowLogin } = useApp();
  const navigate = useNavigate();

  const handleProtectedNav = (e, path) => {
    const isProtected = path.includes('booking') || path.includes('history');
    if (isProtected && !devoteeId) {
      e.preventDefault();
      setShowLogin(true);
    }
    onNavClick?.();
  };

  const handleNav = () => onNavClick?.();

  return (
    <div className="sidebar">
      <div className="s-section-title">SACRED SERVICES</div>
      <NavLink to="/user/home" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}><span className="s-icon">🕉️</span>Dashboard</NavLink>
      <NavLink to="/user/muhurta" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}><span className="s-icon">📅</span>Panchang</NavLink>
      <NavLink to="/user/rituals" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}><span className="s-icon">📚</span>Explore Rituals</NavLink>
      <NavLink to="/user/marketplace" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}><span className="s-icon">🔍</span>Find Pandits</NavLink>
      <NavLink to="/user/booking" onClick={(e) => handleProtectedNav(e, '/user/booking')} className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`}><span className="s-icon">📜</span>Book Now</NavLink>
      <NavLink to="/user/history" onClick={(e) => handleProtectedNav(e, '/user/history')} className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`}><span className="s-icon">📋</span>My Bookings</NavLink>
      <div className="s-div" />
      <div className="s-section-title">COMMUNITY</div>
      <NavLink to="/user/temples" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}><span className="s-icon">🛕</span>Temples</NavLink>
      <NavLink to="/user/samagri" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}><span className="s-icon">📦</span>Buy Samagri</NavLink>
      <NavLink to="/user/donations" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}><span className="s-icon">🙏</span>Seva/Donations</NavLink>
    </div>
  );
}

export function PanditSidebar({ onNavClick }) {
  const { panditId, setShowPanditOnboarding } = useApp();

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
      <NavLink to="/pandit/dashboard" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}><span className="s-icon">🏛️</span>Dashboard</NavLink>
      <NavLink to="/pandit/requests" onClick={handleProtectedNav} className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`}><span className="s-icon">📬</span>All Requests</NavLink>
      <NavLink to="/pandit/history" onClick={handleProtectedNav} className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`}><span className="s-icon">📅</span>Booking Log</NavLink>
      <div className="s-div" />
      <div className="s-section-title">MY PROFILE</div>
      <NavLink to="/pandit/profile" onClick={handleProtectedNav} className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`}><span className="s-icon">👤</span>Edit Profile</NavLink>
      <NavLink to="/pandit/earnings" onClick={handleProtectedNav} className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`}><span className="s-icon">💰</span>Earnings</NavLink>
      <NavLink to="/pandit/schedule" onClick={handleProtectedNav} className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`}><span className="s-icon">⏰</span>Availability</NavLink>
    </div>
  );
}

export function AdminSidebar({ onNavClick }) {
  const { adminRole } = useApp();
  const handleNav = () => onNavClick?.();

  return (
    <div className="sidebar">
      <div className="s-section-title">NETWORK OPS</div>
      <NavLink to="/admin/overview" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}><span className="s-icon">📊</span>Platform Overview</NavLink>
      <NavLink to="/admin/pandits" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}><span className="s-icon">🕉️</span>Manage Pandits</NavLink>
      <NavLink to="/admin/bookings" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}><span className="s-icon">📋</span>Booking Log</NavLink>
      <div className="s-div" />
      <div className="s-section-title">INVENTORY</div>
      <NavLink to="/admin/rituals" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}><span className="s-icon">📿</span>Rituals Catalog</NavLink>
      <NavLink to="/admin/samagri" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}><span className="s-icon">📦</span>Pooja Samagri</NavLink>
      <NavLink to="/admin/temples" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}><span className="s-icon">🛕</span>Temple Mgmt</NavLink>
      {adminRole === "superadmin" && (
        <>
          <div className="s-div" />
          <div className="s-section-title">SYSTEM</div>
          <NavLink to="/admin/settings" className={({ isActive }) => `s-item ${isActive ? 'active' : ''}`} onClick={handleNav}><span className="s-icon">🛡️</span>Platform Settings</NavLink>
        </>
      )}
    </div>
  );
}
