import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';

export default function TemplePage() {
  const { db, toast, devoteeId, setShowLogin } = useApp();
  const [temples, setTemples] = useState([]);
  const [booking, setBooking] = useState(null);
  const [selPooja, setSelPooja] = useState(null);
  useEffect(() => { db.temples().select("*").then(({ data }) => setTemples(data || [])); }, []);

  const handleBook = (t) => {
    if (!devoteeId) {
      setShowLogin(true);
    } else {
      setBooking(t);
    }
  };

  return (<>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 22 }}>
      {temples.map(t => (
        <div key={t.id} className="tc">
          <div className="tc-img">{t.is_live && <div className="live-b"><div className="live-dot" />LIVE</div>}<span>{t.icon}</span></div>
          <div className="tc-body">
            <div className="tc-name">{t.name}</div>
            <div className="tc-loc">📍 {t.city}</div>
            <div style={{ fontSize: 12, color: "#8B6347", marginBottom: 10, fontFamily: "'Crimson Pro',serif", fontStyle: "italic" }}>{t.description}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
              {(t.poojas || []).map((p, i) => <span key={i} className="ptag" onClick={() => handleBook(t)}>{p}</span>)}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#8B6347", fontWeight: 600 }}>🕐 Next: {t.next_aarti}</span>
              <div style={{ display: "flex", gap: 6 }}>
                {t.is_live && <button className="btn btn-danger btn-sm" onClick={() => toast(`Joining live darshan at ${t.name} !`, "🔴")}>🔴 Live</button>}
                <button className="btn btn-primary btn-sm" onClick={() => handleBook(t)}>Book</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    {booking && <div className="overlay" onClick={() => setBooking(null)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">{booking.icon} {booking.name}</div>
          <div className="modal-sub">📍 {booking.city} · Book a Sacred Pooja</div>
          <button className="modal-close" onClick={() => setBooking(null)}>✕</button>
        </div>
        <div className="modal-body">
          {(booking.poojas || []).map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 6, borderRadius: 10, border: `1.5px solid ${selPooja === p ? "#FF6B00" : "rgba(212,160,23,.2)"} `, cursor: "pointer", background: selPooja === p ? "rgba(255,107,0,.06)" : "transparent" }} onClick={() => setSelPooja(p)}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${selPooja === p ? "#FF6B00" : "rgba(212,160,23,.3)"} `, background: selPooja === p ? "#FF6B00" : "transparent" }} />
              <span style={{ fontWeight: 600, fontSize: 13.5 }}>{p}</span>
            </div>
          ))}
          <div className="fgrid" style={{ marginTop: 14 }}>
            <div className="fg"><label className="fl">Name</label><input className="fi" defaultValue="Rahul Sharma" /></div>
            <div className="fg"><label className="fl">Date</label><input type="date" className="fi" /></div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline btn-sm" onClick={() => setBooking(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { setBooking(null); toast(`Pooja booked at ${booking.name} !`, "🛕"); }}>Confirm Booking</button>
        </div>
      </div>
    </div>}
  </>);
}
