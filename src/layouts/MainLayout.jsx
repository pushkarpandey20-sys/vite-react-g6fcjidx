import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppCtx';
import { Toast, Spinner } from '../components/common/UIElements';
import { CartModal, ConfirmModal, LoginModal, UserOnboardingModal, PanditOnboardingModal, PanditModal } from '../components/modals/AllModals';

export default function MainLayout({ children, sidebar, portalLabel, portalColor }) {
  const {
    devoteeId, devoteeName, logout,
    cart, updateCartQty, cartCount, showCart, setShowCart,
    showLogin, setShowLogin, showConfirm, setShowConfirm,
    showUserOnboarding, setShowUserOnboarding, showPanditOnboarding, setShowPanditOnboarding,
    bookingDraft, confirmBooking, viewPandit, setViewPandit,
    toasts, loading, handleLogin
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [phone, setPhone] = React.useState("");
  const [regName, setRegName] = React.useState("");
  const [regCity, setRegCity] = React.useState("");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const isUser = path.startsWith('/user');
  const isPandit = path.startsWith('/pandit');

  const portalBadgeStyle = {
    padding: '3px 12px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '.5px',
    fontFamily: "'Cinzel', serif",
    background: portalColor || 'rgba(255,107,0,.18)',
    color: portalColor ? '#fff' : '#FF6B00',
    border: `1px solid ${portalColor || 'rgba(255,107,0,.35)'}`,
  };

  return (
    <div className="layout-root">
      {/* Top Nav */}
      <nav className="tnav">
        {/* Hamburger for mobile */}
        <button className="hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>

        <div className="logo" onClick={() => navigate("/")}>
          <div className="logo-icon">🕉️</div>
          <div>
            <div className="logo-name">DevSetu</div>
            <div className="logo-tagline">Vedic Ecosystem</div>
          </div>
        </div>

        {/* Portal badge instead of cross-portal tabs */}
        {portalLabel && (
          <div className="nav-portal-badge" style={portalBadgeStyle}>
            {portalLabel}
          </div>
        )}

        <div className="nav-r">
          {devoteeId && isUser && (
            <div className="icon-btn" onClick={() => setShowCart(true)}>
              🛒{cartCount > 0 && <span className="badge">{cartCount}</span>}
            </div>
          )}
          <div className="icon-btn">🔔</div>
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 6, background: "rgba(255,255,255,.07)", padding: "4px 12px", borderRadius: 20, cursor: "pointer", border: "1px solid rgba(212,160,23,.3)" }}
            onClick={() => !devoteeId && isUser && setShowLogin(true)}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: "#F0C040" }}>
              {devoteeId && isUser ? `👤 ${devoteeName}` : isPandit ? '🪔 Pandit' : isUser ? '👤 Guest / Login' : '⚙️ Admin'}
            </div>
            {devoteeId && isUser && (
              <div onClick={(e) => { e.stopPropagation(); logout(); }} style={{ fontSize: 10, color: "#FF6B00", fontWeight: 700 }}>
                Logout
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="layout" style={{display:'flex',height:'calc(100vh - 60px)',overflow:'hidden'}}>
        <div className={`sidebar-wrap ${sidebarOpen ? 'sidebar-open' : ''}`}>
          {React.cloneElement(sidebar, { onNavClick: () => setSidebarOpen(false) })}
        </div>
        <div className="content" style={{flex:1,overflowY:'auto',height:'100%'}}>
          {children}
        </div>
      </div>

      <Toast toasts={toasts} />

      {/* Modals */}
      {showCart && <CartModal onClose={() => setShowCart(false)} cart={cart} updateCartQty={updateCartQty} setShowConfirm={() => setShowConfirm(true)} devoteeId={devoteeId} setShowLogin={setShowLogin} />}
      {showConfirm && <ConfirmModal draft={bookingDraft} onCancel={() => setShowConfirm(false)} onConfirm={confirmBooking} loading={loading} />}
      {showLogin && <LoginModal phone={phone} setPhone={setPhone} regName={regName} setRegName={setRegName} regCity={regCity} setRegCity={setRegCity} onLogin={() => handleLogin(phone, regName, regCity)} onClose={() => setShowLogin(false)} />}
      {showUserOnboarding && <UserOnboardingModal name={devoteeName} onClose={() => setShowUserOnboarding(false)} />}
      {showPanditOnboarding && <PanditOnboardingModal onClose={() => setShowPanditOnboarding(false)} />}
      {viewPandit && <PanditModal pandit={viewPandit} onClose={() => setViewPandit(null)} />}
    </div>
  );
}
