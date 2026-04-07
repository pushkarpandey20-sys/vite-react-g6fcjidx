import React from 'react';

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
  if (n.includes("camphor")) return "🕯️";
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
  if (n.includes("thali")) return "🥣";
  return "🛕";
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
