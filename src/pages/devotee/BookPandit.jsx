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
  const [form, setForm] = useState({ name: devoteeName, phone: "+91 9876543210", date: "", time: "7:00 AM (Brahma Muhurta)", address: "", notes: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    db.rituals().select("*").eq("active", true).then(({ data }) => setRituals(data || []));
    db.pandits().select("*").then(({ data }) => setPandits(data || []));
  }, []);

  const ritual = selRitual === "generic" ? { name: "On-Demand Pandit", icon: "🕉️", price: 1100, duration: "Custom", description: "Book a verified Pandit for custom requests, consultations, or any pooja not listed." } : rituals.find(r => r.id === selRitual);
  const pandit = pandits.find(p => p.id === selPandit);

  const submit = () => {
    if (!ritual || !pandit || !form.date || !form.address) { toast("Please fill all required fields", "⚠️"); return; }
    setBookingDraft({
      ritual: ritual.name, ritualIcon: ritual.icon,
      panditId: pandit.id, panditName: pandit.name,
      date: form.date, time: form.time,
      address: form.address, location: form.address.split(",")[0],
      amount: (ritual.price || 2100) + (addSamagri ? 500 : 0), notes: form.notes + (addSamagri ? " [Includes Poja Samagri]" : ""),
    });
    setShowConfirm(true);
  };

  return (<>
    <div className="steps">
      {["Select Ritual", "Choose Pandit", "Set Schedule"].map((s, i) => (
        <React.Fragment key={i}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: step === i + 1 ? 1 : .5, fontWeight: step === i + 1 ? 800 : 500 }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: step === i + 1 ? "#FF6B00" : "#ddd", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{i + 1}</span>
            <span style={{ fontSize: 13 }}>{s}</span>
          </div>
          {i < 2 && <span className="step-arr">→</span>}
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
        {ritual && <div className="card card-p" style={{ background: "rgba(255,107,0,.04)", border: "1px dashed #FF6B00", marginBottom: 20 }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="fg"><label className="fl">Pooja Date</label><input type="date" className="fi" value={form.date} onChange={e => setForm(s => ({ ...s, date: e.target.value }))} /></div>
          <div className="fg"><label className="fl">Preferred Time Slot</label>
            <select className="fs" value={form.time} onChange={e => setForm(s => ({ ...s, time: e.target.value }))}>
              <option>7:00 AM (Brahma Muhurta)</option><option>9:30 AM</option><option>11:00 AM</option><option>4:00 PM (Pradosh)</option>
            </select>
          </div>
          <div className="fg ffw"><label className="fl">Precise Address (Home/Office/Temple)</label><textarea className="fta" placeholder="Enter full address where ritual will be performed..." value={form.address} onChange={e => setForm(s => ({ ...s, address: e.target.value }))} /></div>
          <div className="fg ffw"><label className="fl">Special Instructions / Gotra</label><input className="fi" placeholder="Add any special requirements..." value={form.notes} onChange={e => setForm(s => ({ ...s, notes: e.target.value }))} /></div>
          <div className="ffw" style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,107,0,.06)", padding: 12, borderRadius: 10, border: "1px solid rgba(255,107,0,.15)" }}>
            <input type="checkbox" checked={addSamagri} onChange={() => setAddSamagri(!addSamagri)} style={{ width: 18, height: 18 }} />
            <div><div style={{ fontSize: 13, fontWeight: 700 }}>Add Pooja Samagri Kit (+₹500)</div><div style={{ fontSize: 11, color: "#8B6347" }}>We'll bring all required items like Incense, Flowers, Ghee, etc.</div></div>
          </div>
        </div>
      </>)}
    </div>

    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
      <button className="btn btn-outline" onClick={() => setStep(p => p - 1)} disabled={step === 1}>Back</button>
      {step < 3 ? (
        <button className="btn btn-primary" onClick={() => setStep(p => p + 1)} disabled={(step === 1 && !selRitual) || (step === 2 && !selPandit)}>Continue</button>
      ) : (
        <button className="btn btn-gold" onClick={submit} style={{ padding: "10px 32px", fontSize: 14 }}>🚀 Book Now</button>
      )}
    </div>
  </>);
}
