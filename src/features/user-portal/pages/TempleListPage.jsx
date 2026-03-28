import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppCtx';
import { db } from '../../../services/supabase';
import { Spinner } from '../../../components/common/UIElements';

const SAMPLE_TEMPLES = [
  { id:'t1', name:'Kashi Vishwanath', city:'Varanasi', icon:'🔱', is_live:true, next_aarti:'5:30 AM', poojas:['Rudrabhishek','Mangala Aarti','Shringar Bhog','Sapta Rishis'], description:'One of the most sacred Shiva temples on the banks of the Ganges.' },
  { id:'t2', name:'Ram Janmabhoomi', city:'Ayodhya', icon:'🏹', is_live:false, next_aarti:'6:00 AM', poojas:['Ramlala Darshan','Parikrama','Ram Katha','Special Bhog'], description:'Sacred birthplace of Lord Ram — the grand new temple complex.' },
  { id:'t3', name:'Tirupati Balaji',  city:'Tirupati', icon:'🪔', is_live:true, next_aarti:'7:00 AM', poojas:['Suprabhatam','Archana','Kalyanam','Sahasranama'], description:'Most visited Vishnu shrine in the world, atop the Tirumala hills.' },
  { id:'t4', name:'Siddhivinayak',    city:'Mumbai',   icon:'🐘', is_live:false, next_aarti:'12:00 PM', poojas:['Ganesh Puja','Modak Naivedya','Sankashti','Gauri Puja'], description:'Revered Ganesh temple in Prabhadevi, Mumbai — blessings before new ventures.' },
  { id:'t5', name:'Mahakal Ujjain',   city:'Ujjain',   icon:'⚡', is_live:true, next_aarti:'4:00 AM', poojas:['Bhasma Aarti','Rudrabhishek','Mahashivratri','Panchakroshi'], description:'One of the 12 Jyotirlingas — ancient seat of Lord Shiva\'s divine light.' },
  { id:'t6', name:'Vaishno Devi',     city:'Katra',    icon:'🌸', is_live:false, next_aarti:'4:00 AM', poojas:['Maa Darshan','Ardh Kuwari','Bhawan Puja','Aarti'], description:'Sacred cave shrine of Goddess Vaishnavi in the Trikuta mountains.' },
];

export default function TempleListPage() {
  const { devoteeId, setShowLogin } = useApp();
  const navigate = useNavigate();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [liveOnly, setLiveOnly] = useState(false);

  useEffect(() => {
    db.temples().select('*').then(({ data }) => {
      setTemples(data?.length ? data : SAMPLE_TEMPLES);
      setLoading(false);
    });
  }, []);

  const filtered = temples
    .filter(t => !filter || t.name.toLowerCase().includes(filter.toLowerCase()) || (t.city||'').toLowerCase().includes(filter.toLowerCase()))
    .filter(t => !liveOnly || t.is_live);

  const handleBook = (temple) => {
    if (!devoteeId) return setShowLogin(true);
    navigate(`/user/temples/book/${temple.id}`, { state: { temple } });
  };

  const dkCard = { background:'rgba(26,15,7,0.72)', border:'1px solid rgba(240,192,64,0.14)', borderRadius:20, backdropFilter:'blur(16px)', overflow:'hidden', display:'flex', flexDirection:'column' };

  return (
    <div>
      {/* Hero */}
      <div style={{ position:'relative', overflow:'hidden', ...dkCard, padding:'28px 26px', marginBottom:20, borderRadius:20 }}>
        <div style={{ position:'absolute', top:-50, right:-30, width:240, height:240,
          background:'radial-gradient(ellipse,rgba(255,107,0,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(240,192,64,0.1)',
          border:'1px solid rgba(240,192,64,0.25)', color:'#F0C040', fontSize:10, fontWeight:800,
          letterSpacing:'1.2px', textTransform:'uppercase', padding:'4px 12px', borderRadius:20, marginBottom:12 }}>
          🛕 Sacred Temples Across Bharat
        </div>
        <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontSize:'clamp(18px,3vw,26px)', margin:'0 0 6px', fontWeight:900 }}>Sacred Temples & Shrines</h2>
        <p style={{ color:'rgba(255,248,240,0.5)', margin:0, fontSize:13 }}>Book temple services, remote aarti darshan, and special poojas — from anywhere.</p>
      </div>

      {/* Filter bar */}
      <div style={{ display:'flex', gap:12, marginBottom:20, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:180 }}>
          <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', fontSize:14, pointerEvents:'none' }}>🔍</span>
          <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search temple or city..."
            style={{ width:'100%', padding:'10px 14px 10px 36px', background:'rgba(255,248,240,0.05)',
              border:'1.5px solid rgba(240,192,64,0.2)', borderRadius:12, color:'rgba(255,248,240,0.88)',
              fontSize:13, outline:'none', fontFamily:'Nunito,sans-serif', boxSizing:'border-box' }} />
        </div>
        <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer',
          background:'rgba(255,0,0,0.08)', border:'1px solid rgba(255,0,0,0.25)',
          borderRadius:20, padding:'8px 16px', whiteSpace:'nowrap' }}>
          <input type="checkbox" checked={liveOnly} onChange={e=>setLiveOnly(e.target.checked)}
            style={{ accentColor:'#FF4444', width:14, height:14 }} />
          <span style={{ color:'#FF9999', fontWeight:700, fontSize:12 }}>🔴 LIVE Only</span>
        </label>
        <div style={{ color:'rgba(255,248,240,0.35)', fontSize:12, fontWeight:600, whiteSpace:'nowrap' }}>
          {loading ? '…' : `${filtered.length} temples`}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'60px 0' }}><Spinner /></div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>
          {filtered.map(t => (
            <div key={t.id} style={{ ...dkCard, cursor:'pointer', transition:'transform 0.3s, box-shadow 0.3s, border-color 0.3s' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 20px 48px rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor='rgba(240,192,64,0.3)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; e.currentTarget.style.borderColor='rgba(240,192,64,0.14)'; }}>

              {/* Temple image area */}
              <div style={{ height:160, position:'relative', background:'linear-gradient(135deg,rgba(44,26,14,0.9),rgba(26,15,7,0.95))',
                display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                <div style={{ fontSize:72, filter:'drop-shadow(0 0 16px rgba(255,107,0,0.3))', lineHeight:1 }}>{t.icon||'🛕'}</div>
                <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(240,192,64,0.06) 0%, transparent 70%)', pointerEvents:'none' }} />
                {t.is_live && (
                  <div style={{ position:'absolute', top:12, right:12, background:'rgba(255,0,0,0.9)',
                    color:'#fff', fontSize:10, fontWeight:800, padding:'4px 10px', borderRadius:20,
                    display:'flex', alignItems:'center', gap:5, boxShadow:'0 2px 8px rgba(255,0,0,0.4)' }}>
                    <div style={{ width:6, height:6, background:'#fff', borderRadius:'50%', animation:'pulse 1s infinite' }} />
                    LIVE
                  </div>
                )}
                <div style={{ position:'absolute', bottom:12, left:12, background:'rgba(0,0,0,0.6)',
                  backdropFilter:'blur(8px)', color:'#FF9F40', padding:'4px 12px',
                  borderRadius:20, fontSize:12, fontWeight:700, border:'1px solid rgba(255,107,0,0.3)' }}>
                  📍 {t.city}
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding:'18px 20px', flex:1, display:'flex', flexDirection:'column' }}>
                <h3 style={{ margin:'0 0 8px', fontFamily:'Cinzel,serif', fontSize:17, color:'#F0C040', fontWeight:700 }}>{t.name}</h3>
                <p style={{ color:'rgba(255,248,240,0.45)', fontSize:13, fontStyle:'italic', marginBottom:14, lineHeight:1.55, margin:'0 0 14px' }}>
                  {t.description||'Ancient shrine of divine grace and spiritual wisdom.'}
                </p>

                <div style={{ borderTop:'1px solid rgba(240,192,64,0.08)', paddingTop:14, marginTop:'auto' }}>
                  {/* Pooja tags */}
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
                    {(t.poojas||[]).slice(0,3).map((p,i)=>(
                      <span key={i} style={{ fontSize:10, background:'rgba(240,192,64,0.08)',
                        color:'rgba(240,192,64,0.7)', padding:'3px 9px', borderRadius:6,
                        border:'1px solid rgba(240,192,64,0.15)', fontWeight:700 }}>{p}</span>
                    ))}
                    {t.poojas?.length>3 && (
                      <span style={{ fontSize:10, color:'rgba(255,248,240,0.3)', padding:'3px 6px' }}>+{t.poojas.length-3} more</span>
                    )}
                  </div>

                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ fontSize:12, color:'rgba(255,248,240,0.4)' }}>
                      Next Aarti: <span style={{ color:'#FF9F40', fontWeight:800 }}>{t.next_aarti||'Noon'}</span>
                    </div>
                    <button onClick={()=>handleBook(t)} className="btn btn-primary btn-sm"
                      style={{ fontSize:12, padding:'7px 16px' }}>
                      View Services →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 20px',
          background:'rgba(26,15,7,0.5)', borderRadius:18, border:'1px solid rgba(240,192,64,0.1)' }}>
          <div style={{ fontSize:48, marginBottom:14 }}>🛕</div>
          <h3 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', marginBottom:8 }}>No Temples Found</h3>
          <p style={{ color:'rgba(255,248,240,0.4)' }}>Try a different search term or remove the Live filter.</p>
          <button onClick={()=>{ setFilter(''); setLiveOnly(false); }} className="btn btn-primary" style={{ marginTop:16 }}>Reset Filters</button>
        </div>
      )}
    </div>
  );
}
