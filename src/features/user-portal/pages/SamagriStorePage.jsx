import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import notificationStore from '../../../services/notificationService';
import { useApp } from '../../../store/AppCtx';
import { PremiumIcon, IconVerified, IconSearch } from '../../../components/Icons';

const CATEGORIES = ['All', 'Festival Kits', 'Daily Worship', 'Abhishek', 'Havan', 'Incense & Diyas'];
const CAT_ICONS = { 
  'All':<PremiumIcon src="/icons/om.png" size={18} />, 
  'Festival Kits':<PremiumIcon src="/icons/diwali_kit.png" size={18} />, 
  'Daily Worship':<PremiumIcon src="/icons/diya.png" size={18} />, 
  'Abhishek':<PremiumIcon src="/icons/lotus.png" size={18} />, 
  'Havan':<PremiumIcon src="/icons/havan.png" size={18} />, 
  'Incense & Diyas':<PremiumIcon src="/icons/diya.png" size={18} /> 
};

const PRODUCTS = [
  { id:1, name:'Diwali Pooja Kit',    category:'Festival Kits',    icon:'/icons/diwali_kit.png', price:899,  mrp:1199, items:61, desc:'Complete Lakshmi-Ganesh puja essentials — 61 items including diyas, rangoli, incense, sweets prasad, red cloth, sindoor, lotus flowers, roli, moli, supari, betel leaves.', badge:'BESTSELLER', rating:4.8, reviews:234 },
  { id:2, name:'Ganesh Puja Kit',     category:'Festival Kits',    icon:'📿', price:349,  mrp:499,  items:29, desc:'29 items: modak, durva grass, red flowers, coconut, camphor, roli, moli, supari, banana, red cloth, incense sticks, ghee, vermilion, sesame seeds, akshat.', rating:4.7, reviews:189 },
  { id:3, name:'Griha Pravesh Kit',   category:'Festival Kits',    icon:'🗝️', price:599,  mrp:799,  items:52, desc:'52 items: sacred thread, turmeric, rice, copper kalash, mango leaves, coconut, flowers, navadhanya, holy water, camphor, ghee, incense, red cloth, coins.', badge:'POPULAR', rating:4.9, reviews:312 },
  { id:4, name:'Navratri Pooja Kit',  category:'Festival Kits',    icon:'🚩', price:499,  mrp:699,  items:35, desc:'35 items for 9-day Durga puja. Chunri, sindoor, shakkar, fruits, incense, camphor, oil lamp, red flowers, coconut, betel leaves, kum kum, durga yantra.', rating:4.6, reviews:145 },
  { id:5, name:'Satyanarayan Kit',    category:'Daily Worship',    icon:'🥣', price:299,  mrp:399,  items:24, desc:'24 items for Satyanarayan Katha: panchamrit ingredients (milk, curd, honey, ghee, sugar), banana, tulsi, yellow flowers, yellow cloth, akshat, camphor.', rating:4.8, reviews:278 },
  { id:6, name:'Rudrabhishek Kit',    category:'Abhishek',         icon:'/icons/lotus.png', price:449,  mrp:599,  items:18, desc:'18 items for Shiva abhishek: milk, honey, curd, ghee, sugar, gangajal, bel patra, dhatura, blue flowers, camphor, vibhuti, rudraksha, black sesame.', rating:4.9, reviews:167 },
  { id:7, name:'Havan Samagri Kit',   category:'Havan',            icon:'/icons/havan.png', price:699,  mrp:899,  items:42, desc:'42 items complete havan kit: pure ghee 500ml, havan kund, samagri mix 500g, mango wood pieces, camphor, incense, navagraha herbs, sandalwood powder.', badge:'PREMIUM', rating:4.7, reviews:98 },
  { id:8, name:'Daily Puja Kit',      category:'Daily Worship',    icon:'/icons/diya.png', price:199,  mrp:299,  items:15, desc:'15 everyday essentials: incense sticks (3 varieties), camphor, matchbox, sindoor, roli, moli, flowers (artificial), ghee lamp, wick, small idol base cloth.', rating:4.5, reviews:456 },
  { id:9, name:'Premium Incense Set', category:'Incense & Diyas',  icon:'💨', price:249,  mrp:349,  items:8,  desc:'8 varieties premium incense: sandalwood, jasmine, rose, camphor, guggul, mogra, lavender, chandan — 120 sticks total. Long-lasting 45-min burn time.', rating:4.6, reviews:203 },
  { id:10,name:'Diya & Lamp Set',     category:'Incense & Diyas',  icon:'/icons/diya.png', price:349,  mrp:499,  items:12, desc:'12 piece set: 4 brass diyas, 4 clay diyas, 1 oil lamp with stand, cotton wicks (50), mustard oil 200ml, cleaning cloth. Perfect for daily aarti.', rating:4.8, reviews:321 },
  { id:11,name:'Navgrah Shanti Kit',  category:'Havan',            icon:'🪐', price:799,  mrp:999,  items:54, desc:'54 items for 9-planet ritual: 9 grains, 9 flowers, 9 fruits, 9 herbs, havan samagri, ghee, navgrah yantra, colored cloth strips.', badge:'COMPLETE', rating:4.9, reviews:87 },
  { id:12,name:'Laxmi Puja Kit',      category:'Daily Worship',    icon:'/icons/lotus.png', price:399,  mrp:549,  items:28, desc:'28 items for Friday Laxmi puja: red/pink flowers, lotus, coins, betel leaves, supari, banana, fruits, red cloth, laxmi yantra, incense, camphor, sindoor.', rating:4.7, reviews:176 },
];

const BADGE_COLORS = { BESTSELLER:'#FF6B00', POPULAR:'#22c55e', PREMIUM:'#9B59B6', COMPLETE:'#3498DB' };

const CUSTOM_ITEMS = [
  { id:'c1', name:'Aggarbatti', icon:'🪔', img:'/samagri/aggarbatti.jpg', price:49, unit:'1 pack (20 sticks)', cat:'Basic' },
  { id:'c2', name:'Camphor Tablets', icon:'🧊', img:'/samagri/camphor.jpg', price:39, unit:'10 tablets', cat:'Basic' },
  { id:'c3', name:'Roli (Vermilion)', icon:'🔴', price:29, unit:'50g packet', cat:'Basic' },
  { id:'c4', name:'Moli (Sacred Thread)', icon:'🧶', price:19, unit:'1 roll', cat:'Basic' },
  { id:'c5', name:'Akshat (Rice)', icon:'🍚', price:25, unit:'250g packet', cat:'Basic' },
  { id:'c6', name:'Supari (Betel Nut)', icon:'🌰', img:'/samagri/supari.jpg', price:35, unit:'100g', cat:'Basic' },
  { id:'c7', name:'Ghee (Pure Cow)', icon:'🧈', img:'/icons/ghee.png', price:299, unit:'500ml', cat:'Premium' },
  { id:'c8', name:'Panchamrit', icon:'🍯', price:149, unit:'Complete set', cat:'Premium' },
  { id:'c9', name:'Gangajal', icon:'💧', price:89, unit:'500ml bottle', cat:'Premium' },
  { id:'c10', name:'Copper Kalash', icon:'🏺', price:199, unit:'1 piece', cat:'Premium' },
  { id:'c11', name:'Bel Patra', icon:'🍃', price:49, unit:'Fresh pack', cat:'Flowers' },
  { id:'c12', name:'Lotus Flowers', icon:'🪷', price:99, unit:'5 flowers', cat:'Flowers' },
  { id:'c13', name:'Yellow Flowers', icon:'🌼', price:69, unit:'1 bunch', cat:'Flowers' },
  { id:'c14', name:'Rose Petals', icon:'🌹', price:59, unit:'1 packet', cat:'Flowers' },
  { id:'c15', name:'Coconut', icon:'🥥', price:45, unit:'1 piece', cat:'Fruits' },
  { id:'c16', name:'Banana Bunch', icon:'🍌', img:'/samagri/banana.png', price:79, unit:'1 bunch', cat:'Fruits' },
  { id:'c17', name:'Havan Kund', icon:'🪵', img:'/icons/havan.png', price:599, unit:'Small size', cat:'Special' },
  { id:'c18', name:'Rudraksha Mala', icon:'📿', price:299, unit:'108 beads', cat:'Special' },
];
const CUSTOM_CATS = ['All', 'Basic', 'Premium', 'Flowers', 'Fruits', 'Special'];

export default function SamagriStorePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromBooking = location.state?.fromBooking || false;
  const bookingDraft = location.state?.bookingDraft || null;
  const { addToCart: globalAddToCart, setShowCart, toast } = useApp();
  const [activeTab, setActiveTab] = useState('ready');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState({});
  const [sortBy, setSortBy] = useState('popular');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [customCart, setCustomCart] = useState({});
  const [customCat, setCustomCat] = useState('All');
  const [bookingKit, setBookingKit] = useState(null); // kit selected for booking flow

  const filtered = PRODUCTS
    .filter(p => category === 'All' || p.category === category)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sortBy==='price_low' ? a.price-b.price : sortBy==='price_high' ? b.price-a.price : sortBy==='rating' ? b.rating-a.rating : b.reviews-a.reviews);

  const addToCart = (product, e) => {
    if(e) { e.stopPropagation(); e.preventDefault(); }
    setCart(prev => ({ ...prev, [product.id]: (prev[product.id]||0)+1 }));
    // Also add to global cart so header badge updates
    try { globalAddToCart({ id: `samagri_${product.id}`, name: product.name, price: product.price, icon: product.icon, qty: 1 }); } catch(_) {}
    if(notificationStore) notificationStore.recordSearch(product.name);
  };
  const removeFromCart = (productId, e) => {
    if(e) e.stopPropagation();
    setCart(prev => {
      const qty = (prev[productId]||1)-1;
      if(qty<=0){ const n={...prev}; delete n[productId]; return n; }
      return { ...prev, [productId]: qty };
    });
  };
  const clearItem = (productId, e) => {
    if(e) e.stopPropagation();
    setCart(prev => { const n={...prev}; delete n[productId]; return n; });
  };

  const totalItems = Object.values(cart).reduce((s,q)=>s+q,0);
  const totalPrice = Object.entries(cart).reduce((s,[id,q])=>{ const p=PRODUCTS.find(p=>p.id===parseInt(id)); return s+(p?p.price*q:0); },0);
  const totalSavings = Object.entries(cart).reduce((s,[id,q])=>{ const p=PRODUCTS.find(p=>p.id===parseInt(id)); return s+(p?(p.mrp-p.price)*q:0); },0);

  const customFiltered = CUSTOM_ITEMS.filter(i => customCat === 'All' || i.cat === customCat);
  const customTotal = Object.entries(customCart).reduce((s,[id,q]) => { const item = CUSTOM_ITEMS.find(i=>i.id===id); return s + (item ? item.price * q : 0); }, 0);
  const customCount = Object.values(customCart).reduce((s,q)=>s+q, 0);

  const dkCard = { background:'rgba(26,15,7,0.72)', border:'1px solid rgba(240,192,64,0.14)', borderRadius:16, backdropFilter:'blur(16px)' };
  const selStyle = { padding:'10px 14px', borderRadius:10, border:'1.5px solid rgba(240,192,64,0.2)',
    background:'rgba(255,248,240,0.05)', color:'rgba(255,248,240,0.85)', fontSize:13, outline:'none', cursor:'pointer', fontFamily:'Nunito,sans-serif' };

  const handleAddToBooking = (product, e) => {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    const kit = { id: `samagri_${product.id}`, name: product.name, price: product.price, icon: product.icon, deliveryTime: '2 Days', itemsIncluded: [] };
    setBookingKit(kit);
    navigate('/user/booking', { state: { resumeFromSamagri: true, selectedKit: kit, bookingDraft } });
  };

  return (
    <div>
      {/* Booking-mode banner */}
      {fromBooking && (
        <div style={{ background: 'linear-gradient(135deg, #FF6B00, #D4A017)', borderRadius: 16, padding: '14px 22px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 28 }}>📦</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>Pick a Kit for Your Booking</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Tap "Add to My Booking" on any kit below — it will be delivered with your ritual.</div>
          </div>
          <button onClick={() => navigate('/user/booking', { state: { resumeFromSamagri: false, bookingDraft } })}
            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', borderRadius: 20, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' }}>
            ← Back to Booking
          </button>
        </div>
      )}
      {/* Hero */}
      <div style={{ position:'relative', overflow:'hidden', ...dkCard, padding:'28px 26px', marginBottom:20, borderRadius:20 }}>
        <div style={{ position:'absolute', top:-50, right:-30, width:240, height:240,
          background:'radial-gradient(ellipse,rgba(240,192,64,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(240,192,64,0.1)',
              border:'1px solid rgba(240,192,64,0.25)', color:'#F0C040', fontSize:10, fontWeight:800,
              letterSpacing:'1.2px', textTransform:'uppercase', padding:'4px 12px', borderRadius:20, marginBottom:10 }}>
              📦 Purity Certified · Same-day Delivery
            </div>
            <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontSize:'clamp(18px,3vw,26px)', margin:'0 0 6px', fontWeight:900 }}>🛍️ Pooja Samagri Store</h2>
            <p style={{ color:'rgba(255,248,240,0.5)', margin:0, fontSize:13 }}>Authentic ritual kits delivered to your door · Free delivery above ₹999</p>
          </div>
          {totalItems > 0 && (
            <button onClick={() => { setCheckoutDone(true); setTimeout(()=>{ setCart({}); setCheckoutDone(false); },3000); }}
              style={{ background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff', border:'none',
                borderRadius:20, padding:'12px 22px', fontWeight:800, cursor:'pointer', fontSize:14,
                boxShadow:'0 4px 14px rgba(255,107,0,0.35)', flexShrink:0 }}>
              🧺 Basket ({totalItems}) · ₹{totalPrice.toLocaleString()}
            </button>
          )}
        </div>
        {/* Trust badges */}
        <div style={{ display:'flex', gap:16, marginTop:16, flexWrap:'wrap' }}>
          {[['🚚','Same-day Delhi NCR'],['✅','100% Authentic'],['🔄','7-day Returns'],['🆓','Free over ₹999']].map(([ic,tx])=>(
            <div key={tx} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span>{ic}</span>
              <span style={{ color:'rgba(255,248,240,0.5)', fontSize:12, fontWeight:600 }}>{tx}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{ display:'flex', background:'rgba(240,192,64,0.1)', borderRadius:12, padding:4, marginBottom:18, width:'fit-content' }}>
        {[['ready','📦 Ready-Made Kits'],['custom','🛠️ Build Custom Kit']].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)}
            style={{ padding:'9px 20px', borderRadius:10, border:'none', cursor:'pointer', fontWeight:700, fontSize:14, transition:'all 0.2s',
              background: activeTab===id ? '#FF6B00' : 'transparent',
              color: activeTab===id ? '#fff' : 'rgba(255,248,240,0.6)', fontFamily:'Nunito,sans-serif' }}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'custom' ? (
        <div style={{ paddingBottom:20 }}>
          <div style={{ background:'rgba(212,160,23,0.08)', border:'1px solid rgba(212,160,23,0.2)', borderRadius:12, padding:'14px 18px', marginBottom:18 }}>
            <div style={{ color:'rgba(255,248,240,0.9)', fontWeight:700, fontSize:14, marginBottom:4 }}>🛠️ Build Your Perfect Pooja Kit</div>
            <div style={{ color:'rgba(255,248,240,0.55)', fontSize:13 }}>Select individual items for your specific ritual. Perfect for experienced devotees who know exactly what they need.</div>
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
            {CUSTOM_CATS.map(c => (
              <button key={c} onClick={()=>setCustomCat(c)}
                style={{ padding:'6px 14px', borderRadius:20, border:'none', cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:'Nunito,sans-serif',
                  background: customCat===c ? '#FF6B00' : 'rgba(255,107,0,0.15)',
                  color: customCat===c ? '#fff' : 'rgba(255,248,240,0.7)' }}>
                {c}
              </button>
            ))}
          </div>

          {/* Custom Kit Quick Commerce Progress Bar */}
          <div style={{ background: 'rgba(26,15,7,0.72)', padding: '16px 20px', borderRadius: 16, marginBottom: 20, border: '1px solid rgba(240,192,64,0.15)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#F0C040', fontSize: 13, fontWeight: 800 }}>🚚 Free Delivery Milestone</span>
              <span style={{ color: customTotal >= 500 ? '#4ade80' : 'rgba(255,248,240,0.6)', fontSize: 12, fontWeight: 800 }}>
                {customTotal >= 500 ? '🎉 Unlocked!' : `₹${500 - customTotal} away`}
              </span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', height: 8, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: customTotal >= 500 ? '#4ade80' : 'linear-gradient(90deg, #FF6B00, #F0C040)', height: '100%', width: `${Math.min((customTotal/500)*100, 100)}%`, transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12, marginBottom:24 }}>
            {customFiltered.map(item => {
              const qty = customCart[item.id] || 0;
              return (
                <div key={item.id} style={{ background:'rgba(26,15,7,0.72)', border:`1px solid ${qty>0?'rgba(255,107,0,0.5)':'rgba(240,192,64,0.14)'}`, borderRadius:12, padding:'14px', backdropFilter:'blur(16px)',
                  boxShadow: qty>0?'0 2px 12px rgba(255,107,0,0.15)':'none' }}>
                  {item.img ? (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, height: 60 }}>
                      <img src={item.img} alt={item.name} style={{ height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} />
                    </div>
                  ) : (
                    <div style={{ fontSize:40, marginBottom:8, textAlign:'center', filter:'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}>{item.icon}</div>
                  )}
                  <div style={{ color:'rgba(255,248,240,0.9)', fontWeight:700, fontSize:13, marginBottom:2, textAlign:'center' }}>{item.name}</div>
                  <div style={{ color:'rgba(255,248,240,0.4)', fontSize:11, textAlign:'center', marginBottom:8 }}>{item.unit}</div>
                  <div style={{ color:'#FF9F40', fontWeight:800, fontSize:18, textAlign:'center', marginBottom:10, fontFamily:'Cinzel,sans-serif' }}>₹{item.price}</div>
                  {qty === 0 ? (
                    <button onClick={()=>setCustomCart(c=>({...c,[item.id]:1}))}
                      style={{ width:'100%', background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff', border:'none', borderRadius:8, padding:'8px', fontWeight:700, cursor:'pointer', fontSize:13 }}>
                      + Add
                    </button>
                  ) : (
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <button onClick={()=>setCustomCart(c=>{const n={...c};if(n[item.id]<=1)delete n[item.id];else n[item.id]--;return n;})}
                        style={{ width:32,height:32,borderRadius:'50%',background:'rgba(255,107,0,0.15)',color:'#FF9F40',border:'2px solid rgba(255,107,0,0.35)',cursor:'pointer',fontWeight:800,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center' }}>−</button>
                      <span style={{ flex:1,textAlign:'center',fontWeight:800,color:'rgba(255,248,240,0.9)',fontSize:16 }}>{qty}</span>
                      <button onClick={()=>setCustomCart(c=>({...c,[item.id]:(c[item.id]||0)+1}))}
                        style={{ width:32,height:32,borderRadius:'50%',background:'#FF6B00',color:'#fff',border:'none',cursor:'pointer',fontWeight:800,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center' }}>+</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {customCount > 0 && (
            <div style={{ background:'linear-gradient(135deg,#FF6B00,#D4A017)', borderRadius:14, padding:'18px 22px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ color:'#fff', fontWeight:700, fontSize:15 }}>🛠️ Custom Built Kit ({customCount} items)</div>
                <div style={{ color:'rgba(255,255,255,0.85)', fontSize:12, marginTop:4, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '60vw' }}>
                  {Object.entries(customCart).map(([id, q]) => { const i = CUSTOM_ITEMS.find(x=>x.id===id); return i ? `${i.icon} ${i.name} (x${q})` : ''; }).join(', ')}
                </div>
              </div>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <div style={{ color:'#fff', fontFamily:'Cinzel,serif', fontWeight:900, fontSize:22 }}>₹{customTotal.toLocaleString()}</div>
                <button onClick={()=>{ alert('Custom kit order placed! ✅ We will contact you to confirm.'); setCustomCart({}); }}
                  style={{ background:'#fff', color:'#FF6B00', border:'none', borderRadius:20, padding:'10px 22px', fontWeight:800, cursor:'pointer', fontSize:14 }}>
                  Order Custom Kit →
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>

      {/* Filters */}
      <div className="dark-input compact-filter" style={{ ...dkCard, padding:'14px 18px', marginBottom:18, borderRadius:16 }}>
        <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap', alignItems: 'center' }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search samagri kits..." />
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option value="popular" style={{ backgroundColor: '#1a0f07', color: '#fff' }}>Most Popular</option>
            <option value="rating" style={{ backgroundColor: '#1a0f07', color: '#fff' }}>Highest Rated</option>
            <option value="price_low" style={{ backgroundColor: '#1a0f07', color: '#fff' }}>Price: Low → High</option>
            <option value="price_high" style={{ backgroundColor: '#1a0f07', color: '#fff' }}>Price: High → Low</option>
          </select>
          <div style={{ color:'rgba(255,248,240,0.5)', fontSize:13, fontWeight:700, padding: '0 8px' }}>
            {filtered.length} kits found
          </div>
        </div>
        <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none', paddingBottom:2 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={()=>setCategory(c)}
              style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'7px 16px', borderRadius:40,
                border:`1.5px solid ${category===c ? 'rgba(240,192,64,0.5)' : 'rgba(255,248,240,0.1)'}`,
                background: category===c ? 'linear-gradient(135deg,rgba(240,192,64,0.18),rgba(255,107,0,0.1))' : 'transparent',
                color: category===c ? '#F0C040' : 'rgba(255,248,240,0.5)',
                fontWeight:700, fontSize:12, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0,
                fontFamily:'Nunito,sans-serif', transition:'all 0.22s',
                boxShadow: category===c ? '0 0 12px rgba(240,192,64,0.15)' : 'none' }}>
              <span>{CAT_ICONS[c]}</span> {c}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
        {filtered.map(p => {
          const qty = cart[p.id]||0;
          const discount = Math.round((1-p.price/p.mrp)*100);
          return (
            <div key={p.id} onClick={()=>setSelectedProduct(p)}
              style={{ ...dkCard, padding:18, cursor:'pointer', position:'relative',
                border: qty>0 ? '1.5px solid rgba(255,107,0,0.45)' : '1px solid rgba(240,192,64,0.14)',
                background: qty>0 ? 'rgba(255,107,0,0.06)' : 'rgba(26,15,7,0.72)',
                transition:'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                overflow:'hidden' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 16px 36px rgba(0,0,0,0.4)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}>

              {p.badge && <div style={{ position:'absolute', top:0, right:0,
                background:`linear-gradient(135deg,${BADGE_COLORS[p.badge]||'#FF6B00'},${BADGE_COLORS[p.badge]||'#D4A017'})`,
                color:'#fff', fontSize:'9px', fontWeight:800, padding:'3px 10px',
                borderRadius:'0 16px 0 10px', letterSpacing:'0.8px' }}>{p.badge}</div>}
              {qty>0 && <div style={{ position:'absolute', top:0, left:0, background:'rgba(255,107,0,0.9)',
                color:'#fff', fontSize:10, fontWeight:800, padding:'3px 10px',
                borderRadius:'16px 0 10px 0' }}>✓ In Basket ({qty})</div>}

              <div style={{ fontSize:42, textAlign:'center', marginBottom:10, marginTop: qty>0||p.badge ? 10 : 0 }}>
                {p.icon.startsWith('/') ? <PremiumIcon src={p.icon} size={64} /> : p.icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', padding: '4px 10px', borderRadius: 20, width: 'fit-content', margin: '0 auto 12px' }}>
                <IconVerified size={10} color="#4ade80" />
                <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase' }}>100% Vedic Verified</span>
              </div>
              <h3 style={{ color:'#F0C040', fontFamily:'Cinzel,serif', margin:'0 0 4px', fontSize:15, fontWeight:700, textAlign: 'center' }}>{p.name}</h3>
              <div style={{ color:'rgba(255,248,240,0.35)', fontSize:11, marginBottom:8, textAlign: 'center' }}>
                🧺 {p.items} items · ⭐ {p.rating} ({p.reviews} reviews)
              </div>
              <p style={{ color:'rgba(255,248,240,0.45)', fontSize:12, lineHeight:1.5, margin:'0 0 12px',
                display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.desc}</p>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <span style={{ color:'#FF9F40', fontWeight:800, fontSize:22, fontFamily:'Cinzel,serif' }}>₹{p.price}</span>
                <span style={{ color:'rgba(255,248,240,0.3)', fontSize:13, textDecoration:'line-through' }}>₹{p.mrp}</span>
                <span style={{ background:'rgba(34,197,94,0.15)', color:'#4ade80',
                  fontSize:11, padding:'2px 8px', borderRadius:20, fontWeight:700 }}>{discount}% OFF</span>
              </div>
              <div style={{ color:'#4ade80', fontSize:11, fontWeight:600, marginBottom:12 }}>Save ₹{(p.mrp-p.price).toLocaleString()}</div>

              {qty===0 ? (
                fromBooking ? (
                  <button onClick={e=>handleAddToBooking(p,e)}
                    style={{ width:'100%', background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff',
                      border:'none', borderRadius:10, padding:'10px', fontWeight:800, cursor:'pointer', fontSize:13,
                      boxShadow:'0 4px 12px rgba(255,107,0,0.3)' }}>
                    ✅ Add to My Booking
                  </button>
                ) : (
                <button onClick={e=>addToCart(p,e)}
                  style={{ width:'100%', background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff',
                    border:'none', borderRadius:10, padding:'10px', fontWeight:800, cursor:'pointer', fontSize:13,
                    boxShadow:'0 4px 12px rgba(255,107,0,0.3)' }}>
                  🧺 Add to Basket
                </button>
                )
              ) : (
                <div onClick={e=>e.stopPropagation()} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <button onClick={e=>removeFromCart(p.id,e)} style={{ width:36, height:36, borderRadius:'50%',
                    background:'rgba(255,107,0,0.15)', color:'#FF9F40', border:'2px solid rgba(255,107,0,0.35)',
                    cursor:'pointer', fontWeight:800, fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                  <span style={{ color:'rgba(255,248,240,0.9)', fontWeight:800, fontSize:18, flex:1, textAlign:'center' }}>{qty}</span>
                  <button onClick={e=>addToCart(p,e)} style={{ width:36, height:36, borderRadius:'50%',
                    background:'#FF6B00', color:'#fff', border:'none', cursor:'pointer',
                    fontWeight:800, fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                  <button onClick={e=>clearItem(p.id,e)} style={{ background:'none', border:'none',
                    color:'rgba(255,248,240,0.3)', cursor:'pointer', fontSize:16, padding:'0 4px' }}>🗑️</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

        </>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div onClick={()=>setSelectedProduct(null)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:1000,
            display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div onClick={e=>e.stopPropagation()}
            style={{ background:'linear-gradient(135deg,rgba(44,26,14,0.98),rgba(26,15,7,0.99))',
              border:'1px solid rgba(240,192,64,0.2)', borderRadius:22, padding:28,
              maxWidth:460, width:'100%', maxHeight:'85vh', overflowY:'auto',
              boxShadow:'0 24px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', margin:0, fontSize:18 }}>{selectedProduct.name}</h2>
              <button onClick={()=>setSelectedProduct(null)}
                style={{ background:'rgba(255,248,240,0.07)', border:'none', color:'rgba(255,248,240,0.5)',
                  borderRadius:'50%', width:30, height:30, cursor:'pointer', fontSize:14,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            <div style={{ textAlign:'center', marginBottom:16 }}>
              <div style={{ fontSize:56 }}>
                {selectedProduct.icon.startsWith('/') ? <PremiumIcon src={selectedProduct.icon} size={80} /> : selectedProduct.icon}
              </div>
            </div>
            <p style={{ color:'rgba(255,248,240,0.6)', fontSize:14, lineHeight:1.65, marginBottom:16 }}>{selectedProduct.desc}</p>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <span style={{ color:'#FF9F40', fontWeight:800, fontSize:26, fontFamily:'Cinzel,serif' }}>₹{selectedProduct.price}</span>
              <span style={{ color:'rgba(255,248,240,0.3)', fontSize:16, textDecoration:'line-through' }}>₹{selectedProduct.mrp}</span>
              <span style={{ background:'rgba(34,197,94,0.15)', color:'#4ade80', padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>
                {Math.round((1-selectedProduct.price/selectedProduct.mrp)*100)}% OFF
              </span>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              {(cart[selectedProduct.id]||0)===0 ? (
                <button onClick={e=>{ addToCart(selectedProduct,e); setSelectedProduct(null); }}
                  style={{ flex:1, background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff',
                    border:'none', borderRadius:12, padding:13, fontWeight:800, cursor:'pointer', fontSize:14 }}>🧺 Add to Basket</button>
              ) : (
                <div style={{ flex:1, display:'flex', alignItems:'center', gap:8 }}>
                  <button onClick={e=>removeFromCart(selectedProduct.id,e)} style={{ width:36, height:36, borderRadius:'50%',
                    background:'rgba(255,107,0,0.15)', color:'#FF9F40', border:'2px solid rgba(255,107,0,0.35)',
                    cursor:'pointer', fontWeight:800, fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                  <span style={{ flex:1, textAlign:'center', fontWeight:800, fontSize:18, color:'rgba(255,248,240,0.9)' }}>{cart[selectedProduct.id]}</span>
                  <button onClick={e=>addToCart(selectedProduct,e)} style={{ width:36, height:36, borderRadius:'50%',
                    background:'#FF6B00', color:'#fff', border:'none', cursor:'pointer',
                    fontWeight:800, fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                </div>
              )}
              <button onClick={()=>setSelectedProduct(null)}
                style={{ background:'rgba(255,248,240,0.06)', color:'rgba(255,248,240,0.5)',
                  border:'1px solid rgba(255,248,240,0.1)', borderRadius:12, padding:'12px 18px', fontWeight:700, cursor:'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Cart Bar */}
      {totalItems > 0 && (
        <div style={{ position:'sticky', bottom:0, background:'linear-gradient(135deg,#FF6B00,#D4A017)',
          padding:'14px 24px', display:'flex', justifyContent:'space-between', alignItems:'center',
          boxShadow:'0 -4px 24px rgba(255,107,0,0.4)', zIndex:100, marginTop:20, borderRadius:'14px 14px 0 0' }}>
          <div>
            <div style={{ color:'#fff', fontWeight:700, fontSize:15 }}>🧺 {totalItems} items · Save ₹{totalSavings.toLocaleString()}</div>
            <div style={{ color:'rgba(255,255,255,0.75)', fontSize:12 }}>Free delivery included!</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ color:'#fff', fontFamily:'Cinzel,serif', fontWeight:900, fontSize:22 }}>₹{totalPrice.toLocaleString()}</div>
            <button onClick={()=>{ setCheckoutDone(true); setTimeout(()=>{ setCart({}); setCheckoutDone(false); },3000); }}
              style={{ background:'#fff', color:'#FF6B00', border:'none', borderRadius:24,
                padding:'10px 24px', fontWeight:800, cursor:'pointer', fontSize:14 }}>
              {checkoutDone ? '✅ Order Placed!' : 'Checkout →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
