import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';
import { supabase } from '../../services/supabase';
import { Spinner, StatusBadge } from '../../components/common/UIElements';
import { RatePanditModal } from '../../components/modals/AllModals';

export default function HistoryPage() {
  const { db, devoteeId, setShowLogin, submitReview } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [ratingBooking, setRatingBooking] = useState(null);

  useEffect(() => {
    if (!devoteeId) { setLoading(false); return; }
    db.bookings().select("*").eq("devotee_id", devoteeId).order("created_at", { ascending: false })
      .then(({ data }) => { setBookings(data || []); setLoading(false); });
  }, [devoteeId]);

  // realtime
  useEffect(() => {
    if (!devoteeId) return;
    const ch = supabase.channel("bookings-user").on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "bookings",
      filter: `devotee_id = eq.${devoteeId}`
    }, (payload) => {
      setBookings(prev => [payload.new, ...prev]);
    }).subscribe();
    return () => supabase.removeChannel(ch);
  }, [devoteeId]);

  if (!devoteeId) {
    return (
      <div style={{ textAlign:"center", padding:"60px 20px", background:'rgba(26,15,7,0.6)', borderRadius:18, border:'1px solid rgba(240,192,64,0.1)' }}>
        <div style={{ fontSize:60, marginBottom:20 }}>📋</div>
        <h3 style={{ fontFamily:"'Cinzel',serif", color:'#F0C040', marginBottom:10 }}>Login Required</h3>
        <p style={{ color:"rgba(255,248,240,0.5)", marginBottom:24 }}>Please login to view and track your pooja booking history.</p>
        <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Login / Register</button>
      </div>
    );
  }

  if (loading) return <Spinner />;
  const filtered = filter === "All" ? bookings : bookings.filter(b => (b.booking_status || b.status) === filter.toLowerCase());
  
  return (<>
    <div style={{ marginBottom: 16 }}>
      {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map(f => (
        <span key={f} className={`chip ${filter === f ? "on" : ""} `} onClick={() => setFilter(f)}>
          {f} ({f === "All" ? bookings.length : bookings.filter(b => (b.booking_status || b.status) === f.toLowerCase() || (f === "Confirmed" && b.booking_status === "booking_confirmed")).length})
        </span>
      ))}
    </div>
    {filtered.length === 0 ? <div style={{ textAlign:"center", padding:"40px", background:'rgba(26,15,7,0.6)', borderRadius:14, border:'1px solid rgba(240,192,64,0.1)' }}>
      <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
      <div style={{ fontFamily:"'Cinzel',serif", color:"#F0C040" }}>No bookings found</div>
    </div> : <div className="dtable">
      <div className="thead" style={{ gridTemplateColumns: ".7fr 1.3fr 1.5fr 1.2fr .8fr .8fr 1fr" }}>
        {["ID", "Ritual", "Pandit", "Location", "Date", "Amount", "Status"].map(h => <div key={h} className="th">{h}</div>)}
      </div>
      {filtered.map(b => (
        <div key={b.id} style={{ display: 'contents' }}>
          <div className="tr" style={{ gridTemplateColumns: ".7fr 1.3fr 1.5fr 1.2fr .8fr .8fr 1fr", borderBottom: b.prasad_required ? 'none' : '1px solid rgba(212,160,23,.09)' }}>
            <div className="td" style={{ fontFamily: "'Cinzel',serif", fontSize: 10, color: "#FF6B00" }}>#{b.id?.slice(-6)}</div>
            <div className="td">{b.ritual_icon} {b.ritual}</div>
            <div className="td"><div style={{ fontSize: 12 }}>{b.pandit_name || "Temple Direct"}</div><div className="td2">{b.booking_time || "Scheduled"}</div></div>
            <div className="td" style={{ fontSize: 12 }}>{b.location}</div>
            <div className="td" style={{ fontSize: 12 }}>{b.booking_date}</div>
            <div className="td" style={{ fontFamily: "'Cinzel',serif", fontWeight: 700 }}>₹{b.amount?.toLocaleString()}</div>
            <div className="td" style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "center" }}>
              <StatusBadge status={b.booking_status || b.status} />
              {(b.booking_status === 'ritual_completed' || b.status === 'completed') && (
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 9, padding: "2px 8px" }} onClick={() => setRatingBooking(b)}>⭐ Rate</button>
              )}
            </div>
          </div>
          {b.prasad_required && (
            <div className="ds-prasad-row" style={{ gridColumn: '1 / -1', padding: '10px 20px', fontSize: '11px', display: 'flex', gap: '25px', alignItems: 'center', marginTop: '-1px' }}>
              <div style={{ fontWeight: 800, color: '#FF9F40', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14px' }}>🍬</span> PRASAD STATUS:
              </div>
              <div style={{ color:'rgba(255,248,240,0.6)' }}>Dispatch: <span style={{ fontWeight: 700, color:'rgba(255,248,240,0.85)' }}>{b.dispatch_date || "Pending Ritual"}</span></div>
              <div style={{ color:'rgba(255,248,240,0.6)' }}>Tracking: <span style={{ fontWeight: 700, fontStyle: 'italic', color:'rgba(255,248,240,0.85)' }}>{b.courier_tracking || "Awaiting Courier"}</span></div>
              <div style={{ marginLeft: 'auto', color:'rgba(255,248,240,0.4)' }}>📍 {b.delivery_address?.slice(0, 30)}...</div>
            </div>
          )}
        </div>
      ))}
    </div>}
    
    {ratingBooking && (
      <RatePanditModal 
        booking={ratingBooking} 
        onClose={() => setRatingBooking(null)} 
        onSubmit={submitReview} 
      />
    )}
  </>);
}
