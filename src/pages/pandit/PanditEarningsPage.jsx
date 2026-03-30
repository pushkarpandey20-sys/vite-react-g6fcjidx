import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';
import { supabase } from '../../services/supabase';
import { useIsMobile } from '../../utils/responsive';

const C = { bg:'#fff8f0', card:'#fff', border:'rgba(212,160,23,0.2)', orange:'#FF6B00', gold:'#D4A017', dark:'#3d1f00', mid:'#7a5c3a', soft:'#9a8070', green:'#16a34a', red:'#dc2626' };

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function PanditEarningsPage() {
  const { panditId } = useApp();
  const mobile = useIsMobile();
  const [bookings, setBookings] = useState([]);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!panditId) { setLoading(false); return; }
    (async () => {
      try {
        const { data } = await supabase
          .from('bookings')
          .select('*')
          .eq('pandit_id', panditId)
          .eq('status', 'confirmed')
          .order('booking_date', { ascending: false });
        setBookings(data || []);
      } catch(e) {
        setBookings([
          { id:'1', ritual_name:'Griha Pravesh', booking_date:'2025-03-28', total_amount:2100, devotee_name:'Rahul Sharma' },
          { id:'2', ritual_name:'Satyanarayan',  booking_date:'2025-03-22', total_amount:1500, devotee_name:'Priya Singh' },
          { id:'3', ritual_name:'Rudrabhishek',  booking_date:'2025-03-15', total_amount:2500, devotee_name:'Amit Gupta' },
          { id:'4', ritual_name:'Navgrah Shanti',booking_date:'2025-03-08', total_amount:1800, devotee_name:'Sunita Verma' },
          { id:'5', ritual_name:'Vivah Ceremony',booking_date:'2025-02-28', total_amount:8000, devotee_name:'Vikram Patel' },
          { id:'6', ritual_name:'Griha Pravesh', booking_date:'2025-02-14', total_amount:2100, devotee_name:'Neha Gupta' },
          { id:'7', ritual_name:'Kaal Sarp Dosh',booking_date:'2025-01-20', total_amount:3500, devotee_name:'Raj Kumar' },
        ]);
      }
      setLoading(false);
    })();
  }, [panditId]);

  const now = new Date();
  const filtered = bookings.filter(b => {
    if (period === 'all') return true;
    const d = new Date(b.booking_date);
    if (period === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (period === 'quarter') return d >= new Date(now.getFullYear(), Math.floor(now.getMonth()/3)*3, 1);
    if (period === 'year') return d.getFullYear() === now.getFullYear();
    return true;
  });

  const gross     = filtered.reduce((s,b) => s + (b.total_amount || 0), 0);
  const net       = Math.round(gross * 0.82);
  const platform  = gross - net;
  const avgPerBooking = filtered.length ? Math.round(gross / filtered.length) : 0;

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const m = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const monthBookings = bookings.filter(b => {
      const d = new Date(b.booking_date);
      return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear();
    });
    return {
      label: MONTHS[m.getMonth()],
      gross: monthBookings.reduce((s,b) => s+(b.total_amount||0), 0),
      net: Math.round(monthBookings.reduce((s,b) => s+(b.total_amount||0), 0) * 0.82),
      count: monthBookings.length,
    };
  });
  const maxBar = Math.max(...monthlyData.map(m => m.gross), 1);

  const card = (children, extra={}) => (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'18px 22px', boxShadow:'0 2px 8px rgba(212,160,23,0.06)', ...extra }}>
      {children}
    </div>
  );

  if (!panditId) return (
    <div style={{ textAlign:'center', padding:60, color:C.soft }}>
      <div style={{ fontSize:48, marginBottom:12 }}>💰</div>
      <div style={{ fontSize:16, color:C.dark, fontWeight:700 }}>Login as pandit to see your earnings</div>
    </div>
  );

  return (
    <div style={{ fontFamily:'Nunito,sans-serif' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <div>
          <h2 style={{ fontFamily:'Cinzel,serif', color:C.dark, fontSize:20, margin:0 }}>💰 Earnings Overview</h2>
          <p style={{ color:C.soft, margin:'4px 0 0', fontSize:13 }}>DevSetu takes 18% · payouts every Monday</p>
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {[['month','This Month'],['quarter','This Quarter'],['year','This Year'],['all','All Time']].map(([v,l]) => (
            <button key={v} onClick={() => setPeriod(v)} style={{ padding:'7px 14px', borderRadius:20, border:'none', cursor:'pointer', fontWeight:700, fontSize:12, background: period===v ? C.orange : 'rgba(255,107,0,0.1)', color: period===v ? '#fff' : C.orange }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: mobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {[
          [`₹${net.toLocaleString()}`,     'YOUR EARNINGS (82%)',    C.green],
          [`₹${gross.toLocaleString()}`,   'GROSS BOOKING VALUE',   C.orange],
          [`₹${platform.toLocaleString()}`,'PLATFORM FEE (18%)',     C.soft],
          [filtered.length,                 'BOOKINGS COMPLETED',    C.gold],
        ].map(([v,l,c]) => (
          <div key={l} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'18px 22px' }}>
            <div style={{ color:c, fontFamily:'Cinzel,serif', fontWeight:800, fontSize:26 }}>{v}</div>
            <div style={{ color:C.soft, fontSize:11, marginTop:4, letterSpacing:0.5 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns: mobile ? '1fr' : '1.4fr 1fr', gap:18, marginBottom:18 }}>
        {card(<>
          <div style={{ color:C.dark, fontWeight:700, fontSize:15, marginBottom:16 }}>📊 Monthly Earnings (Last 6 Months)</div>
          <div style={{ display:'flex', gap:8, alignItems:'flex-end', height:140 }}>
            {monthlyData.map(m => (
              <div key={m.label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{ fontSize:10, color:C.soft, fontWeight:600 }}>₹{(m.net/1000).toFixed(1)}k</div>
                <div style={{ width:'100%', position:'relative', display:'flex', flexDirection:'column', gap:2, alignItems:'center' }}>
                  <div style={{ width:'100%', height: Math.max(4, (m.gross/maxBar)*100), background:'rgba(255,107,0,0.15)', borderRadius:'4px 4px 0 0', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'82%', background:'linear-gradient(180deg,#FF6B00,#e55a00)', borderRadius:'4px 4px 0 0' }}/>
                  </div>
                </div>
                <div style={{ fontSize:11, color:C.mid, fontWeight:600 }}>{m.label}</div>
                <div style={{ fontSize:10, color:C.soft }}>{m.count} jobs</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:16, marginTop:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:12, height:12, borderRadius:3, background:'#FF6B00' }}/>
              <span style={{ fontSize:12, color:C.soft }}>Your earnings (82%)</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:12, height:12, borderRadius:3, background:'rgba(255,107,0,0.15)' }}/>
              <span style={{ fontSize:12, color:C.soft }}>Gross booking value</span>
            </div>
          </div>
        </>)}

        {card(<>
          <div style={{ color:C.dark, fontWeight:700, fontSize:15, marginBottom:14 }}>🏦 Payout Information</div>
          <div style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:14 }}>
            <div style={{ color:C.green, fontWeight:800, fontSize:22 }}>₹{net.toLocaleString()}</div>
            <div style={{ color:'#15803d', fontSize:13, marginTop:2 }}>Available for next payout</div>
            <div style={{ color:C.soft, fontSize:12, marginTop:4 }}>Next payout: Every Monday by 5 PM</div>
          </div>
          <div style={{ background:'#fffbf5', border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 16px' }}>
            <div style={{ color:C.soft, fontSize:11, fontWeight:700, letterSpacing:1, marginBottom:8 }}>BANK DETAILS</div>
            <div style={{ color:C.dark, fontSize:13, fontWeight:600 }}>Add your bank account</div>
            <div style={{ color:C.soft, fontSize:12, marginTop:2 }}>Go to Profile → Bank Details to add account for weekly payouts</div>
          </div>
          <div style={{ marginTop:14 }}>
            <div style={{ color:C.soft, fontSize:11, fontWeight:700, letterSpacing:1, marginBottom:8 }}>QUICK STATS</div>
            {[
              ['Average per booking', `₹${avgPerBooking.toLocaleString()}`],
              ['Highest earning ritual', [...filtered].sort((a,b)=>b.total_amount-a.total_amount)[0]?.ritual_name || '—'],
              ['Total bookings (all time)', bookings.length],
            ].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${C.border}` }}>
                <span style={{ color:C.mid, fontSize:13 }}>{l}</span>
                <span style={{ color:C.dark, fontWeight:700, fontSize:13 }}>{v}</span>
              </div>
            ))}
          </div>
        </>)}
      </div>

      {card(<>
        <div style={{ color:C.dark, fontWeight:700, fontSize:15, marginBottom:14 }}>📋 Recent Transactions</div>
        {loading ? <div style={{ textAlign:'center', padding:20, color:C.soft }}>Loading...</div>
        : filtered.length === 0 ? <div style={{ textAlign:'center', padding:20, color:C.soft }}>No confirmed bookings in this period.</div>
        : filtered.map(b => (
          <div key={b.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
            <div>
              <div style={{ color:C.dark, fontWeight:600, fontSize:14 }}>{b.ritual_name || 'Pooja'}</div>
              <div style={{ color:C.soft, fontSize:12, marginTop:2 }}>
                {b.devotee_name || 'Devotee'} · {b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—'}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ color:C.green, fontWeight:800, fontSize:15 }}>+₹{Math.round((b.total_amount||0)*0.82).toLocaleString()}</div>
              <div style={{ color:C.soft, fontSize:11 }}>Gross ₹{(b.total_amount||0).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </>)}
    </div>
  );
}
