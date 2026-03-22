import React, { useState, useEffect } from 'react';
import { useApp } from '../../../store/AppCtx';
import { db } from '../../../services/supabase';

export default function SpiritualCalendarWidget() {
  const { devoteeId, MUHURTAS } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (devoteeId) {
      db.bookings()
        .select("*")
        .eq("devotee_id", devoteeId)
        .eq("status", "confirmed")
        .order("booking_date", { ascending: true })
        .limit(3)
        .then(({ data }) => {
          setBookings(data || []);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [devoteeId]);

  const festivals = [
    { name: "Ekadashi", date: "Mar 24", icon: "🌙", type: "Vrat" },
    { name: "Pradosh", date: "Mar 26", icon: "🔱", type: "Pooja" },
    { name: "Holi", date: "Mar 30", icon: "🎨", type: "Festival" }
  ];

  return (
    <div className="spiritual-calendar-widget card" style={{ padding: '25px', borderRadius: '24px', background: '#fff', border: '1px solid rgba(212,160,23,.12)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
      {/* Daily Tithi Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#FF6B00', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Today's Tithi</div>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#2C1A0E' }}>{MUHURTAS[0].tithi}</h3>
          <div style={{ fontSize: '13px', color: '#8B6347', marginTop: '4px' }}>{MUHURTAS[0].nakshatra} · {MUHURTAS[0].quality}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px' }}>🕉️</div>
          <div style={{ fontSize: '10px', fontWeight: 700, opacity: 0.6, color: '#5C3317' }}>Vikram Samvat 2080</div>
        </div>
      </div>

      {/* Festival Alerts */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#5C3317', marginBottom: '12px', opacity: 0.5, textTransform: 'uppercase' }}>Upcoming Festivals</div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
          {festivals.map(f => (
            <div key={f.name} style={{ flexShrink: 0, padding: '12px', background: '#FFFAF5', borderRadius: '16px', border: '1px solid #FFF1E0', textAlign: 'center', minWidth: '85px' }}>
              <div style={{ fontSize: '20px', marginBottom: '5px' }}>{f.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#2C1A0E' }}>{f.name}</div>
              <div style={{ fontSize: '10px', color: '#FF6B00', fontWeight: 700 }}>{f.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* User Ritual Reminders */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#5C3317', marginBottom: '12px', opacity: 0.5, textTransform: 'uppercase' }}>Your Ritual Reminders</div>
        <div style={{ display: 'grid', gap: '10px' }}>
          {bookings.length > 0 ? bookings.map(b => (
            <div key={b.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: '#f9f9f9', borderRadius: '14px', border: '1px solid #eee' }}>
              <div style={{ fontSize: '20px', background: '#fff', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>{b.ritual_icon}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{b.ritual}</div>
                <div style={{ fontSize: '11px', color: '#8B6347' }}>{b.booking_date} at {b.booking_time}</div>
              </div>
            </div>
          )) : (
            <div style={{ fontSize: '12px', color: '#8B6347', fontStyle: 'italic', padding: '10px' }}>No upcoming rituals scheduled.</div>
          )}
        </div>
      </div>

      {/* Muhurat Quick Actions */}
      <div style={{ background: 'linear-gradient(135deg, #FF6B00, #FF9E00)', padding: '15px', borderRadius: '18px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, opacity: 0.9 }}>NEXT SHUBH MUHURTA</div>
            <div style={{ fontSize: '14px', fontWeight: 800, marginTop: '2px' }}>{MUHURTAS[1].tithi}</div>
          </div>
          <button className="btn btn-white btn-sm" style={{ padding: '6px 12px', fontSize: '11px' }}>Verify Muhurta</button>
        </div>
      </div>
    </div>
  );
}
