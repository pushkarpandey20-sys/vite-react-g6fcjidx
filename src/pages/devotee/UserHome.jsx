import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppCtx';
import { PanditCard } from '../../components/Cards';
import { StatusBadge } from '../../components/common/UIElements';

import SpiritualCalendarWidget from '../../features/user-portal/sankalp-engine/SpiritualCalendarWidget';

export default function UserHome() {
  const { db, devoteeId, devoteeName, setActivePage, setShowLogin, MUHURTAS } = useApp();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [pandits, setPandits] = useState([]);

  useEffect(() => {
    if (devoteeId) db.bookings().select("*").eq("devotee_id", devoteeId).limit(5).order("created_at", { ascending: false }).then(({ data }) => setBookings(data || []));
    db.pandits().select("*").limit(3).then(({ data }) => setPandits(data || []));
  }, [devoteeId, db]);

  const goBook = (id) => {
    if (!devoteeId) {
      setShowLogin(true);
    } else {
      setActivePage(id);
    }
  };

  const goInstant = () => {
    if (!devoteeId) setShowLogin(true);
    else navigate('/user/instant-booking');
  };


  const upcoming = bookings.filter(b => b.status === "confirmed" || b.status === "pending");

  return (<>
    <div className="express-banner card" style={{ background: 'linear-gradient(90deg, #FF6B00, #FF9E00)', padding: '20px 30px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', color: '#fff' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '1.6rem', fontFamily: "'Cinzel', serif" }}>Need a Pandit Instantly?</h2>
        <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Book a certified scholar in under 60 seconds.</p>
      </div>
      <button className="btn btn-white btn-lg" onClick={goInstant} style={{ fontWeight: 800 }}>⚡ Book Pandit Now</button>
    </div>

    <div className="sg4 stat-grid">
      {[["₹2.4k", "Saved"], ["3", "Rituals"], ["2", "Temples"], ["4.9 ★", "Ref Score"]].map(([v, l], i) => (
        <div key={i} className="stat-card"><div className="stat-val">{v}</div><div className="stat-lbl">{l}</div></div>
      ))}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18, marginBottom: 22 }}>
      <div className="card card-p">
        <div className="sh"><div className="sh-title">Browse Most Booked Rituals</div><button className="btn btn-ghost btn-sm" onClick={() => goBook("book-pandit")}>View All</button></div>
        <div className="rgrid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          {[["Griha Pravesh", "🏠"], ["Satyanarayan", "🐚"], ["Sundarkand", "🚩"], ["Navgrah", "⭐"], ["Rudrabhishek", "🕉️"], ["Custom Pooja", "🔱"]].map(([n, i]) => (
            <div key={n} className="rc" onClick={() => goBook("book-pandit")}><div className="rc-icon" style={{ fontSize: 24, padding: 10 }}>{i}</div><div className="rc-body"><div className="rc-name" style={{ fontSize: 11 }}>{n}</div></div></div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <SpiritualCalendarWidget />
      </div>
    </div>

    <div className="sh"><div className="sh-title">Highly Rated Scholars (Pandits)</div><button className="btn btn-ghost btn-sm" onClick={() => goBook("book-pandit")}>All Pandits</button></div>
    <div className="pgrid">{pandits.map(p => <PanditCard key={p.id} p={p} onBook={() => goBook("book-pandit")} />)}</div>

    {devoteeId && upcoming.length > 0 && <>
      <div className="sh" style={{ marginTop: 22 }}><div className="sh-title">Your Upcoming Appointments</div></div>
      <div className="card card-p">
        {upcoming.slice(0, 2).map(b => (
          <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: "1px solid rgba(212,160,23,.09)" }}>
            <div style={{ fontSize: 26 }}>{b.ritual_icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{b.ritual}</div>
              <div style={{ fontSize: 12, color: "#8B6347" }}>{b.pandit_name} · {b.booking_date} at {b.booking_time}</div>
            </div>
            <StatusBadge status={b.status} />
          </div>
        ))}
      </div>
    </>}
  </>);
}
