import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationStore from '../../../services/notificationService';

const CATEGORIES = ['All', 'Festival Kits', 'Daily Worship', 'Abhishek', 'Havan', 'Incense & Diyas'];

const PRODUCTS = [
  { id:1, name:'Diwali Pooja Kit', category:'Festival Kits', icon:'🪔', price:899, mrp:1199, items:61, desc:'Complete Lakshmi-Ganesh puja essentials. 61 items including diyas, rangoli, incense, sweets prasad, red cloth, sindoor, lotus flowers, roli, moli, supari, betel leaves.', badge:'BESTSELLER', rating:4.8, reviews:234 },
  { id:2, name:'Ganesh Puja Kit', category:'Festival Kits', icon:'🐘', price:349, mrp:499, items:29, desc:'29 items: modak, durva grass, red flowers, coconut, camphor, roli, moli, supari, banana, red cloth, incense sticks, ghee, vermilion, sesame seeds, akshat.', rating:4.7, reviews:189 },
  { id:3, name:'Griha Pravesh Kit', category:'Festival Kits', icon:'🏡', price:599, mrp:799, items:52, desc:'52 items: sacred thread, turmeric, rice, copper kalash, mango leaves, coconut, flowers, navadhanya, holy water, camphor, ghee, incense, red cloth, coins.', badge:'POPULAR', rating:4.9, reviews:312 },
  { id:4, name:'Navratri Pooja Kit', category:'Festival Kits', icon:'🌺', price:499, mrp:699, items:35, desc:'35 items for 9-day Durga puja. Chunri, sindoor, shakkar, fruits, incense, camphor, oil lamp, red flowers, coconut, betel leaves, kum kum, durga yantra.', rating:4.6, reviews:145 },
  { id:5, name:'Satyanarayan Kit', category:'Daily Worship', icon:'🌟', price:299, mrp:399, items:24, desc:'24 items for Satyanarayan Katha: panchamrit ingredients (milk, curd, honey, ghee, sugar), banana, tulsi, yellow flowers, yellow cloth, akshat, camphor.', rating:4.8, reviews:278 },
  { id:6, name:'Rudrabhishek Kit', category:'Abhishek', icon:'🔱', price:449, mrp:599, items:18, desc:'18 items for Shiva abhishek: milk, honey, curd, ghee, sugar, gangajal, bel patra, dhatura, blue flowers, camphor, vibhuti, rudraksha, black sesame.', rating:4.9, reviews:167 },
  { id:7, name:'Havan Samagri Kit', category:'Havan', icon:'🔥', price:699, mrp:899, items:42, desc:'42 items complete havan kit: pure ghee 500ml, havan kund, samagri mix 500g, mango wood pieces, camphor, incense, navagraha herbs, sandalwood powder.', badge:'PREMIUM', rating:4.7, reviews:98 },
  { id:8, name:'Daily Puja Kit', category:'Daily Worship', icon:'🌸', price:199, mrp:299, items:15, desc:'15 everyday essentials: incense sticks (3 varieties), camphor, matchbox, sindoor, roli, moli, flowers (artificial), ghee lamp, wick, small idol base cloth.', rating:4.5, reviews:456 },
  { id:9, name:'Premium Incense Set', category:'Incense & Diyas', icon:'🕯️', price:249, mrp:349, items:8, desc:'8 varieties premium incense: sandalwood, jasmine, rose, camphor, guggul, mogra, lavender, chandan — 120 sticks total. Long-lasting 45-min burn time.', rating:4.6, reviews:203 },
  { id:10, name:'Diya & Lamp Set', category:'Incense & Diyas', icon:'✨', price:349, mrp:499, items:12, desc:'12 piece set: 4 brass diyas, 4 clay diyas, 1 oil lamp with stand, cotton wicks (50), mustard oil 200ml, cleaning cloth. Perfect for daily aarti.', rating:4.8, reviews:321 },
  { id:11, name:'Navgrah Shanti Kit', category:'Havan', icon:'⭐', price:799, mrp:999, items:54, desc:'54 items for 9-planet ritual: 9 grains, 9 flowers, 9 fruits, 9 herbs (ashwagandha, shatavari etc.), havan samagri, ghee, navgrah yantra, colored cloth strips.', badge:'COMPLETE', rating:4.9, reviews:87 },
  { id:12, name:'Laxmi Puja Kit', category:'Daily Worship', icon:'🪷', price:399, mrp:549, items:28, desc:'28 items for Friday Laxmi puja: red/pink flowers, lotus, coins, betel leaves, supari, banana, fruits, red cloth, laxmi yantra, incense, camphor, sindoor, kumkum.', rating:4.7, reviews:176 },
];

export default function SamagriStorePage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState({});
  const [sortBy, setSortBy] = useState('popular');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutDone, setCheckoutDone] = useState(false);

  const filtered = PRODUCTS
    .filter(p => category === 'All' || p.category === category)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'price_low' ? a.price - b.price : sortBy === 'price_high' ? b.price - a.price : sortBy === 'rating' ? b.rating - a.rating : b.reviews - a.reviews);

  const addToCart = (product, e) => {
    if (e) e.stopPropagation();
    setCart(prev => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
    if (notificationStore) notificationStore.recordSearch(product.name);
  };

  const removeFromCart = (productId, e) => {
    if (e) e.stopPropagation();
    setCart(prev => {
      const qty = (prev[productId] || 1) - 1;
      if (qty <= 0) { const n = { ...prev }; delete n[productId]; return n; }
      return { ...prev, [productId]: qty };
    });
  };

  const clearItem = (productId, e) => {
    if (e) e.stopPropagation();
    setCart(prev => { const n = { ...prev }; delete n[productId]; return n; });
  };

  const totalItems = Object.values(cart).reduce((s, q) => s + q, 0);
  const totalPrice = Object.entries(cart).reduce((s, [id, q]) => {
    const p = PRODUCTS.find(p => p.id === parseInt(id));
    return s + (p ? p.price * q : 0);
  }, 0);
  const totalSavings = Object.entries(cart).reduce((s, [id, q]) => {
    const p = PRODUCTS.find(p => p.id === parseInt(id));
    return s + (p ? (p.mrp - p.price) * q : 0);
  }, 0);

  const cardStyle = (inCart) => ({
    background: inCart ? 'rgba(255, 107, 0, 0.06)' : '#ffffff',
    border: inCart ? '2px solid rgba(255, 107, 0, 0.5)' : '1px solid rgba(212, 160, 23, 0.2)',
    borderRadius: 14,
    padding: 18,
    position: 'relative',
    transition: 'all 0.25s',
    cursor: 'pointer',
    boxShadow: inCart ? '0 4px 16px rgba(255,107,0,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
  });

  return (
    <div style={{ fontFamily: 'Nunito, sans-serif', minHeight: '100vh', background: '#fff8f0' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h1 style={{ color: '#FF6B00', fontFamily: 'Cinzel,serif', margin: 0, fontSize: 24, fontWeight: 900 }}>🛍️ Pooja Samagri Store</h1>
            <p style={{ color: '#9a8070', margin: '4px 0 0', fontSize: 14 }}>Authentic, purity-certified samagri · Same-day delivery in Delhi NCR</p>
          </div>
          {totalItems > 0 && (
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#FF6B00,#FF8C35)', color: '#fff', border: 'none', borderRadius: 28, padding: '12px 20px', fontWeight: 800, cursor: 'pointer', fontSize: 14, boxShadow: '0 4px 12px rgba(255,107,0,0.3)' }}>
              🧺 Cart ({totalItems}) · ₹{totalPrice.toLocaleString()}
            </button>
          )}
        </div>
        {/* Search + Sort */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search samagri kits..."
            style={{ flex: 1, padding: '10px 16px', borderRadius: 10, border: '1.5px solid rgba(212,160,23,0.4)', background: '#fff', color: '#1a0f07', fontSize: 14, outline: 'none', width: 'auto' }} />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid rgba(212,160,23,0.4)', background: '#fff', color: '#1a0f07', fontSize: 13, cursor: 'pointer', width: 'auto' }}>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price_low">Price: Low → High</option>
            <option value="price_high">Price: High → Low</option>
          </select>
        </div>
        {/* Categories */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{ padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, background: category === c ? '#FF6B00' : 'rgba(255,107,0,0.1)', color: category === c ? '#fff' : '#FF6B00', transition: 'all 0.2s', width: 'auto' }}>{c}</button>
          ))}
        </div>
        {/* Delivery banner */}
        <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10, padding: '10px 16px', marginBottom: 20, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[['🚚', 'Same-day delivery Delhi NCR'], ['✅', '100% authentic & purity certified'], ['🔄', 'Easy 7-day returns'], ['🆓', 'Free delivery above ₹999']].map(([i, t]) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{i}</span><span style={{ color: '#1a6b1a', fontSize: 12, fontWeight: 600 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {filtered.map(p => {
          const qty = cart[p.id] || 0;
          const discount = Math.round((1 - p.price / p.mrp) * 100);
          return (
            <div key={p.id} style={cardStyle(qty > 0)} onClick={() => setSelectedProduct(p)}>
              {p.badge && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: p.badge === 'BESTSELLER' ? '#FF6B00' : p.badge === 'POPULAR' ? '#22c55e' : '#8b5cf6', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 10, letterSpacing: 1 }}>{p.badge}</div>
              )}
              {qty > 0 && (
                <div style={{ position: 'absolute', top: 12, left: 12, background: '#FF6B00', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10 }}>✓ In Cart ({qty})</div>
              )}
              <div style={{ fontSize: 44, textAlign: 'center', marginBottom: 10, marginTop: qty > 0 ? 16 : 0 }}>{p.icon}</div>
              <h3 style={{ color: '#1a0f07', fontFamily: 'Cinzel,serif', margin: '0 0 4px', fontSize: 15, fontWeight: 700 }}>{p.name}</h3>
              <div style={{ color: '#9a8070', fontSize: 11, marginBottom: 6 }}>🧺 {p.items} items · ⭐ {p.rating} ({p.reviews} reviews)</div>
              <p style={{ color: '#4a3728', fontSize: 12, lineHeight: 1.5, margin: '0 0 12px', height: 56, overflow: 'hidden' }}>{p.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ color: '#FF6B00', fontWeight: 800, fontSize: 22 }}>₹{p.price}</span>
                <span style={{ color: '#9a8070', fontSize: 13, textDecoration: 'line-through' }}>₹{p.mrp}</span>
                <span style={{ background: 'rgba(34,197,94,0.15)', color: '#15803d', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>{discount}% OFF</span>
              </div>
              <div style={{ color: '#22c55e', fontSize: 11, fontWeight: 600, marginBottom: 12 }}>You save ₹{(p.mrp - p.price).toLocaleString()}</div>
              {qty === 0 ? (
                <button onClick={(e) => addToCart(p, e)} style={{ width: '100%', background: 'linear-gradient(135deg,#FF6B00,#FF8C35)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                  🧺 Add to Basket
                </button>
              ) : (
                <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={(e) => removeFromCart(p.id, e)} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,107,0,0.15)', color: '#FF6B00', border: '2px solid rgba(255,107,0,0.4)', cursor: 'pointer', fontWeight: 800, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ color: '#1a0f07', fontWeight: 800, fontSize: 18, flex: 1, textAlign: 'center' }}>{qty}</span>
                  <button onClick={(e) => addToCart(p, e)} style={{ width: 38, height: 38, borderRadius: '50%', background: '#FF6B00', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  <button onClick={(e) => clearItem(p.id, e)} style={{ background: 'none', border: 'none', color: '#9a8070', cursor: 'pointer', fontSize: 18, padding: '0 4px' }} title="Remove from cart">🗑️</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div onClick={() => setSelectedProduct(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, padding: 28, maxWidth: 480, width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 56, marginBottom: 8 }}>{selectedProduct.icon}</div>
              <h2 style={{ color: '#1a0f07', fontFamily: 'Cinzel,serif', margin: 0, fontSize: 20 }}>{selectedProduct.name}</h2>
            </div>
            <p style={{ color: '#4a3728', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{selectedProduct.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ color: '#FF6B00', fontWeight: 800, fontSize: 26 }}>₹{selectedProduct.price}</span>
              <span style={{ color: '#9a8070', fontSize: 16, textDecoration: 'line-through' }}>₹{selectedProduct.mrp}</span>
              <span style={{ background: 'rgba(34,197,94,0.15)', color: '#15803d', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{Math.round((1-selectedProduct.price/selectedProduct.mrp)*100)}% OFF</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              {(cart[selectedProduct.id] || 0) === 0 ? (
                <button onClick={(e) => { addToCart(selectedProduct, e); setSelectedProduct(null); }} style={{ flex: 1, background: 'linear-gradient(135deg,#FF6B00,#FF8C35)', color: '#fff', border: 'none', borderRadius: 10, padding: 12, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>🧺 Add to Basket</button>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={(e) => removeFromCart(selectedProduct.id, e)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,107,0,0.15)', color: '#FF6B00', border: '2px solid rgba(255,107,0,0.4)', cursor: 'pointer', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 18, color: '#1a0f07' }}>{cart[selectedProduct.id]}</span>
                  <button onClick={(e) => addToCart(selectedProduct, e)} style={{ width: 36, height: 36, borderRadius: '50%', background: '#FF6B00', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
              )}
              <button onClick={() => setSelectedProduct(null)} style={{ background: 'rgba(0,0,0,0.08)', color: '#4a3728', border: 'none', borderRadius: 10, padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Cart Bar */}
      {totalItems > 0 && (
        <div style={{ position: 'sticky', bottom: 0, background: 'linear-gradient(135deg,#FF6B00,#D4A017)', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 -4px 20px rgba(255,107,0,0.3)', zIndex: 100 }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>🧺 {totalItems} items · Save ₹{totalSavings.toLocaleString()}</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Free delivery included!</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ color: '#fff', fontFamily: 'Cinzel,serif', fontWeight: 900, fontSize: 22 }}>₹{totalPrice.toLocaleString()}</div>
            <button onClick={() => { setCheckoutDone(true); setTimeout(() => { setCart({}); setCheckoutDone(false); }, 3000); }} style={{ background: '#fff', color: '#FF6B00', border: 'none', borderRadius: 24, padding: '10px 24px', fontWeight: 800, cursor: 'pointer', fontSize: 14 }}>{checkoutDone ? '✅ Order Placed!' : 'Checkout →'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
