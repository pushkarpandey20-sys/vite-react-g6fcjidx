import React, { useState } from 'react';

const TOGGLES = [
  { key:'razorpay_live', label:'Razorpay Live Mode', desc:'Switch from test keys to production payment gateway', group:'Payments', defaultVal:false },
  { key:'otp_verification', label:'OTP Verification', desc:'Require phone OTP for devotee sign-up/login', group:'Auth', defaultVal:true },
  { key:'email_notifications', label:'Email Notifications', desc:'Send booking confirmations and reminders by email', group:'Notifications', defaultVal:true },
  { key:'sms_notifications', label:'SMS Notifications', desc:'Send SMS alerts for bookings and approvals', group:'Notifications', defaultVal:false },
  { key:'virtual_pooja', label:'Virtual Pooja Feature', desc:'Allow devotees to book online/virtual puja sessions', group:'Features', defaultVal:true },
  { key:'live_darshan', label:'Live Darshan Streaming', desc:'Enable live video darshan from temples', group:'Features', defaultVal:true },
  { key:'samagri_store', label:'Samagri Store', desc:'Show puja samagri e-commerce section to devotees', group:'Features', defaultVal:true },
  { key:'auto_pandit_assign', label:'Auto Pandit Assignment', desc:'Automatically assign nearest available pandit for bookings', group:'Booking', defaultVal:false },
  { key:'new_registrations', label:'New Pandit Registrations', desc:'Allow new pandits to sign up on the platform', group:'Auth', defaultVal:true },
  { key:'maintenance_mode', label:'Maintenance Mode', desc:'Show maintenance banner to all users (admin unaffected)', group:'Platform', defaultVal:false },
];

const PRICING = [
  { key:'platform_fee_pct', label:'Platform Fee (%)', value:'10', desc:'% cut taken from each confirmed booking' },
  { key:'min_booking_amount', label:'Minimum Booking (₹)', value:'500', desc:'Minimum amount for any booking' },
  { key:'cancellation_window_hrs', label:'Cancellation Window (hrs)', value:'24', desc:'Hours before event within which cancellation is free' },
  { key:'pandit_payout_days', label:'Pandit Payout (days)', value:'7', desc:'Days after booking to release payment to pandit' },
];

const SYSTEM_STATUS = [
  { label:'Supabase DB', status:'operational', icon:'🟢' },
  { label:'Razorpay Gateway', status:'operational', icon:'🟢' },
  { label:'SMS Provider (Twilio)', status:'degraded', icon:'🟡' },
  { label:'Email (Resend)', status:'operational', icon:'🟢' },
  { label:'Storage (Supabase)', status:'operational', icon:'🟢' },
  { label:'CDN / Assets', status:'operational', icon:'🟢' },
];

export default function AdminPermissionPage() {
  const [toggles, setToggles] = useState(() => Object.fromEntries(TOGGLES.map(t => [t.key, t.defaultVal])));
  const [pricing, setPricing] = useState(() => Object.fromEntries(PRICING.map(p => [p.key, p.value])));
  const [saved, setSaved] = useState('');

  const toggle = (key) => setToggles(t => ({ ...t, [key]: !t[key] }));

  const handleSave = () => {
    setSaved('✅ Settings saved successfully');
    setTimeout(() => setSaved(''), 3000);
  };

  const groups = [...new Set(TOGGLES.map(t => t.group))];

  return (
    <div style={{ color:'rgba(255,255,255,0.85)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h1 style={{ color:'#3498db', fontFamily:'Cinzel,serif', margin:0, fontSize:20 }}>⚙️ Platform Settings</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', margin:'4px 0 0', fontSize:13 }}>Feature toggles, pricing config & system health</p>
        </div>
        <button onClick={handleSave} style={{ background:'#3498db', color:'#fff', border:'none', borderRadius:10, padding:'10px 24px', fontWeight:700, cursor:'pointer', fontSize:13 }}>
          Save Changes
        </button>
      </div>

      {saved && <div style={{ background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:10, padding:'10px 16px', marginBottom:16, color:'#22c55e', fontSize:13 }}>{saved}</div>}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
        {/* Feature Toggles by Group */}
        <div style={{ gridColumn:'1/-1' }}>
          {groups.map(group => (
            <div key={group} style={{ background:'#0f0f1a', border:'1px solid rgba(41,128,185,0.2)', borderRadius:14, padding:20, marginBottom:14 }}>
              <h3 style={{ color:'#3498db', margin:'0 0 14px', fontSize:14, letterSpacing:1, textTransform:'uppercase' }}>{group}</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {TOGGLES.filter(t => t.group === group).map(t => (
                  <div key={t.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'12px 14px', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ flex:1, marginRight:12 }}>
                      <div style={{ color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:600 }}>{t.label}</div>
                      <div style={{ color:'rgba(255,255,255,0.35)', fontSize:11, marginTop:2 }}>{t.desc}</div>
                    </div>
                    <button
                      onClick={() => toggle(t.key)}
                      style={{
                        width:44, height:24, borderRadius:12, border:'none', cursor:'pointer',
                        background: toggles[t.key] ? '#22c55e' : 'rgba(255,255,255,0.15)',
                        position:'relative', flexShrink:0, transition:'background 0.2s',
                      }}
                    >
                      <span style={{
                        position:'absolute', top:3, width:18, height:18, borderRadius:'50%',
                        background:'#fff', transition:'left 0.2s',
                        left: toggles[t.key] ? 23 : 3,
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Config */}
        <div style={{ background:'#0f0f1a', border:'1px solid rgba(41,128,185,0.2)', borderRadius:14, padding:20 }}>
          <h3 style={{ color:'#3498db', margin:'0 0 16px', fontSize:14, letterSpacing:1, textTransform:'uppercase' }}>Pricing Config</h3>
          {PRICING.map(p => (
            <div key={p.key} style={{ marginBottom:16 }}>
              <label style={{ color:'rgba(255,255,255,0.5)', fontSize:11, display:'block', marginBottom:4 }}>{p.label.toUpperCase()}</label>
              <input
                type="number"
                value={pricing[p.key]}
                onChange={e => setPricing(pr => ({ ...pr, [p.key]: e.target.value }))}
                style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(41,128,185,0.3)', background:'rgba(255,255,255,0.05)', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box' }}
              />
              <div style={{ color:'rgba(255,255,255,0.3)', fontSize:11, marginTop:3 }}>{p.desc}</div>
            </div>
          ))}
        </div>

        {/* System Status */}
        <div style={{ background:'#0f0f1a', border:'1px solid rgba(41,128,185,0.2)', borderRadius:14, padding:20 }}>
          <h3 style={{ color:'#3498db', margin:'0 0 16px', fontSize:14, letterSpacing:1, textTransform:'uppercase' }}>System Status</h3>
          {SYSTEM_STATUS.map(s => (
            <div key={s.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}>{s.label}</span>
              <span style={{ fontSize:12, fontWeight:700, color: s.status === 'operational' ? '#22c55e' : '#F0C040' }}>
                {s.icon} {s.status}
              </span>
            </div>
          ))}
          <div style={{ marginTop:14, padding:'10px 14px', background:'rgba(34,197,94,0.08)', borderRadius:8, border:'1px solid rgba(34,197,94,0.2)', textAlign:'center' }}>
            <span style={{ color:'#22c55e', fontSize:12, fontWeight:700 }}>🟢 Platform Uptime: 99.9% (last 30 days)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
