import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationStore, { requestNotificationPermission } from '../services/notificationService';
import { IconBell, IconX, IconOm } from './icons/Icons';

export default function NotificationBell() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [permAsked, setPermAsked] = useState(false);
  const ref = useRef();

  useEffect(() => {
    setNotifications([...notificationStore.notifications]);
    const unsub = notificationStore.subscribe(setNotifications);
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => { unsub(); document.removeEventListener('mousedown', handleClick); };
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const handleOpen = async () => {
    setOpen(o => !o);
    if (!permAsked) {
      setPermAsked(true);
      await requestNotificationPermission();
    }
  };

  const urgencyColor = (u) => u === 'high' ? '#ef4444' : u === 'medium' ? '#FF6B00' : '#888';
  const typeIcon = (t) => ({ tithi:'🌙', weekday:'📿', festival:'🎊', muhurat:'⏰', muhurat_reminder:'⏰', search_reminder:'🔍', rebooking:'🔄' }[t] || '🔔');

  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button onClick={handleOpen} style={{ position:'relative', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(212,160,23,0.2)', borderRadius:'50%', width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:18, transition:'all 0.2s' }}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,107,0,0.15)'}
        onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}>
        <IconBell size={20} color="#F0C040" />
        {unread > 0 && (
          <div style={{ position:'absolute', top:-4, right:-4, background:'#ef4444', color:'#fff', borderRadius:'50%', width:18, height:18, fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #0d0700' }}>
            {unread > 9 ? '9+' : unread}
          </div>
        )}
      </button>
      {open && (
        <div style={{ 
          position: window.innerWidth < 640 ? 'fixed' : 'absolute', 
          right: window.innerWidth < 640 ? 10 : 0, 
          left: window.innerWidth < 640 ? 10 : 'auto',
          top: window.innerWidth < 640 ? 70 : 48, 
          width: window.innerWidth < 640 ? 'calc(100vw - 20px)' : 380, 
          maxHeight: '70vh', 
          overflowY: 'auto', 
          background: '#1a0f07', 
          border: '1px solid rgba(212,160,23,0.25)', 
          borderRadius: 20, 
          boxShadow: '0 20px 80px rgba(0,0,0,0.8)', 
          zIndex: 10000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', borderBottom:'1px solid rgba(212,160,23,0.1)', position:'sticky', top:0, background:'#1a0f07', zIndex:10 }}>
            <div>
              <div style={{ color:'#F0C040', fontFamily:'Cinzel,serif', fontWeight:700, fontSize:15, display:'flex', alignItems:'center', gap:8 }}>
                <IconBell size={18} color="#F0C040" /> Sacred Alerts
              </div>
              <div style={{ color:'rgba(255,248,240,0.4)', fontSize:11, marginTop:2 }}>{unread} unread · Vedic calendar powered</div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <button onClick={()=>{ notificationStore.markAllRead(); }} style={{ background:'rgba(255,107,0,0.15)', color:'#FF6B00', border:'1px solid rgba(255,107,0,0.3)', borderRadius:8, padding:'4px 10px', fontSize:11, cursor:'pointer', fontWeight:600 }}>
                Mark all read
              </button>
              <button onClick={()=>setOpen(false)} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <IconX size={18} color="rgba(255,248,240,0.7)" />
              </button>
            </div>
          </div>
          {notifications.length === 0 ? (
            <div style={{ textAlign:'center', padding:'32px 20px', color:'rgba(255,248,240,0.4)' }}>
              <div style={{ fontSize:32, marginBottom:8 }}><IconOm size={40} color="rgba(212,160,23,0.3)" /></div>
              <div style={{ fontSize:13 }}>No alerts yet. We'll notify you of auspicious timings and recommended poojas.</div>
            </div>
          ) : notifications.map(n => (
            <div key={n.id} onClick={()=>{ notificationStore.markRead(n.id); if(n.url) navigate(n.url); setOpen(false); }}
              style={{ padding:'14px 20px', borderBottom:'1px solid rgba(212,160,23,0.06)', cursor:'pointer', background:n.read?'transparent':'rgba(255,107,0,0.05)', transition:'background 0.2s', borderLeft:`3px solid ${n.read?'transparent':urgencyColor(n.urgency)}` }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}
              onMouseLeave={e=>e.currentTarget.style.background=n.read?'transparent':'rgba(255,107,0,0.05)'}>
              <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ fontSize:24, flexShrink:0 }}>{n.icon || typeIcon(n.type)}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div style={{ color: n.read?'rgba(255,248,240,0.7)':'#F0C040', fontWeight:700, fontSize:13 }}>{n.title}</div>
                    {!n.read && <div style={{ width:8, height:8, borderRadius:'50%', background:urgencyColor(n.urgency), flexShrink:0, marginTop:3, marginLeft:8 }}/>}
                  </div>
                  <div style={{ color:'rgba(255,248,240,0.6)', fontSize:12, marginTop:3, lineHeight:1.4 }}>{n.message}</div>
                  {n.rituals?.length > 0 && (
                    <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:6 }}>
                      {n.rituals.slice(0,3).map(r=>(
                        <span key={r} style={{ background:'rgba(212,160,23,0.15)', color:'#D4A017', fontSize:10, padding:'2px 8px', borderRadius:10, fontWeight:600 }}>{r}</span>
                      ))}
                    </div>
                  )}
                  {n.muhurat?.length > 0 && (
                    <div style={{ color:'#22c55e', fontSize:11, marginTop:4, fontWeight:600 }}>⏰ Muhurat: {n.muhurat.join(' · ')}</div>
                  )}
                  {n.cta && (
                    <div style={{ marginTop:8 }}>
                      <span style={{ background:'linear-gradient(135deg,#FF6B00,#FF8C35)', color:'#fff', fontSize:11, padding:'4px 12px', borderRadius:20, fontWeight:700, cursor:'pointer' }}>{n.cta} →</span>
                    </div>
                  )}
                  <div style={{ color:'rgba(255,248,240,0.3)', fontSize:10, marginTop:6 }}>
                    {new Date(n.createdAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ padding:'12px 20px', borderTop:'1px solid rgba(212,160,23,0.1)', textAlign:'center' }}>
            <div style={{ color:'rgba(255,248,240,0.4)', fontSize:11 }}>
              Notifications based on Vedic calendar · Personalized for you
            </div>
            {typeof Notification !== 'undefined' && Notification.permission !== 'granted' && (
              <button onClick={()=>requestNotificationPermission()} style={{ marginTop:8, background:'rgba(255,107,0,0.15)', color:'#FF6B00', border:'1px solid rgba(255,107,0,0.3)', borderRadius:8, padding:'6px 14px', fontSize:11, cursor:'pointer', fontWeight:600 }}>
                Enable Browser Notifications
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
