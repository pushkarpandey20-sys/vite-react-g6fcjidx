import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';
import { Spinner, Toggle } from '../../components/common/UIElements';

export default function AdminSamagriList() {
  const { db, toast } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.samagri().select("*").order("name").then(({ data }) => { setItems(data || []); setLoading(false); });
  }, []);

  const toggle = async (s) => {
    const v = !s.active;
    await db.samagri().update({ active: v }).eq("id", s.id);
    setItems(prev => prev.map(x => x.id === s.id ? { ...x, active: v } : x));
    toast(v ? `${s.name} in stock!` : `${s.name} out of stock`, v ? "📦" : "⚠️");
  };

  if (loading) return <Spinner />;
  return (<>
    <div className="sh"><div className="sh-title">Inventory: Pooja Samagri</div><div style={{ display: "flex", gap: 10 }}><button className="btn btn-primary btn-sm">+ Add Product</button></div></div>
    <div className="dtable">
      <div className="thead" style={{ gridTemplateColumns: ".8fr 1.5fr .8fr 1.5fr .8fr .8fr" }}>
        {["ID", "Product", "Items", "Price", "Status", "Manage"].map(h => <div key={h} className="th">{h}</div>)}
      </div>
      {items.map(s => (
        <div key={s.id} className="tr" style={{ gridTemplateColumns: ".8fr 1.5fr .8fr 1.5fr .8fr .8fr" }}>
          <div className="td" style={{ fontFamily: "'Cinzel',serif", fontSize: 10, color: "#FF6B00" }}>#{s.id?.slice(-6)}</div>
          <div className="td"><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ fontSize: 24 }}>{s.icon}</div><div style={{ fontWeight: 800 }}>{s.name}</div></div></div>
          <div className="td" style={{ fontWeight: 700 }}>{s.item_count} items</div>
          <div className="td" style={{ color: "#FF6B00", fontWeight: 700 }}>₹{s.price}</div>
          <div className="td"><span style={{ fontWeight: 800, color: s.active ? "#27AE60" : "#E67E22" }}>{s.active ? "In Stock" : "Unavailable"}</span></div>
          <div className="td"><Toggle on={s.active} onChange={() => toggle(s)} /></div>
        </div>
      ))}
    </div>
  </>);
}
