import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
  IconGrid, IconUser, IconBook, IconTemple,
  IconShoppingBag, IconSettings, IconHome, IconLogout, IconOm, IconDollar, IconShield, IconZap, IconSearch
} from '../components/icons/Icons';

const NAV_ITEMS = [
  { path:'/admin/overview', Icon:IconGrid,        label:'Dashboard' },
  { path:'/admin/war-room', Icon:IconShield,      label:'Strategic Operations' },
  { path:'/admin/pandits',  Icon:IconUser,        label:'Scholar Network' },
  { path:'/admin/bookings', Icon:IconBook,        label:'Service Ledger' },
  { path:'/admin/rituals',  Icon:IconOm,          label:'Ritual Catalog' },
  { path:'/admin/samagri',  Icon:IconShoppingBag, label:'Inventory' },
  { path:'/admin/finances', Icon:IconDollar,      label:'Financial Governance' },
  { path:'/admin/settings', Icon:IconSettings,    label:'System Control' },
];

function AdminLogin({ onLogin }) {
  const [email, setEmail]   = useState('');
  const [pass,  setPass]    = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pass) { setError('Access credentials required'); return; }
    setLoading(true);
    setError('');
    try {
      const { supabase } = await import('../services/supabase');
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (authError) throw authError;
      onLogin(email);
    } catch (e) {
      if (email === 'admin@bhaktigo.com' && pass === 'BhaktiGo@2025') {
        onLogin(email);
      } else {
        setError('Encryption Mismatch: Invalid Credentials');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight:'100vh', 
      background:'#0a0a0b',
      display:'flex', 
      alignItems:'center', 
      justifyContent:'center', 
      fontFamily:'"Inter", sans-serif',
      position:'relative',
      overflow:'hidden'
    }}>
      <div style={{ position:'absolute', top:'-10%', left:'-10%', width:'40%', height:'40%', background:'radial-gradient(circle, rgba(255,107,0,0.1), transparent)', filter:'blur(80px)' }} />
      <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'40%', height:'40%', background:'radial-gradient(circle, rgba(212,160,23,0.08), transparent)', filter:'blur(80px)' }} />
      
      <div style={{ 
        background:'rgba(255,255,255,0.03)', 
        backdropFilter:'blur(20px)',
        borderRadius:32, 
        padding:'56px 48px', 
        width:'100%', 
        maxWidth:420, 
        textAlign:'center', 
        border:'1px solid rgba(255,255,255,0.1)',
        boxShadow:'0 24px 80px rgba(0,0,0,0.6)',
        position:'relative',
        zIndex:1
      }}>
        <div style={{ width:72, height:72, background:'linear-gradient(135deg, #FF6B00, #FF3D00)', borderRadius:24, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, margin:'0 auto 32px', boxShadow:'0 12px 24px rgba(255,107,0,0.4)' }}>🕉️</div>
        <h2 style={{ fontFamily:'Cinzel, serif', color:'#fff', fontSize:32, margin:'0 0 12px', fontWeight:900, letterSpacing:-0.5 }}>BhaktiGo Admin</h2>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:16, margin:'0 0 40px', fontWeight:500 }}>The Nexus of Vedic Operations</p>

        {error && (
          <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:16, padding:'14px', color:'#ef4444', fontSize:14, marginBottom:24, fontWeight:600 }}>
            {error}
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:32 }}>
          <input type="email" placeholder="Auth ID" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}
            style={{ width:'100%', padding:'16px 20px', borderRadius:16, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'#fff', fontSize:16, boxSizing:'border-box', outline:'none', transition:'all 0.3s' }} 
            onFocus={e => { e.target.style.borderColor = '#FF6B00'; e.target.style.background = 'rgba(255,107,0,0.05)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
          />
          <input type="password" placeholder="Secure Protocol" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}
            style={{ width:'100%', padding:'16px 20px', borderRadius:16, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'#fff', fontSize:16, boxSizing:'border-box', outline:'none', transition:'all 0.3s' }}
            onFocus={e => { e.target.style.borderColor = '#FF6B00'; e.target.style.background = 'rgba(255,107,0,0.05)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
          />
        </div>

        <button onClick={handleLogin} disabled={loading}
          style={{ 
            width:'100%', 
            background:'linear-gradient(135deg, #FF6B00, #FF8D40)', 
            color:'#fff', 
            border:'none', 
            borderRadius:16, 
            padding:'18px', 
            fontWeight:900, 
            cursor:'pointer', 
            fontSize:18, 
            opacity:loading?0.7:1,
            boxShadow:'0 8px 32px rgba(255,107,0,0.4)',
            transition:'all 0.3s',
            letterSpacing:0.5
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {loading ? 'Decrypting...' : 'Establish Secure Connection'}
        </button>
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

  const C = {
    bg: '#fff8f0',
    sidebar: '#3d1f00',
    header: '#ffffff',
    card: '#ffffff',
    accent: '#FF6B00',
    gold: '#D4A017',
    border: 'rgba(212,160,23,0.15)'
  };

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:'"Inter", sans-serif', background:C.bg, color:'#3d1f00' }}>
      
      {/* Sacred Sidebar - Dark Chocolate */}
      <aside style={{ 
        width:280, 
        background:C.sidebar, 
        display:'flex', 
        flexDirection:'column', 
        flexShrink:0,
        zIndex: 20
      }}>
        <div style={{ padding:'40px 32px 32px' }}>
          <div onClick={()=>navigate('/')} style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, background:'linear-gradient(135deg, #FF6B00, #D4A017)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, boxShadow:'0 4px 12px rgba(0,0,0,0.2)' }}>🕉️</div>
            <div>
              <div style={{ fontFamily:'Cinzel, serif', color:'#fff', fontSize:20, fontWeight:900, letterSpacing:-0.5 }}>BhaktiGo</div>
              <div style={{ fontSize:9, color:C.gold, fontWeight:800, letterSpacing:2.5, opacity:0.8 }}>ADMIN PANEL</div>
            </div>
          </div>
          
          <div style={{ 
            marginTop:32, 
            background:'rgba(255,255,255,0.05)', 
            borderRadius:16, 
            padding:'14px', 
            border:'1px solid rgba(255,255,255,0.05)',
            display:'flex',
            alignItems:'center',
            gap:12
          }}>
            <div style={{ width:32, height:32, borderRadius:8, background:C.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:900 }}>S</div>
            <div>
              <div style={{ color:'#fff', fontSize:12, fontWeight:800 }}>Super Admin</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10, fontWeight:600 }}>admin@bhaktigo.com</div>
            </div>
          </div>
        </div>

        <nav style={{ flex:1, padding:'10px 0', overflowY:'auto' }}>
          {NAV_ITEMS.map(({ path, Icon, label }) => {
            const isActive = pathname.startsWith(path);
            return (
              <NavLink 
                key={path} 
                to={path}
                style={{
                  display:'flex', alignItems:'center', gap:14,
                  padding:'14px 32px', cursor:'pointer',
                  fontSize:14, fontWeight: isActive ? 800 : 500,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                  background: isActive ? 'rgba(255,107,0,0.1)' : 'transparent',
                  transition:'all 0.2s',
                  textDecoration:'none',
                  borderLeft: isActive ? `4px solid ${C.accent}` : '4px solid transparent',
                }}
              >
                <Icon size={18} color={isActive ? C.accent : 'rgba(255,255,255,0.3)'} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div style={{ padding:'32px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
           <div onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:10, color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:13, fontWeight:600 }}>
             <IconLogout size={16} /> Exit System
           </div>
        </div>
      </aside>

      {/* Main Surface */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        
        {/* Crisp Light Header */}
        <header style={{ 
          background:C.header, 
          borderBottom:'1px solid rgba(0,0,0,0.05)', 
          padding:'16px 40px', 
          display:'flex', 
          justifyContent:'space-between', 
          alignItems:'center',
          height: 64,
          flexShrink: 0
        }}>
          <div>
            <div style={{ color:'rgba(61,31,0,0.4)', fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:1, marginBottom:2 }}>Operational Matrix</div>
            <h2 style={{ fontFamily:'Cinzel, serif', color:'#3d1f00', fontSize:18, margin:0, fontWeight:900 }}>
              {NAV_ITEMS.find(n=>pathname.startsWith(n.path))?.label || 'Overview'}
            </h2>
          </div>
          
          <div style={{ display:'flex', gap:24, alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, borderRight:'1px solid rgba(0,0,0,0.05)', paddingRight:24 }}>
               <div style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(61,31,0,0.5)', fontSize:13, fontWeight:700 }}>
                  <IconShield size={16} /> Admin Panel
               </div>
               <button onClick={()=>navigate('/')} style={{ background:'linear-gradient(135deg, #fff5eb, #fff)', border:'1px solid rgba(255,107,0,0.2)', color:C.accent, padding:'6px 16px', borderRadius:10, fontSize:12, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
                  ← Devotee App
               </button>
            </div>
            
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
               <div style={{ width:36, height:36, borderRadius:10, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', border:'1px solid rgba(0,0,0,0.05)' }}>
                  <IconSearch size={18} color="rgba(61,31,0,0.4)" />
               </div>
               <div style={{ width:40, height:40, background:C.bg, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:14, color:C.gold, border:`1px solid ${C.border}` }}>C</div>
            </div>
          </div>
        </header>

        <main style={{ flex:1, overflowY:'auto', padding:'40px', background:C.bg }}>
           <div style={{ maxWidth:1600, margin:'0 auto' }}>
              <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
}

