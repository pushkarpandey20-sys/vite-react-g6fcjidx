import React from 'react';

const getSamagriIcon = (name) => {
  const n = (name || "").toLowerCase();
  if (n.includes("thali")) return "🥣";
  if (n.includes("kit")) return "📦";
  if (n.includes("diya") || n.includes("lamp")) return "🪔";
  if (n.includes("incense") || n.includes("agarbatti")) return "☁️";
  if (n.includes("flower")) return "🌸";
  if (n.includes("fruit")) return "🍎";
  if (n.includes("ghee")) return "🧈";
  if (n.includes("honey")) return "🍯";
  if (n.includes("gangajal")) return "🧴";
  if (n.includes("rice") || n.includes("akshat")) return "🌾";
  if (n.includes("turmeric") || n.includes("haldi")) return "🧂";
  if (n.includes("sandalwood") || n.includes("chandan")) return "🪵";
  if (n.includes("coconut")) return "🥥";
  if (n.includes("bell")) return "🔔";
  if (n.includes("cloth")) return "🧣";
  return "📦";
};

export default function SamagriCard({ item, onAdd, onView }) {
  const icon = item.icon && item.icon !== "📦" ? item.icon : getSamagriIcon(item.name);
  return (
    <div className="samagri-card card">
      <div className="sc-img-box" onClick={() => onView(item)}>
        <span className="sc-icon">{icon}</span>
      </div>
      <div className="sc-meta-row">
        <span className="sc-category-tag">Sacred Item</span>
        <span className="sc-price-tag">₹{item.price}</span>
      </div>
      <div className="sc-body">
        <h4 className="sc-name" onClick={() => onView(item)}>{item.name}</h4>
        <p className="sc-desc">{item.description || "Essential elements for your divine rituals."}</p>
        <div className="sc-items-tag">📦 {item.item_count} Essential Items Included</div>
      </div>
      <div className="sc-actions">
        <button className="btn btn-primary btn-sm btn-full" onClick={() => onAdd(item)}>
          🛒 Add to Basket
        </button>
      </div>
    </div>
  );
}
