import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';
import { useCart } from '../../hooks/useCart';
import SamagriCard from '../../features/user-portal/components/SamagriCard';
import CartDrawer from '../../features/user-portal/components/CartDrawer';
import CheckoutModal from '../../features/user-portal/components/CheckoutModal';
import { Spinner } from '../../components/common/UIElements';

const getSamagriIcon = (name) => {
  const n = (name || "").toLowerCase();
  // Rituals / Occasions
  if (n.includes("diwali")) return "🪔";
  if (n.includes("griha pravesh") || n.includes("griha") || n.includes("housewarming")) return "🏠";
  if (n.includes("satyanarayan")) return "🌟";
  if (n.includes("ganesh") || n.includes("ganpati")) return "🐘";
  if (n.includes("laxmi") || n.includes("lakshmi")) return "🪷";
  if (n.includes("rudrabhishek") || n.includes("shiva") || n.includes("shiv")) return "🔱";
  if (n.includes("krishna") || n.includes("janmashtami")) return "🦚";
  if (n.includes("durga") || n.includes("navratri") || n.includes("devi")) return "🔴";
  if (n.includes("ram") || n.includes("hanuman")) return "🚩";
  if (n.includes("surya") || n.includes("sun") || n.includes("solar")) return "🌞";
  if (n.includes("navgrah") || n.includes("navagraha")) return "⭐";
  if (n.includes("kaal sarp") || n.includes("kalsarp") || n.includes("sarp")) return "🐍";
  if (n.includes("vastu")) return "🧿";
  if (n.includes("vivah") || n.includes("wedding") || n.includes("marriage")) return "💍";
  if (n.includes("namkaran") || n.includes("naming")) return "👶";
  if (n.includes("mundan") || n.includes("hair")) return "✂️";
  if (n.includes("upanayana") || n.includes("sacred thread") || n.includes("janeu")) return "🧵";
  if (n.includes("shraddha") || n.includes("pitra") || n.includes("ancestor")) return "🪔";
  if (n.includes("havan") || n.includes("homa") || n.includes("yagna")) return "🔥";
  // Items
  if (n.includes("thali")) return "🥣";
  if (n.includes("diya") || n.includes("deepak") || n.includes("lamp")) return "🪔";
  if (n.includes("agarbatti") || n.includes("incense") || n.includes("dhoop")) return "🌫️";
  if (n.includes("camphor") || n.includes("kapoor")) return "🕯️";
  if (n.includes("flower") || n.includes("phool") || n.includes("marigold") || n.includes("rose")) return "🌼";
  if (n.includes("fruit") || n.includes("phal")) return "🍎";
  if (n.includes("ghee")) return "🧈";
  if (n.includes("honey") || n.includes("shahad")) return "🍯";
  if (n.includes("gangajal") || n.includes("ganga jal")) return "💧";
  if (n.includes("rice") || n.includes("akshat") || n.includes("chawal")) return "🌾";
  if (n.includes("turmeric") || n.includes("haldi")) return "🟡";
  if (n.includes("kumkum") || n.includes("sindoor") || n.includes("roli")) return "🔴";
  if (n.includes("sandalwood") || n.includes("chandan")) return "🪵";
  if (n.includes("coconut") || n.includes("nariyal")) return "🥥";
  if (n.includes("bell") || n.includes("ghanta")) return "🔔";
  if (n.includes("cloth") || n.includes("vastram") || n.includes("dupatta")) return "🧣";
  if (n.includes("rudraksha") || n.includes("mala") || n.includes("rosary")) return "📿";
  if (n.includes("conch") || n.includes("shankh")) return "🐚";
  if (n.includes("kalash") || n.includes("copper pot") || n.includes("copper")) return "🏺";
  if (n.includes("sweets") || n.includes("prasad") || n.includes("ladoo") || n.includes("mithai")) return "🍮";
  if (n.includes("banana") || n.includes("kela")) return "🍌";
  if (n.includes("mango") || n.includes("aam")) return "🥭";
  if (n.includes("betel") || n.includes("paan") || n.includes("supari")) return "🌿";
  if (n.includes("sesame") || n.includes("til")) return "⚫";
  if (n.includes("mustard") || n.includes("sarso")) return "🌱";
  if (n.includes("oil") || n.includes("tel")) return "🫙";
  if (n.includes("water") || n.includes("jal")) return "💧";
  if (n.includes("leaf") || n.includes("tulsi") || n.includes("basil")) return "🌿";
  if (n.includes("mauli") || n.includes("kalava")) return "🔴";
  if (n.includes("thread") || n.includes("janeu")) return "🧵";
  if (n.includes("sugar") || n.includes("shakkar") || n.includes("mishri")) return "🍬";
  if (n.includes("curd") || n.includes("dahi") || n.includes("yogurt")) return "🥛";
  if (n.includes("milk") || n.includes("dudh")) return "🥛";
  // Kits / Combos
  if (n.includes("puja kit") || n.includes("pooja kit")) return "🕉️";
  if (n.includes("kit") || n.includes("combo") || n.includes("set") || n.includes("package")) return "🎁";
  return "🛕";
};

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
              <div style={{ fontSize: 60, marginBottom: 15 }}>{viewItem.icon && viewItem.icon !== '📦' ? viewItem.icon : getSamagriIcon(viewItem.name)}</div>
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
