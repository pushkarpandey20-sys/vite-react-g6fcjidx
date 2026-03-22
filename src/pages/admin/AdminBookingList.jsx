import AdminBookingMonitor from '../../features/admin-panel/components/AdminBookingMonitor';

export default function AdminBookingList() {
  return (
    <div className="admin-booking-page">
      <div className="sh" style={{ marginBottom: '20px' }}>
        <div className="sh-title">Sacred Ledger: Real-time Monitor</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline btn-sm">Export divine Catalog</button>
        </div>
      </div>
      <AdminBookingMonitor />
    </div>
  );
}

