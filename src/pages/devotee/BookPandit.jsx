import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';
import { PanditCard } from '../../components/Cards';

export default function BookPandit() {
  const { db, devoteeId, devoteeName, setBookingDraft, setShowConfirm, toast, setViewPandit, MUHURTAS, setShowLogin } = useApp();
  const [step, setStep] = useState(1);
  const [pandits, setPandits] = useState([]);
  const [rituals, setRituals] = useState([]);

  if (!devoteeId) {
    return (
      <div className="card card-p" style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>🙏</div>
        <h3 style={{ fontFamily: "'Cinzel',serif", marginBottom: 10 }}>Ready to Book?</h3>
        <p style={{ color: "#8B6347", marginBottom: 24 }}>Connect with verified Vedic scholars for your sacred ceremonies. Login to start your booking.</p>
        <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Login / Register Now</button>
      </div>
    );
  }

  const [selRitual, setSelRitual] = useState(null);
  const [selPandit, setSelPandit] = useState(null);
  const [selMuhurat, setSelMuhurat] = useState(null);
  const [addSamagri, setAddSamagri] = useState(true);
  const [samagriKits, setSamagriKits] = useState([]);
  const [form, setForm] = useState({ 
    name: devoteeName, 
    phone: "+91 9876543210", 
    date: "", 
    time: "7:00 AM (Brahma Muhurta)", 
    address: "", 
    notes: "",
    country: "India",
    timezone: "IST (Asia/Kolkata)"
  });
  const [sankalp, setSankalp] = useState({
    devotee_name: devoteeName,
    gotra: "",
    nakshatra: "",
    purpose_of_puja: "",
    family_members: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    db.rituals().select("*").eq("active", true).then(({ data }) => setRituals(data || []));
    db.pandits().select("*").then(({ data }) => setPandits(data || []));
    supabase.from('samagri_kits').select('*').then(({ data }) => setSamagriKits(data || []));
  }, []);

  const ritual = selRitual === "generic" ? { name: "On-Demand Pandit", icon: "🕉️", price: 1100, duration: "Custom", description: "Book a verified Pandit for custom requests, consultations, or any pooja not listed." } : rituals.find(r => r.id === selRitual);
  const pandit = pandits.find(p => p.id === selPandit);
  const kit = samagriKits.find(k => k.ritual_id === selRitual) || { price: 500, items_list: ["Incense", "Flowers", "Ghee", "Akshat", "Moli"] };

  const submit = () => {
    if (!ritual || !pandit || !form.date || !form.address) { toast("Please fill all required fields", "⚠️"); return; }
    setBookingDraft({
      ritual: ritual.name, 
      ritualId: ritual.id,
      ritualIcon: ritual.icon,
      panditId: pandit.id, 
      panditName: pandit.name,
      date: form.date, 
      time: form.time,
      address: form.address, 
      location: form.address.split(",")[0],
      amount: (ritual.price || 2100) + (addSamagri ? (kit.price || 500) : 0), 
      notes: form.notes,
      addSamagri,
      sankalp: {
        ...sankalp,
        family_members: sankalp.family_members.split(",").map(m => m.trim()).filter(m => m)
      },
      country: form.country,
      timezone: form.timezone
    });
    setShowConfirm(true);
  };

  return (<>
    <div className="steps" style={{ overflowX: "auto", paddingBottom: 10 }}>
      {["Ritual", "Pandit", "Schedule", "Sankalp"].map((s, i) => (
        <React.Fragment key={i}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: step === i + 1 ? 1 : .5, fontWeight: step === i + 1 ? 800 : 500, flexShrink: 0 }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: step === i + 1 ? "#FF6B00" : "#ddd", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{i + 1}</span>
            <span style={{ fontSize: 13 }}>{s}</span>
          </div>
          {i < 3 && <span className="step-arr">→</span>}
        </React.Fragment>
      ))}
    </div>

    <div className="card card-p" style={{ minHeight: 400 }}>
      {step === 1 && (<>
        <div className="sh"><div className="sh-title">Select Sacred Ritual</div></div>
        <div className="rgrid">
          <div className={`rc ${selRitual === "generic" ? "selected" : ""} `} onClick={() => setSelRitual("generic")}>
            <div className="rc-icon">🕉️</div><div className="rc-body"><div className="rc-name">On-Demand</div><div className="rc-price">₹1,100</div></div>
          </div>
          {rituals.map(r => (
            <div key={r.id} className={`rc ${selRitual === r.id ? "selected" : ""} `} onClick={() => setSelRitual(r.id)}>
              <div className="rc-icon">{r.icon}</div>
              <div className="rc-body"><div className="rc-name">{r.name}</div><div className="rc-price">₹{r.price}</div></div>
            </div>
          ))}
        </div>
        {ritual && <div className="card card-p" style={{ background: "rgba(255,107,0,.04)", border: "1px dashed #FF6B00", marginTop: 20 }}>
          <div style={{ fontWeight: 800, color: "#FF6B00", marginBottom: 4 }}>{ritual.icon} {ritual.name}</div>
          <p style={{ fontSize: 12.5, color: "#8B6347", lineHeight: 1.6 }}>{ritual.description}</p>
        </div>}
      </>)}

      {step === 2 && (<>
        <div className="sh"><div className="sh-title">Choose Certified Pandit</div></div>
        <div className="pgrid">
          {pandits.map(p => <PanditCard key={p.id} p={p} selected={selPandit === p.id} selectMode onBook={() => setSelPandit(p.id)} onView={setViewPandit} />)}
        </div>
      </>)}

      {step === 3 && (<>
        <div className="sh"><div className="sh-title">Booking Details & Address</div></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
          <div className="fg"><label className="fl">Pooja Date</label><input type="date" className="fi" value={form.date} onChange={e => setForm(s => ({ ...s, date: e.target.value }))} /></div>
          <div className="fg"><label className="fl">Time Slot</label>
            <select className="fs" value={form.time} onChange={e => setForm(s => ({ ...s, time: e.target.value }))}>
              {MUHURTAS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="fg"><label className="fl">Country</label>
            <select className="fs" value={form.country} onChange={e => setForm(s => ({ ...s, country: e.target.value }))}>
              <option>India</option><option>USA</option><option>UK</option><option>Canada</option><option>Australia</option><option>Other</option>
            </select>
          </div>
          <div className="fg"><label className="fl">Timezone</label><input className="fi" value={form.timezone} disabled /></div>
          <div className="fg ffw"><label className="fl">Precise Address</label><textarea className="fta" placeholder="Enter full address where ritual will be performed..." value={form.address} onChange={e => setForm(s => ({ ...s, address: e.target.value }))} /></div>
          
          <div className="ffw" style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,107,0,.06)", padding: 12, borderRadius: 10, border: "1px solid rgba(255,107,0,.15)" }}>
            <input type="checkbox" checked={addSamagri} onChange={() => setAddSamagri(!addSamagri)} style={{ width: 18, height: 18 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Add Pooja Samagri Kit (+₹{kit.price || 500})</div>
              <div style={{ fontSize: 11, color: "#8B6347" }}>Items: {kit.items_list?.slice(0, 5).join(", ")}...</div>
            </div>
          </div>
        </div>
      </>)}

      {step === 4 && (<>
        <div className="sh"><div className="sh-title">Sankalp Details</div><div className="sh-sub">Provide these details for the Pandit to include in the ritual</div></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
          <div className="fg"><label className="fl">Main Devotee Name</label><input className="fi" value={sankalp.devotee_name} onChange={e => setSankalp(s => ({ ...s, devotee_name: e.target.value }))} /></div>
          <div className="fg"><label className="fl">Gotra</label><input className="fi" placeholder="e.g. Kashyap, Bhardwaj..." value={sankalp.gotra} onChange={e => setSankalp(s => ({ ...s, gotra: e.target.value }))} /></div>
          <div className="fg"><label className="fl">Nakshatra (Optional)</label><input className="fi" placeholder="e.g. Ashwini, Rohini..." value={sankalp.nakshatra} onChange={e => setSankalp(s => ({ ...s, nakshatra: e.target.value }))} /></div>
          <div className="fg"><label className="fl">Purpose of Pooja</label><input className="fi" placeholder="e.g. Health, Wealth, Birthday..." value={sankalp.purpose_of_puja} onChange={e => setSankalp(s => ({ ...s, purpose_of_puja: e.target.value }))} /></div>
          <div className="fg ffw"><label className="fl">Family Members (Comman separated)</label><textarea className="fta" placeholder="Enter names of family members to be included in Sankalp..." value={sankalp.family_members} onChange={e => setSankalp(s => ({ ...s, family_members: e.target.value }))} /></div>
        </div>
      </>)}
    </div>

    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
      <button className="btn btn-outline" onClick={() => setStep(p => p - 1)} disabled={step === 1}>Back</button>
      {step < 4 ? (
        <button className="btn btn-primary" onClick={() => setStep(p => p + 1)} disabled={(step === 1 && !selRitual) || (step === 2 && !selPandit) || (step === 3 && (!form.date || !form.address))}>Continue</button>
      ) : (
        <button className="btn btn-gold" onClick={submit} style={{ padding: "10px 32px", fontSize: 14 }}>🚀 Proceed to Payment</button>
      )}
    </div>
  </>);
}
