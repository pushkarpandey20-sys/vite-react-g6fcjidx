import React from 'react';

const STATUS_MAP = [
  { key: 'booking_confirmed', label: 'Confirmed', icon: '✅' },
  { key: 'pandit_assigned', label: 'Pandit Assigned', icon: '🙏' },
  { key: 'samagri_preparing', label: 'Preparing Samagri', icon: '📦' },
  { key: 'pandit_on_the_way', label: 'On the Way', icon: '🚗' },
  { key: 'ritual_completed', label: 'Ritual Completed', icon: '🕉️' },
  { key: 'prasad_dispatched', label: 'Prasad Dispatched', icon: '🚚' },
];

export default function RitualTimeline({ booking }) {
  if (!booking) return null;

  const currentStatus = booking.booking_status || 'booking_confirmed';
  const currentIndex = STATUS_MAP.findIndex(s => s.key === currentStatus);

  return (
    <div className="card card-p" style={{ background: 'rgba(255,107,0,0.04)', border: '1px solid rgba(255,107,0,0.15)', borderRadius: 16, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#FF6B00', letterSpacing: 1.5, textTransform: 'uppercase' }}>Active Ritual Status</div>
          <div style={{ fontFamily: 'Cinzel,serif', fontSize: 18, color: '#F0C040', fontWeight: 900 }}>{booking.ritual}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,248,240,0.6)' }}>Pandit: {booking.pandit_name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,248,240,0.45)' }}>{booking.booking_date} at {booking.booking_time}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 10px' }}>
        {/* Progress Line */}
        <div style={{ position: 'absolute', top: 11, left: '5%', right: '5%', height: 2, background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: 11, left: '5%', width: `${(currentIndex / (STATUS_MAP.length - 1)) * 90}%`, height: 2, background: '#FF6B00', zIndex: 0, transition: 'width 0.5s ease' }} />

        {STATUS_MAP.map((s, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isPending = i > currentIndex;

          return (
            <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 1, width: '16%' }}>
              <div style={{ 
                width: 24, height: 24, borderRadius: '50%', 
                background: isCompleted || isCurrent ? '#FF6B00' : '#2A1A0E', 
                border: `2px solid ${isCurrent ? '#F0C040' : (isCompleted ? '#FF6B00' : 'rgba(255,255,255,0.1)')}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
                boxShadow: isCurrent ? '0 0 10px rgba(255,107,0,0.4)' : 'none'
              }}>
                {isCompleted ? '✓' : ''}
              </div>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ 
                fontSize: 9, fontWeight: 800, textAlign: 'center', 
                color: isCurrent ? '#F0C040' : (isCompleted ? '#fff' : 'rgba(255,255,255,0.3)'),
                textTransform: 'uppercase', letterSpacing: 0.5
              }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
