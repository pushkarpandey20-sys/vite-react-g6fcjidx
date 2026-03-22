import React from 'react';
import { Stars, StatusBadge } from './common/UIElements';

export function PanditCard({ p, onView, onBook, selected = false, selectMode = false }) {
  return (
    <div className={`pc ${selected ? "selected" : ""} `} onClick={() => selectMode ? onBook && onBook(p) : onView && onView(p)}>
      <div className="pc-head">
        <div className="pc-av">{p.emoji}</div>
        <div>
          <div className="pc-name">{p.name}</div>
          <div className="pc-spec">{p.speciality} · {p.experience_years} yrs</div>
          {p.verified && <div className="vbadge">✓ Verified</div>}
        </div>
      </div>
      <div className="pc-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div><Stars rating={p.rating} /><span style={{ fontWeight: 800, fontSize: 13, marginLeft: 3 }}>{p.rating}</span><span style={{ color: "#95A5A6", fontSize: 11.5 }}> ({p.review_count})</span></div>
          <div className="price-tag">₹{p.price?.toLocaleString()}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
          {(p.tags || []).slice(0, 2).map((t, i) => <span key={i} className="ptag">{t}</span>)}
          <span className="ptag ptag-g">📍 {p.city}</span>
        </div>
      </div>
    </div>
  );
}

export function ReqCard({ r, onAction, readOnly = false }) {
  return (
    <div className="breq">
      <div className="breq-av">{r.devotee_emoji || "👤"}</div>
      <div className="breq-info">
        <div className="breq-name">{r.devotee_name}</div>
        <div className="breq-det">{r.ritual_icon} {r.ritual}</div>
        <div className="breq-meta">
          <span>📅 {r.booking_date}</span>
          <span>🕐 {r.booking_time}</span>
          <span>📍 {r.address}</span>
        </div>
      </div>
      <div style={{ textAlign: "right", marginRight: 12, flexShrink: 0 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 700, color: "#FF6B00" }}>₹{r.amount?.toLocaleString()}</div>
        <StatusBadge status={r.status} />
      </div>
      {!readOnly && r.status === "pending" && <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
        <button className="btn btn-success btn-sm" onClick={() => onAction(r.id, "accepted")}>✓ Accept</button>
        <button className="btn btn-danger btn-sm" onClick={() => onAction(r.id, "rejected")}>✕ Decline</button>
      </div>}
    </div>
  );
}

