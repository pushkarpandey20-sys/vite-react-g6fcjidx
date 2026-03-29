import React, { useState } from 'react';
import { useApp } from '../../store/AppCtx';

const C = { card:'#fff', border:'rgba(212,160,23,0.2)', orange:'#FF6B00', gold:'#D4A017', dark:'#3d1f00', mid:'#7a5c3a', soft:'#9a8070', green:'#16a34a', red:'#dc2626' };

const DAYS   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const SLOTS  = ['5:00 AM','6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM'];

export default function PanditAvailPage() {
  const { panditId } = useApp();
  const [availability, setAvailability] = useState({
    Mon: ['8:00 AM','9:00 AM','10:00 AM'],
    Tue: ['8:00 AM','9:00 AM'],
    Wed: ['7:00 AM','8:00 AM','9:00 AM','10:00 AM'],
    Thu: ['8:00 AM'],
    Fri: ['8:00 AM','9:00 AM','10:00 AM'],
    Sat: ['6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM'],
    Sun: ['6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM'],
  });
  const [blockedDates, setBlockedDates] = useState(['2025-04-14','2025-04-15']);
  const [newBlock, setNewBlock] = useState('');
  const [saved, setSaved] = useState(false);

  const toggleSlot = (day, slot) => {
    setAvailability(prev => {
      const curr = prev[day] || [];
      const next = curr.includes(slot) ? curr.filter(s=>s!==slot) : [...curr, slot];
      return { ...prev, [day]: next };
    });
    setSaved(false);
  };

  const save = async () => {
    setSaved(true);
    try {
      const { supabase } = await import('../../services/supabase');
      await supabase.from('pandits').update({
        availability_slots: availability,
        blocked_dates: blockedDates,
      }).eq('id', panditId);
    } catch(e) {}
    setTimeout(() => setSaved(false), 3000);
  };

  const totalSlots = Object.values(availability).reduce((s,slots)=>s+slots.length,0);

  return (
    <div style={{ fontFamily:'Nunito,sans-serif' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h2 style={{ fontFamily:'Cinzel,serif', color:C.dark, fontSize:20, margin:0 }}>📅 Availability Schedule</h2>
          <p style={{ color:C.soft, margin:'4px 0 0', fontSize:13 }}>{totalSlots} slots available weekly · Devotees book from your open slots</p>
        </div>
        <button onClick={save} style={{ background: saved ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg,#FF6B00,#e55a00)', color: saved ? C.green : '#fff', border: saved ? `1px solid rgba(34,197,94,0.4)` : 'none', borderRadius:20, padding:'10px 24px', fontWeight:700, cursor:'pointer', fontSize:14 }}>
          {saved ? '✓ Saved!' : '💾 Save Schedule'}
        </button>
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'20px 22px', marginBottom:18, boxShadow:'0 2px 8px rgba(212,160,23,0.06)' }}>
        <div style={{ color:C.dark, fontWeight:700, fontSize:15, marginBottom:16 }}>🗓️ Weekly Availability (tap to toggle)</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:10 }}>
          {DAYS.map(day => (
            <div key={day}>
              <div style={{ color:C.dark, fontWeight:800, fontSize:13, textAlign:'center', marginBottom:8, padding:'6px', background:'rgba(212,160,23,0.1)', borderRadius:8 }}>{day}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {SLOTS.map(slot => {
                  const on = (availability[day]||[]).includes(slot);
                  return (
                    <button key={slot} onClick={()=>toggleSlot(day,slot)}
                      style={{ padding:'4px 2px', borderRadius:6, border:`1px solid ${on?'rgba(34,197,94,0.4)':'rgba(212,160,23,0.2)'}`, background: on?'rgba(34,197,94,0.12)':'rgba(0,0,0,0.03)', color: on?C.green:C.soft, fontSize:10, fontWeight:600, cursor:'pointer', textAlign:'center', transition:'all 0.15s' }}>
                      {slot}
                    </button>
                  );
                })}
              </div>
              <div style={{ textAlign:'center', marginTop:6, color:C.soft, fontSize:11 }}>
                {(availability[day]||[]).length} slots
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'20px 22px' }}>
        <div style={{ color:C.dark, fontWeight:700, fontSize:15, marginBottom:14 }}>🚫 Block Specific Dates (leaves, travel, holidays)</div>
        <div style={{ display:'flex', gap:10, marginBottom:14 }}>
          <input type="date" value={newBlock} onChange={e=>setNewBlock(e.target.value)}
            style={{ flex:1, padding:'9px 12px', borderRadius:8, border:`1.5px solid ${C.border}`, background:'#fffbf5', color:C.dark, fontSize:13, fontFamily:'inherit', outline:'none' }} />
          <button onClick={()=>{ if(newBlock && !blockedDates.includes(newBlock)){ setBlockedDates(p=>[...p,newBlock].sort()); setNewBlock(''); setSaved(false); } }}
            style={{ background:'rgba(239,68,68,0.1)', color:C.red, border:`1px solid rgba(239,68,68,0.3)`, borderRadius:8, padding:'9px 20px', fontWeight:700, cursor:'pointer', fontSize:13 }}>
            Block Date
          </button>
        </div>
        {blockedDates.length === 0 ? (
          <div style={{ color:C.soft, fontSize:13, textAlign:'center', padding:'12px 0' }}>No blocked dates</div>
        ) : (
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {blockedDates.map(d => (
              <div key={d} style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:8, padding:'6px 12px' }}>
                <span style={{ color:C.dark, fontSize:13, fontWeight:600 }}>{new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                <button onClick={()=>{ setBlockedDates(p=>p.filter(x=>x!==d)); setSaved(false); }} style={{ background:'none', border:'none', color:C.red, cursor:'pointer', fontSize:16, padding:0, lineHeight:1 }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
