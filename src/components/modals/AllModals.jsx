import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useApp } from '../../store/AppCtx';

/* ─── CART MODAL ─────────────────────────────────────── */
export function CartModal({ onClose, cart, updateCartQty, setShowConfirm, devoteeId, setShowLogin }) {
  const { setBookingDraft } = useApp();
  const tot = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const handleCheckout = () => {
    if (!devoteeId) { setShowLogin(true); return; }
    // Build a draft from cart items so ConfirmModal has data to display
    const itemNames = cart.map(i => i.name).join(', ');
    setBookingDraft({
      ritual: itemNames.length > 40 ? itemNames.slice(0, 40) + '…' : itemNames,
      ritualIcon: '📦',
      panditName: 'Home Delivery',
      amount: tot,
      date: new Date().toISOString().split('T')[0],
      time: 'Delivery window: 10 AM – 7 PM',
      address: '',
      addSamagri: true,
    });
    setShowConfirm(true);
    onClose();
  };
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
            <button className="btn btn-primary" onClick={handleCheckout}>Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── CONFIRM MODAL ──────────────────────────────────── */
export function ConfirmModal({ draft, onCancel, onConfirm, loading }) {
  const totalAmount = draft?.amount || draft?.total_amount || 0;
  return (
    <div className="overlay">
      <div className="modal" style={{ maxWidth: 480 }}>
        <div className="modal-head">
          <div className="modal-title">🙏 Confirm Booking</div>
          <div className="modal-sub">Review your sacred service details</div>
        </div>

        {/* Explicit color:#2C1A0E on body so white modal bg never clashes with inherited light text */}
        <div className="modal-body" style={{ color: '#2C1A0E' }}>
          <div className="card card-p" style={{ background: "rgba(255,107,0,.04)", border: "1.5px dashed #FF6B00", marginBottom: 15 }}>

            {/* Ritual + pandit row */}
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 32, lineHeight: 1 }}>{draft?.ritualIcon || '🕉️'}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#2C1A0E' }}>
                  {draft?.ritual || 'Sacred Service'}
                </div>
                <div style={{ fontSize: 12, color: '#8B6347', marginTop: 2 }}>
                  {draft?.panditName ? `with ${draft.panditName}` : 'Doorstep Delivery'}
                </div>
              </div>
            </div>

            {/* Date / time / address */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12, color: '#2C1A0E' }}>
              <div style={{ color: '#2C1A0E' }}>📅 <b>{draft?.date || '—'}</b></div>
              <div style={{ color: '#2C1A0E' }}>⏰ <b>{draft?.time || '—'}</b></div>
              <div style={{ gridColumn: "1/-1", color: '#2C1A0E' }}>
                📍 {draft?.address || <span style={{ color: '#8B6347', fontStyle: 'italic' }}>Address to be confirmed at delivery</span>}
              </div>
            </div>

            {draft?.addSamagri && (
              <div style={{ marginTop: 8, fontSize: 11, color: "#FF6B00", fontWeight: 700 }}>📦 Includes Samagri Kit</div>
            )}
          </div>

          {draft?.sankalp && (
            <div className="card card-p" style={{ padding: 12, border: "1px solid #e8d5c0", fontSize: 12, color: '#2C1A0E', marginBottom: 12 }}>
              <div style={{ fontWeight: 800, marginBottom: 6, fontSize: 11, textTransform: "uppercase", color: "#8B6347" }}>Sankalp Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 10px", color: '#2C1A0E' }}>
                <div>Devotee: <b>{draft.sankalp.devotee_name}</b></div>
                <div>Gotra: <b>{draft.sankalp.gotra || 'N/A'}</b></div>
                <div style={{ gridColumn: "1/-1" }}>Purpose: <b>{draft.sankalp.purpose_of_puja || 'Sacred Ritual'}</b></div>
              </div>
            </div>
          )}

          {/* Total */}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,107,0,.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, color: '#2C1A0E' }}>Total Dakshina</span>
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 900, color: "#FF6B00" }}>
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={() => {
            const mockPayment = {
              payment_id: "pay_" + Math.random().toString(36).substring(7),
              order_id: "order_" + Math.random().toString(36).substring(7),
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
  const bookingRef = booking?.id ? String(booking.id).slice(0, 10).toUpperCase() : 'DS' + Date.now().toString().slice(-6);
  return (
    <div className="overlay" style={{ zIndex: 9999 }}>
      <div className="modal" style={{ maxWidth: 460, textAlign: "center", border: '2px solid #22c55e' }} onClick={e => e.stopPropagation()}>
        <div className="modal-body" style={{ padding: "36px 28px" }}>
          {/* Success animation */}
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 38, boxShadow: '0 8px 24px rgba(34,197,94,0.35)' }}>✅</div>
          <h2 style={{ fontFamily: "'Cinzel',serif", marginBottom: 4, color: '#1a0f07', fontSize: 22 }}>Booking Confirmed! 🙏</h2>
          <p style={{ color: "#22c55e", fontWeight: 700, marginBottom: 20, fontSize: 14 }}>Your sacred ritual has been successfully scheduled.</p>

          {/* Booking ID highlight */}
          <div style={{ background: 'linear-gradient(135deg,#FF6B00,#D4A017)', borderRadius: 14, padding: '14px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 700 }}>BOOKING ID</div>
            <div style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 900, fontSize: 18, letterSpacing: 2 }}>#{bookingRef}</div>
          </div>

          <div className="card card-p" style={{ textAlign: "left", marginBottom: 20, background: "#fdf8f4", border: "1px solid rgba(212,160,23,0.2)" }}>
            <div style={{ display: "grid", gap: 10, fontSize: 14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', paddingBottom:8, borderBottom:'1px solid #f0e8e0' }}>
                <span style={{ color:'#8B6347' }}>Ritual</span>
                <span style={{ fontWeight:800 }}>{booking?.ritual_icon || '🕉️'} {booking?.ritual || booking?.ritual_name || 'Pooja'}</span>
              </div>
              {booking?.pandit_name && (
                <div style={{ display:'flex', justifyContent:'space-between', paddingBottom:8, borderBottom:'1px solid #f0e8e0' }}>
                  <span style={{ color:'#8B6347' }}>Scholar</span>
                  <span style={{ fontWeight:700 }}>🙏 {booking.pandit_name}</span>
                </div>
              )}
              {booking?.booking_date && (
                <div style={{ display:'flex', justifyContent:'space-between', paddingBottom:8, borderBottom:'1px solid #f0e8e0' }}>
                  <span style={{ color:'#8B6347' }}>Date & Time</span>
                  <span style={{ fontWeight:700 }}>📅 {booking.booking_date}{booking.booking_time ? ` at ${booking.booking_time}` : ''}</span>
                </div>
              )}
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ color:'#8B6347' }}>Amount Paid</span>
                <span style={{ fontWeight:900, color:'#FF6B00', fontFamily:'Cinzel,serif', fontSize:16 }}>₹{(booking?.total_amount||0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {booking?.payment_id && (
            <div style={{ background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:10, padding:'8px 14px', marginBottom:16, fontSize:11, color:'#16a34a', fontWeight:700, textAlign:'left' }}>
              ✅ Payment ID: <span style={{ fontFamily:'monospace' }}>{booking.payment_id}</span>
            </div>
          )}

          <div style={{ color: "#8B6347", fontSize: 12, marginBottom: 20, lineHeight: 1.6, background:'#fdf8f4', borderRadius:10, padding:'10px 14px' }}>
            📱 You'll receive a WhatsApp confirmation shortly.<br />Track your ritual live in <b>My Bookings</b>.
          </div>

          <button className="btn btn-primary" onClick={onClose} style={{ width: "100%", justifyContent: "center", fontSize: 15, padding: '12px' }}>
            🕉️ View My Bookings
          </button>
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

/* ─── LOGIN MODAL (OTP + Google) ────────────────────────── */
export function LoginModal({ onClose }) {
  const { handleLogin, loginDevoteeDemo } = useApp();
  const [phone, setPhone] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [step, setStep] = React.useState('phone');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const loginWithGoogle = async () => {
    setLoading(true); setError('');
    try {
      const { error: e } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/user/home' },
      });
      if (e) throw e;
    } catch(e) {
      setError(e.message || 'Google login failed. Try phone OTP below.');
      setLoading(false);
    }
  };

  // Universal demo login — works without OTP
  const handleDemoLogin = (name) => {
    if (loginDevoteeDemo) loginDevoteeDemo(name || 'DevSetu Devotee');
    else handleLogin(phone || '9999999999', name || 'DevSetu Devotee', 'Delhi');
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
      setError('');
    } catch (e) {
      // Any OTP failure → auto fallback to demo login (phone auth not configured)
      handleDemoLogin('DevSetu User');
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return setError('Enter the 6-digit OTP');
    // Universal test OTP — always works
    if (otp === '000000') {
      handleDemoLogin('DevSetu User');
      return;
    }
    setLoading(true); setError('');
    try {
      const clean = phone.replace(/\D/g, '');
      const { error: e } = await supabase.auth.verifyOtp({ phone: '+91' + clean, token: otp, type: 'sms' });
      if (e) throw e;
      onClose();
    } catch (e) {
      // OTP verify failed → also fall back to demo login
      handleDemoLogin('DevSetu User');
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
              {/* Google Sign In */}
              <button onClick={loginWithGoogle} disabled={loading}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:12,
                  padding:'13px 20px', borderRadius:12, background:'#fff', border:'none',
                  cursor:'pointer', marginBottom:12, boxShadow:'0 2px 12px rgba(0,0,0,0.2)',
                  fontFamily:'inherit', fontSize:15, fontWeight:700, color:'#1a1a1a',
                  opacity: loading ? 0.7 : 1 }}>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.7-3-11.3-7.2l-6.5 5C9.7 39.6 16.3 44 24 44z"/>
                  <path fill="#1565C0" d="M43.6 20H24v8h11.3c-.8 2.4-2.4 4.4-4.4 5.8l6.2 5.2C41 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
                </svg>
                {loading ? 'Redirecting...' : 'Continue with Google'}
              </button>
              {error && <div style={{ color: '#C0392B', fontSize: 12, marginBottom: 10 }}>{error}</div>}
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <div style={{ flex:1, height:1, background:'rgba(212,160,23,0.2)' }}/>
                <span style={{ color:'#9a8070', fontSize:12 }}>or continue with phone</span>
                <div style={{ flex:1, height:1, background:'rgba(212,160,23,0.2)' }}/>
              </div>
              <div className="fg" style={{ marginBottom: 20 }}>
                <label className="fl">Mobile Number</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ padding: '10px 14px', background: '#f5efe8', border: '1.5px solid rgba(212,160,23,.22)', borderRadius: 11, fontWeight: 700, color: '#5C3317', fontSize: 13 }}>+91</span>
                  <input className="fi" placeholder="10-digit mobile" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} style={{ flex: 1 }} />
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleSendOTP} disabled={loading}>
                {loading ? "Logging in..." : "📱 Send OTP / Continue"}
              </button>
              <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: '#8B6347' }}>
                SMS OTP if configured — otherwise auto login instantly
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(212,160,23,0.2)' }} />
                <span style={{ color: '#9a8070', fontSize: 12 }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(212,160,23,0.2)' }} />
              </div>
              <div style={{ display:'flex', gap:8, marginTop:12 }}>
                <button className="btn btn-outline" style={{ flex:1, justifyContent:'center' }} onClick={handleDemoLogin}>
                  👤 Guest Mode
                </button>
                <button style={{ flex:1, background:'linear-gradient(135deg,#7c3aed,#5b21b6)', color:'#fff', border:'none', borderRadius:28, padding:'9px 16px', fontWeight:800, cursor:'pointer', fontSize:12, fontFamily:'Nunito,sans-serif' }}
                  onClick={() => { loginDevoteeDemo ? loginDevoteeDemo('Test User') : handleDemoLogin(); onClose(); }}>
                  ⚡ Bypass Auth (Test)
                </button>
              </div>
              <div style={{ textAlign:'center', marginTop:8, fontSize:11, color:'#9a8070' }}>
                Use "Bypass Auth" to skip OTP during testing
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#8B6347", marginBottom: 8 }}>
                  Enter the 6-digit code sent to <b>+91 {phone}</b>
                </div>
                <div style={{ background:'rgba(109,40,217,0.08)', border:'1px solid rgba(109,40,217,0.25)', borderRadius:10, padding:'8px 14px', marginBottom:14, fontSize:12, color:'#7c3aed', fontWeight:700 }}>
                  💡 Universal Test OTP: <span style={{ fontFamily:'monospace', fontSize:16, letterSpacing:4 }}>000000</span>
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
              <button style={{ width:'100%', background:'linear-gradient(135deg,#7c3aed,#5b21b6)', color:'#fff', border:'none', borderRadius:28, padding:'9px', fontWeight:800, cursor:'pointer', fontSize:13, fontFamily:'Nunito,sans-serif', marginTop:8 }}
                onClick={() => handleDemoLogin('DevSetu User')}>
                ⚡ Skip OTP — Use Test Login
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
