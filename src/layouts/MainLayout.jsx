import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppCtx';
import { Toast } from '../components/common/UIElements';
import { CartModal, ConfirmModal, LoginModal, AdminLoginModal, UserOnboardingModal, PanditOnboardingModal, PanditModal, BookingSuccessModal } from '../components/modals/AllModals';
import { BhaktiGoLogo } from '../components/common/Logo';
import NotificationBell from '../components/NotificationBell';
import PWAInstallBanner from '../components/PWAInstallBanner';
import { IconMenu, IconShoppingBag, IconLogout, IconUser } from '../components/icons/Icons';

export default function MainLayout({ children, sidebar, portalLabel, portalColor }) {
  const {
    devoteeId, devoteeName, logout,
    cart, updateCartQty, cartCount, showCart, setShowCart,
    showLogin, setShowLogin, showConfirm, setShowConfirm,
    showSuccess, setShowSuccess, lastBooking,
    showAdminLogin, setShowAdminLogin,
    showUserOnboarding, setShowUserOnboarding, showPanditOnboarding, setShowPanditOnboarding,
    bookingDraft, confirmBooking, viewPandit, setViewPandit,
    toasts, loading, loginAdmin, loginAdminDemo, loginDevoteeDemo, setActivePage
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const isUser = path.startsWith('/user');
  const isPandit = path.startsWith('/pandit');

  return (
    <div className="layout-root">
      {/* Top Nav */}
      <nav className="tnav" style={{ background: '#1a0a00', borderBottom: '1.5px solid rgba(212,160,23,0.2)' }}>
        <button className="hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu" style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconMenu size={22} color="#F0C040" />
        </button>
        <div className="logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
          <BhaktiGoLogo size={28} />
        </div>

        {/* Portal badge — scale down on small screens */}
        {portalLabel && (
          <div className="nav-portal-badge" style={{ padding: '3px 8px', borderRadius: 20, fontSize: 9, fontWeight: 800, letterSpacing: '.5px', fontFamily: "'Cinzel', serif", background: `${portalColor}22`, color: portalColor, border: `1px solid ${portalColor}55`, whiteSpace: 'nowrap' }}>
            {portalLabel}
          </div>
        )}
        <div className="nav-r" style={{ gap: window.innerWidth < 480 ? 8 : 12 }}>
          {/* Test Login — hide on small screens to save space */}
          {isUser && !devoteeId && window.innerWidth > 500 && (
            <button className="nav-test-login" onClick={() => loginDevoteeDemo && loginDevoteeDemo('Test User')}
              style={{ background:'linear-gradient(135deg,#7c3aed,#5b21b6)', color:'#fff', border:'none', borderRadius:20, padding:'5px 10px', fontWeight:800, cursor:'pointer', fontSize:10, fontFamily:'Nunito,sans-serif', display:'flex', alignItems:'center', gap:3, whiteSpace:'nowrap' }}
              title="Bypass login for testing">
              ⚡ Login
            </button>
          )}
          {isUser && (
            <div className="icon-btn" onClick={() => setShowCart(true)} style={{ width: window.innerWidth < 480 ? 34 : 38, height: window.innerWidth < 480 ? 34 : 38 }}>
              <IconShoppingBag size={window.innerWidth < 480 ? 18 : 20} color="#FF6B00" />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </div>
          )}
          <NotificationBell size={window.innerWidth < 480 ? 24 : 28} />
          {/* User pill — compact on mobile */}
          <div className="nav-user-pill"
            style={{ 
              display: "flex", alignItems: "center", gap: 6, marginLeft: 2, 
              background: "rgba(61,31,0,0.6)", padding: window.innerWidth < 480 ? "5px 10px" : "6px 14px", 
              borderRadius: 20, cursor: "pointer", border: "1.5px solid rgba(255,107,0,0.25)", 
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)', maxWidth: window.innerWidth < 480 ? 70 : 140, overflow: 'hidden' 
            }}
            onClick={() => isUser && !devoteeId && setShowLogin(true)}>
            <div style={{ fontSize: window.innerWidth < 480 ? 11 : 12, fontWeight: 900, color: "#F0C040", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 4 }}>
              {devoteeId && isUser ? <><IconUser size={14} color="#F0C040" /> {window.innerWidth < 480 ? devoteeName.split(' ')[0][0] : devoteeName.split(' ')[0]}</> : isPandit ? '🪔' : isUser ? <><IconUser size={14} color="#F0C040" /> {window.innerWidth < 480 ? 'L' : 'Login'}</> : '⚙️'}
            </div>
            {devoteeId && isUser && window.innerWidth > 480 && (
              <div onClick={e => { e.stopPropagation(); logout(); }} style={{ fontSize: 10, color: "#FF6B00", fontWeight: 800, flexShrink: 0, padding: '2px 6px', background: 'rgba(255,107,0,0.08)', borderRadius: 8, marginLeft: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconLogout size={12} color="#FF6B00" /> Out
              </div>
            )}
          </div>
        </div>
      </nav>


      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="layout">
        <div className={`sidebar-wrap ${sidebarOpen ? 'sidebar-open' : ''}`}>
          {React.cloneElement(sidebar, { onNavClick: () => setSidebarOpen(false) })}
        </div>
        <div className="content" id="main-content">
          {children}
        </div>
      </div>

      <Toast toasts={toasts} />
      <PWAInstallBanner />

      {showCart && <CartModal onClose={() => setShowCart(false)} cart={cart} updateCartQty={updateCartQty} setShowConfirm={() => setShowConfirm(true)} devoteeId={devoteeId} setShowLogin={setShowLogin} />}
      {showConfirm && <ConfirmModal draft={bookingDraft} onCancel={() => setShowConfirm(false)} onConfirm={confirmBooking} loading={loading} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showAdminLogin && <AdminLoginModal onClose={() => setShowAdminLogin(false)} loginAdmin={loginAdmin} loginAdminDemo={loginAdminDemo} />}
      {showUserOnboarding && <UserOnboardingModal name={devoteeName} onClose={() => setShowUserOnboarding(false)} />}
      {showPanditOnboarding && <PanditOnboardingModal onClose={() => setShowPanditOnboarding(false)} />}
      {showSuccess && <BookingSuccessModal booking={lastBooking} onClose={() => { setShowSuccess(false); setActivePage("history"); navigate("/user/history"); }} />}
      {viewPandit && <PanditModal pandit={viewPandit} onClose={() => setViewPandit(null)} />}
    </div>
  );
}
