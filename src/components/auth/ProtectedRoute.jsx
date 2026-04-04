import React from 'react';

export const ProtectedRoute = ({ children, role }) => {
  const { devoteeId, panditId, adminRole, authLoading, setShowLogin, loginPanditDemo } = useApp();
  const location = useLocation();

  if (authLoading) {
    return (
      <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#1a0f07', color:'#F0C040', flexDirection:'column' }}>
        <div style={{ fontSize:40, marginBottom:15 }}>🕉️</div>
        <p style={{ fontFamily:'Cinzel', letterSpacing:'2px' }}>Loading Sacred Space...</p>
      </div>
    );
  }

  let isAuthorized = false;
  if (role === 'admin')       isAuthorized = !!adminRole;
  else if (role === 'pandit') isAuthorized = !!panditId;
  else if (role === 'user')   isAuthorized = !!devoteeId;

  if (!isAuthorized) {
    if (role === 'admin') return <Navigate to="/admin-login" state={{ from: location }} replace />;

    // Pandit portal: show inline login gate instead of silently redirecting away
    if (role === 'pandit') {
      return (
        <div style={{ minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, background:'linear-gradient(135deg,#1a0f07,#3d2211)', borderRadius:16, padding:40, margin:24 }}>
          <div style={{ fontSize:56 }}>🙏</div>
          <h2 style={{ fontFamily:'Cinzel,serif', color:'#D4A017', margin:0 }}>Pandit Portal</h2>
          <p style={{ color:'rgba(255,248,240,0.5)', textAlign:'center', maxWidth:360, margin:'4px 0 12px' }}>
            Login with your registered phone to access the portal, or use Demo Access to explore.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
            <button
              onClick={() => setShowLogin(true)}
              style={{ background:'linear-gradient(135deg,#D4A017,#F0C040)', color:'#1a0f07', border:'none', borderRadius:28, padding:'12px 36px', fontWeight:800, cursor:'pointer', fontSize:14 }}
            >
              🪔 Login with OTP
            </button>
            <button
              onClick={() => loginPanditDemo()}
              style={{ background:'rgba(255,107,0,0.15)', color:'#FF6B00', border:'1px solid rgba(255,107,0,0.4)', borderRadius:28, padding:'12px 36px', fontWeight:800, cursor:'pointer', fontSize:14 }}
            >
              ⚡ Demo Access
            </button>
          </div>
        </div>
      );
    }

    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};
