import React, { useState, useEffect } from 'react';
import { useApp } from '../../../store/AppCtx';
import { useCart } from '../../../hooks/useCart';
import SamagriCard from '../components/SamagriCard';
import CartDrawer from '../components/CartDrawer';
import CheckoutModal from '../components/CheckoutModal';
import { samagriApi } from '../../../api/samagriApi';
import { Spinner } from '../../../components/common/UIElements';

export default function SamagriStorePage() {
  const { devoteeId, toast } = useApp();
  const { cart, addToCart, removeFromCart, updateQty, clearCart, subtotal, cartCount } = useCart();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await samagriApi.getProducts();
      setItems(data || []);
      setLoading(false);
    })();
  }, []);

  const handleCheckoutComplete = async (paymentData, formData) => {
    try {
      const orderPayload = {
        userId: devoteeId,
        items: cart,
        totalAmount: subtotal,
        deliveryAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zip: formData.zip
        },
        paymentId: paymentData.payment_id
      };

      const { error } = await samagriApi.createOrder(orderPayload);
      if (error) throw error;

      toast(`Sacred Order Placed Successfully! 🙏`, "🛒");
      clearCart();
      setShowCheckout(false);
      setShowCart(false);
    } catch (err) {
      toast("Sacred Transaction Failed: " + err.message, "❌");
    }
  };

  return (
    <div className="samagri-store-page">
      <div className="marketplace-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div>
          <h2 className="ph-title" style={{ color: '#F0C040' }}>Pooja Store</h2>
          <p className="ph-sub">Explore our catalog of high-quality sacred items and puja rituals.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn btn-primary cart-btn" onClick={() => setShowCart(true)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '15px' }}>
            🛒 Sacred Cart {cartCount > 0 && <span className="cart-badge" style={{ background: '#fff', color: '#FF6B00', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>{cartCount}</span>}
          </button>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className="samagri-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {items.map(item => (
            <SamagriCard 
              key={item.id} 
              item={item} 
              onAdd={() => { addToCart(item); toast(`${item.name} added!`, "🛒"); }}
              onView={setViewItem}
            />
          ))}
        </div>
      )}

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

      {showCheckout && (
        <CheckoutModal 
          subtotal={subtotal} 
          onClose={() => setShowCheckout(false)} 
          onComplete={handleCheckoutComplete}
        />
      )}

      {/* Item Detail Modal */}
      {viewItem && (
        <div className="overlay" onClick={() => setViewItem(null)} style={{ zIndex: 2000 }}>
          <div className="modal card" onClick={e => e.stopPropagation()} style={{ padding: '30px', maxWidth: '600px' }}>
            <button className="modal-close" onClick={() => setViewItem(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', opacity: 0.5 }}>✕</button>
            <div style={{ display: 'flex', gap: '30px' }}>
              <div style={{ fontSize: '100px', background: '#FFFAF5', borderRadius: '25px', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{viewItem.icon}</div>
              <div>
                <h3 className="ph-title" style={{ fontSize: '1.8rem', margin: '0 0 10px 0' }}>{viewItem.name}</h3>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FF6B00', marginBottom: '15px' }}>₹{viewItem.price}/-</div>
                <p style={{ color: '#8B6347', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.5 }}>{viewItem.description}</p>
                
                <div style={{ fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: '#5C3317', marginBottom: '10px' }}>Kit Contents:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(viewItem.contents || viewItem.itemsIncluded || []).map((c, i) => (
                    <span key={i} style={{ fontSize: '12px', background: 'rgba(212,160,23,.05)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(212,160,23,.1)', fontWeight: 600, color: '#2C1A0E' }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <button className="btn btn-outline" onClick={() => setViewItem(null)}>Back to Store</button>
              <button className="btn btn-primary" onClick={() => { addToCart(viewItem); setViewItem(null); toast(`${viewItem.name} added!`, "🛒"); }}> Add to Sacred Cart — ₹{viewItem.price}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
