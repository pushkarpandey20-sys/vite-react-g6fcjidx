import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';
import { Spinner, Toggle } from '../../components/common/UIElements';

export default function AdminRitualList() {
  const { db, toast } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.rituals().select("*").order("name").then(({ data }) => { setItems(data || []); setLoading(false); });
  }, []);

  const toggle = async (r) => {
    const v = !r.active;
    await db.rituals().update({ active: v }).eq("id", r.id);
    setItems(prev => prev.map(x => x.id === r.id ? { ...x, active: v } : x));
    toast(v ? `${r.name} activated!` : `${r.name} deactivated`, v ? "✅" : "⚠️");
  };

  if (loading) return <Spinner />;
  return (<>
    <div className="sh"><div className="sh-title">Ritual & Pooja Management</div><div style={{ display: "flex", gap: 10 }}><button className="btn btn-primary btn-sm">+ New Ritual</button></div></div>
    <div className="dtable">
      <div className="thead" style={{ gridTemplateColumns: ".8fr 1.5fr .8fr 1fr .8fr 1fr" }}>
        {["ID", "Ritual Name", "Duration", "Dakshina", "Status", "Action"].map(h => <div key={h} className="th">{h}</div>)}
      </div>
      {items.map(r => (
        <div key={r.id} className="tr" style={{ gridTemplateColumns: ".8fr 1.5fr .8fr 1fr .8fr 1fr" }}>
          <div className="td" style={{ fontFamily: "'Cinzel',serif", fontSize: 10, color: "#FF6B00" }}>#{r.id?.slice(-6)}</div>
          <div className="td"><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ fontSize: 24 }}>{r.icon}</div><div style={{ fontWeight: 800 }}>{r.name}</div></div></div>
          <div className="td">{r.duration}</div>
          <div className="td" style={{ fontWeight: 700 }}>₹{r.price?.toLocaleString()}</div>
          <div className="td"><span style={{ fontWeight: 800, color: r.active ? "#27AE60" : "#E67E22" }}>{r.active ? "Enabled" : "Disabled"}</span></div>
          <div className="td"><Toggle on={r.active} onChange={() => toggle(r)} /></div>
        </div>
      ))}
    </div>
  </>);
}
