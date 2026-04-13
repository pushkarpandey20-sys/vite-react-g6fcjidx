import React from 'react';
import { useApp } from '../../store/AppCtx';
import MuhuratFinder from '../../features/user-portal/components/Muhurtas/MuhuratFinder';

export default function MuhuratPage() {
  try {
    const { MUHURTAS = [] } = useApp();
    return (
      <div className="muhurat-page-container">
        <MuhuratFinder />

        <div className="card card-p" style={{ marginTop: 40, background:'#FFFFFF', border:'1.5px solid rgba(255,107,0,0.15)', borderRadius:18, boxShadow: '0 8px 30px rgba(255,107,0,0.06)' }}>
          <div className="sh">
            <div className="sh-title" style={{ color:'#2C1A0E', fontWeight: 900 }}>Traditional Panchang (General)</div>
            <div className="sh-sub" style={{ color:'#8B6347', fontWeight: 600 }}>Daily auspicious and inauspicious timings at a glance.</div>
          </div>
          <div className="dtable" style={{ marginBottom: 0 }}>
            <div className="thead" style={{ gridTemplateColumns: ".8fr 1.2fr 1.2fr 1fr 1.5fr" }}>
              {["Day/Month", "Tithi", "Nakshatra", "Quality", "Primary Window"].map(h => <div key={h} className="th">{h}</div>)}
            </div>
            {MUHURTAS.map((m, i) => (
              <div key={i} className="tr" style={{ gridTemplateColumns: ".8fr 1.2fr 1.2fr 1fr 1.5fr" }}>
                <div className="td"><b>{m.day} {m.month}</b></div>
                <div className="td">{m.tithi}</div>
                <div className="td" style={{ fontSize: 12 }}>{m.nakshatra}</div>
                <div className="td"><span style={{ color: m.quality === "Excellent" ? "#4ade80" : "#F0C040", fontWeight: 700 }}>{m.quality}</span></div>
                <div className="td" style={{ fontSize: 13, fontWeight: 600 }}>{m.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch(e) {
    console.error('Panchang error:', e);
    return (
      <div style={{ padding:40, textAlign:'center', color:'#F0C040' }}>
        <div style={{ fontSize:48, marginBottom:16 }}>📅</div>
        <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040' }}>Panchang Loading...</h2>
        <p style={{ color:'rgba(255,248,240,0.6)' }}>Today's auspicious timings will appear shortly.</p>
      </div>
    );
  }
}
