import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';
import { db } from '../../services/supabase';

export default function PanditCalendarManager() {
  const { panditId, toast } = useApp();
  const [schedule, setSchedule] = useState({
    working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    slots: {
      morning: { start: '06:00', end: '12:00', active: true },
      afternoon: { start: '12:00', end: '18:00', active: true },
      evening: { start: '18:00', end: '22:00', active: true }
    },
    busy_dates: []
  });
  const [loading, setLoading] = useState(true);
  const [newBusyDate, setNewBusyDate] = useState('');

  useEffect(() => {
    if (!panditId) return;
    db.pandits().select("availability_config").eq("id", panditId).single()
      .then(({ data }) => {
        if (data?.availability_config) setSchedule(data.availability_config);
        setLoading(false);
      });
  }, [panditId]);

  const saveConfig = async (newConfig) => {
    const { error } = await db.pandits().update({ availability_config: newConfig }).eq("id", panditId);
    if (!error) toast("Availability Schedule Updated! 🙏", "🗓️");
    else toast("Sacred Schedule Update Failed", "⚠️");
  };

  const toggleDay = (day) => {
    const wd = schedule.working_days.includes(day)
      ? schedule.working_days.filter(d => d !== day)
      : [...schedule.working_days, day];
    const newConfig = { ...schedule, working_days: wd };
    setSchedule(newConfig);
    saveConfig(newConfig);
  };

  const addBusyDate = () => {
    if (!newBusyDate) return;
    const newConfig = { ...schedule, busy_dates: [...schedule.busy_dates, newBusyDate] };
    setSchedule(newConfig);
    saveConfig(newConfig);
    setNewBusyDate('');
  };

  const removeBusyDate = (date) => {
    const newConfig = { ...schedule, busy_dates: schedule.busy_dates.filter(d => d !== date) };
    setSchedule(newConfig);
    saveConfig(newConfig);
  };

  return (
    <div className="pandit-calendar-manager">
      <div className="card card-p" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 className="ph-title" style={{ color: '#F0C040' }}>Availability & Schedule Manager</h2>
        <p className="ph-sub">Configure your working days, time slots, and mark busy dates for rituals.</p>

        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
          {/* Weekday Selector */}
          <section>
            <h4 style={{ marginBottom: '15px' }}>📅 Available Working Days</h4>
            <div style={{ display: 'grid', gap: '10px' }}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: schedule.working_days.includes(day) ? '#FFFAF5' : '#f9f9f9', border: '1px solid', borderColor: schedule.working_days.includes(day) ? '#FFD4B2' : '#eee', borderRadius: '14px', cursor: 'pointer' }} onClick={() => toggleDay(day)}>
                  <span style={{ fontWeight: 700, opacity: schedule.working_days.includes(day) ? 1 : 0.5 }}>{day}</span>
                  <div className={`tab-toggle ${schedule.working_days.includes(day) ? 'active' : ''}`} style={{ width: '40px', height: '22px', background: schedule.working_days.includes(day) ? '#FF6B00' : '#ccc', borderRadius: '20px', position: 'relative', transition: '0.3s' }}>
                    <div style={{ position: 'absolute', top: '2px', left: schedule.working_days.includes(day) ? '20px' : '2px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: '0.3s' }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Busy Dates & Slots */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div className="card" style={{ padding: '20px', background: '#fefefe', border: '1px solid #ddd', borderRadius: '18px' }}>
              <h4 style={{ marginBottom: '15px' }}>🔒 Mark Busy Dates</h4>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>Dates selected here will not show you as available for devotees.</p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input type="date" className="fi" value={newBusyDate} onChange={e => setNewBusyDate(e.target.value)} />
                <button className="btn btn-primary btn-sm" onClick={addBusyDate}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {schedule.busy_dates.map(date => (
                  <span key={date} style={{ background: '#f0f0f0', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {date} <span onClick={() => removeBusyDate(date)} style={{ cursor: 'pointer', opacity: 0.5 }}>✕</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '20px', background: '#fefefe', border: '1px solid #ddd', borderRadius: '18px' }}>
              <h4 style={{ marginBottom: '15px' }}>⏰ Custom Time Slots</h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                {Object.entries(schedule.slots).map(([key, slot]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'capitalize' }}>{key}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{slot.start} - {slot.end}</div>
                    <input type="checkbox" checked={slot.active} onChange={e => {
                      const newConfig = { ...schedule, slots: { ...schedule.slots, [key]: { ...slot, active: e.target.checked } } };
                      setSchedule(newConfig);
                      saveConfig(newConfig);
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
