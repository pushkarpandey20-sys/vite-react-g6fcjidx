import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../store/AppCtx';
import { supabase, db } from '../../services/supabase';
import { Spinner, Toggle } from '../../components/common/UIElements';
import { useNavigate } from 'react-router-dom';

export default function PanditHome() {
  const { panditId, panditName, panditOnline, setPanditOnline, toast } = useApp();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const isValidUUID = (v) => v && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

  const loadBookings = async () => {
    if (!isValidUUID(panditId)) { setLoading(false); return; }
    const { data } = await db.bookings()
      .select("*")
      .eq("pandit_id", panditId)
      .order("booking_date", { ascending: true });
    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
    if (!isValidUUID(panditId)) return;

    const channel = supabase.channel(`pandit_dashboard_${panditId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'bookings',
        filter: `pandit_id=eq.${panditId}` 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setBookings(prev => [payload.new, ...prev]);
          toast("New Booking Request Received! 🕉️", "🔔");
        } else if (payload.eventType === 'UPDATE') {
          setBookings(prev => prev.map(b => b.id === payload.new.id ? payload.new : b));
        } else if (payload.eventType === 'DELETE') {
          setBookings(prev => prev.filter(b => b.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [panditId]);

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const pending = bookings.filter(b => b.status === 'pending');
    const today = bookings.filter(b => b.booking_date === todayStr && b.status === 'accepted');
    const earnings = bookings.filter(b => b.status === 'completed' || b.status === 'accepted').reduce((sum, b) => sum + (b.amount || 0), 0);
    const upcoming = bookings.filter(b => b.booking_date > todayStr && b.status === 'accepted');
    
    return { pending, today, earnings, upcoming };
  }, [bookings]);

  const handleStatusUpdate = async (id, status) => {
    const { error } = await db.bookings().update({ status }).eq("id", id);
    if (!error) {
      toast(`Booking ${status} Successfully!`, "✅");
    } else {
      toast("Error updating booking status", "❌");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="pandit-dashboard">
      <header className="dashboard-header wb">
        <div>
          <h2 className="ph-title animate-glow">🙏 Namaste, Pt. {panditName || "Ji"}</h2>
          <p className="ph-sub">You have {stats.pending.length} pending requests for attention.</p>
        </div>
        <div className="status-toggle-box card">
          <span className={`status-dot ${panditOnline ? 'online' : 'offline'}`} />
          <span className="status-lbl">{panditOnline ? "Duty: Online" : "Duty: Offline"}</span>
          <Toggle on={panditOnline} onChange={(v) => {
            setPanditOnline(v);
            toast(v ? "You are now receiving live requests!" : "Your requests are paused.", v ? "🟢" : "⚫");
          }} />
        </div>
      </header>

      {/* Stats Section */}
      <div className="stats-row grid-4" style={{ marginBottom: 30 }}>
        <div className="stat-card gold-grad">
          <div className="st-val">₹{stats.earnings.toLocaleString()}</div>
          <div className="st-lbl">Sacred Earnings (Total)</div>
        </div>
        <div className="stat-card dark-grad">
          <div className="st-val">{stats.today.length}</div>
          <div className="st-lbl">Today's Rituals</div>
        </div>
        <div className="stat-card dark-grad">
          <div className="st-val">{stats.pending.length}</div>
          <div className="st-lbl">Pending Requests</div>
        </div>
        <div className="stat-card dark-grad">
          <div className="st-val">{stats.upcoming.length}</div>
          <div className="st-lbl">Upcoming Bookings</div>
        </div>
      </div>

      <div className="dashboard-grid display-2col">
        {/* Today's Schedule Module */}
        <section className="dashboard-module card card-p">
          <div className="sh">
            <div className="sh-title">Today's Sacred Schedule</div>
            <div className="sh-sub">Rituals scheduled for today's auspicious timings.</div>
          </div>
          <div className="module-content">
            {stats.today.length === 0 ? <EmptyModule message="No rituals for today yet." icon="📿" /> : (
              stats.today.map(b => (
                <BookingActionCard key={b.id} b={b} onAction={handleStatusUpdate} isToday />
              ))
            )}
          </div>
        </section>

        {/* Pending Requests Module */}
        <section className="dashboard-module card card-p">
          <div className="sh">
            <div className="sh-title">Pending Invitations</div>
            <div className="sh-sub">Confirm these requests to secure your schedule.</div>
          </div>
          <div className="module-content">
            {stats.pending.length === 0 ? <EmptyModule message="Clean slate! No pending requests." icon="✨" /> : (
              stats.pending.map(b => (
                <BookingActionCard key={b.id} b={b} onAction={handleStatusUpdate} />
              ))
            )}
          </div>
        </section>

        {/* Upcoming Section */}
        <section className="dashboard-module card card-p ffw">
          <div className="sh">
            <div className="sh-title">Upcoming Rituals (Nex 7 Days)</div>
          </div>
          <div className="module-content grid-2">
            {stats.upcoming.slice(0, 4).map(b => (
              <BookingActionCard key={b.id} b={b} mini />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function BookingActionCard({ b, onAction, isToday = false, mini = false }) {
  if (mini) return (
    <div className="mini-booking-card">
      <div className="mbc-icon">{b.ritual_icon}</div>
      <div className="mbc-info">
        <div className="mbc-name">{b.ritual}</div>
        <div className="mbc-meta">{b.booking_date} · {b.booking_time}</div>
      </div>
    </div>
  );

  return (
    <div className={`booking-action-card ${isToday ? 'accent' : ''}`}>
      <div className="bac-header">
        <div className="bac-ritual">
          <span className="bac-icon">{b.ritual_icon}</span>
          <div>
            <div className="ritual-name">{b.ritual}</div>
            <div className="devotee-info">{b.devotee_emoji} {b.devotee_name}</div>
          </div>
        </div>
        <div className="bac-timing">
          <div className="bac-date">{b.booking_date}</div>
          <div className="bac-time">{b.booking_time}</div>
        </div>
      </div>
      <div className="bac-body">
        <div className="bac-location">📍 {b.address}, {b.location}</div>
        {b.notes && <p className="bac-notes">📝 "{b.notes}"</p>}
      </div>
      {b.status === 'pending' && (
        <div className="bac-footer">
          <button className="btn btn-outline btn-sm" onClick={() => onAction(b.id, 'cancelled')}>Decline</button>
          <button className="btn btn-primary btn-sm" onClick={() => onAction(b.id, 'accepted')}>Confirm Booking</button>
        </div>
      )}
      {b.status === 'accepted' && isToday && (
        <div className="bac-footer">
          <button className="btn btn-primary btn-sm btn-full animate-pulse" onClick={() => window.open('/video-call/' + b.id)}>📿 Join Mandap (Live)</button>
        </div>
      )}
    </div>
  );
}

function EmptyModule({ message, icon }) {
  return (
    <div className="empty-module-box">
      <div className="em-icon">{icon}</div>
      <p className="em-msg">{message}</p>
    </div>
  );
}
