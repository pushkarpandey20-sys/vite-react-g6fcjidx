import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSmartRecommendations, getNextShubhMuhurat } from '../services/notificationService';
import notificationStore from '../services/notificationService';

export default function SmartRecommendations({ bookingHistory = [] }) {
  const navigate = useNavigate();
  const [recs, setRecs] = useState([]);
  const nextMuhurat = getNextShubhMuhurat();

  useEffect(() => {
    const searchHistory = notificationStore.getSearchHistory();
    const recommendations = getSmartRecommendations(searchHistory, bookingHistory);
    setRecs(recommendations.slice(0, 4));
  }, [bookingHistory]);

  if (!recs.length) return null;

  const urgencyBg = (u) => u === 'high' ? 'rgba(239,68,68,0.1)' : u === 'medium' ? 'rgba(255,107,0,0.08)' : 'rgba(255,255,255,0.04)';
  const urgencyBorder = (u) => u === 'high' ? 'rgba(239,68,68,0.3)' : u === 'medium' ? 'rgba(255,107,0,0.25)' : 'rgba(212,160,23,0.12)';

  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <h3 style={{ color:'#F0C040', fontFamily:'Cinzel,serif', margin:0, fontSize:16 }}>✨ Recommended for You</h3>
        <div style={{ background:'rgba(34,197,94,0.15)', color:'#22c55e', fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:700 }}>
          Next muhurat: {nextMuhurat?.time}
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:12 }}>
        {recs.map(rec => (
          <div key={rec.id} onClick={()=>navigate('/user/booking')}
            style={{ background:urgencyBg(rec.urgency), border:`1px solid ${urgencyBorder(rec.urgency)}`, borderRadius:12, padding:'14px 16px', cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <div style={{ color:'#F0C040', fontWeight:700, fontSize:13 }}>{rec.title}</div>
              {rec.urgency === 'high' && <span style={{ background:'#ef4444', color:'#fff', fontSize:9, padding:'2px 6px', borderRadius:8, fontWeight:800, letterSpacing:1, flexShrink:0 }}>NOW</span>}
            </div>
            <div style={{ color:'rgba(255,248,240,0.6)', fontSize:12, lineHeight:1.4, marginBottom:10 }}>{rec.message}</div>
            {rec.rituals?.length > 0 && (
              <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:8 }}>
                {rec.rituals.slice(0,2).map(r=>(
                  <span key={r} style={{ background:'rgba(212,160,23,0.15)', color:'#D4A017', fontSize:10, padding:'2px 8px', borderRadius:10 }}>{r}</span>
                ))}
              </div>
            )}
            {rec.muhurat?.length > 0 && (
              <div style={{ color:'#22c55e', fontSize:11, fontWeight:600, marginBottom:8 }}>⏰ {rec.muhurat.join(' · ')}</div>
            )}
            <span style={{ background:'linear-gradient(135deg,#FF6B00,#FF8C35)', color:'#fff', fontSize:11, padding:'5px 14px', borderRadius:20, fontWeight:700 }}>{rec.cta} →</span>
          </div>
        ))}
      </div>
    </div>
  );
}
