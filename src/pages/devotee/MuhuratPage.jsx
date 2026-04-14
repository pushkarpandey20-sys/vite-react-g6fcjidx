import React from 'react';
import { useApp } from '../../store/AppCtx';
import MuhuratFinder from '../../features/user-portal/components/Muhurtas/MuhuratFinder';

export default function MuhuratPage() {
  try {
    const { MUHURTAS = [] } = useApp();
    return (
      <div className="muhurat-page-container">
        <MuhuratFinder />

        <div className="card card-p" style={{ marginTop: 40, background:'rgba(26,15,7,0.85)', border:'1.5px solid rgba(212,160,23,0.18)', borderRadius:18, boxShadow: '0 8px 30px rgba(0,0,0,0.4)', padding: 24 }}>
          <div className="sh" style={{ marginBottom: 20 }}>
            <div className="sh-title" style={{ color:'#F0C040', fontWeight: 900, fontSize: 20, fontFamily: 'Cinzel, serif' }}>Traditional Panchang (General)</div>
            <div className="sh-sub" style={{ color:'rgba(255,248,240,0.6)', fontWeight: 600, fontSize: 14 }}>Daily auspicious and inauspicious timings at a glance.</div>
          </div>
          <div className="dtable" style={{ marginBottom: 0 }}>
            <div className="thead" style={{ gridTemplateColumns: ".8fr 1.2fr 1.2fr 1fr 1.5fr", background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 0' }}>
              {["Day/Month", "Tithi", "Nakshatra", "Quality", "Primary Window"].map(h => <div key={h} className="th" style={{ color: 'rgba(255,248,240,0.85)', fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>{h}</div>)}
            </div>
            {MUHURTAS.map((m, i) => (
              <div key={i} className="tr" style={{ gridTemplateColumns: ".8fr 1.2fr 1.2fr 1fr 1.5fr", borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 0' }}>
                <div className="td" style={{ color: '#F0C040' }}><b>{m.day} {m.month}</b></div>
                <div className="td" style={{ color: 'rgba(255,248,240,0.9)' }}>{m.tithi}</div>
                <div className="td" style={{ fontSize: 12, color: 'rgba(255,248,240,0.7)' }}>{m.nakshatra}</div>
                <div className="td"><span style={{ color: m.quality === "Excellent" ? "#4ade80" : "#F0C040", fontWeight: 700 }}>{m.quality}</span></div>
                <div className="td" style={{ fontSize: 13, fontWeight: 600, color: '#FF6B00' }}>{m.time}</div>
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
