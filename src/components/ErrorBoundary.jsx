import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError:false, error:null }; }
  static getDerivedStateFromError(error) { return { hasError:true, error }; }
  componentDidCatch(error, info) { console.error('BhaktiGo error:', error, info); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{ fontFamily:'Nunito,sans-serif', minHeight:'100vh', background:'#fff8f0', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
        <div style={{ background:'#fff', border:'1px solid rgba(212,160,23,0.2)', borderRadius:20, padding:40, maxWidth:480, textAlign:'center', boxShadow:'0 8px 32px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🕉️</div>
          <h2 style={{ fontFamily:'Cinzel,serif', color:'#3d1f00', fontSize:22, margin:'0 0 10px' }}>Something went wrong</h2>
          <p style={{ color:'#7a5c3a', fontSize:14, lineHeight:1.6, margin:'0 0 24px' }}>
            We apologize for the inconvenience. Please try refreshing the page.
            If the problem persists, contact support.
          </p>
          <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, padding:'10px 14px', marginBottom:20, textAlign:'left' }}>
            <code style={{ color:'#dc2626', fontSize:12, fontFamily:'monospace' }}>
              {this.state.error?.message || 'Unknown error'}
            </code>
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
            <button onClick={()=>window.location.reload()} style={{ background:'linear-gradient(135deg,#FF6B00,#e55a00)', color:'#fff', border:'none', borderRadius:20, padding:'12px 28px', fontWeight:700, cursor:'pointer', fontSize:14 }}>
              🔄 Refresh Page
            </button>
            <button onClick={()=>window.location.href='/'} style={{ background:'rgba(0,0,0,0.06)', color:'#7a5c3a', border:'1px solid rgba(212,160,23,0.2)', borderRadius:20, padding:'12px 20px', cursor:'pointer', fontSize:14 }}>
              🏠 Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}
