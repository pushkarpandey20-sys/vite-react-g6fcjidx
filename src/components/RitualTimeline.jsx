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

      <div className="ritual-timeline-container">
        {/* Progress Line Desktop */}
        <div className="timeline-line-desktop" style={{ width: `${(currentIndex / (STATUS_MAP.length - 1)) * 100}%` }} />
        {/* Progress Line Mobile */}
        <div className="timeline-line-mobile" style={{ height: `${(currentIndex / (STATUS_MAP.length - 1)) * 100}%` }} />

        {STATUS_MAP.map((s, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isPending = i > currentIndex;

          return (
            <div key={s.key} className={`timeline-step ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className="step-circle">
                {isCompleted ? '✓' : s.icon}
              </div>
              <div className="step-label">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ritual-timeline-container {
          display: flex;
          justify-content: space-between;
          position: relative;
          padding: 0 10px;
        }
        .timeline-line-desktop {
          position: absolute;
          top: 11px;
          left: 0;
          height: 2px;
          background: #FF6B00;
          z-index: 0;
          transition: width 0.5s ease;
        }
        .timeline-line-mobile { display: none; }
        .timeline-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 1;
          width: 16%;
        }
        .step-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2A1A0E;
          border: 2px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }
        .timeline-step.completed .step-circle, .timeline-step.current .step-circle {
          background: #FF6B00;
          border-color: #FF6B00;
        }
        .timeline-step.current .step-circle {
          border-color: #F0C040;
          box-shadow: 0 0 10px rgba(255,107,0,0.4);
        }
        .step-label {
          fontSize: 9px;
          font-weight: 800;
          text-align: center;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .timeline-step.current .step-label { color: #F0C040; }
        .timeline-step.completed .step-label { color: #fff; }

        @media (max-width: 768px) {
          .ritual-timeline-container {
            flex-direction: column;
            gap: 20px;
            padding-left: 30px;
          }
          .timeline-line-desktop { display: none; }
          .timeline-line-mobile {
            display: block;
            position: absolute;
            left: 11px;
            top: 0;
            width: 2px;
            background: #FF6B00;
            z-index: 0;
            transition: height 0.5s ease;
          }
          .timeline-step {
            flex-direction: row;
            width: 100%;
            justify-content: flex-start;
          }
          .step-label {
            text-align: left;
            font-size: 11px;
          }
        }
      `}} />
    </div>
  );
}
