import React from 'react';

export function CartModal({ onClose, cart, updateCartQty, setShowConfirm, devoteeId, setShowLogin }) {
  const tot = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">🛒 Your Sacred Cart</div>
          <div className="modal-sub">{cart.length} items selected</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {cart.length === 0 ? <div style={{ textAlign: "center", padding: 20 }}>Your cart is empty</div> : cart.map(i => (
            <div key={i.id} className="cart-item">
              <div className="cart-icon">{i.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{i.name}</div>
                <div style={{ fontSize: 12, color: "#FF6B00", fontWeight: 700 }}>₹{i.price}</div>
              </div>
              <div className="qty-ctrl">
                <button className="qty-btn" onClick={() => updateCartQty(i.id, -1)}>−</button>
                <div className="qty-num">{i.qty}</div>
                <button className="qty-btn" onClick={() => updateCartQty(i.id, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && <div className="modal-foot">
          <div style={{ flex: 1, fontWeight: 800, fontSize: 16 }}>Total: ₹{tot}</div>
          <button className="btn btn-primary" onClick={() => { 
            if (!devoteeId) { setShowLogin(true); } else { setShowConfirm(true); onClose(); }
          }}>Checkout</button>
        </div>}
      </div>
    </div>
  );
}

export function ConfirmModal({ draft, onCancel, onConfirm, loading }) {
  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">🙏 Confirm Booking</div>
          <div className="modal-sub">Final step before connecting with the divine</div>
        </div>
        <div className="modal-body">
          <div className="card card-p" style={{ background: "rgba(255,107,0,.04)", border: "1.5px dashed var(--s)" }}>
            <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
              <div style={{ fontSize: 32 }}>{draft?.ritualIcon}</div>
              <div><div style={{ fontWeight: 800, fontSize: 16 }}>{draft?.ritual}</div><div style={{ fontSize: 12, color: "#8B6347" }}>with {draft?.panditName}</div></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12 }}>
              <div>📅 <b>{draft?.date}</b></div><div>⏰ <b>{draft?.time}</b></div><div style={{ gridColumn: "1/-1" }}>📍 {draft?.address}</div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,107,0,.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>Total Dakshina</span><span style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 900, color: "var(--s)" }}>₹{draft?.amount?.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={onCancel}>Edit Details</button>
          <button className="btn btn-primary" onClick={onConfirm} disabled={loading}>{loading ? "Processing..." : "Confirm & Pay"}</button>
        </div>
      </div>
    </div>
  );
}

export function LoginModal({ phone, setPhone, regName, setRegName, regCity, setRegCity, onLogin, onClose }) {
  const [otp, setOtp] = React.useState(false);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">🕉️ Welcome to DevSetu</div>
          <div className="modal-sub">Your digital bridge to Vedic services</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {!otp ? (<>
            <div className="fg" style={{ marginBottom: 16 }}><label className="fl">Mobile Number</label><input className="fi" placeholder="+91 00000 00000" value={phone} onChange={e => setPhone(e.target.value)} /></div>
            <div className="fg" style={{ marginBottom: 16 }}><label className="fl">Full Name</label><input className="fi" placeholder="How should we call you?" value={regName} onChange={e => setRegName(e.target.value)} /></div>
            <div className="fg" style={{ marginBottom: 20 }}><label className="fl">City</label><input className="fi" placeholder="Your current city" value={regCity} onChange={e => setRegCity(e.target.value)} /></div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setOtp(true)}>Send OTP</button>
          </>) : (<>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#8B6347" }}>Enter 4-digit code sent to<br /><b>{phone}</b></div>
              <div className="otp-wrap">{[1, 2, 3, 4].map(i => <input key={i} className="otp-d" maxLength="1" />)}</div>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={onLogin}>Verify & Continue</button>
          </>)}
        </div>
      </div>
    </div>
  );
}

export function UserOnboardingModal({ onClose, name }) {
  return (
    <div className="overlay">
      <div className="modal" style={{ maxWidth: 440 }}>
        <div className="modal-body" style={{ textAlign: "center", padding: "40px 30px" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✨</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 24, fontWeight: 700, color: "#2C1A0E", marginBottom: 8 }}>Vande Mataram!</div>
          <div style={{ color: "#8B6347", lineHeight: 1.6, marginBottom: 24 }}>Welcome <b>{name}</b>! Your spiritual journey with DevSetu begins now. Access verified pandits, sacred rituals, and auspicious timings in one place.</div>
          <button className="btn btn-primary" onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>Let's Start 🙏</button>
        </div>
      </div>
    </div>
  );
}

export function PanditOnboardingModal({ onClose }) {
  return (
    <div className="overlay">
      <div className="modal" style={{ maxWidth: 800 }}>
        <div className="modal-head">
          <div className="modal-title">📜 Pandit Onboarding (KYC)</div>
          <div className="modal-sub">Complete your profile to join our sacred network</div>
        </div>
        <div className="modal-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div className="fg"><label className="fl">Full Legal Name</label><input className="fi" value="Pt. Ramesh Sharma" /></div>
            <div className="fg"><label className="fl">Father's Name (Gurudeva)</label><input className="fi" value="Pt. Harish Sharma" /></div>
            <div className="fg"><label className="fl">Education (Ved Pathshala)</label><input className="fi" value="Sampurnanand Sanskrit University" /></div>
            <div className="fg"><label className="fl">Degrees/Certification</label><input className="fi" value="Acharya in Shukla Yajurveda" /></div>
            <div className="fg"><label className="fl">Speciality</label><input className="fi" value="Vivah, Shanti Paath, Rudrabhishek" /></div>
            <div className="fg"><label className="fl">Experience (Years)</label><input className="fi" value="15" /></div>
            <div className="fg" style={{ gridColumn: "1/-1" }}><label className="fl">Official Address</label><input className="fi" value="12/A, Hanuman Mandir Gali, Banaras" /></div>
            <div className="ffw"><div className="upz">📤 <b>Upload Aadhar/ID</b><p style={{ fontSize: 11, color: "#95A5A6" }}>Document required for verification</p></div></div>
            <div className="ffw"><div className="upz">📤 <b>Upload Educational Degree</b><p style={{ fontSize: 11, color: "#95A5A6" }}>Upload scan copy of your Ved/Acharya certificate</p></div></div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-primary" onClick={onClose}>Submit for Verification</button>
        </div>
      </div>
    </div>
  );
}

export function PanditModal({ pandit, onClose }) {
  if (!pandit) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">{pandit.emoji} {pandit.name}</div>
          <div className="modal-sub">{pandit.speciality} · {pandit.experience_years} yrs Experience</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 14, color: "#8B6347", fontStyle: "italic", marginBottom: 15 }}>"Dedicated Vedic scholar performing sacred rituals with strict adherence to Shastras."</p>
          <div className="sg3 stat-grid" style={{ marginBottom: 15 }}>
            <div className="card card-p" style={{ textAlign: "center" }}><div style={{ fontWeight: 800 }}>{pandit.rating} ★</div><div style={{ fontSize: 10 }}>Rating</div></div>
            <div className="card card-p" style={{ textAlign: "center" }}><div style={{ fontWeight: 800 }}>{pandit.review_count}</div><div style={{ fontSize: 10 }}>Reviews</div></div>
            <div className="card card-p" style={{ textAlign: "center" }}><div style={{ fontWeight: 800 }}>1.2k+</div><div style={{ fontSize: 10 }}>Poojas Done</div></div>
          </div>
          <h4 style={{ fontFamily: "'Cinzel',serif", fontSize: 13, marginBottom: 8 }}>Available Rituals</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {(pandit.tags || []).map((t, i) => <span key={i} className="ptag">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
