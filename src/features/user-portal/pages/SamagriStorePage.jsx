import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import notificationStore from '../../../services/notificationService';
import { useApp } from '../../../store/AppCtx';
import { PremiumIcon, IconVerified, IconSearch } from '../../../components/Icons';

const CATEGORIES = [
  { id:'All',             label:'All',              icon:'🕉️' },
  { id:'festival',        label:'Festival Kits',    icon:'🎊' },
  { id:'daily',           label:'Daily Worship',    icon:'🙏' },
  { id:'abhishek',        label:'Abhishek',         icon:'🔱' },
  { id:'havan',           label:'Havan',            icon:'🔥' },
  { id:'incense',         label:'Incense & Diyas',  icon:'🕯️' },
];

const PRODUCTS = [
  {
    id: 'diwali-kit', name: 'Diwali Pooja Kit', category: 'festival', icon: '🪔',
    price: 599, mrp: 799,
    badge: 'POPULAR', rating: 4.8, reviews: 234, weight: '850g',
    desc: 'Complete Diwali puja kit with diyas, incense, roli, akshat, moli, camphor, agarbatti and sweets offering tray.',
    items: ['12 Clay Diyas', 'Roli & Akshat', 'Moli (5m)', 'Camphor', 'Agarbatti (20 sticks)', 'Offering Tray', 'Coconut'],
  },
  {
    id: 'ganesh-kit', name: 'Ganesh Puja Kit', category: 'festival', icon: '🐘',
    price: 449, mrp: 599,
    badge: 'BESTSELLER', rating: 4.9, reviews: 412, weight: '620g',
    desc: 'All items for Ganesh puja including modak, durva grass, red flowers, sindoor and more.',
    items: ['Durva Grass', 'Red Flowers', 'Modak (6 pcs)', 'Sindoor', 'Akshat', 'Moli', 'Agarbatti'],
  },
  {
    id: 'griha-pravesh-kit', name: 'Griha Pravesh Kit', category: 'daily', icon: '🏠',
    price: 1299, mrp: 1699,
    badge: null, rating: 4.7, reviews: 156, weight: '1.8kg',
    desc: 'Premium Griha Pravesh kit with all items for home-entry ceremony havan and puja.',
    items: ['Havan Samagri', 'Mango Leaves', 'Kalash', 'Coconut', 'Red Cloth', 'Kumkum', 'Akshat', 'Diyas (x6)', 'Ghee (200ml)'],
  },
  {
    id: 'navratri-kit', name: 'Navratri Pooja Kit', category: 'festival', icon: '🚩',
    price: 799, mrp: 999,
    badge: 'NEW', rating: 4.8, reviews: 89, weight: '1.1kg',
    desc: 'Complete 9-day Navratri puja kit with Durga idol, red chunri, jowar and all essentials.',
    items: ['Red Chunri', 'Jowar Seeds', 'Earthen Pot', 'Sindoor', 'Bangles', 'Coconut', 'Agarbatti', 'Camphor'],
  },
  {
    id: 'satyanarayan-kit', name: 'Satyanarayan Puja Kit', category: 'daily', icon: '🍌',
    price: 549, mrp: 699,
    badge: 'POPULAR', rating: 4.9, reviews: 321, weight: '780g',
    desc: 'Complete Satyanarayan Katha kit with panchamrit ingredients, tulsi, yellow cloth and all essentials.',
    items: ['Panchamrit Set', 'Tulsi Leaves', 'Yellow Cloth', 'Banana', 'Wheat Flour', 'Sugar', 'Milk', 'Honey', 'Ghee'],
  },
  {
    id: 'rudrabhishek-kit', name: 'Rudrabhishek Kit', category: 'abhishek', icon: '🔱',
    price: 699, mrp: 899,
    badge: null, rating: 4.8, reviews: 178, weight: '950g',
    desc: 'Premium Rudrabhishek kit with bel patra, gangajal, milk, honey and all abhishek items.',
    items: ['Bel Patra (x21)', 'Gangajal (250ml)', 'Milk', 'Honey', 'Curd', 'Camphor', 'Dhatura Flower', 'White Sandal'],
  },
  {
    id: 'havan-kit', name: 'Havan Samagri Kit', category: 'havan', icon: '🪵',
    price: 399, mrp: 499,
    badge: null, rating: 4.6, reviews: 203, weight: '1.2kg',
    desc: 'Pure Vedic havan samagri with 51 herbs, ghee, sesame, barley and sacred wood.',
    items: ['Havan Samagri (500g)', 'Pure Ghee (200ml)', 'Til (Sesame)', 'Barley', 'Mango Wood', 'Camphor', 'Kesar'],
  },
  {
    id: 'daily-puja-kit', name: 'Daily Puja Kit', category: 'daily', icon: '🪔',
    price: 299, mrp: 399,
    badge: 'BESTSELLER', rating: 4.7, reviews: 567, weight: '450g',
    desc: 'Everything for your daily puja — agarbatti, roli, akshat, moli, camphor and flowers.',
    items: ['Agarbatti (40 sticks)', 'Roli', 'Akshat', 'Moli', 'Camphor', 'Matchbox', 'Puja Thali'],
  },
  {
    id: 'incense-set', name: 'Premium Incense Collection', category: 'incense', icon: '🌿',
    price: 349, mrp: 449,
    badge: null, rating: 4.8, reviews: 145, weight: '350g',
    desc: 'Premium dhoop, agarbatti and sambrani collection with 10 sacred fragrances.',
    items: ['Chandan Agarbatti', 'Rose Agarbatti', 'Loban Dhoop', 'Sambrani Cups', 'Guggal', 'Camphor Cubes'],
  },
  {
    id: 'diya-lamp-set', name: 'Diya & Lamp Set', category: 'incense', icon: '🕯️',
    price: 249, mrp: 349,
    badge: null, rating: 4.6, reviews: 98, weight: '600g',
    desc: 'Hand-crafted clay diyas and brass deepak for daily aarti and festival decorations.',
    items: ['Clay Diyas (24 pcs)', 'Brass Deepak', 'Cotton Wicks', 'Mustard Oil (100ml)'],
  },
  {
    id: 'navgrah-kit', name: 'Navgrah Shanti Kit', category: 'abhishek', icon: '🌐',
    price: 899, mrp: 1199,
    badge: null, rating: 4.7, reviews: 112, weight: '1.4kg',
    desc: 'Complete Navgrah shanti kit with 9 grain offerings, cloth pieces, and puja items.',
    items: ['9 Grains Set', '9 Color Cloths', 'Nav Dhanya', 'Coconut', 'Flowers', 'Akshat', 'Roli', 'Camphor'],
  },
  {
    id: 'lakshmi-kit', name: 'Lakshmi Puja Kit', category: 'festival', icon: '🪷',
    price: 499, mrp: 649,
    badge: 'NEW', rating: 4.9, reviews: 203, weight: '720g',
    desc: 'Complete Lakshmi puja kit with lotus, coins, red cloth, kumkum and all essentials.',
    items: ['Lotus Flower', 'Gold Coins (2)', 'Red Cloth', 'Kumkum', 'Haldi', 'Betel Leaves', 'Coconut', 'Agarbatti'],
  },
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
  const totalPrice = Object.entries(cart).reduce((s,[id,q])=>{ const p=PRODUCTS.find(p=>String(p.id)===String(id)); return s+(p?p.price*q:0); },0);
  const totalSavings = Object.entries(cart).reduce((s,[id,q])=>{ const p=PRODUCTS.find(p=>String(p.id)===String(id)); return s+(p?(p.mrp-p.price)*q:0); },0);

  const customFiltered = CUSTOM_ITEMS.filter(i => customCat === 'All' || i.cat === customCat);
  const customTotal = Object.entries(customCart).reduce((s,[id,q]) => { const item = CUSTOM_ITEMS.find(i=>i.id===id); return s + (item ? item.price * q : 0); }, 0);
  const customCount = Object.values(customCart).reduce((s,q)=>s+q, 0);

  const dkCard = { background:'#FFFFFF', border:'1px solid rgba(255,107,0,0.15)', borderRadius:16, boxShadow:'0 4px 15px rgba(255,107,0,0.05)' };
  const selStyle = { padding:'10px 14px', borderRadius:10, border:'1.5px solid rgba(255,107,0,0.2)',
    background:'#FFFDFB', color:'#2C1A0E', fontSize:13, outline:'none', cursor:'pointer', fontFamily:'Nunito,sans-serif' };

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
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,107,0,0.08)',
              border:'1px solid rgba(255,107,0,0.25)', color:'#FF6B00', fontSize:10, fontWeight:900,
              letterSpacing:'1.2px', textTransform:'uppercase', padding:'4px 12px', borderRadius:20, marginBottom:10 }}>
              📦 Purity Certified · Same-day Delivery
            </div>
            <h2 style={{ fontFamily:'Cinzel,serif', color:'#2C1A0E', fontSize:'clamp(20px,3.5vw,28px)', margin:'0 0 6px', fontWeight:900 }}>🛍️ Pooja Samagri Store</h2>
            <p style={{ color:'#8B6347', margin:0, fontSize:14, fontWeight:600 }}>Authentic ritual kits delivered to your door · Free delivery above ₹999</p>
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
          {[['🚚','Same-day Delivery'],['✅','100% Authentic'],['🔄','Easy Returns'],['🆓','Free over ₹999']].map(([ic,tx])=>(
            <div key={tx} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span>{ic}</span>
              <span style={{ color:'#8B6347', fontSize:11, fontWeight:800 }}>{tx}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{ display:'flex', background:'rgba(240,192,64,0.1)', borderRadius:12, padding:4, marginBottom:18, width:'fit-content' }}>
        {[['ready','📦 Ready-Made Kits'],['custom','🛠️ Build Custom Kit']].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)}
            style={{ padding:'10px 22px', borderRadius:10, border:'none', cursor:'pointer', fontWeight:800, fontSize:14, transition:'all 0.24s',
              background: activeTab===id ? '#FF6B00' : 'transparent',
              color: activeTab===id ? '#fff' : '#5C3317', fontFamily:'Nunito,sans-serif' }}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'custom' ? (
        <div style={{ paddingBottom:20 }}>
          <div style={{ background:'#FDF9F4', border:'1.5px solid rgba(255,107,0,0.15)', borderRadius:16, padding:'20px 24px', marginBottom:20 }}>
            <div style={{ color:'#2C1A0E', fontWeight:900, fontSize:15, marginBottom:6 }}>🛠️ Build Your Perfect Pooja Kit</div>
            <div style={{ color:'#8B6347', fontSize:13, fontWeight:600, lineHeight:1.5 }}>Select individual items for your specific ritual. Perfect for experienced devotees who know exactly what they need.</div>
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
            {CUSTOM_CATS.map(c => (
              <button key={c} onClick={()=>setCustomCat(c)}
                style={{ padding:'8px 18px', borderRadius:20, cursor:'pointer', fontWeight:800, fontSize:13, fontFamily:'Nunito,sans-serif',
                  background: customCat===c ? '#FF6B00' : '#FFFDFB',
                  border: customCat===c ? 'none' : '1px solid rgba(255,107,0,0.2)',
                  color: customCat===c ? '#fff' : '#5C3317' }}>
                {c}
              </button>
            ))}
          </div>

          {/* Custom Kit Quick Commerce Progress Bar */}
          <div style={{ background: '#FFFDFB', padding: '16px 20px', borderRadius: 16, marginBottom: 20, border: '1.5px solid rgba(255,107,0,0.12)', boxShadow: '0 4px 12px rgba(255,107,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#FF6B00', fontSize: 13, fontWeight: 900 }}>🚚 Free Delivery Milestone</span>
              <span style={{ color: customTotal >= 500 ? '#27AE60' : '#8B6347', fontSize: 12, fontWeight: 900 }}>
                {customTotal >= 500 ? '🎉 Unlocked!' : `₹${500 - customTotal} away`}
              </span>
            </div>
            <div style={{ background: 'rgba(255,107,0,0.08)', height: 8, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: customTotal >= 500 ? '#4ade80' : 'linear-gradient(90deg, #FF6B00, #F0C040)', height: '100%', width: `${Math.min((customTotal/500)*100, 100)}%`, transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12, marginBottom:24 }}>
            {customFiltered.map(item => {
              const qty = customCart[item.id] || 0;
              return (
                <div key={item.id} style={{ background:'#FFFFFF', border:`1.5px solid ${qty>0?'rgba(255,107,0,0.5)':'rgba(255,107,0,0.1)'}`, borderRadius:12, padding:'14px',
                  boxShadow: qty>0?'0 4px 15px rgba(255,107,0,0.1)':'0 2px 8px rgba(0,0,0,0.03)' }}>
                  {item.img ? (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, height: 60 }}>
                      <img src={item.img} alt={item.name} style={{ height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} />
                    </div>
                  ) : (
                    <div style={{ fontSize:40, marginBottom:8, textAlign:'center', filter:'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}>{item.icon}</div>
                  )}
                  <div style={{ color:'#2C1A0E', fontWeight:900, fontSize:14, marginBottom:2, textAlign:'center' }}>{item.name}</div>
                  <div style={{ color:'#8B6347', fontSize:11, textAlign:'center', marginBottom:8, fontWeight:600 }}>{item.unit}</div>
                  <div style={{ color:'#FF6B00', fontWeight:900, fontSize:19, textAlign:'center', marginBottom:12, fontFamily:'Cinzel,sans-serif' }}>₹{item.price}</div>
                  {qty === 0 ? (
                    <button onClick={()=>setCustomCart(c=>({...c,[item.id]:1}))}
                      style={{ width:'100%', background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff', border:'none', borderRadius:8, padding:'8px', fontWeight:700, cursor:'pointer', fontSize:13 }}>
                      + Add
                    </button>
                  ) : (
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <button onClick={()=>setCustomCart(c=>{const n={...c};if(n[item.id]<=1)delete n[item.id];else n[item.id]--;return n;})}
                        style={{ width:32,height:32,borderRadius:'50%',background:'rgba(255,107,0,0.08)',color:'#FF6B00',border:'1.5px solid rgba(255,107,0,0.3)',cursor:'pointer',fontWeight:900,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center' }}>−</button>
                      <span style={{ flex:1,textAlign:'center',fontWeight:900,color:'#2C1A0E',fontSize:16 }}>{qty}</span>
                      <button onClick={()=>setCustomCart(c=>({...c,[item.id]:(c[item.id]||0)+1}))}
                        style={{ width:32,height:32,borderRadius:'50%',background:'#FF6B00',color:'#fff',border:'none',cursor:'pointer',fontWeight:900,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center' }}>+</button>
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
                <div style={{ color:'rgba(255,255,255,0.95)', fontSize:12, marginTop:4, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '60vw', fontWeight: 600 }}>
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
      <div className="compact-filter" style={{ ...dkCard, padding:'14px 18px', marginBottom:18, borderRadius:16 }}>
        <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap', alignItems: 'center' }}>
          <input style={{ flex: 1, background: '#FFFDFB', color: '#2C1A0E', border: '1.5px solid rgba(255,107,0,0.2)', borderRadius: 10, padding: '10px 14px' }} value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search samagri kits..." />
          <select style={selStyle} value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price_low">Price: Low → High</option>
            <option value="price_high">Price: High → Low</option>
          </select>
          <div style={{ color:'#8B6347', fontSize:13, fontWeight:900, padding: '0 8px' }}>
            {filtered.length} kits found
          </div>
        </div>
        <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none', paddingBottom:2 }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={()=>setCategory(c.id)}
              style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'8px 18px', borderRadius:40,
                border:`1.5px solid ${category===c.id ? '#FF6B00' : 'rgba(255,107,0,0.15)'}`,
                background: category===c.id ? '#FF6B00' : 'rgba(255,255,255,0.08)',
                color: category===c.id ? '#fff' : 'rgba(255,248,240,0.7)',
                fontWeight:800, fontSize:12, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0,
                fontFamily:'Nunito,sans-serif', transition:'all 0.24s',
                boxShadow: category===c.id ? '0 4px 12px rgba(255,107,0,0.15)' : 'none' }}>
              <span style={{ fontSize:16 }}>{c.icon}</span> {c.label}
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
              style={{ background:'#FFFFFF', padding:18, cursor:'pointer', position:'relative',
                border: qty>0 ? '1.5px solid #FF6B00' : '1.5px solid rgba(255,107,0,0.12)',
                borderRadius: 20,
                transition:'all 0.3s',
                boxShadow: qty>0 ? '0 8px 24px rgba(255,107,0,0.1)' : '0 4px 12px rgba(0,0,0,0.03)',
                overflow:'hidden' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor='#FF6B00'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=qty>0 ? '0 8px 24px rgba(255,107,0,0.1)' : '0 4px 12px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor=qty>0 ? '#FF6B00' : 'rgba(255,107,0,0.12)'; }}>

              {p.badge && <div style={{ position:'absolute', top:0, right:0,
                background:`linear-gradient(135deg,${BADGE_COLORS[p.badge]||'#FF6B00'},${BADGE_COLORS[p.badge]||'#D4A017'})`,
                color:'#fff', fontSize:'9px', fontWeight:800, padding:'3px 10px',
                borderRadius:'0 16px 0 10px', letterSpacing:'0.8px' }}>{p.badge}</div>}
              {qty>0 && <div style={{ position:'absolute', top:0, left:0, background:'rgba(255,107,0,0.9)',
                color:'#fff', fontSize:10, fontWeight:800, padding:'3px 10px',
                borderRadius:'16px 0 10px 0' }}>✓ In Basket ({qty})</div>}

              <div style={{ display:'flex', fontSize:64, alignItems:'center',
                justifyContent:'center', height:110, background:'rgba(212,160,23,0.06)',
                marginBottom:12, marginTop: qty>0||p.badge ? 10 : 0, borderRadius:12,
                filter:'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>
                {p.icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(39,174,96,0.08)', border: '1px solid rgba(34,197,94,0.2)', padding: '5px 12px', borderRadius: 20, width: 'fit-content', margin: '0 auto 12px' }}>
                <IconVerified size={10} color="#27AE60" />
                <span style={{ fontSize: 10, color: '#27AE60', fontWeight: 900, letterSpacing: 0.5, textTransform: 'uppercase' }}>100% Vedic Verified</span>
              </div>
              <h3 style={{ color:'#2C1A0E', fontFamily:'Cinzel,serif', margin:'0 0 6px', fontSize:16, fontWeight:900, textAlign: 'center' }}>{p.name}</h3>
              <div style={{ color:'#8B6347', fontSize:11, marginBottom:10, textAlign: 'center', fontWeight:700 }}>
                🧺 {Array.isArray(p.items) ? p.items.length : p.items} items · ⭐ {p.rating} ({p.reviews})
              </div>
              <p style={{ color:'#5C3317', fontSize:13, lineHeight:1.6, margin:'0 0 14px', fontWeight:500,
                display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden', textAlign: 'center' }}>{p.desc}</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:6 }}>
                <span style={{ color:'#FF6B00', fontWeight:900, fontSize:22, fontFamily:'Cinzel,serif' }}>₹{p.price}</span>
                <span style={{ color:'#8B6347', fontSize:14, textDecoration:'line-through', opacity:0.6 }}>₹{p.mrp}</span>
                <span style={{ background:'rgba(39,174,96,0.1)', color:'#27AE60',
                  fontSize:11, padding:'2px 10px', borderRadius:20, fontWeight:900 }}>{discount}% OFF</span>
              </div>
              <div style={{ color:'#27AE60', fontSize:11, fontWeight:800, marginBottom:14, textAlign: 'center' }}>Save ₹{(p.mrp-p.price).toLocaleString()}</div>

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
                    background:'rgba(255,107,0,0.08)', color:'#FF6B00', border:'1.5px solid rgba(255,107,0,0.3)',
                    cursor:'pointer', fontWeight:900, fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                  <span style={{ color:'#2C1A0E', fontWeight:900, fontSize:18, flex:1, textAlign:'center' }}>{qty}</span>
                  <button onClick={e=>addToCart(p,e)} style={{ width:36, height:36, borderRadius:'50%',
                    background:'#FF6B00', color:'#fff', border:'none', cursor:'pointer',
                    fontWeight:900, fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                  <button onClick={e=>clearItem(p.id,e)} style={{ background:'none', border:'none',
                    color:'#8B6347', cursor:'pointer', fontSize:16, padding:'0 4px', opacity:0.6 }}>🗑️</button>
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
            style={{ background:'#FFFFFF',
              border:'2px solid #FF6B00', borderRadius:24, padding:32,
              maxWidth:480, width:'100%', maxHeight:'90vh', overflowY:'auto',
              boxShadow:'0 30px 70px rgba(0,0,0,0.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ fontFamily:'Cinzel,serif', color:'#2C1A0E', margin:0, fontSize:22, fontWeight:900 }}>{selectedProduct.name}</h2>
              <button onClick={()=>setSelectedProduct(null)}
                style={{ background:'rgba(0,0,0,0.05)', border:'none', color:'#2C1A0E',
                  borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:14,
                  display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800 }}>✕</button>
            </div>
            <div style={{ textAlign:'center', marginBottom:16 }}>
              <div style={{ fontSize:56 }}>
                {selectedProduct.icon.startsWith('/') ? <PremiumIcon src={selectedProduct.icon} size={80} /> : selectedProduct.icon}
              </div>
            </div>
            <p style={{ color:'#5C3317', fontSize:15, lineHeight:1.7, marginBottom:24, fontWeight:500 }}>{selectedProduct.desc}</p>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
              <span style={{ color:'#FF6B00', fontWeight:900, fontSize:32, fontFamily:'Cinzel,serif' }}>₹{selectedProduct.price}</span>
              <span style={{ color:'#8B6347', fontSize:18, textDecoration:'line-through', opacity:0.5 }}>₹{selectedProduct.mrp}</span>
              <span style={{ background:'rgba(39,174,96,0.1)', color:'#27AE60', padding:'4px 12px', borderRadius:20, fontSize:14, fontWeight:900 }}>
                {Math.round((1-selectedProduct.price/selectedProduct.mrp)*100)}% OFF
              </span>
            </div>
            <div style={{ display:'flex', gap:12, marginTop:24 }}>
              {(cart[selectedProduct.id]||0)===0 ? (
                <button onClick={e=>{ addToCart(selectedProduct,e); setSelectedProduct(null); }}
                  style={{ flex:1, background:'linear-gradient(135deg,#FF6B00,#D4A017)', color:'#fff',
                    border:'none', borderRadius:14, padding:15, fontWeight:900, cursor:'pointer', fontSize:15, boxShadow:'0 8px 20px rgba(255,107,0,0.25)' }}>🧺 Add to Basket</button>
              ) : (
                <div style={{ flex:1, display:'flex', alignItems:'center', gap:12 }}>
                  <button onClick={e=>removeFromCart(selectedProduct.id,e)} style={{ width:40, height:40, borderRadius:'50%',
                    background:'rgba(255,107,0,0.1)', color:'#FF6B00', border:'2px solid rgba(255,107,0,0.3)',
                    cursor:'pointer', fontWeight:900, fontSize:20, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                  <span style={{ flex:1, textAlign:'center', fontWeight:900, fontSize:20, color:'#2C1A0E' }}>{cart[selectedProduct.id]}</span>
                  <button onClick={e=>addToCart(selectedProduct,e)} style={{ width:40, height:40, borderRadius:'50%',
                    background:'#FF6B00', color:'#fff', border:'none', cursor:'pointer',
                    fontWeight:900, fontSize:20, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                </div>
              )}
              <button onClick={()=>setSelectedProduct(null)}
                style={{ background:'#FDF9F4', color:'#8B6347',
                  border:'1.5px solid rgba(255,107,0,0.15)', borderRadius:14, padding:'12px 24px', fontWeight:800, cursor:'pointer' }}>Close</button>
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
