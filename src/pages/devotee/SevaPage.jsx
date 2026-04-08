import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';
import { paymentService } from '../../services/paymentService';
import { Spinner } from '../../components/common/UIElements';
import { toUUID } from '../../services/supabase';
import { PremiumIcon } from '../../components/Icons';

export default function SevaPage() {
  const { db, toast, devoteeId, devoteeName, SEVA_OPTIONS, setShowLogin } = useApp();
  const [selAmts, setSelAmts] = useState({});
  const [customAmts, setCustomAmts] = useState({});
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    if (devoteeId) db.donations().select("*").eq("devotee_id", devoteeId).order("created_at", { ascending: false }).then(({ data }) => setDonations(data || []));
  }, [devoteeId, db]);

  const donate = async (seva) => {
    if (!devoteeId) {
      setShowLogin(true);
      return;
    }
    const amt = parseInt(customAmts[seva.id]) || selAmts[seva.id];
    if (!amt) { toast("Please select or enter an amount", "⚠️"); return; }

    try {
      const payment = await paymentService.processPayment({
        amount: amt,
        name: devoteeName,
        description: `Seva Offering: ${seva.name}`
      });

      if (payment.success) {
        const { data, error } = await db.donations().insert({
          devotee_id: toUUID(devoteeId),
          devotee_name: devoteeName, 
          seva_name: seva.name, 
          seva_icon: seva.icon, 
          amount: amt,
          payment_id: payment.payment_id,
          status: 'paid'
        }).select().single();

        if (!error && data) {
          setDonations(prev => [data, ...prev]);
          toast(`₹${amt} donated for ${seva.name}! 🙏`, seva.icon);
          setSelAmts(s => ({ ...s, [seva.id]: null }));
          setCustomAmts(c => ({ ...c, [seva.id]: "" }));
        }
      }
    } catch (err) {
      toast("Transaction Cancelled", "⚠️");
    }
  };


  return (<>
    <div className="sev-grid">
      {SEVA_OPTIONS.map(s => (
        <div key={s.id} className="sev-card">
          <div className="sev-icon">
            {s.icon.startsWith('/') ? <PremiumIcon src={s.icon} size={48} /> : s.icon}
          </div>
          <div className="sev-name">{s.name}</div>
          <div className="sev-desc">{s.desc}</div>
          <div className="sev-amts">
            {s.amounts.map(a => (
              <span key={a}
                className={`amt-chip ${selAmts[s.id] === a && !customAmts[s.id] ? "selected" : ""}`}
                onClick={() => {
                  setSelAmts(p => ({ ...p, [s.id]: a }));
                  setCustomAmts(p => ({ ...p, [s.id]: String(a) }));
                }}>₹{a}</span>
            ))}
          </div>
          <input className="fi" placeholder="Custom ₹" type="number"
            value={customAmts[s.id] || ""}
            onChange={e => {
              setCustomAmts(p => ({ ...p, [s.id]: e.target.value }));
              setSelAmts(p => ({ ...p, [s.id]: null }));
            }}
            style={{ fontSize: 12, padding: "6px 10px", marginBottom: 10 }} />
          <button className="btn btn-gold btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={() => donate(s)}>🙏 Donate Now</button>
        </div>
      ))}
    </div>
    {donations.length > 0 && <>
      <div className="sh"><div className="sh-title">Your Donation History</div></div>
      <div className="dtable-scroll"><div className="dtable" style={{ minWidth: 340 }}>
        <div className="thead" style={{ gridTemplateColumns: "1fr 2fr 1fr 1fr" }}>
          {["", "Seva", "Amount", "Date"].map(h => <div key={h} className="th">{h}</div>)}
        </div>
        {donations.map(d => (
          <div key={d.id} className="tr" style={{ gridTemplateColumns: "1fr 2fr 1fr 1fr" }}>
            <div className="td" style={{ fontSize: 22 }}>
              {d.seva_icon?.startsWith('/') ? <PremiumIcon src={d.seva_icon} size={32} /> : d.seva_icon}
            </div>
            <div className="td">{d.seva_name}</div>
            <div className="td" style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, color: "#FF6B00" }}>₹{d.amount}</div>
            <div className="td" style={{ fontSize: 12, color: "#8B6347" }}>{new Date(d.created_at).toLocaleDateString("en-IN")}</div>
          </div>
        ))}
      </div></div>
    </>}
  </>);
}
