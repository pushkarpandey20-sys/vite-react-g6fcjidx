import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppCtx';

const tabs = [
  { to: '/user/home', icon: '🏠', label: 'Home' },
  { to: '/user/booking', icon: '📿', label: 'Book' },
  { to: '/user/marketplace', icon: '🕉️', label: 'Pandits' },
  { to: '/user/history', icon: '📋', label: 'History' },
];

export default function MobileNav() {
  const { devoteeId, setShowLogin } = useApp();
  const navigate = useNavigate();

  const handleTab = (e, to) => {
    if (!devoteeId && (to.includes('history') || to.includes('booking'))) {
      e.preventDefault();
      setShowLogin(true);
    }
  };

  return (
    <nav className="mobile-bottom-nav">
      {tabs.map(t => (
        <NavLink
          key={t.to}
          to={t.to}
          onClick={e => handleTab(e, t.to)}
          className={({ isActive }) => `mbn-tab ${isActive ? 'mbn-active' : ''}`}
        >
          <span className="mbn-icon">{t.icon}</span>
          <span className="mbn-label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
