import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppCtx';
import { supabase, db } from '../services/supabase';

export default function NotificationOverlay() {
  const { devoteeId, panditId, toast } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  const userId = panditId || devoteeId;
  const userType = panditId ? 'pandit' : 'devotee';

  useEffect(() => {
    if (!userId) return;

    // Fetch initial notifications
    db.notifications()
      .select("*")
      .eq("user_id", userId)
      .eq("user_type", userType)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setNotifications(data || []));

    // Real-time subscription
    const channel = supabase.channel(`notifs_${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
        toast(payload.new.message, "🔔");
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId, userType]);

  const markAsRead = async (id) => {
    await db.notifications().update({ read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (!userId) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-bell-container" style={{ position: 'relative' }}>
      <button className="nav-btn bell-btn" onClick={() => setShow(!show)}>
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && <span className="bell-count">{unreadCount}</span>}
      </button>

      {show && (
        <div className="notification-dropdown card">
          <div className="notif-header">
            <h3>Sacred Notifications</h3>
            <button className="notif-close" onClick={() => setShow(false)}>✕</button>
          </div>
          <div className="notif-list">
            {notifications.length === 0 ? (
              <p className="no-notif">No new messages from the divine.</p>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'}`} onClick={() => markAsRead(n.id)}>
                  <div className="notif-msg">{n.message}</div>
                  <div className="notif-time">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
