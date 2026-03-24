import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../store/AppCtx';
import { supabase, db } from '../../../services/supabase';
import { Spinner, Toggle } from '../../../components/common/UIElements';

import { notificationService } from '../../../services/notificationService';

export default function Dashboard() {
  const { panditId, panditName, panditOnline, setPanditOnline, toast, setShowPanditOnboarding } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!panditId) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await db.bookings()
        .select("*")
        .eq("pandit_id", panditId)
        .order("booking_date", { ascending: true });
      setBookings(data || []);
      setLoading(false);
    })();

    const channel = supabase.channel(`dashboard_${panditId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'bookings',
        filter: `pandit_id=eq.${panditId}` 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setBookings(prev => [payload.new, ...prev]);
          toast("New Sacred Invitation Received!", "🔔");
        } else if (payload.eventType === 'UPDATE') {
          setBookings(prev => prev.map(b => b.id === payload.new.id ? payload.new : b));
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [panditId]);


  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const pending = bookings.filter(b => b.status === 'pending');
    const todayBookings = bookings.filter(b => b.booking_date === today && b.status === 'accepted');
    const acceptedTotal = bookings.filter(b => b.status === 'accepted' || b.status === 'completed');
    const earnings = acceptedTotal.reduce((acc, b) => acc + (b.amount || 0), 0);
    const upcoming = bookings.filter(b => b.booking_date > today && b.status === 'accepted');
    return { pending, today: todayBookings, earnings, upcoming };
  }, [bookings]);

  const handleAction = async (id, status) => {
    const { error } = await db.bookings().update({ status }).eq("id", id);
    if (!error) {
      const b = bookings.find(x => x.id === id);
      if (status === 'accepted') {
        notificationService.notifyDevoteeOfAcceptance(b.devotee_id, b.ritual, panditName);
      }
      toast(`Booking ${status}.`, status === 'accepted' ? "✅" : "⚠️");
    }
  };


  if (loading) return <Spinner />;

  if (!panditId) {
    return (
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'70vh',gap:20}}>
        <div style={{fontSize:64}}>🙏</div>
        <h2 style={{fontFamily:"'Cinzel',serif",color:'#D4A017'}}>Sacred Scholar Gateway</h2>
        <p style={{color:'#888'}}>Please log in as a Pandit to manage your bookings</p>
        <button onClick={()=>setShowPanditOnboarding(true)} style={{background:'linear-gradient(135deg,#D4A017,#F0C040)',color:'#1a0f07',border:'none',borderRadius:28,padding:'12px 36px',fontWeight:800,cursor:'pointer'}}>🪔 Login as Pandit</button>
      </div>
    );
  }

  return (
    <div className="pandit-dashboard">
      <header className="dashboard-header wb">
        <div>
          <h2 className="ph-title animate-glow">🙏 Namaste, Pt. {panditName || "Ji"}</h2>
          <p className="ph-sub">Managing your sacred throughput for today.</p>
        </div>

        <div className="status-toggle-box card">
          <span className={`status-dot ${panditOnline ? 'online' : 'offline'}`} />
          <span className="status-lbl">{panditOnline ? "LIVE: ONLINE" : "LIVE: PAUSED"}</span>
          <Toggle on={panditOnline} onChange={setPanditOnline} />
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-row grid-4" style={{ marginBottom: 30 }}>
        {[
          ["₹" + stats.earnings.toLocaleString(), "Total Earnings", "gold-grad"],
          [stats.today.length, "Today's Rituals", "dark-grad"],
          [stats.pending.length, "Pending Requests", "dark-grad"],
          [stats.upcoming.length, "Upcoming Bookings", "dark-grad"]
        ].map(([v, l, c]) => (
          <div key={l} className={`stat-card ${c}`}>
            <div className="st-val">{v}</div>
            <div className="st-lbl">{l}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid display-2col">
        {/* Today's Bookings */}
        <section className="dashboard-module card card-p">
          <div className="sh"><div className="sh-title">Today's Sacred Schedule</div></div>
          {stats.today.length === 0 ? <EmptyState icon="📿" text="No rituals scheduled for today." /> : (
            stats.today.map(b => (
              <BookingItem key={b.id} b={b} onAction={handleAction} highlight />
            ))
          )}
        </section>

        {/* Pending Requests */}
        <section className="dashboard-module card card-p">
          <div className="sh"><div className="sh-title">Pending Invitations</div></div>
          {stats.pending.length === 0 ? <EmptyState icon="✨" text="All invitations addressed." /> : (
            stats.pending.map(b => (
              <BookingItem key={b.id} b={b} onAction={handleAction} showActions />
            ))
          )}
        </section>

        {/* Monthly Earnings / Performance (Implicitly covered by total stat, but showing list of completed here) */}
        <section className="dashboard-module card card-p ffw">
          <div className="sh"><div className="sh-title">Upcoming Devotional Activities (Next 7 Days)</div></div>
          <div className="upcoming-list grid-2">
            {stats.upcoming.map(b => (
              <BookingItem key={b.id} b={b} mini />
            ))}
            {stats.upcoming.length === 0 && <p className="ac" style={{ gridColumn: '1/-1', padding: 20 }}>No upcoming bookings in the next 7 days.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

function BookingItem({ b, onAction, highlight = false, showActions = false, mini = false }) {
  if (mini) return (
    <div className="mini-card card">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ fontSize: 24 }}>{b.ritual_icon}</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 13, color: "#2C1A0E" }}>{b.ritual}</div>
          <div style={{ fontSize: 11, color: "#8B6347" }}>{b.booking_date} · {b.booking_time}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`booking-action-card ${highlight ? 'accent' : ''}`}>
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
      {showActions && (
        <div className="bac-footer">
          <button className="btn btn-outline btn-sm" onClick={() => onAction(b.id, 'declined')}>Decline</button>
          <button className="btn btn-primary btn-sm" onClick={() => onAction(b.id, 'accepted')}>Accept</button>
        </div>
      )}
      {highlight && (
        <div className="bac-footer">
          <button className="btn btn-primary btn-sm btn-full animate-pulse" onClick={() => window.open('/mandap/' + b.id)}>📿 Join Mandap (Live)</button>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, text }) {
  return <div className="ac" style={{ padding: 40 }}><div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div><p style={{ fontFamily: 'Cinzel', fontSize: 14, color: '#8B6347' }}>{text}</p></div>;
}
