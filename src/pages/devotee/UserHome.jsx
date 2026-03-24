import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppCtx';
import { PanditCard } from '../../components/Cards';
import { StatusBadge } from '../../components/common/UIElements';
import SpiritualCalendarWidget from '../../features/user-portal/sankalp-engine/SpiritualCalendarWidget';

export default function UserHome() {
  const { db, devoteeId, devoteeName, setShowLogin, navigate: _nav } = useApp();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [stats, setStats] = useState({ saved: 0, rituals: 0, temples: 0 });

  useEffect(() => {
    // Fetch top pandits (verified, highest rated)
    db.pandits().select("*").eq('status', 'verified').order('rating', { ascending: false }).limit(3)
      .then(({ data }) => setPandits(data || []));

    if (devoteeId) {
      db.bookings().select("*").eq("devotee_id", devoteeId).order("created_at", { ascending: false }).limit(10)
        .then(({ data }) => {
          const bks = data || [];
          setBookings(bks);
          const saved = bks.reduce((s, b) => s + Math.round((b.amount || 0) * 0.1), 0);
          const rituals = bks.filter(b => b.status === 'confirmed' || b.status === 'completed').length;
          const temples = new Set(bks.filter(b => b.temple_id).map(b => b.temple_id)).size;
          setStats({ saved, rituals, temples });
        });
    }
  }, [devoteeId]);

  const goBook = () => { if (!devoteeId) setShowLogin(true); else navigate('/user/booking'); };
  const goInstant = () => { if (!devoteeId) setShowLogin(true); else navigate('/user/instant-booking'); };

  const upcoming = bookings.filter(b => b.status === "confirmed" || b.status === "pending");

  return (
    <>
      {/* Instant booking banner */}
      <div className="express-banner card" style={{ background: 'linear-gradient(90deg, #FF6B00, #FF9E00)', padding: '20px 30px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', color: '#fff' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontFamily: "'Cinzel', serif" }}>Need a Pandit Instantly?</h2>
          <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Book a certified scholar in under 60 seconds.</p>
        </div>
        <button className="btn btn-white btn-lg" onClick={goInstant} style={{ fontWeight: 800, background: '#fff', color: '#FF6B00' }}>⚡ Book Now</button>
      </div>

      {/* Real stats */}
      <div className="sg4 stat-grid">
        {[
          [devoteeId ? `₹${stats.saved > 0 ? stats.saved.toLocaleString() : '0'}` : '–', "Saved"],
          [devoteeId ? stats.rituals : '–', "Rituals"],
          [devoteeId ? stats.temples : '–', "Temples"],
          [devoteeId ? '🙏' : '–', "Blessings"]
        ].map(([v, l], i) => (
          <div key={i} className="stat-card"><div className="stat-val">{v}</div><div className="stat-lbl">{l}</div></div>
        ))}
      </div>

      {/* Rituals grid + calendar */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18, marginBottom: 22 }}>
        <div className="card card-p">
          <div className="sh">
            <div className="sh-title">Browse Most Booked Rituals</div>
            <button className="btn btn-ghost btn-sm" onClick={goBook}>View All</button>
          </div>
          <div className="rgrid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            {[["Griha Pravesh", "🏠"], ["Satyanarayan", "🐚"], ["Sundarkand", "🚩"], ["Navgrah", "⭐"], ["Rudrabhishek", "🕉️"], ["Custom Pooja", "🔱"]].map(([n, i]) => (
              <div key={n} className="rc" onClick={goBook} style={{ cursor: 'pointer' }}>
                <div className="rc-icon" style={{ fontSize: 24, padding: 10 }}>{i}</div>
                <div className="rc-body"><div className="rc-name" style={{ fontSize: 11 }}>{n}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <SpiritualCalendarWidget />
        </div>
      </div>

      {/* Pandits */}
      <div className="sh">
        <div className="sh-title">Highly Rated Scholars</div>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/user/marketplace')}>All Pandits</button>
      </div>
      {pandits.length > 0 ? (
        <div className="pgrid">{pandits.map(p => <PanditCard key={p.id} p={p} onBook={goBook} />)}</div>
      ) : (
        <div className="card card-p" style={{ textAlign: 'center', padding: 30, color: '#8B6347' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🕉️</div>
          <p>Pandits loading... Check your connection or add verified pandits to the database.</p>
        </div>
      )}

      {/* Upcoming bookings */}
      {devoteeId && upcoming.length > 0 && (
        <>
          <div className="sh" style={{ marginTop: 22 }}><div className="sh-title">Your Upcoming Appointments</div></div>
          <div className="card card-p">
            {upcoming.slice(0, 3).map(b => (
              <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: "1px solid rgba(212,160,23,.09)" }}>
                <div style={{ fontSize: 26 }}>{b.ritual_icon || '🕉️'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{b.ritual}</div>
                  <div style={{ fontSize: 12, color: "#8B6347" }}>{b.pandit_name} · {b.booking_date} at {b.booking_time}</div>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
