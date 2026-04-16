import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';

const TYPE_ICON = {
  booking_confirmed:      '✅',
  booking_accepted:       '🙏',
  booking_cancelled:      '❌',
  payment_received:       '💰',
  muhurta_request:        '📅',
  pandit_approved:        '🎉',
  pandit_rejected:        '⚠️',
  new_review:             '⭐',
  new_pandit_application: '📋',
};

export function NotificationBell({ userId }) {
  const { notifications, unreadCount, markAllRead, markRead } =
    useNotifications(userId);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close on outside click
  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'relative',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(212,160,23,0.2)',
          borderRadius: '50%', width: 40, height: 40,
          cursor: 'pointer', fontSize: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#F0C040', transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,0,0.15)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
      >
        🔔
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute', top: -4, right: -4,
            background: '#ef4444', color: '#fff',
            borderRadius: '50%', width: 18, height: 18,
            fontSize: 10, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #0d0700',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {open && (
        <div style={{
          position: window.innerWidth < 640 ? 'fixed' : 'absolute',
          top: window.innerWidth < 640 ? 70 : 48,
          right: window.innerWidth < 640 ? 10 : 0,
          left: window.innerWidth < 640 ? 10 : 'auto',
          width: window.innerWidth < 640 ? 'calc(100vw - 20px)' : 360,
          maxHeight: '70vh',
          background: '#1a0f07',
          border: '1px solid rgba(212,160,23,0.25)',
          borderRadius: 20,
          boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideIn 0.25s ease-out',
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid rgba(212,160,23,0.12)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#1a0f07', position: 'sticky', top: 0, zIndex: 5,
          }}>
            <div>
              <span style={{ color: '#F0C040', fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 15 }}>
                🔔 Notifications
              </span>
              <div style={{ color: 'rgba(255,248,240,0.4)', fontSize: 11, marginTop: 2 }}>
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: 'rgba(255,107,0,0.15)', color: '#FF6B00',
                  border: '1px solid rgba(255,107,0,0.3)',
                  borderRadius: 8, padding: '4px 10px',
                  fontSize: 11, cursor: 'pointer', fontWeight: 700,
                }}>
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '36px 24px', textAlign: 'center', color: 'rgba(255,248,240,0.4)' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🔔</div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>No notifications yet</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.7 }}>
                  Booking updates will appear here
                </p>
              </div>
            ) : notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  padding: '12px 18px',
                  borderBottom: '1px solid rgba(212,160,23,0.07)',
                  cursor: 'pointer',
                  background: n.is_read ? 'transparent' : 'rgba(255,107,0,0.06)',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = n.is_read ? 'transparent' : 'rgba(255,107,0,0.06)'}
              >
                <div style={{ fontSize: 22, flexShrink: 0 }}>
                  {TYPE_ICON[n.type] || '🔔'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, color: '#F0C040', fontWeight: 700, fontSize: 13 }}>
                    {n.title}
                  </p>
                  <p style={{ margin: '3px 0 0', color: 'rgba(255,248,240,0.65)', fontSize: 12, lineHeight: 1.4 }}>
                    {n.message}
                  </p>
                  <p style={{ margin: '5px 0 0', color: 'rgba(255,248,240,0.3)', fontSize: 11 }}>
                    {new Date(n.created_at).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                {!n.is_read && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#FF6B00', flexShrink: 0, marginTop: 5,
                  }} />
                )}
              </div>
            ))}
          </div>

          <style>{`
            @keyframes slideIn {
              from { transform: translateY(-8px); opacity: 0; }
              to   { transform: translateY(0);    opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
