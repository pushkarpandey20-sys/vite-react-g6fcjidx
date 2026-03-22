import React from 'react';

export default function SamagriCard({ item, onAdd, onView }) {
  return (
    <div className="samagri-card card">
      <div className="sc-img-box" onClick={() => onView(item)}>
        <span className="sc-icon">{item.icon || "📦"}</span>
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
