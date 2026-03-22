import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppCtx';
import { Toast, Spinner } from '../components/common/UIElements';
import { CartModal, ConfirmModal, LoginModal, UserOnboardingModal, PanditOnboardingModal, PanditModal } from '../components/modals/AllModals';

export default function MainLayout({ children, sidebar }) {
  const { 
    devoteeId, devoteeName, devoteeCity, logout,
    cart, updateCartQty, cartCount, showCart, setShowCart,
    showLogin, setShowLogin, showConfirm, setShowConfirm,
    showUserOnboarding, setShowUserOnboarding, showPanditOnboarding, setShowPanditOnboarding,
    bookingDraft, confirmBooking, viewPandit, setViewPandit,
    toasts, loading, handleLogin, adminRole
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [phone, setPhone] = React.useState("");
  const [regName, setRegName] = React.useState("");
  const [regCity, setRegCity] = React.useState("");

  return (
    <div className="layout-root">
      {/* Top Nav */}
      <nav className="tnav">
        <div className="logo" onClick={() => navigate("/")}>
          <div className="logo-icon">🕉️</div>
          <div><div className="logo-name">DevSetu</div><div className="logo-tagline">Vedic Ecosystem</div></div>
        </div>
        <div className="nav-tabs">
          <button className={`ntab ${path.startsWith('/user') ? 'active' : ''}`} onClick={() => navigate('/user')}>Devotee</button>
          <button className={`ntab ${path.startsWith('/pandit') ? 'active' : ''}`} onClick={() => navigate('/pandit')}>Pandit</button>
          <button className={`ntab ${path.startsWith('/admin') ? 'active' : ''}`} onClick={() => navigate('/admin')}>Admin</button>
        </div>
        <div className="nav-r">
          {devoteeId && path.startsWith("/user") && (
            <div className="icon-btn" onClick={() => setShowCart(true)}>🛒{cartCount > 0 && <span className="badge">{cartCount}</span>}</div>
          )}
          <div className="icon-btn">🔔</div>
          <div 
            style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 10, background: "rgba(255,255,255,.07)", padding: "4px 12px", borderRadius: 20, cursor: "pointer", border: "1px solid rgba(212,160,23,.3)" }}
            onClick={() => !devoteeId && setShowLogin(true)}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: "#F0C040" }}>
              {devoteeId ? `👤 ${devoteeName}` : "👤 Guest / Login"}
            </div>
            {devoteeId && <div onClick={(e) => { e.stopPropagation(); logout(); }} style={{ fontSize: 10, color: "#FF6B00", fontWeight: 700 }}>Logout</div>}
          </div>
        </div>
      </nav>

      <div className="layout">
        {sidebar}
        <div className="content">
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
