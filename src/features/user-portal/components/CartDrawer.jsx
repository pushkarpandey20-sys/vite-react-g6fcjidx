import React from 'react';
import { PremiumIcon } from '../../../components/Icons';

export default function CartDrawer({ cart, onUpdate, onRemove, subtotal, onClose, onCheckout }) {
  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <aside className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="cd-header">
          <div className="cd-title">Sacred Basket</div>
          <button className="cd-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="cd-items">
          {cart.length === 0 ? (
            <div className="cd-empty-state">
              <div className="empty-basket-icon">🛒</div>
              <h4 className="empty-title">Your basket is empty</h4>
              <p className="empty-desc">Explore our samagri catalog to fill your sacred store.</p>
              <button className="btn btn-outline btn-sm" onClick={onClose}>Start Shopping</button>
            </div>
          ) : (
            cart.map(i => (
              <div key={i.id} className="cd-item">
                <div className="cd-i-icon">
                  {i.icon?.startsWith('/') ? <PremiumIcon src={i.icon} size={32} /> : i.icon}
                </div>
                <div className="cd-i-details">
                  <div className="cd-i-name">{i.name}</div>
                  <div className="cd-i-price">₹{i.price * i.qty}</div>
                  <div className="cd-i-qty-ctrl">
                    <button className="qty-btn" onClick={() => onUpdate(i.id, -1)} disabled={i.qty <= 1}>-</button>
                    <span className="qty-val">{i.qty}</span>
                    <button className="qty-btn" onClick={() => onUpdate(i.id, 1)}>+</button>
                  </div>
                </div>
                <button className="cd-i-remove" onClick={() => onRemove(i.id)}>🗑️</button>
              </div>
            ))
          )}
        </div>

        <div className="cd-footer">
          <div className="cd-subtotal-row">
            <span className="subtotal-lbl">Subtotal</span>
            <span className="subtotal-val">₹{subtotal}</span>
          </div>
          <p className="cd-disclaimer">Taxes and delivery calculated at checkout.</p>
          <button 
            className="btn btn-primary btn-full checkout-btn" 
            onClick={onCheckout} 
            disabled={cart.length === 0}
          >
            📿 Complete Order
          </button>
        </div>
      </aside>
    </div>
  );
}
