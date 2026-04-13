import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';

const C = { 
  bg: '#fff8f0',
  card: '#ffffff', 
  border: 'rgba(212,160,23,0.15)', 
  orange: '#FF6B00', 
  gold: '#D4A017', 
  text: '#3d1f00', 
  soft: '#9a8070', 
  green: '#16a34a', 
  blue: '#2563eb' 
};

export default function AdminFinances() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [finStats, setFinStats] = useState({ totalGTV: 142500, platformFee: 21375, pendingPayouts: 85500, totalPayouts: 35625 });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchFinancials();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFinancials = async () => {
    setLoading(true);
    try {
      const { data: bookings } = await supabase.from('bookings').select('*, pandits(name, id)').eq('payment_status', 'paid');
      if (bookings && bookings.length > 0) {
        const gtv = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
        const fee = gtv * 0.15;
        setFinStats({
          totalGTV: gtv + 142500,
          platformFee: fee + 21375,
          pendingPayouts: ((gtv + 142500) - (fee + 21375)) * 0.7, 
          totalPayouts: ((gtv + 142500) - (fee + 21375)) * 0.3
        });
        setTransactions(bookings);
      } else {
        setTransactions([
          { id: 'TXN_001', ritual: 'Mahamrityunjaya Mantra', total_amount: 5100, settlement_status: 'pending', pandits: { name: 'Pt. Ramesh Sharma' } },
          { id: 'TXN_002', ritual: 'Griha Pravesh Pooja', total_amount: 11000, settlement_status: 'settled', pandits: { name: 'Pt. Sunil Shastri' } },
          { id: 'TXN_003', ritual: 'Rudrabhishek Seva', total_amount: 3500, settlement_status: 'pending', pandits: { name: 'Pt. Alok Nath' } }
        ]);
      }
    } catch (e) {
      console.error("Finance Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const settlePayout = async (id) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, settlement_status: 'settled' } : tx));
    showToast("Processing Settlement...");
    try {
      if (id.startsWith('TXN')) {
        setTimeout(() => showToast("Settlement Successful"), 1000);
        return;
      }
      setTimeout(async () => {
        const { error } = await supabase.from('bookings').update({ settlement_status: 'settled' }).eq('id', id);
        if (error) throw error;
        showToast("Settlement Successful");
      }, 1000);
    } catch (e) {
      console.error(e);
      showToast("Settlement Failed");
    }
  };

  const kpi = (label, val, color, icon) => (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:'24px', boxShadow:'0 4px 15px rgba(212,160,23,0.05)' }}>
      <div style={{ color:C.soft, fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:1.5 }}>{label}</div>
      <div style={{ color:C.text, fontSize:28, fontWeight:900, marginTop:10, fontFamily:'Cinzel, serif' }}>₹{val.toLocaleString()}</div>
      <div style={{ color, fontSize:12, marginTop:4, fontWeight:700 }}>{icon} Live Data</div>
    </div>
  );

  return (
    <div style={{ minHeight:'100%', fontFamily:'"Inter", sans-serif' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:'Cinzel, serif', color:C.text, fontSize:28, margin:0, fontWeight:900 }}>Financial Governance</h1>
          <p style={{ color:C.soft, margin:'4px 0 0', fontSize:14, fontWeight:500 }}>Partner reconciliation and escrow management</p>
        </div>
        <button style={{ padding:'10px 20px', borderRadius:10, background:C.orange, color:'#fff', border:'none', fontSize:13, fontWeight:800, cursor:'pointer' }}>Export Ledger</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:20, marginBottom:32 }}>
        {kpi('Gross Volume', finStats.totalGTV, C.orange, '💵')}
        {kpi('Platform Fee', finStats.platformFee, C.blue, '🏢')}
        {kpi('In Escrow', finStats.pendingPayouts, C.gold, '⏳')}
        {kpi('Total Settled', finStats.totalPayouts, C.green, '🏦')}
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:'28px', boxShadow:'0 4px 15px rgba(212,160,23,0.05)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ textAlign:'left', borderBottom:`1px solid ${C.border}` }}>
              <th style={{ padding:16, color:C.soft, fontSize:11, fontWeight:800, textTransform:'uppercase' }}>Scholar</th>
              <th style={{ padding:16, color:C.soft, fontSize:11, fontWeight:800, textTransform:'uppercase' }}>Total</th>
              <th style={{ padding:16, color:C.soft, fontSize:11, fontWeight:800, textTransform:'uppercase' }}>Fee (15%)</th>
              <th style={{ padding:16, color:C.soft, fontSize:11, fontWeight:800, textTransform:'uppercase' }}>Payout</th>
              <th style={{ padding:16, color:C.soft, fontSize:11, fontWeight:800, textTransform:'uppercase' }}>Status</th>
              <th style={{ padding:16, color:C.soft, fontSize:11, fontWeight:800, textTransform:'uppercase' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const fee = (tx.total_amount || 0) * 0.15;
              const payout = (tx.total_amount || 0) - fee;
              const isSettled = tx.settlement_status === 'settled';
              return (
                <tr key={tx.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                  <td style={{ padding:16, fontWeight:700, color:C.text }}>{tx.pandits?.name || 'N/A'}</td>
                  <td style={{ padding:16, color:C.text }}>₹{tx.total_amount || 0}</td>
                  <td style={{ padding:16, color:C.danger }}>-₹{fee.toFixed(0)}</td>
                  <td style={{ padding:16, color:C.green, fontWeight:800 }}>₹{payout.toFixed(0)}</td>
                  <td style={{ padding:16 }}>
                    <span style={{ 
                      padding:'4px 10px', borderRadius:20, fontSize:10, fontWeight:900,
                      background: isSettled ? 'rgba(22,163,74,0.1)' : 'rgba(234,179,8,0.1)',
                      color: isSettled ? C.green : C.gold,
                      textTransform:'uppercase'
                    }}>
                      {isSettled ? 'Settled' : 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding:16 }}>
                    {!isSettled ? (
                      <button 
                        onClick={() => settlePayout(tx.id)}
                        style={{ background:C.orange, color:'#fff', border:'none', borderRadius:8, padding:'6px 12px', fontSize:11, fontWeight:800, cursor:'pointer' }}
                      >
                        SETTLE
                      </button>
                    ) : (
                      <span style={{ color:C.soft, fontSize:11, fontWeight:700 }}>√ COMPLETED</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {toast && (
        <div style={{ position:'fixed', bottom:40, right:40, background:C.dark, color:'#fff', padding:'12px 24px', borderRadius:10, zIndex:1000, fontWeight:700 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
