import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../store/AppCtx';

const DEMO_ACCOUNTS = [
  { role: 'superadmin', label: 'Super Admin',  icon: '👑', color: '#F0C040',  desc: 'Full access — payments, approvals, settings' },
  { role: 'manager',    label: 'Manager',       icon: '🛡️', color: '#3498db',  desc: 'Manage bookings & pandit verifications' },
  { role: 'viewer',     label: 'Viewer',        icon: '👁️', color: '#22c55e',  desc: 'Read-only analytics dashboard' },
];

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin, loginAdminDemo, toast } = useApp();
  // After login, redirect to where the user was trying to go (or admin overview)
  const from = location.state?.from?.pathname || '/admin/overview';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email and password are required.'); return; }
    setLoading(true);
    try {
      await loginAdmin(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (role) => {
    loginAdminDemo(role);
    navigate(from, { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg,#0a0500 0%,#130a04 40%,#1a0f07 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: 'Nunito,sans-serif',
    }}>
      {/* Background glow effects */}
      <div style={{ position:'fixed', top:'20%', left:'15%', width:400, height:400,
        background:'radial-gradient(ellipse,rgba(52,152,219,0.07) 0%,transparent 70%)',
        pointerEvents:'none', zIndex:0 }}/>
      <div style={{ position:'fixed', bottom:'20%', right:'15%', width:350, height:350,
        background:'radial-gradient(ellipse,rgba(240,192,64,0.06) 0%,transparent 70%)',
        pointerEvents:'none', zIndex:0 }}/>

      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:480 }}>

        {/* Logo / Header */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ width:72, height:72, margin:'0 auto 16px',
            background:'linear-gradient(135deg,rgba(52,152,219,0.2),rgba(41,128,185,0.1))',
            border:'2px solid rgba(52,152,219,0.35)',
            borderRadius:22, display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:34, boxShadow:'0 8px 32px rgba(52,152,219,0.2)' }}>🛡️</div>
          <div style={{ fontFamily:'Cinzel,serif', color:'#3498db', fontSize:22, fontWeight:900, marginBottom:4 }}>
            DevSetu Admin
          </div>
          <div style={{ color:'rgba(255,255,255,0.35)', fontSize:13 }}>
            Command Centre · Secure Access
          </div>
        </div>

        {/* Login Card */}
        <div style={{
          background:'rgba(15,8,4,0.85)',
          border:'1px solid rgba(52,152,219,0.2)',
          borderRadius:24,
          padding:'32px 30px',
          backdropFilter:'blur(20px)',
          boxShadow:'0 20px 60px rgba(0,0,0,0.6)',
        }}>
          <form onSubmit={handleLogin} style={{ marginBottom:24 }}>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:800, color:'rgba(52,152,219,0.8)',
                letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@devsetu.com"
                style={{ width:'100%', padding:'13px 16px', borderRadius:12,
                  background:'rgba(255,255,255,0.04)', border:'1.5px solid rgba(52,152,219,0.25)',
                  color:'rgba(255,255,255,0.88)', fontSize:14, outline:'none', boxSizing:'border-box',
                  fontFamily:'Nunito,sans-serif', transition:'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor='rgba(52,152,219,0.55)'}
                onBlur={e => e.target.style.borderColor='rgba(52,152,219,0.25)'}
              />
            </div>

            <div style={{ marginBottom:error ? 14 : 24 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:800, color:'rgba(52,152,219,0.8)',
                letterSpacing:1, textTransform:'uppercase', marginBottom:8 }}>Password</label>
              <div style={{ position:'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width:'100%', padding:'13px 44px 13px 16px', borderRadius:12,
                    background:'rgba(255,255,255,0.04)', border:'1.5px solid rgba(52,152,219,0.25)',
                    color:'rgba(255,255,255,0.88)', fontSize:14, outline:'none', boxSizing:'border-box',
                    fontFamily:'Nunito,sans-serif', transition:'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor='rgba(52,152,219,0.55)'}
                  onBlur={e => e.target.style.borderColor='rgba(52,152,219,0.25)'}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', color:'rgba(255,255,255,0.35)',
                    cursor:'pointer', fontSize:16, padding:0 }}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ marginBottom:16, padding:'10px 14px', borderRadius:10,
                background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)',
                color:'#f87171', fontSize:13 }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'14px', borderRadius:14,
                background: loading ? 'rgba(41,128,185,0.4)' : 'linear-gradient(135deg,#2980B9,#3498db)',
                border:'none', color:'#fff', fontWeight:800, fontSize:15, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily:'Cinzel,sans-serif', letterSpacing:'0.5px',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(41,128,185,0.4)',
                transition:'all 0.2s' }}>
              {loading ? '🔐 Authenticating…' : '🔐 Sign In as Admin'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }}/>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontWeight:600, letterSpacing:'1px' }}>OR DEMO ACCESS</span>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }}/>
          </div>

          {/* Demo Role Buttons */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.role} onClick={() => handleDemo(acc.role)}
                style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 16px',
                  borderRadius:12, cursor:'pointer', textAlign:'left', transition:'all 0.2s',
                  background:`${acc.color}0d`, border:`1px solid ${acc.color}25`,
                  outline:'none' }}
                onMouseEnter={e => { e.currentTarget.style.background=`${acc.color}18`; e.currentTarget.style.borderColor=`${acc.color}45`; }}
                onMouseLeave={e => { e.currentTarget.style.background=`${acc.color}0d`; e.currentTarget.style.borderColor=`${acc.color}25`; }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{acc.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ color:acc.color, fontWeight:800, fontSize:14 }}>{acc.label}</div>
                  <div style={{ color:'rgba(255,255,255,0.35)', fontSize:11, marginTop:2 }}>{acc.desc}</div>
                </div>
                <span style={{ color:acc.color, opacity:0.6, fontSize:14 }}>→</span>
              </button>
            ))}
          </div>

          {/* Back link */}
          <div style={{ textAlign:'center', marginTop:24, paddingTop:20,
            borderTop:'1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={() => navigate('/')}
              style={{ background:'none', border:'none', color:'rgba(255,255,255,0.35)',
                cursor:'pointer', fontSize:13, fontFamily:'Nunito,sans-serif' }}>
              ← Back to DevSetu
            </button>
          </div>
        </div>

        {/* Footer note */}
        <div style={{ textAlign:'center', marginTop:20, color:'rgba(255,255,255,0.2)', fontSize:11 }}>
          🔒 Secured access — DevSetu Platform v2.0
        </div>
      </div>
    </div>
  );
}
