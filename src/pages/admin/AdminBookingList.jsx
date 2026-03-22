import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';
import { Spinner, StatusBadge } from '../../components/common/UIElements';

export default function AdminBookingList() {
  const { db, toast } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.bookings().select("*").order("created_at", { ascending: false }).then(({ data }) => { setItems(data || []); setLoading(false); });
  }, []);

  if (loading) return <Spinner />;
  return (<>
    <div className="sh"><div className="sh-title">Order & Booking Log</div><div style={{ display: "flex", gap: 10 }}><button className="btn btn-outline btn-sm">Export CSV</button></div></div>
    <div className="dtable">
      <div className="thead" style={{ gridTemplateColumns: ".8fr 1.5fr .8fr 1.2fr .8fr 1fr" }}>
        {["Booking ID", "Devotee", "Pandit", "Ritual", "Amount", "Status"].map(h => <div key={h} className="th">{h}</div>)}
      </div>
      {items.map(b => (
        <div key={b.id} className="tr" style={{ gridTemplateColumns: ".8fr 1.5fr .8fr 1.2fr .8fr 1fr" }}>
          <div className="td" style={{ fontFamily: "'Cinzel',serif", fontSize: 10, color: "#FF6B00" }}>#{b.id?.slice(-6)}</div>
          <div className="td"><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,var(--s),var(--g))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{b.devotee_emoji || "👤"}</div><div style={{ fontWeight: 800 }}>{b.devotee_name}</div></div></div>
          <div className="td" style={{ fontWeight: 700 }}>{b.pandit_name}</div>
          <div className="td">{b.ritual_icon} {b.ritual}</div>
          <div className="td" style={{ fontWeight: 700 }}>₹{b.amount?.toLocaleString()}</div>
          <div className="td"><StatusBadge status={b.status} /></div>
        </div>
      ))}
    </div>
  </>);
}
