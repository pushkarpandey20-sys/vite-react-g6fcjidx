import React, { useState } from 'react';
import { useApp } from '../../store/AppCtx';
import { Toggle } from '../../components/common/UIElements';

export default function PanditAvailPage() {
  const { toast } = useApp();
  const [avail, setAvail] = useState(
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d, i) => ({ day: d, enabled: i !== 0, from: "06:00", to: "20:00" }))
  );
  return (
    <div className="card card-p">
      <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, marginBottom: 18 }}>Weekly Schedule</div>
      {avail.map((a, i) => (
        <div key={a.day} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: a.enabled ? "rgba(255,243,230,.5)" : "rgba(0,0,0,.02)", borderRadius: 11, marginBottom: 8, border: `1px solid ${a.enabled ? "rgba(212,160,23,.2)" : "rgba(0,0,0,.06)"} ` }}>
          <div style={{ width: 92, fontWeight: 700, color: a.enabled ? "#5C3317" : "#aaa", fontSize: 13.5 }}>{a.day}</div>
          <div style={{ display: "flex", gap: 10, flex: 1, opacity: a.enabled ? 1 : .4 }}>
            {["from", "to"].map(k => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <label style={{ fontSize: 11, color: "#8B6347", fontWeight: 700 }}>{k === "from" ? "From" : "To"}</label>
                <input type="time" className="fi" value={a[k]} onChange={e => setAvail(av => av.map((x, j) => j === i ? { ...x, [k]: e.target.value } : x))} style={{ padding: "5px 9px", width: 110 }} />
              </div>
            ))}
          </div>
          <Toggle on={a.enabled} onChange={v => setAvail(av => av.map((x, j) => j === i ? { ...x, enabled: v } : x))} />
        </div>
      ))}
      <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => toast("Schedule saved!", "✅")}>💾 Save Schedule</button>
    </div>
  );
}
