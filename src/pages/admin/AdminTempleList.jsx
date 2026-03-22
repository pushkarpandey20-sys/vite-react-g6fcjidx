import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';
import { Spinner, Toggle } from '../../components/common/UIElements';

export default function AdminTempleList() {
  const { db, toast } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.temples().select("*").order("name").then(({ data }) => { setItems(data || []); setLoading(false); });
  }, []);

  const toggle = async (t) => {
    const v = !t.is_live;
    await db.temples().update({ is_live: v }).eq("id", t.id);
    setItems(prev => prev.map(x => x.id === t.id ? { ...x, is_live: v } : x));
    toast(v ? `${t.name} is now LIVE!` : `${t.name} live stream off`, v ? "🔴" : "⚠️");
  };

  if (loading) return <Spinner />;
  return (<>
    <div className="sh"><div className="sh-title">Temple Registry</div><div style={{ display: "flex", gap: 10 }}><button className="btn btn-primary btn-sm">+ New Temple</button></div></div>
    <div className="dtable">
      <div className="thead" style={{ gridTemplateColumns: ".8fr 1.5fr .8fr 1.5fr .8fr .8fr" }}>
        {["ID", "Temple", "Location", "Aarti", "Go Live", "Delete"].map(h => <div key={h} className="th">{h}</div>)}
      </div>
      {items.map(t => (
        <div key={t.id} className="tr" style={{ gridTemplateColumns: ".8fr 1.5fr .8fr 1.5fr .8fr .8fr" }}>
          <div className="td" style={{ fontFamily: "'Cinzel',serif", fontSize: 10, color: "#FF6B00" }}>#{t.id?.slice(-6)}</div>
          <div className="td"><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ fontSize: 24 }}>{t.icon}</div><div style={{ fontWeight: 800 }}>{t.name}</div></div></div>
          <div className="td" style={{ fontWeight: 700 }}>{t.city}</div>
          <div className="td">{t.next_aarti}</div>
          <div className="td"><Toggle on={t.is_live} onChange={() => toggle(t)} /></div>
          <div className="td"><button className="btn btn-outline btn-sm">✕</button></div>
        </div>
      ))}
    </div>
  </>);
}
