import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';

export default function PanditEarningsPage() {
  const { db, panditId } = useApp();
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    if (!panditId) return;
    db.requests().select("*").eq("pandit_id", panditId).eq("status", "accepted").then(({ data }) => setRequests(data || []));
  }, [panditId]);
  const earned = requests.reduce((s, r) => s + (r.amount * 0.75 || 0), 0);
  const chartData = [40, 55, 48, 65, 72, 68, 80, 75, 88, 92, 85, 95];
  return (<>
    <div className="earnings-stats-bar" style={{ background: "linear-gradient(135deg,#1a0f07,#3d2211,#5c3317)", borderRadius: 16, padding: "22px", color: "#fff", marginBottom: 22 }}>
      {[[`₹${(earned + 42500).toLocaleString()} `, "This Month"], ["₹3,87,200", "This Year"], [requests.length + 23, "Poojas Done"], ["4.9 ★", "Rating"]].map(([v, l], i) => (
        <React.Fragment key={i}>
          <div style={{ textAlign: "center", padding: "0 6px" }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, fontWeight: 700, color: "#F0C040", marginBottom: 4 }}>{v}</div>
            <div style={{ fontSize: 10, color: "rgba(255,248,240,.5)", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
          </div>
          {i < 3 && <div style={{ background: "rgba(212,160,23,.2)", width: 1, margin: "10px 0" }} />}
        </React.Fragment>
      ))}
    </div>
    <div className="ac" style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, marginBottom: 12 }}>Monthly Earnings Trend</div>
      <div className="mini-chart" style={{ height: 80 }}>{chartData.map((v, i) => <div key={i} className="cbar" style={{ height: `${v}% ` }} />)}</div>
    </div>
    {requests.length > 0 && <>
      <div className="sh"><div className="sh-title">Accepted Bookings</div></div>
      <div className="dtable-scroll">
      <div className="dtable" style={{ minWidth: 480 }}>
        <div className="thead" style={{ gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr" }}>
          {["Req ID", "Devotee", "Ritual", "Gross", "Net (75%)"].map(h => <div key={h} className="th">{h}</div>)}
        </div>
        {requests.map((r, i) => (
          <div key={i} className="tr" style={{ gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr" }}>
            <div className="td" style={{ fontFamily: "'Cinzel',serif", fontSize: 10, color: "#FF6B00" }}>#{r.id?.slice(-6)}</div>
            <div className="td">{r.devotee_name}</div>
            <div className="td">{r.ritual_icon} {r.ritual}</div>
            <div className="td" style={{ fontWeight: 700 }}>₹{r.amount?.toLocaleString()}</div>
            <div className="td" style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, color: "#27AE60" }}>₹{Math.round(r.amount * .75).toLocaleString()}</div>
          </div>
        ))}
      </div>
      </div>
    </>}
  </>);
}
