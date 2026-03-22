import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../../services/supabase';
import { Spinner, StatusBadge } from '../../../components/common/UIElements';

export default function BookingRiskMonitor() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.bookings().select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setBookings(data || []);
      setLoading(false);
    });
  }, []);

  const riskAnalysis = useMemo(() => {
    const risks = [];
    const userBookingCount = {};
    const duplicateMap = new Set();

    bookings.forEach(b => {
      // 1. Duplicate Booking Detection (Same user, same ritual, same date)
      const dupKey = `${b.devotee_id}-${b.ritual}-${b.booking_date}`;
      if (duplicateMap.has(dupKey)) {
        risks.push({
          id: b.id,
          type: 'DUPLICATE',
          severity: 'HIGH',
          reason: 'Potential double booking detected for this user and ritual.',
          item: b
        });
      }
      duplicateMap.add(dupKey);

      // 2. Fake User Detection (Aggressive booking behavior)
      userBookingCount[b.devotee_id] = (userBookingCount[b.devotee_id] || 0) + 1;
      if (userBookingCount[b.devotee_id] > 5) {
        risks.push({
          id: b.id,
          type: 'FAKE_USER',
          severity: 'CRITICAL',
          reason: 'High volume of bookings from a single account in a short interval.',
          item: b
        });
      }

      // 3. Payment Failure Detection
      if (b.payment_status === 'failed' || (b.payment_status === 'pending' && new Date(b.created_at) < new Date(Date.now() - 3600000))) {
        risks.push({
          id: b.id,
          type: 'PAYMENT_FAILURE',
          severity: 'MEDIUM',
          reason: 'Manual validation required for unresolved or failed payment status.',
          item: b
        });
      }

      // 4. Pandit Complaint Simulation (Based on flags or specific notes)
      if (b.notes?.toLowerCase().includes('complaint') || b.notes?.toLowerCase().includes('dispute')) {
        risks.push({
          id: b.id,
          type: 'COMPLAINT',
          severity: 'HIGH',
          reason: 'Scholar dispute recorded for this session.',
          item: b
        });
      }
    });

    return risks;
  }, [bookings]);

  if (loading) return <Spinner />;

  return (
    <div className="booking-risk-monitor">
      <div className="risk-header card" style={{ background: 'rgba(255, 107, 0, 0.05)', border: '1px solid rgba(255, 107, 0, 0.2)', marginBottom: '25px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: '#FF6B00', margin: 0 }}>🛡️ Spiritual Integrity Safeguard</h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#8B6347' }}>Automated risk screening for platform security and trust.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#FF6B00' }}>{riskAnalysis.length}</div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800 }}>Active Flags</div>
          </div>
        </div>
      </div>

      <div className="risk-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {riskAnalysis.map((risk, idx) => (
          <div key={`${risk.id}-${idx}`} className="risk-card card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ 
              position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px',
              background: risk.severity === 'CRITICAL' ? '#D92D20' : (risk.severity === 'HIGH' ? '#F79009' : '#FDB022')
            }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ 
                fontSize: '10px', fontWeight: 900, padding: '4px 8px', borderRadius: '4px',
                background: risk.severity === 'CRITICAL' ? '#FEE4E2' : '#FFFAEB',
                color: risk.severity === 'CRITICAL' ? '#D92D20' : '#B54708'
              }}>
                {risk.type.replace('_', ' ')}
              </span>
              <span style={{ fontSize: '11px', color: '#888' }}>#{risk.id.slice(-6)}</span>
            </div>

            <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>{risk.item.devotee_name} ↔ Pt. {risk.item.pandit_name}</h4>
            <div style={{ fontSize: '12px', color: '#8B6347', fontStyle: 'italic', marginBottom: '15px' }}>"{risk.reason}"</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9F9F9', padding: '10px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px' }}>
                <div style={{ fontWeight: 800 }}>{risk.item.ritual}</div>
                <div style={{ color: '#888' }}>{risk.item.booking_date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <StatusBadge status={risk.item.status} />
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button className="btn btn-outline btn-xs" style={{ flex: 1, borderColor: '#D92D20', color: '#D92D20' }}>Block Account</button>
              <button className="btn btn-primary btn-xs" style={{ flex: 1 }}>Investigate</button>
              <button className="btn btn-outline btn-xs" style={{ flex: 0.5 }}>Ignore</button>
            </div>
          </div>
        ))}

        {riskAnalysis.length === 0 && (
          <div className="card" style={{ padding: '60px', textAlign: 'center', gridColumn: '1 / -1', opacity: 0.6 }}>
            <div style={{ fontSize: '50px' }}>🏅</div>
            <h3>Platform Integrity Solid</h3>
            <p>No high-risk behaviors detected in the divine ecosystem.</p>
          </div>
        )}
      </div>
    </div>
  );
}
