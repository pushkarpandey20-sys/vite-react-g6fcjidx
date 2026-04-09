import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import notificationStore from '../../../services/notificationService';
import { useApp } from '../../../store/AppCtx';
import { PremiumIcon, IconVerified, IconSearch } from '../../../components/Icons';

const CATEGORIES = [
  { id:'All',       label:'All Kits',          icon:'🕉️',  color:'#FF6B00' },
  { id:'festival',  label:'Festival Kits',     icon:'🪔',  color:'#D4A017' },
  { id:'daily',     label:'Daily Worship',     icon:'🌸',  color:'#e91e63' },
  { id:'abhishek',  label:'Abhishek',          icon:'🔱',  color:'#2196f3' },
  { id:'havan',     label:'Havan & Yagna',     icon:'🔥',  color:'#ff5722' },
  { id:'incense',   label:'Incense & Diyas',   icon:'🕯️',  color:'#9c27b0' },
  { id:'flowers',   label:'Flowers & Garlands',icon:'🌺',  color:'#4caf50' },
  { id:'grains',    label:'Grains & Offerings',icon:'🌾',  color:'#795548' },
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
    id: 'griha-pravesh-kit', name: 'Griha Pravesh Kit', category: 'daily', icon: '🏡',
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
    id: 'satyanarayan-kit', name: 'Satyanarayan Puja Kit', category: 'daily', icon: '🌟',
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
    id: 'havan-kit', name: 'Havan Samagri Kit', category: 'havan', icon: '🔥',
    price: 399, mrp: 499,
    badge: null, rating: 4.6, reviews: 203, weight: '1.2kg',
    desc: 'Pure Vedic havan samagri with 51 herbs, ghee, sesame, barley and sacred wood.',
    items: ['Havan Samagri (500g)', 'Pure Ghee (200ml)', 'Til (Sesame)', 'Barley', 'Mango Wood', 'Camphor', 'Kesar'],
  },
  {
    id: 'daily-puja-kit', name: 'Daily Puja Kit', category: 'daily', icon: '🌸',
    price: 299, mrp: 399,
    badge: 'BESTSELLER', rating: 4.7, reviews: 567, weight: '450g',
    desc: 'Everything for your daily puja — agarbatti, roli, akshat, moli, camphor and flowers.',
    items: ['Agarbatti (40 sticks)', 'Roli', 'Akshat', 'Moli', 'Camphor', 'Matchbox', 'Puja Thali'],
  },
  {
    id: 'incense-set', name: 'Premium Incense Collection', category: 'incense', icon: '🥢',
    price: 349, mrp: 449,
    badge: null, rating: 4.8, reviews: 145, weight: '350g',
    desc: 'Premium dhoop, agarbatti and sambrani collection with 10 sacred fragrances.',
    items: ['Chandan Agarbatti', 'Rose Agarbatti', 'Loban Dhoop', 'Sambrani Cups', 'Guggal', 'Camphor Cubes'],
  },
  {
    id: 'diya-lamp-set', name: 'Diya & Lamp Set', category: 'incense', icon: '🪔',
    price: 249, mrp: 349,
    badge: null, rating: 4.6, reviews: 98, weight: '600g',
    desc: 'Hand-crafted clay diyas and brass deepak for daily aarti and festival decorations.',
    items: ['Clay Diyas (24 pcs)', 'Brass Deepak', 'Cotton Wicks', 'Mustard Oil (100ml)'],
  },
  {
    id: 'navgrah-kit', name: 'Navgrah Shanti Kit', category: 'abhishek', icon: '⭐',
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
  { id:'c01', name:'Agarbatti (Incense Sticks)', icon:'🥢', price:49,  unit:'1 pack · 20 sticks',  cat:'Basic',    desc:'Chandan, rose or mogra fragrance' },
  { id:'c02', name:'Camphor (Kapoor)',            icon:'⬜', price:39,  unit:'10 tablets',           cat:'Basic',    desc:'Pure camphor for aarti and purification' },
  { id:'c03', name:'Roli / Kumkum',              icon:'🔴', price:29,  unit:'50g pack',             cat:'Basic',    desc:'Vermilion for tilak and puja marking' },
  { id:'c04', name:'Moli / Kalava (Sacred Thread)',icon:'🧵',price:19, unit:'1 roll · 10m',         cat:'Basic',    desc:'Red-yellow sacred thread for wrist and kalash' },
  { id:'c05', name:'Akshat (Unbroken Rice)',      icon:'🍚', price:25,  unit:'200g pack',            cat:'Basic',    desc:'Whole unbroken rice for puja offering' },
  { id:'c06', name:'Matchbox',                   icon:'🔥', price:10,  unit:'1 box',                cat:'Basic',    desc:'For lighting diya and agarbatti' },
  { id:'c07', name:'Puja Thali (Brass)',          icon:'🫓', price:199, unit:'1 piece',              cat:'Utensil',  desc:'Engraved brass plate for offerings' },
  { id:'c08', name:'Copper Kalash',              icon:'🏺', price:149, unit:'1 piece',              cat:'Utensil',  desc:'Sacred water pot with lid and coconut' },
  { id:'c09', name:'Clay Diyas (Matke)',          icon:'🪔', price:49,  unit:'12 pieces',            cat:'Diya',     desc:'Hand-crafted traditional clay diyas' },
  { id:'c10', name:'Brass Deepak (Oil Lamp)',    icon:'🪔', price:249, unit:'1 piece',              cat:'Diya',     desc:'Panch-mukhi brass oil lamp' },
  { id:'c11', name:'Cotton Wicks (Baati)',        icon:'🌾', price:15,  unit:'50 wicks',             cat:'Diya',     desc:'Pure cotton wicks for diyas and deepak' },
  { id:'c12', name:'Pure Mustard Oil',           icon:'🫙', price:79,  unit:'500ml bottle',          cat:'Diya',     desc:'Cold-pressed mustard oil for diya lighting' },
  { id:'c13', name:'Marigold (Genda) Flowers',   icon:'🌼', price:39,  unit:'250g fresh',            cat:'Flowers',  desc:'Auspicious yellow-orange marigold for puja' },
  { id:'c14', name:'Rose Petals',                icon:'🌹', price:29,  unit:'100g fresh',            cat:'Flowers',  desc:'Fresh red rose petals for offering' },
  { id:'c15', name:'Lotus Flower',               icon:'🪷', price:49,  unit:'2 pieces',              cat:'Flowers',  desc:'Fresh lotus for Lakshmi and Vishnu puja' },
  { id:'c16', name:'Bel Patra Leaves',            icon:'🍃', price:29,  unit:'21 leaves',            cat:'Flowers',  desc:'Sacred bilva leaves for Shiva puja' },
  { id:'c17', name:'Durva Grass',                icon:'🌱', price:19,  unit:'1 bunch',               cat:'Flowers',  desc:'21-bladed grass for Ganesh puja' },
  { id:'c18', name:'Tulsi Leaves',               icon:'🌿', price:15,  unit:'1 bunch',               cat:'Flowers',  desc:'Holy basil leaves for Vishnu puja' },
  { id:'c19', name:'Marigold Garland (1m)',       icon:'💐', price:59,  unit:'1 garland',            cat:'Flowers',  desc:'Fresh marigold flower garland' },
  { id:'c20', name:'Gangajal (Holy Water)',       icon:'💧', price:69,  unit:'250ml bottle',          cat:'Liquid',   desc:'Pure Ganga water sourced from Haridwar' },
  { id:'c21', name:'Pure Cow Ghee',              icon:'🫙', price:199, unit:'200ml jar',             cat:'Liquid',   desc:'Pure desi cow ghee for havan and abhishek' },
  { id:'c22', name:'Panchamrit Set',             icon:'🥛', price:149, unit:'5 sacred liquids',      cat:'Liquid',   desc:'Milk, curd, honey, ghee, sugar for abhishek' },
  { id:'c23', name:'Raw Cow Milk',               icon:'🥛', price:49,  unit:'500ml',                 cat:'Liquid',   desc:'Fresh pure cow milk for abhishek' },
  { id:'c24', name:'Honey (Pure)',               icon:'🍯', price:89,  unit:'100ml bottle',           cat:'Liquid',   desc:'Pure wild honey for panchamrit' },
  { id:'c25', name:'Curd / Dahi',                icon:'🥣', price:29,  unit:'200g',                  cat:'Liquid',   desc:'Fresh curd for panchamrit and abhishek' },
  { id:'c26', name:'Sugar / Mishri',             icon:'🍚', price:29,  unit:'100g',                  cat:'Liquid',   desc:'Crystal sugar for panchamrit' },
  { id:'c27', name:'Supari (Betel Nut)',          icon:'🌰', price:35,  unit:'50g pack',              cat:'Grain',    desc:'Whole betel nut for puja offering' },
  { id:'c28', name:'Betel Leaves (Pan Patta)',    icon:'🍃', price:25,  unit:'11 leaves',             cat:'Grain',    desc:'Fresh betel leaves for puja and offering' },
  { id:'c29', name:'Coconut (Nariyal)',           icon:'🥥', price:45,  unit:'1 whole coconut',       cat:'Grain',    desc:'Fresh whole coconut for puja' },
  { id:'c30', name:'Banana (Kela)',              icon:'🍌', price:25,  unit:'6 pieces',               cat:'Grain',    desc:'Ripe bananas for bhog and prasad' },
  { id:'c31', name:'Haldi (Turmeric)',           icon:'🟡', price:29,  unit:'50g pack',               cat:'Grain',    desc:'Turmeric powder for puja' },
  { id:'c32', name:'Sindoor',                    icon:'🔴', price:39,  unit:'10g box',                cat:'Grain',    desc:'Red sindoor for Devi puja and Vivah' },
  { id:'c33', name:'Jowar Seeds',               icon:'🌾', price:19,  unit:'100g',                   cat:'Grain',    desc:'Sorghum seeds for Navratri pot sowing' },
  { id:'c34', name:'Wheat Flour (Atta)',         icon:'🌾', price:29,  unit:'250g',                   cat:'Grain',    desc:'Whole wheat flour for Satyanarayan prasad' },
  { id:'c35', name:'Sesame Seeds (Til)',         icon:'⚫', price:25,  unit:'100g',                   cat:'Grain',    desc:'Black sesame seeds for havan and tarpan' },
  { id:'c36', name:'Barley (Jau)',              icon:'🌾', price:19,  unit:'100g',                   cat:'Grain',    desc:'Barley grains for havan ahuti offering' },
  { id:'c37', name:'Havan Samagri (51 Herbs)',   icon:'🌿', price:249, unit:'500g pack',              cat:'Havan',    desc:'Blend of 51 Vedic herbs, roots and resins' },
  { id:'c38', name:'Mango Wood (Aam Lakdi)',     icon:'🪵', price:99,  unit:'1kg bundle',             cat:'Havan',    desc:'Dry mango wood sticks for havan kund fire' },
  { id:'c39', name:'Havan Kund (Copper)',         icon:'🏺', price:399, unit:'1 piece',               cat:'Havan',    desc:'Square copper havan kund for fire ritual' },
  { id:'c40', name:'Lobaan / Guggal Resin',      icon:'💨', price:79,  unit:'50g pack',              cat:'Havan',    desc:'Sacred resin for dhoop smoke and havan' },
  { id:'c41', name:'Rudraksha Mala (108 beads)', icon:'📿', price:299, unit:'1 mala',                cat:'Abhishek', desc:'5-mukhi Rudraksha mala for Shiva puja' },
  { id:'c42', name:'White Sandal Powder (Chandan)',icon:'🌿',price:99, unit:'50g pack',              cat:'Abhishek', desc:'Pure white chandan for abhishek and tilak' },
  { id:'c43', name:'Dhatura Flower',             icon:'🌸', price:29,  unit:'5 pieces',              cat:'Abhishek', desc:'Sacred white Dhatura for Shiva puja' },
  { id:'c44', name:'Kesar (Saffron)',            icon:'🟠', price:149, unit:'0.5g sachet',            cat:'Abhishek', desc:'Pure Kashmir kesar for puja tilak' },
  { id:'c45', name:'Mango Leaves Torana (12)',   icon:'🍃', price:19,  unit:'12 leaves',             cat:'Decor',    desc:'Auspicious mango leaves for door decoration' },
  { id:'c46', name:'Red Cloth / Chunri (1m)',    icon:'🟥', price:99,  unit:'1 yard',                cat:'Decor',    desc:'Red cloth for Devi covering and chunri' },
  { id:'c47', name:'Yellow Cloth (1m)',          icon:'🟨', price:79,  unit:'1 yard',                cat:'Decor',    desc:'Yellow cloth for Vishnu puja and altar' },
  { id:'c48', name:'Puja Bell (Ghanta)',         icon:'🔔', price:149, unit:'1 brass piece',         cat:'Utensil',  desc:'Brass bell for aarti and puja' },
  { id:'c49', name:'Puja Chowki (Wooden Platform)',icon:'🟫',price:199,unit:'1 piece',               cat:'Utensil',  desc:'Wooden platform for idol and kalash' },
  { id:'c50', name:'Panchamrit Copper Spoon',   icon:'🥄', price:49,  unit:'1 copper piece',        cat:'Utensil',  desc:'Copper spoon for panchamrit abhishek' },
  { id:'c51', name:'Sambrani Cup (Dhoop)',       icon:'💨', price:49,  unit:'10 cups',               cat:'Incense',  desc:'Sambrani resin cups for home purification' },
  { id:'c52', name:'Karpoor (Large Camphor Block)',icon:'⬜',price:29, unit:'5g block',              cat:'Incense',  desc:'Large camphor block for aarti plate' },
];
const CUSTOM_CATS = ['All', 'Basic', 'Diya', 'Flowers', 'Liquid', 'Grain', 'Havan', 'Abhishek', 'Decor', 'Utensil', 'Incense'];
const RITUAL_SAMAGRI = {
  'griha-pravesh':   ['c01','c02','c03','c04','c05','c06','c07','c08','c09','c11','c12','c13','c19','c20','c21','c29','c37','c38','c39','c45','c48','c49'],
  'satyanarayan':    ['c01','c02','c03','c04','c05','c06','c07','c09','c11','c12','c13','c18','c20','c22','c23','c24','c25','c26','c29','c30','c34','c47','c48'],
  'rudrabhishek':    ['c01','c02','c04','c06','c09','c11','c12','c16','c20','c21','c23','c24','c25','c40','c41','c42','c43','c44','c48','c51','c50'],
  'vivah':           ['c01','c02','c03','c04','c05','c06','c07','c08','c09','c11','c12','c13','c14','c19','c20','c21','c29','c32','c45','c46','c48','c49'],
  'navgrah-shanti':  ['c01','c02','c03','c04','c05','c06','c09','c11','c12','c13','c20','c21','c23','c29','c35','c36','c37','c47','c48'],
  'kaal-sarp':       ['c01','c02','c04','c06','c09','c11','c12','c16','c20','c21','c37','c40','c41','c48'],
  'lakshmi-puja':    ['c01','c02','c03','c04','c05','c06','c07','c09','c11','c12','c14','c15','c20','c22','c26','c29','c32','c44','c47','c48','c49'],
  'ganesh-puja':     ['c01','c02','c03','c04','c05','c06','c09','c11','c12','c17','c20','c29','c30','c48'],
  'havan':           ['c01','c02','c04','c06','c08','c09','c11','c12','c20','c21','c35','c36','c37','c38','c39','c40','c48'],
  'namkaran':        ['c01','c02','c03','c04','c05','c06','c09','c11','c12','c13','c20','c22','c29','c48'],
  'mundan':          ['c01','c02','c03','c04','c05','c06','c09','c11','c12','c13','c20','c29','c48'],
  'navratri-puja':   ['c01','c02','c03','c04','c05','c06','c08','c09','c11','c12','c13','c20','c29','c33','c46','c48'],
  'diwali-puja':     ['c01','c02','c03','c04','c05','c06','c09','c10','c11','c12','c13','c14','c20','c26','c29','c48','c49'],
  'custom':          ['c01','c02','c03','c04','c05','c06','c09','c11','c12','c20','c29'],
};

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
  const [selectedRitual, setSelectedRitual] = useState('custom');
  const [customCart, setCustomCart] = useState(() => {
    const ids = RITUAL_SAMAGRI['custom'];
    const cart = {};
    ids.forEach(id => { cart[id] = 1; });
    return cart;
  });
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

  const dkCard = { background:'rgba(26,15,7,0.88)', border:'1px solid rgba(212,160,23,0.18)', borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,0.4)' };
  const selStyle = { padding:'10px 14px', borderRadius:10, border:'1.5px solid rgba(255,107,0,0.2)',
    background:'rgba(61,31,0,0.6)', color:'rgba(255,248,240,0.85)', fontSize:13, outline:'none', cursor:'pointer', fontFamily:'Nunito,sans-serif' };

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
            <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontSize:'clamp(20px,3.5vw,28px)', margin:'0 0 6px', fontWeight:900 }}>🛍️ Pooja Samagri Store</h2>
            <p style={{ color:'rgba(255,248,240,0.6)', margin:0, fontSize:14, fontWeight:600 }}>Authentic ritual kits delivered to your door · Free delivery above ₹999</p>
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
              <span style={{ color:'rgba(255,248,240,0.55)', fontSize:11, fontWeight:800 }}>{tx}</span>
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
          <div style={{ background:'rgba(61,31,0,0.6)', border:'1.5px solid rgba(255,107,0,0.2)', borderRadius:16, padding:'20px 24px', marginBottom:20 }}>
            <div style={{ color:'#F0C040', fontWeight:900, fontSize:15, marginBottom:6 }}>🛠️ Build Your Perfect Pooja Kit</div>
            <div style={{ color:'rgba(255,248,240,0.65)', fontSize:13, fontWeight:600, lineHeight:1.5, marginBottom:14 }}>Select your ritual — items auto-fill. Add or remove below as needed.</div>
            <label style={{ color:'#D4A017', fontSize:12, fontWeight:700, letterSpacing:0.8, display:'block', marginBottom:6 }}>
              🕉️ SELECT YOUR RITUAL — Auto-fills the required items
            </label>
            <select value={selectedRitual}
              onChange={e => {
                const val = e.target.value;
                setSelectedRitual(val);
                const ids = RITUAL_SAMAGRI[val] || RITUAL_SAMAGRI['custom'];
                const newCart = {};
                ids.forEach(id => { newCart[id] = 1; });
                setCustomCart(newCart);
              }}
              style={{
                width:'100%', padding:'11px 14px', borderRadius:10,
                border:'1.5px solid rgba(212,160,23,0.4)',
                background:'rgba(255,255,255,0.06)', color:'rgba(255,248,240,0.9)',
                fontSize:14, fontFamily:'inherit', cursor:'pointer', outline:'none',
              }}>
              <option value="custom">🕉️ Custom — Pick items manually</option>
              <option value="griha-pravesh">🏡 Griha Pravesh (22 items)</option>
              <option value="satyanarayan">🌟 Satyanarayan Katha (23 items)</option>
              <option value="rudrabhishek">🔱 Rudrabhishek (21 items)</option>
              <option value="vivah">💍 Vivah Ceremony (22 items)</option>
              <option value="navgrah-shanti">⭐ Navgrah Shanti (19 items)</option>
              <option value="kaal-sarp">🐍 Kaal Sarp Dosh (14 items)</option>
              <option value="lakshmi-puja">🪷 Lakshmi Puja (21 items)</option>
              <option value="ganesh-puja">🐘 Ganesh Puja (14 items)</option>
              <option value="havan">🔥 Havan / Homam (17 items)</option>
              <option value="namkaran">🍼 Namkaran Ceremony (14 items)</option>
              <option value="mundan">✂️ Mundan Ceremony (14 items)</option>
              <option value="navratri-puja">🌺 Navratri Puja (16 items)</option>
              <option value="diwali-puja">🪔 Diwali Pooja (17 items)</option>
            </select>
            <div style={{ color:'rgba(255,248,240,0.35)', fontSize:11, marginTop:5 }}>
              Selecting a ritual auto-fills all Vedic-required items. Add or remove below.
            </div>
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
            {CUSTOM_CATS.map(c => (
              <button key={c} onClick={()=>setCustomCat(c)}
                style={{ padding:'8px 18px', borderRadius:20, cursor:'pointer', fontWeight:800, fontSize:13, fontFamily:'Nunito,sans-serif',
                  background: customCat===c ? '#FF6B00' : 'rgba(61,31,0,0.6)',
                  border: customCat===c ? 'none' : '1px solid rgba(255,107,0,0.2)',
                  color: customCat===c ? '#fff' : 'rgba(255,248,240,0.6)' }}>
                {c}
              </button>
            ))}
          </div>

          {/* Custom Kit Quick Commerce Progress Bar */}
          <div style={{ background: 'rgba(26,15,7,0.85)', padding: '16px 20px', borderRadius: 16, marginBottom: 20, border: '1.5px solid rgba(255,107,0,0.12)', boxShadow: '0 4px 12px rgba(255,107,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#FF6B00', fontSize: 13, fontWeight: 900 }}>🚚 Free Delivery Milestone</span>
              <span style={{ color: customTotal >= 500 ? '#27AE60' : 'rgba(255,248,240,0.55)', fontSize: 12, fontWeight: 900 }}>
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
                <div key={item.id} style={{ background:'rgba(26,15,7,0.88)', border:`1.5px solid ${qty>0?'rgba(255,107,0,0.5)':'rgba(255,107,0,0.1)'}`, borderRadius:12, padding:'14px',
                  boxShadow: qty>0?'0 4px 15px rgba(255,107,0,0.1)':'0 2px 8px rgba(0,0,0,0.03)' }}>
                  {item.img ? (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, height: 60 }}>
                      <img src={item.img} alt={item.name} style={{ height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }} />
                    </div>
                  ) : (
                    <div style={{ fontSize:40, marginBottom:8, textAlign:'center', filter:'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}>{item.icon}</div>
                  )}
                  <div style={{ color:'#F0C040', fontWeight:900, fontSize:14, marginBottom:2, textAlign:'center' }}>{item.name}</div>
                  <div style={{ color:'rgba(255,248,240,0.55)', fontSize:11, textAlign:'center', marginBottom:8, fontWeight:600 }}>{item.unit}</div>
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
                      <span style={{ flex:1,textAlign:'center',fontWeight:900,color:'rgba(255,248,240,0.9)',fontSize:16 }}>{qty}</span>
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
                  style={{ background:'rgba(255,107,0,0.1)', color:'#FF6B00', border:'none', borderRadius:20, padding:'10px 22px', fontWeight:800, cursor:'pointer', fontSize:14 }}>
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
          <input style={{ flex: 1, background: 'rgba(40,15,5,0.8)', color: 'rgba(255,248,240,0.85)', border: '1.5px solid rgba(255,107,0,0.2)', borderRadius: 10, padding: '10px 14px' }} value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search samagri kits..." />
          <select style={selStyle} value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price_low">Price: Low → High</option>
            <option value="price_high">Price: High → Low</option>
          </select>
          <div style={{ color:'rgba(255,248,240,0.55)', fontSize:13, fontWeight:900, padding: '0 8px' }}>
            {filtered.length} kits found
          </div>
        </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', margin:'12px 0' }}>
            {CATEGORIES.map(cat => {
              const active = category === cat.id;
              return (
                <button key={cat.id} onClick={() => setCategory(cat.id)}
                  style={{
                    display:'flex', alignItems:'center', gap:6,
                    padding:'8px 16px', borderRadius:24, cursor:'pointer',
                    fontFamily:'inherit', fontWeight:700, fontSize:13,
                    transition:'all 0.2s', whiteSpace:'nowrap',
                    border: active ? `1.5px solid ${cat.color}` : '1.5px solid rgba(212,160,23,0.25)',
                    background: active ? cat.color : 'rgba(255,255,255,0.05)',
                    color: active ? '#ffffff' : 'rgba(255,248,240,0.75)',
                    boxShadow: active ? `0 2px 12px ${cat.color}44` : 'none',
                  }}>
                  <span style={{ fontSize:16 }}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
      </div>

      {/* Product Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
        {filtered.map(p => {
          const qty = cart[p.id]||0;
          const discount = Math.round((1-p.price/p.mrp)*100);
          return (
            <div key={p.id} onClick={()=>setSelectedProduct(p)}
              style={{ background:'rgba(26,15,7,0.88)', padding:18, cursor:'pointer', position:'relative',
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
              <h3 style={{ color:'#F0C040', fontFamily:'Cinzel,serif', margin:'0 0 6px', fontSize:16, fontWeight:900, textAlign: 'center' }}>{p.name}</h3>
              <div style={{ color:'rgba(255,248,240,0.55)', fontSize:11, marginBottom:10, textAlign: 'center', fontWeight:700 }}>
                🧺 {Array.isArray(p.items) ? p.items.length : p.items} items · ⭐ {p.rating} ({p.reviews})
              </div>
              <p style={{ color:'rgba(255,248,240,0.6)', fontSize:13, lineHeight:1.6, margin:'0 0 14px', fontWeight:500,
                display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden', textAlign: 'center' }}>{p.desc}</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:6 }}>
                <span style={{ color:'#FF6B00', fontWeight:900, fontSize:22, fontFamily:'Cinzel,serif' }}>₹{p.price}</span>
                <span style={{ color:'rgba(255,248,240,0.45)', fontSize:14, textDecoration:'line-through', opacity:0.6 }}>₹{p.mrp}</span>
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
                  <span style={{ color:'rgba(255,248,240,0.9)', fontWeight:900, fontSize:18, flex:1, textAlign:'center' }}>{qty}</span>
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
            style={{ background:'rgba(20,8,2,0.98)',
              border:'2px solid #FF6B00', borderRadius:24, padding:32,
              maxWidth:480, width:'100%', maxHeight:'90vh', overflowY:'auto',
              boxShadow:'0 30px 70px rgba(0,0,0,0.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', margin:0, fontSize:22, fontWeight:900 }}>{selectedProduct.name}</h2>
              <button onClick={()=>setSelectedProduct(null)}
                style={{ background:'rgba(255,107,0,0.1)', border:'none', color:'#F0C040',
                  borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:14,
                  display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800 }}>✕</button>
            </div>
            <div style={{ textAlign:'center', marginBottom:16 }}>
              <div style={{ fontSize:56 }}>
                {selectedProduct.icon.startsWith('/') ? <PremiumIcon src={selectedProduct.icon} size={80} /> : selectedProduct.icon}
              </div>
            </div>
            <p style={{ color:'rgba(255,248,240,0.6)', fontSize:15, lineHeight:1.7, marginBottom:24, fontWeight:500 }}>{selectedProduct.desc}</p>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
              <span style={{ color:'#FF6B00', fontWeight:900, fontSize:32, fontFamily:'Cinzel,serif' }}>₹{selectedProduct.price}</span>
              <span style={{ color:'rgba(255,248,240,0.45)', fontSize:18, textDecoration:'line-through', opacity:0.5 }}>₹{selectedProduct.mrp}</span>
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
                  <span style={{ flex:1, textAlign:'center', fontWeight:900, fontSize:20, color:'rgba(255,248,240,0.9)' }}>{cart[selectedProduct.id]}</span>
                  <button onClick={e=>addToCart(selectedProduct,e)} style={{ width:40, height:40, borderRadius:'50%',
                    background:'#FF6B00', color:'#fff', border:'none', cursor:'pointer',
                    fontWeight:900, fontSize:20, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                </div>
              )}
              <button onClick={()=>setSelectedProduct(null)}
                style={{ background:'rgba(26,15,7,0.85)', color:'rgba(255,248,240,0.6)',
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
              style={{ background:'rgba(255,107,0,0.1)', color:'#FF6B00', border:'none', borderRadius:24,
                padding:'10px 24px', fontWeight:800, cursor:'pointer', fontSize:14 }}>
              {checkoutDone ? '✅ Order Placed!' : 'Checkout →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
