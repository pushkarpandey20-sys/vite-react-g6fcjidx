import React, { useState } from 'react';

const C = { card:'#ffffff', border:'rgba(212,160,23,0.2)', orange:'#FF6B00', gold:'#D4A017', dark:'#3d1f00', mid:'#7a5c3a', soft:'#9a8070', green:'#16a34a' };

export default function AdminPermissionPage() {
  const [s, setS] = useState({ autoApprove:false, emailNotifs:true, whatsapp:true, razorpayLive:false, maintenance:false, maxBookings:50, platformFee:18, freeDelivery:999 });
  const tog = k => setS(x=>({...x,[k]:!x[k]}));
  const upd = (k,v) => setS(x=>({...x,[k]:v}));

  const Toggle = ({k}) => (
    <div onClick={()=>tog(k)} style={{ width:46,height:26,borderRadius:13,background:s[k]?C.green:'rgba(0,0,0,0.15)',position:'relative',cursor:'pointer',transition:'background 0.3s',flexShrink:0 }}>
      <div style={{ width:20,height:20,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:s[k]?23:3,transition:'left 0.3s',boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
    </div>
  );

  const NumInput = ({k}) => (
    <input type="number" value={s[k]} onChange={e=>upd(k,+e.target.value)}
      style={{ width:80,padding:'6px 10px',borderRadius:8,border:`1.5px solid rgba(212,160,23,0.4)`,background:'#fff',color:C.dark,fontSize:14,textAlign:'center',fontFamily:'inherit' }} />
  );

  const Row = ({label,desc,children}) => (
    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:`1px solid ${C.border}` }}>
      <div><div style={{ color:C.dark,fontWeight:600,fontSize:14 }}>{label}</div><div style={{ color:C.soft,fontSize:12,marginTop:2 }}>{desc}</div></div>
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily:'Nunito,sans-serif' }}>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:'Cinzel,serif', color:C.dark, fontSize:20, margin:0 }}>⚙️ Platform Settings</h2>
        <p style={{ color:C.soft, margin:'4px 0 0', fontSize:13 }}>Configure BhaktiGo platform behavior</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'20px 22px' }}>
          <h3 style={{ color:C.dark, fontFamily:'Cinzel,serif', margin:'0 0 2px', fontSize:15 }}>Operations</h3>
          <p style={{ color:C.soft, fontSize:12, margin:'0 0 8px' }}>Booking & workflow</p>
          <Row label="Auto-Approve Bookings" desc="Confirm bookings without manual review"><Toggle k="autoApprove"/></Row>
          <Row label="Maintenance Mode" desc="Take platform offline temporarily"><Toggle k="maintenance"/></Row>
          <Row label="Max Bookings/Day" desc="Platform-wide daily booking limit"><NumInput k="maxBookings"/></Row>
        </div>

        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'20px 22px' }}>
          <h3 style={{ color:C.dark, fontFamily:'Cinzel,serif', margin:'0 0 2px', fontSize:15 }}>Notifications</h3>
          <p style={{ color:C.soft, fontSize:12, margin:'0 0 8px' }}>Alerts & communication</p>
          <Row label="Email Notifications" desc="Booking confirmations via email"><Toggle k="emailNotifs"/></Row>
          <Row label="WhatsApp Alerts" desc="OTP & updates via WhatsApp"><Toggle k="whatsapp"/></Row>
        </div>

        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'20px 22px' }}>
          <h3 style={{ color:C.dark, fontFamily:'Cinzel,serif', margin:'0 0 2px', fontSize:15 }}>Payments</h3>
          <p style={{ color:C.soft, fontSize:12, margin:'0 0 8px' }}>Razorpay & fee config</p>
          <Row label="Razorpay Live Mode" desc="Switch test → live gateway"><Toggle k="razorpayLive"/></Row>
          <Row label="Platform Fee %" desc="BhaktiGo's cut per booking"><NumInput k="platformFee"/></Row>
        </div>

        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'20px 22px' }}>
          <h3 style={{ color:C.dark, fontFamily:'Cinzel,serif', margin:'0 0 2px', fontSize:15 }}>Samagri Store</h3>
          <p style={{ color:C.soft, fontSize:12, margin:'0 0 8px' }}>Delivery settings</p>
          <Row label="Free Delivery Above (₹)" desc="Minimum for free delivery"><NumInput k="freeDelivery"/></Row>
        </div>
      </div>

      <div style={{ marginTop:20, display:'flex', gap:12 }}>
        <button style={{ background:`linear-gradient(135deg,${C.green},#15803d)`, color:'#fff', border:'none', borderRadius:10, padding:'12px 28px', fontWeight:700, cursor:'pointer', fontSize:14 }}>✓ Save All Settings</button>
        <button style={{ background:'rgba(0,0,0,0.06)', color:C.mid, border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 22px', cursor:'pointer', fontSize:14 }}>Reset</button>
      </div>
    </div>
  );
}
