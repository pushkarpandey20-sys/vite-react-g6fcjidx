import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';
import { useCart } from '../../hooks/useCart';
import SamagriCard from '../../features/user-portal/components/SamagriCard';
import CartDrawer from '../../features/user-portal/components/CartDrawer';
import CheckoutModal from '../../features/user-portal/components/CheckoutModal';
import { Spinner } from '../../components/common/UIElements';

export default function SamagriPage() {
  const { db, toast } = useApp();
  const { cart, addToCart, removeFromCart, updateQty, clearCart, subtotal, cartCount } = useCart();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await db.samagri().select("*").eq("active", true);
      setItems(data || []);
      setLoading(false);
    })();
  }, [db]);

  const handleCheckoutComplete = (formData) => {
    toast(`Order Placed for ${formData.name}! 🙏`, "📦");
    clearCart();
    setShowCheckout(false);
    setShowCart(false);
  };

  return (
    <div className="samagri-marketplace-page">
      {/* Header with Cart Button */}
      <div className="marketplace-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div>
          <h2 className="ph-title" style={{ color: '#F0C040' }}>Pooja Samagri Marketplace</h2>
          <p className="ph-sub">Pure and authentic items for your sacred ceremonies.</p>
        </div>
        <button className="btn btn-primary cart-btn" onClick={() => setShowCart(true)}>
          🛒 Sacred Basket {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>

      {loading ? <Spinner /> : (
        <div className="samagri-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {items.map(item => (
            <SamagriCard 
              key={item.id} 
              item={item} 
              onAdd={() => { addToCart(item); toast(`${item.name} added to sacred basket!`, "🛒"); }}
              onView={setViewItem}
            />
          ))}
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <CartDrawer 
          cart={cart} 
          onUpdate={updateQty} 
          onRemove={removeFromCart} 
          subtotal={subtotal} 
          onClose={() => setShowCart(false)}
          onCheckout={() => { setShowCart(false); setShowCheckout(true); }}
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal 
          subtotal={subtotal} 
          onClose={() => setShowCheckout(false)} 
          onComplete={handleCheckoutComplete}
        />
      )}

      {/* Item Detail Modal (Existing View logic refined) */}
      {viewItem && (
        <div className="overlay" onClick={() => setViewItem(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div style={{ fontSize: 60, marginBottom: 15 }}>{viewItem.icon}</div>
              <div className="modal-title">{viewItem.name}</div>
              <div className="modal-sub">📦 {viewItem.item_count} items · ₹{viewItem.price}</div>
              <button className="modal-close" onClick={() => setViewItem(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontStyle: 'italic', color: '#8B6347', marginBottom: 20 }}>{viewItem.description}</p>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#5C3317", textTransform: "uppercase", letterSpacing: 1, marginBottom: 15 }}>Kit Contents</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {(viewItem.contents || []).map((c, i) => (
                  <span key={i} className="samagri-tag" style={{ fontSize: 13, padding: '6px 14px' }}>{c}</span>
                ))}
              </div>
            </div>
            <div className="modal-foot" style={{ marginTop: 30 }}>
              <button className="btn btn-outline" onClick={() => setViewItem(null)}>Explore More</button>
              <button className="btn btn-primary" onClick={() => { addToCart(viewItem); setViewItem(null); toast(`${viewItem.name} added to basket!`, "🛒"); }}>🛒 Add to Basket — ₹{viewItem.price}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
