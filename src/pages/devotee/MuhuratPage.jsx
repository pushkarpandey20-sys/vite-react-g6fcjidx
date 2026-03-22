import React from 'react';
import { useApp } from '../../store/AppCtx';
import MuhuratFinder from '../../features/user-portal/components/Muhurtas/MuhuratFinder';

export default function MuhuratPage() {
  const { MUHURTAS } = useApp();
  return (
    <div className="muhurat-page-container">
      <MuhuratFinder />

      <div className="card card-p" style={{ marginTop: 40 }}>
        <div className="sh">
          <div className="sh-title">Traditional Panchang (General)</div>
          <div className="sh-sub">Daily auspicious and inauspicious timings at a glance.</div>
        </div>
        <div className="dtable" style={{ marginBottom: 0 }}>
          <div className="thead" style={{ gridTemplateColumns: ".8fr 1.2fr 1.2fr 1fr 1.5fr" }}>
            {["Day/Month", "Tithi", "Nakshatra", "Quality", "Primary Window"].map(h => <div key={h} className="th">{h}</div>)}
          </div>
          {MUHURTAS.map((m, i) => (
            <div key={i} className="tr" style={{ gridTemplateColumns: ".8fr 1.2fr 1.2fr 1fr 1.5fr" }}>
              <div className="td"><b>{m.day} {m.month}</b></div>
              <div className="td">{m.tithi}</div>
              <div className="td" style={{ fontSize: 12 }}>{m.nakshatra}</div>
              <div className="td"><span style={{ color: m.quality === "Excellent" ? "#27AE60" : "#D4A017", fontWeight: 700 }}>{m.quality}</span></div>
              <div className="td" style={{ fontSize: 13, fontWeight: 600 }}>{m.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
