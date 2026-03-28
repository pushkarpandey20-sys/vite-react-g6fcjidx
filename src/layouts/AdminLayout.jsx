import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path:'/admin/overview',  icon:'📊', label:'Overview' },
  { path:'/admin/pandits',   icon:'🙏', label:'Pandits' },
  { path:'/admin/bookings',  icon:'📋', label:'Bookings' },
  { path:'/admin/rituals',   icon:'🕉️', label:'Rituals' },
  { path:'/admin/samagri',   icon:'🛍️', label:'Samagri' },
  { path:'/admin/temples',   icon:'🏛️', label:'Temples' },
  { path:'/admin/settings',  icon:'⚙️', label:'Settings' },
];

function AdminLogin({ onLogin }) {
  const [email, setEmail]   = useState('');
  const [pass,  setPass]    = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pass) { setError('Enter email and password'); return; }
    setLoading(true);
    setError('');
    try {
      const { supabase } = await import('../services/supabase');
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (authError) throw authError;
      onLogin(email);
    } catch (e) {
      if (email === 'admin@devsetu.app' && pass === 'DevSetu@2025') {
        onLogin(email);
      } else {
        setError(e.message || 'Invalid credentials. Try admin@devsetu.app / DevSetu@2025');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:'#fff8f0', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Nunito, sans-serif' }}>
      <div style={{ background:'#fff', borderRadius:20, border:'1.5px solid rgba(212,160,23,0.3)', padding:'40px 36px', width:'100%', maxWidth:420, textAlign:'center', boxShadow:'0 8px 32px rgba(212,160,23,0.1)' }}>
        <div style={{ fontSize:48, marginBottom:12 }}>⚙️</div>
        <h2 style={{ fontFamily:'Cinzel,serif', color:'#3d1f00', fontSize:24, margin:'0 0 6px' }}>Admin Panel</h2>
        <p style={{ color:'#9a8070', fontSize:13, margin:'0 0 28px' }}>DevSetu Platform Management</p>

        {error && (
          <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'10px 14px', color:'#dc2626', fontSize:13, marginBottom:16, textAlign:'left' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom:12 }}>
          <input type="email" placeholder="Admin email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}
            style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid rgba(212,160,23,0.4)', background:'#fff', color:'#3d1f00', fontSize:14, boxSizing:'border-box', fontFamily:'inherit', outline:'none' }} />
        </div>
        <div style={{ marginBottom:20 }}>
          <input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}
            style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid rgba(212,160,23,0.4)', background:'#fff', color:'#3d1f00', fontSize:14, boxSizing:'border-box', fontFamily:'inherit', outline:'none' }} />
        </div>

        <button onClick={handleLogin} disabled={loading}
          style={{ width:'100%', background:'linear-gradient(135deg,#FF6B00,#e55a00)', color:'#fff', border:'none', borderRadius:28, padding:'13px', fontWeight:800, cursor:'pointer', fontSize:15, opacity:loading?0.7:1 }}>
          {loading ? '⏳ Signing in...' : '🔐 Sign In to Admin'}
        </button>
        <p style={{ color:'#c8a882', fontSize:11, marginTop:20 }}>Test credentials: admin@devsetu.app / DevSetu@2025</p>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();
  const [adminUser, setAdminUser] = useState(() => {
    try { return localStorage.getItem('ds_admin') || null; } catch { return null; }
  });

  const handleLogin = (email) => {
    try { localStorage.setItem('ds_admin', email); } catch {}
    setAdminUser(email);
    navigate('/admin/overview');
  };

  const handleLogout = () => {
    try { localStorage.removeItem('ds_admin'); } catch {}
    setAdminUser(null);
  };

  if (!adminUser) return <AdminLogin onLogin={handleLogin} />;

  const ni = (active) => ({
    display:'flex', alignItems:'center', gap:10,
    padding:'10px 16px', cursor:'pointer', borderRadius:8,
    margin:'2px 8px', fontSize:14, fontWeight: active ? 700 : 500,
    background: active ? 'rgba(255,107,0,0.12)' : 'transparent',
    color: active ? '#FF6B00' : 'rgba(255,248,240,0.7)',
    transition:'all 0.2s',
  });

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:'Nunito,sans-serif', background:'#fff8f0' }}>
      {/* Sidebar */}
      <div style={{ width:220, background:'#3d1f00', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
          <div onClick={()=>navigate('/')} style={{ cursor:'pointer' }}>
            <div style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontSize:16, fontWeight:900 }}>🕉️ DevSetu</div>
            <div style={{ fontSize:10, color:'rgba(255,248,240,0.5)', letterSpacing:2, marginTop:2 }}>ADMIN PANEL</div>
          </div>
          <div style={{ marginTop:12, background:'rgba(255,107,0,0.2)', borderRadius:8, padding:'7px 10px' }}>
            <div style={{ color:'#FF6B00', fontSize:11, fontWeight:700 }}>⚙️ Super Admin</div>
            <div style={{ color:'rgba(255,248,240,0.5)', fontSize:11, marginTop:1 }}>{adminUser}</div>
          </div>
        </div>

        <nav style={{ flex:1, padding:'8px 0' }}>
          {NAV_ITEMS.map(({ path, icon, label }) => (
            <div key={path} style={ni(pathname.startsWith(path))} onClick={()=>navigate(path)}>
              <span style={{ fontSize:16 }}>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </nav>

        <div style={{ padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,0.1)' }}>
          <div style={ni(false)} onClick={()=>navigate('/user/home')}>
            <span>🏠</span><span style={{ fontSize:14 }}>Devotee App</span>
          </div>
          <div style={ni(false)} onClick={handleLogout}>
            <span>🚪</span><span style={{ fontSize:14 }}>Logout</span>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ background:'#fff', borderBottom:'1px solid rgba(212,160,23,0.2)', padding:'12px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <div style={{ fontFamily:'Cinzel,serif', color:'#3d1f00', fontSize:15 }}>
            {NAV_ITEMS.find(n=>pathname.startsWith(n.path))?.label || 'Admin'}
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <span style={{ color:'#9a8070', fontSize:12 }}>⚙️ Admin Panel</span>
            <button onClick={()=>navigate('/user/home')} style={{ background:'rgba(255,107,0,0.1)', color:'#FF6B00', border:'1px solid rgba(255,107,0,0.3)', borderRadius:8, padding:'5px 14px', fontSize:12, cursor:'pointer', fontWeight:700 }}>← Devotee App</button>
          </div>
        </div>

        <div id="admin-content" style={{ flex:1, overflowY:'auto', padding:'24px', background:'#fff8f0' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
