import React from 'react';
import { supabase } from '../../services/supabase';

/* ─── CART MODAL ─────────────────────────────────────── */
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
        {cart.length > 0 && (
          <div className="modal-foot">
            <div style={{ flex: 1, fontWeight: 800, fontSize: 16 }}>Total: ₹{tot}</div>
            <button className="btn btn-primary" onClick={() => {
              if (!devoteeId) { setShowLogin(true); } else { setShowConfirm(true); onClose(); }
            }}>Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── CONFIRM MODAL ──────────────────────────────────── */
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
              <div>📅 <b>{draft?.date}</b></div><div>⏰ <b>{draft?.time}</b></div>
              <div style={{ gridColumn: "1/-1" }}>📍 {draft?.address}</div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,107,0,.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>Total Dakshina</span>
              <span style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 900, color: "var(--s)" }}>₹{draft?.amount?.toLocaleString()}</span>
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

/* ─── LOGIN MODAL (OTP) ──────────────────────────────── */
export function LoginModal({ onClose }) {
  const [phone, setPhone] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [step, setStep] = React.useState('phone');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSendOTP = async () => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length !== 10) return setError('Enter a valid 10-digit mobile number');
    setLoading(true); setError('');
    try {
      const { error: e } = await supabase.auth.signInWithOtp({ phone: '+91' + clean });
      if (e) throw e;
      setStep('otp');
    } catch (e) {
      setError(e.message || 'Failed to send OTP. Please try again.');
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return setError('Enter the 6-digit OTP');
    setLoading(true); setError('');
    try {
      const clean = phone.replace(/\D/g, '');
      const { error: e } = await supabase.auth.verifyOtp({ phone: '+91' + clean, token: otp, type: 'sms' });
      if (e) throw e;
      onClose();
    } catch (e) {
      setError(e.message || 'Invalid OTP. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">🕉️ Welcome to DevSetu</div>
          <div className="modal-sub">Your digital bridge to Vedic services</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {step === 'phone' ? (
            <>
              <div className="fg" style={{ marginBottom: 20 }}>
                <label className="fl">Mobile Number</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ padding: '10px 14px', background: '#f5efe8', border: '1.5px solid rgba(212,160,23,.22)', borderRadius: 11, fontWeight: 700, color: '#5C3317', fontSize: 13 }}>+91</span>
                  <input className="fi" placeholder="10-digit mobile" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} style={{ flex: 1 }} />
                </div>
              </div>
              {error && <div style={{ color: '#C0392B', fontSize: 12, marginBottom: 12 }}>{error}</div>}
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleSendOTP} disabled={loading}>
                {loading ? "Sending OTP..." : "📱 Send OTP"}
              </button>
              <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: '#8B6347' }}>
                You'll receive a 6-digit code via SMS
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#8B6347", marginBottom: 16 }}>
                  Enter the 6-digit code sent to <b>+91 {phone}</b>
                </div>
                <input
                  className="fi"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  style={{ textAlign: 'center', fontSize: 22, letterSpacing: 8, fontWeight: 700 }}
                />
              </div>
              {error && <div style={{ color: '#C0392B', fontSize: 12, marginBottom: 12, textAlign: 'center' }}>{error}</div>}
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleVerifyOTP} disabled={loading}>
                {loading ? "Verifying..." : "✓ Verify & Continue"}
              </button>
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={() => { setStep('phone'); setOtp(''); setError(''); }}>
                ← Change Number
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── ADMIN LOGIN MODAL ──────────────────────────────── */
export function AdminLoginModal({ onClose, loginAdmin, loginAdminDemo }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleLogin = async () => {
    if (!email || !password) return setError('Enter email and password');
    setLoading(true); setError('');
    try {
      await loginAdmin(email, password);
      onClose();
    } catch (e) {
      setError(e.message || 'Login failed. Check credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="modal-head">
          <div className="modal-title">🛡️ Admin Login</div>
          <div className="modal-sub">DevSetu Platform Management</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="fg" style={{ marginBottom: 14 }}>
            <label className="fl">Email</label>
            <input className="fi" type="email" placeholder="admin@devsetu.app" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="fg" style={{ marginBottom: 20 }}>
            <label className="fl">Password</label>
            <input className="fi" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          {error && <div style={{ color: '#C0392B', fontSize: 12, marginBottom: 12 }}>{error}</div>}
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", background: 'linear-gradient(135deg,#2980B9,#3498db)' }}
            onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "🔐 Sign In"}
          </button>
          <div style={{ textAlign: 'center', margin: '16px 0 4px', fontSize: 12, color: '#8B6347' }}>— or demo access —</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['viewer', 'manager', 'superadmin'].map(r => (
              <button key={r} className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => { loginAdminDemo(r); onClose(); }}>
                {r === 'superadmin' ? '👑' : r === 'manager' ? '⚙️' : '👁️'} {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ONBOARDING MODALS ──────────────────────────────── */
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
      <div className="modal" style={{ maxWidth: 440 }}>
        <div className="modal-body" style={{ textAlign: "center", padding: "40px 30px" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🪔</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, fontWeight: 700, color: "#D4A017", marginBottom: 8 }}>Sacred Scholar Gateway</div>
          <div style={{ color: "#8B6347", lineHeight: 1.6, marginBottom: 24 }}>Please complete your pandit profile to start receiving booking requests from devotees.</div>
          <button className="btn btn-gold" onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>Complete Profile 📜</button>
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
          <div className="modal-sub">{pandit.specialization || pandit.speciality} · {pandit.years_of_experience || pandit.experience_years || pandit.experience} yrs Experience</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 14, color: "#8B6347", fontStyle: "italic", marginBottom: 15 }}>"Dedicated Vedic scholar performing sacred rituals with strict adherence to Shastras."</p>
          <div className="sg3 stat-grid" style={{ marginBottom: 15 }}>
            <div className="card card-p" style={{ textAlign: "center" }}><div style={{ fontWeight: 800 }}>{pandit.rating} ★</div><div style={{ fontSize: 10 }}>Rating</div></div>
            <div className="card card-p" style={{ textAlign: "center" }}><div style={{ fontWeight: 800 }}>{pandit.review_count || 0}</div><div style={{ fontSize: 10 }}>Reviews</div></div>
            <div className="card card-p" style={{ textAlign: "center" }}><div style={{ fontWeight: 800 }}>₹{pandit.price?.toLocaleString() || '–'}</div><div style={{ fontSize: 10 }}>Per Pooja</div></div>
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
