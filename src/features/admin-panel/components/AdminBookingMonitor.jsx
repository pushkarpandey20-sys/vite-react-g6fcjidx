import React, { useState, useEffect, useMemo } from 'react';
import { db, supabase } from '../../../services/supabase';
import { Spinner, StatusBadge } from '../../../components/common/UIElements';

export default function AdminBookingMonitor() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: 'All',
    ritual: 'All',
    pandit: 'All',
    date: ''
  });

  // Unique options for filters
  const filterOptions = useMemo(() => {
    const cities = ['All', ...new Set(bookings.map(b => b.location).filter(Boolean))];
    const rituals = ['All', ...new Set(bookings.map(b => b.ritual).filter(Boolean))];
    const pandits = ['All', ...new Set(bookings.map(b => b.pandit_name).filter(Boolean))];
    return { cities, rituals, pandits };
  }, [bookings]);

  useEffect(() => {
    // Initial fetch
    const fetchBookings = async () => {
      const { data, error } = await db.bookings()
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setBookings(data || []);
      setLoading(false);
    };

    fetchBookings();

    // Realtime subscription
    const channel = supabase
      .channel('admin-booking-monitor')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'bookings' 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setBookings(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setBookings(prev => prev.map(b => b.id === payload.new.id ? payload.new : b));
        } else if (payload.eventType === 'DELETE') {
          setBookings(prev => prev.filter(b => b.id === payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredBookings = bookings.filter(b => {
    return (filters.city === 'All' || b.location === filters.city) &&
           (filters.ritual === 'All' || b.ritual === filters.ritual) &&
           (filters.pandit === 'All' || b.pandit_name === filters.pandit) &&
           (!filters.date || b.booking_date === filters.date);
  });

  const stats = {
    new: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed' || b.status === 'accepted').length,
    completed: bookings.filter(b => b.status === 'completed' || b.status === 'fulfilled').length,
    cancelled: bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length
  };

  if (loading) return <Spinner />;

  return (
    <div className="admin-booking-monitor">
      {/* Real-time Status Header */}
      <div className="stat-grid sg4" style={{ marginBottom: '30px' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid #F0C040' }}>
          <div className="stat-icon">🔔</div>
          <div className="stat-val">{stats.new}</div>
          <div className="stat-lbl">New Requests</div>
          <div className="live-indicator"><span className="dot pulse" /> Live Feed</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #00C853' }}>
          <div className="stat-icon">✅</div>
          <div className="stat-val">{stats.confirmed}</div>
          <div className="stat-lbl">Confirmed</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #2196F3' }}>
          <div className="stat-icon">📿</div>
          <div className="stat-val">{stats.completed}</div>
          <div className="stat-lbl">Completed</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #FF5252' }}>
          <div className="stat-icon">🛑</div>
          <div className="stat-val">{stats.cancelled}</div>
          <div className="stat-lbl">Cancelled</div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="card" style={{ padding: '20px', marginBottom: '25px', display: 'flex', gap: '20px', alignItems: 'flex-end', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}>
        <div className="fg" style={{ flex: 1 }}>
          <label className="fl">City</label>
          <select className="fs" value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})}>
            {filterOptions.cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="fg" style={{ flex: 1 }}>
          <label className="fl">Ritual</label>
          <select className="fs" value={filters.ritual} onChange={e => setFilters({...filters, ritual: e.target.value})}>
            {filterOptions.rituals.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="fg" style={{ flex: 1 }}>
          <label className="fl">Pandit</label>
          <select className="fs" value={filters.pandit} onChange={e => setFilters({...filters, pandit: e.target.value})}>
            {filterOptions.pandits.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="fg" style={{ flex: 1 }}>
          <label className="fl">Service Date</label>
          <input type="date" className="fi" value={filters.date} onChange={e => setFilters({...filters, date: e.target.value})} />
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => setFilters({ city: 'All', ritual: 'All', pandit: 'All', date: '' })}>Reset</button>
      </div>

      {/* Real-time Order Log */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="sh" style={{ padding: '20px' }}>
          <div className="sh-title">Real-time Sacred Records ({filteredBookings.length})</div>
        </div>
        <div className="dtable">
          <div className="thead" style={{ gridTemplateColumns: "0.8fr 1.5fr 1.2fr 1.5fr 1fr 1fr" }}>
            {["Record ID", "Devotee", "Pandit", "Ritual Service", "Amount", "Status"].map(h => (
              <div key={h} className="th">{h}</div>
            ))}
          </div>
          <div className="tbody" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredBookings.map(b => (
              <div key={b.id} className="tr" style={{ gridTemplateColumns: "0.8fr 1.5fr 1.2fr 1.5fr 1fr 1fr", animation: 'fadeIn 0.5s' }}>
                <div className="td" style={{ fontFamily: 'monospace', color: '#FF6B00', fontWeight: 700 }}>#{b.id.slice(-6).toUpperCase()}</div>
                <div className="td">
                  <div style={{ fontWeight: 800 }}>{b.devotee_name}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>📍 {b.location}</div>
                </div>
                <div className="td" style={{ fontWeight: 700 }}>Pt. {b.pandit_name}</div>
                <div className="td">
                  <div>{b.ritual_icon} {b.ritual}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>📅 {b.booking_date} | {b.booking_time}</div>
                </div>
                <div className="td" style={{ fontWeight: 900, color: '#2C1A0E' }}>₹{b.amount?.toLocaleString()}</div>
                <div className="td"><StatusBadge status={b.status} /></div>
              </div>
            ))}
            {filteredBookings.length === 0 && (
              <div style={{ textAlign: 'center', padding: '50px', color: '#8B6347' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔍</div>
                <p>No rituals matching your current divine filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .live-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 800;
          color: #FF6B00;
          text-transform: uppercase;
          margin-top: 10px;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: #FF6B00;
          border-radius: 50%;
        }
        .pulse {
          animation: pulse-red 2s infinite;
        }
        @keyframes pulse-red {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 107, 0, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 107, 0, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 107, 0, 0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
