import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PortalSelector() {
  const navigate = useNavigate();
  return (
    <div className="portal-land">
      <div className="logo" style={{ marginBottom: 40, transform: "scale(1.5)" }}>
        <div className="logo-icon">🕉️</div>
        <div><div className="logo-name">BhaktiGo</div><div className="logo-tagline">Vedic Ecosystem</div></div>
      </div>
      <h2 style={{ fontFamily: "'Cinzel',serif", color: "#F0C040", fontSize: 28, marginBottom: 12 }}>Choose Your Portal</h2>
      <p style={{ color: "rgba(255,248,240,.6)", fontFamily: "'Crimson Pro',serif", fontStyle: "italic", marginBottom: 30 }}>Connecting the physical world with the divine digital bridge</p>
      <div className="portal-grid">
        <div className="portal-card" onClick={() => navigate("/user")}>
          <div className="portal-card-icon">🙏</div>
          <div className="portal-card-title">Devotee</div>
          <p className="portal-card-desc">Book Pandits, Pooja Samagri, and explore sacred temples across India.</p>
        </div>
        <div className="portal-card" onClick={() => navigate("/pandit")}>
          <div className="portal-card-icon">📜</div>
          <div className="portal-card-title">Pandit</div>
          <p className="portal-card-desc">Manage your bookings, earnings, and availability in the sacred network.</p>
        </div>
        <div className="portal-card" onClick={() => navigate("/admin")}>
          <div className="portal-card-icon">🛡️</div>
          <div className="portal-card-title">Network Admin</div>
          <p className="portal-card-desc">Manage users, approve pandits, and monitor platform-wide transactions.</p>
        </div>
      </div>
      <div style={{ marginTop: 60, color: "rgba(255,248,240,0.3)", fontSize: 12, letterSpacing: 1 }}>BHAKTIGO DIGITAL ECOSYSTEM &copy; 2026</div>
    </div>
  );
}

