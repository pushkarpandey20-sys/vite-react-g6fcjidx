import React from 'react';

export function Toggle({ on, onChange }) {
  return <div className={`toggle ${on ? "on" : ""}`} onClick={() => onChange(!on)}><div className="toggle-knob" /></div>;
}

export function Toast({ toasts }) {
  return <div className="toast-wrap">{toasts.map(t => <div key={t.id} className="toast">{t.icon} {t.msg}</div>)}</div>;
}

export function Spinner() {
  return (
    <div className="loading">
      <div className="spinner" />
      <div style={{ fontSize: 13, color: "#8B6347", fontWeight: 700 }}>Loading sacred data...</div>
    </div>
  );
}

export function StatusBadge({ status }) {
  return <span className={`sb sb-${status}`}>{status?.charAt(0).toUpperCase() + status?.slice(1)}</span>;
}

export function Stars({ rating = 5 }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? "#D4A017" : "#ddd", fontSize: 13 }}>★</span>
      ))}
    </span>
  );
}
