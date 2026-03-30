import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useApp } from '../../store/AppCtx';

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
      <div className="modal" style={{ maxWidth: 480 }}>
        <div className="modal-head">
          <div className="modal-title">🙏 Confirm Booking</div>
          <div className="modal-sub">Review your sacred service details</div>
        </div>
        <div className="modal-body">
          <div className="card card-p" style={{ background: "rgba(255,107,0,.04)", border: "1.5px dashed var(--s)", marginBottom: 15 }}>
            <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
              <div style={{ fontSize: 32 }}>{draft?.ritualIcon}</div>
              <div><div style={{ fontWeight: 800, fontSize: 16 }}>{draft?.ritual}</div><div style={{ fontSize: 12, color: "#8B6347" }}>with {draft?.panditName}</div></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12 }}>
              <div>📅 <b>{draft?.date}</b></div><div>⏰ <b>{draft?.time}</b></div>
              <div style={{ gridColumn: "1/-1" }}>📍 {draft?.address}</div>
            </div>
            {draft?.addSamagri && (
              <div style={{ marginTop: 8, fontSize: 11, color: "#FF6B00", fontWeight: 700 }}>📦 Includes Pooja Samagri Kit</div>
            )}
          </div>

          {draft?.sankalp && (
            <div className="card card-p" style={{ padding: 12, border: "1px solid #eee", fontSize: 12 }}>
              <div style={{ fontWeight: 800, marginBottom: 6, fontSize: 11, textTransform: "uppercase", color: "#8B6347" }}>Sankalp Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 10px" }}>
                <div>Devotee: <b>{draft.sankalp.devotee_name}</b></div>
                <div>Gotra: <b>{draft.sankalp.gotra || 'N/A'}</b></div>
                <div style={{ gridColumn: "1/-1" }}>Purpose: <b>{draft.sankalp.purpose_of_puja || 'Sacred Ritual'}</b></div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,107,0,.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700 }}>Total Dakshina</span>
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 900, color: "var(--s)" }}>₹{draft?.amount?.toLocaleString()}</span>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={() => {
            // Mocking Razorpay success
            const mockPayment = {
              razorpay_payment_id: "pay_" + Math.random().toString(36).substring(7),
              razorpay_order_id: "order_" + Math.random().toString(36).substring(7),
              razorpay_signature: "sig_" + Math.random().toString(36).substring(7)
            };
            onConfirm(mockPayment);
          }} disabled={loading}>
            {loading ? <span className="spinner-sm" /> : "🪙 Pay & Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── SUCCESS MODAL ──────────────────────────────────── */
export function BookingSuccessModal({ booking, onClose }) {
  return (
    <div className="overlay">
      <div className="modal" style={{ maxWidth: 440, textAlign: "center" }}>
        <div className="modal-body" style={{ padding: "40px 30px" }}>
          <div style={{ fontSize: 60, marginBottom: 15 }}>✨</div>
          <h2 style={{ fontFamily: "'Cinzel',serif", marginBottom: 5 }}>Puja Confirmed</h2>
          <p style={{ color: "#27AE60", fontWeight: 700, marginBottom: 24 }}>Your sacred ritual has been successfully scheduled.</p>
          
          <div className="card card-p" style={{ textAlign: "left", marginBottom: 24, background: "#fdf8f4", border: "1px solid #eee" }}>
            <div style={{ fontSize: 13, marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#8B6347" }}>Booking ID:</span>
              <span style={{ fontWeight: 700 }}>#{booking?.id?.slice(0,8).toUpperCase()}</span>
            </div>
            <div style={{ display: "grid", gap: 8, fontSize: 14 }}>
              <div>🕉️ <b>{booking?.ritual}</b></div>
              <div>🙏 <b>{booking?.pandit_name}</b></div>
              <div>📅 <b>{booking?.booking_date} at {booking?.booking_time}</b></div>
              <div style={{ fontSize: 12, color: "#8B6347" }}>📍 {booking?.address}</div>
            </div>
          </div>

          <div style={{ color: "#8B6347", fontSize: 12, marginBottom: 24, lineHeight: 1.5 }}>
            A confirmation message has been sent to your email and WhatsApp. You can track your ritual status in the dashboard.
          </div>

          <button className="btn btn-primary" onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>Go to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

/* ─── RATE PANDIT MODAL ──────────────────────────────── */
export function RatePanditModal({ booking, onClose, onSubmit }) {
  const [rating, setRating] = React.useState(5);
  const [review, setReview] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(booking.id, booking.pandit_id, rating, review);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="modal" style={{ maxWidth: 400 }}>
        <div className="modal-head">
          <div className="modal-title">⭐ Rate Ritual Experience</div>
          <div className="modal-sub">How was your ritual with Pt. {booking?.pandit_name}?</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, fontSize: 32, margin: "10px 0 20px" }}>
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s} onClick={() => setRating(s)} style={{ cursor: "pointer", color: s <= rating ? "#F1C40F" : "#ddd" }}>
                {s <= rating ? '★' : '☆'}
              </span>
            ))}
          </div>
          <textarea 
            className="fta" 
            placeholder="Write a few words about your experience..." 
            value={review} 
            onChange={e => setReview(e.target.value)}
            style={{ minHeight: 100, marginBottom: 15 }}
          />
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? "Submitting..." : "Submit Review"}</button>
        </div>
      </div>
    </div>
  );
}

/* ─── LOGIN MODAL (OTP) ──────────────────────────────── */
export function LoginModal({ onClose }) {
  const { handleLogin } = useApp();
  const [phone, setPhone] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [step, setStep] = React.useState('phone');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleDemoLogin = () => {
    handleLogin(phone || '9999999999', 'DevSetu Devotee', 'Delhi');
    onClose();
  };

  const handleSendOTP = async () => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length !== 10) return setError('Enter a valid 10-digit mobile number');
    setLoading(true); setError('');
    try {
      const { error: e } = await supabase.auth.signInWithOtp({ phone: '+91' + clean });
      if (e) throw e;
      setStep('otp');
    } catch (e) {
      // Phone OTP not configured on this Supabase project — fall back to demo login
      if (e.message?.toLowerCase().includes('phone') || e.message?.toLowerCase().includes('unsupported')) {
        handleDemoLogin();
        return;
      }
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(212,160,23,0.2)' }} />
                <span style={{ color: '#9a8070', fontSize: 12 }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(212,160,23,0.2)' }} />
              </div>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={handleDemoLogin}>
                👤 Continue as Guest (Demo)
              </button>
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
  const navigate = useNavigate();
  if (!pandit) return null;
  const specs = Array.isArray(pandit.specializations) ? pandit.specializations : (pandit.tags || []);
  const handleBook = () => {
    onClose();
    navigate('/user/booking', { state: { prefilledPandit: pandit } });
  };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">{pandit.emoji || '🙏'} {pandit.name}</div>
          <div className="modal-sub">📍 {pandit.city} · {pandit.years_of_experience || pandit.experience_years || 5}+ yrs · ⭐ {pandit.rating || 4.8}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 14, color: "#8B6347", fontStyle: "italic", marginBottom: 15 }}>
            {pandit.bio || '"Dedicated Vedic scholar performing sacred rituals with strict adherence to Shastras."'}
          </p>
          <div className="sg3 stat-grid" style={{ marginBottom: 15 }}>
            <div className="card card-p" style={{ textAlign: "center" }}><div style={{ fontWeight: 800 }}>{pandit.rating || 4.8} ★</div><div style={{ fontSize: 10 }}>Rating</div></div>
            <div className="card card-p" style={{ textAlign: "center" }}><div style={{ fontWeight: 800 }}>{pandit.review_count || 0}</div><div style={{ fontSize: 10 }}>Reviews</div></div>
            <div className="card card-p" style={{ textAlign: "center" }}><div style={{ fontWeight: 800 }}>₹{(pandit.min_fee || pandit.price || 500).toLocaleString()}</div><div style={{ fontSize: 10 }}>From</div></div>
          </div>
          <h4 style={{ fontFamily: "'Cinzel',serif", fontSize: 13, marginBottom: 8 }}>Specializations</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
            {specs.slice(0, 6).map((t, i) => <span key={i} className="ptag">{t}</span>)}
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={handleBook}>⚡ Book Now</button>
        </div>
      </div>
    </div>
  );
}
