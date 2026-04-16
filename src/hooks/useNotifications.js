import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    // Load existing notifications
    supabase
      .from('notifications')
      .select('*')
      .or(`user_id.eq.${userId},pandit_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (error) {
          // Table may not exist yet — fail silently
          console.warn('[useNotifications] fetch skipped:', error.message);
          return;
        }
        if (data) {
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.is_read).length);
        }
      });

    // Request browser push permission
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    // Realtime subscription for new notifications
    const channel = supabase
      .channel(`notif_${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, payload => {
        setNotifications(prev => [payload.new, ...prev]);
        setUnreadCount(prev => prev + 1);
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification('BhaktiGo 🙏', {
            body: payload.new.message,
            icon: '/favicon.ico',
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markAllRead = async () => {
    if (!userId) return;
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .or(`user_id.eq.${userId},pandit_id.eq.${userId}`)
      .catch(e => console.warn('[useNotifications] markAllRead:', e.message));
  };

  const markRead = async (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .catch(e => console.warn('[useNotifications] markRead:', e.message));
  };

  return { notifications, unreadCount, markAllRead, markRead };
}
