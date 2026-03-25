import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodaysMuhurat, getTodaysTithi, getUpcomingFestivals } from '../services/notificationService';

export default function MuhuratWidget({ compact = false }) {
  const navigate = useNavigate();
  const [muhurats] = useState(getTodaysMuhurat());
  const [{ tithiInfo, weekdayInfo }] = useState(getTodaysTithi());
  const [festivals] = useState(getUpcomingFestivals(30));
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const nextMuhurat = muhurats.find(m => m.isNext || m.isCurrent) || muhurats[0];

  if (compact) return (
    <div onClick={()=>navigate('/user/muhurta')} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,160,23,0.15)', borderRadius:12, padding:'12px 16px', cursor:'pointer', transition:'all 0.2s' }}
      onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,107,0,0.4)'}
      onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(212,160,23,0.15)'}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ color:'rgba(255,248,240,0.5)', fontSize:10, letterSpacing:1, marginBottom:4 }}>NEXT SHUBH MUHURAT</div>
          <div style={{ color:'#F0C040', fontWeight:700, fontSize:16 }}>{nextMuhurat?.time}</div>
          <div style={{ color:'rgba(255,248,240,0.6)', fontSize:12 }}>{nextMuhurat?.name}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          {tithiInfo && <div style={{ background:'rgba(212,160,23,0.15)', color:'#D4A017', fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:700, marginBottom:4 }}>{tithiInfo.icon} {tithiInfo.name}</div>}
          <div style={{ color:'#22c55e', fontSize:11, fontWeight:600 }}>{nextMuhurat?.quality}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,160,23,0.12)', borderRadius:14, padding:'20px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h3 style={{ color:'#F0C040', fontFamily:'Cinzel,serif', margin:0, fontSize:16 }}>🕐 Today's Muhurat</h3>
        <button onClick={()=>navigate('/user/muhurta')} style={{ background:'rgba(255,107,0,0.15)', color:'#FF6B00', border:'1px solid rgba(255,107,0,0.3)', borderRadius:8, padding:'4px 12px', fontSize:12, cursor:'pointer', fontWeight:600 }}>Full Panchang</button>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {tithiInfo && (
          <div style={{ flex:1, background:'rgba(212,160,23,0.1)', border:'1px solid rgba(212,160,23,0.2)', borderRadius:10, padding:'10px 12px', textAlign:'center' }}>
            <div style={{ fontSize:20 }}>{tithiInfo.icon}</div>
            <div style={{ color:'#F0C040', fontWeight:700, fontSize:13, marginTop:4 }}>{tithiInfo.name}</div>
            <div style={{ color:'rgba(255,248,240,0.5)', fontSize:11 }}>Today's Tithi</div>
          </div>
        )}
        {weekdayInfo && (
          <div style={{ flex:1, background:'rgba(255,107,0,0.08)', border:'1px solid rgba(255,107,0,0.2)', borderRadius:10, padding:'10px 12px', textAlign:'center' }}>
            <div style={{ fontSize:20 }}>{weekdayInfo.icon}</div>
            <div style={{ color:'#FF6B00', fontWeight:700, fontSize:13, marginTop:4 }}>{weekdayInfo.deity}'s Day</div>
            <div style={{ color:'rgba(255,248,240,0.5)', fontSize:11 }}>Auspicious</div>
          </div>
        )}
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ color:'rgba(255,248,240,0.5)', fontSize:11, letterSpacing:1, marginBottom:10 }}>TODAY'S AUSPICIOUS TIMINGS</div>
        {muhurats.map((m, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, opacity:m.isPast?0.4:1 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', flexShrink:0, background:m.isCurrent?'#22c55e':m.isNext?'#FF6B00':'rgba(255,255,255,0.2)', boxShadow:m.isCurrent?'0 0 8px #22c55e':m.isNext?'0 0 8px #FF6B00':'none' }}/>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ color:m.isCurrent?'#22c55e':m.isNext?'#FF6B00':'rgba(255,248,240,0.7)', fontWeight:m.isCurrent||m.isNext?700:400, fontSize:13 }}>{m.name}</span>
                <span style={{ color:m.isCurrent?'#22c55e':m.isNext?'#F0C040':'rgba(255,248,240,0.4)', fontSize:12, fontWeight:600 }}>{m.time}</span>
              </div>
              <div style={{ color:'rgba(255,248,240,0.4)', fontSize:11 }}>{m.quality} · {m.desc.substring(0,40)}...</div>
            </div>
          </div>
        ))}
      </div>
      {tithiInfo && (
        <div>
          <div style={{ color:'rgba(255,248,240,0.5)', fontSize:11, letterSpacing:1, marginBottom:8 }}>RECOMMENDED TODAY</div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {tithiInfo.recommended.map(r=>(
              <span key={r} onClick={()=>navigate('/user/booking')} style={{ background:'rgba(255,107,0,0.15)', color:'#FF6B00', border:'1px solid rgba(255,107,0,0.3)', fontSize:11, padding:'4px 10px', borderRadius:20, cursor:'pointer', fontWeight:600 }}>{r}</span>
            ))}
          </div>
        </div>
      )}
      {festivals.length > 0 && (
        <div style={{ marginTop:16, borderTop:'1px solid rgba(212,160,23,0.1)', paddingTop:12 }}>
          <div style={{ color:'rgba(255,248,240,0.5)', fontSize:11, letterSpacing:1, marginBottom:8 }}>UPCOMING FESTIVALS</div>
          {festivals.slice(0,3).map(f=>(
            <div key={f.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <span style={{ color:'rgba(255,248,240,0.7)', fontSize:12 }}>{f.icon} {f.name}</span>
              <span onClick={()=>navigate('/user/booking')} style={{ background:'rgba(255,107,0,0.15)', color:'#FF6B00', fontSize:11, padding:'2px 10px', borderRadius:10, cursor:'pointer', fontWeight:600 }}>Book →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
