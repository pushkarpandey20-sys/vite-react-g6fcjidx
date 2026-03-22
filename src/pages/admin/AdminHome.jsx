import BookingRiskMonitor from '../../features/admin-panel/components/BookingRiskMonitor';

export default function AdminHome() {
  const { db } = useApp();
  const [stats, setStats] = useState({ pandits: 0, bookings: 0, pending: 0, revenue: 0, devotees: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartData = [40, 55, 48, 65, 72, 68, 80, 75, 88, 92, 85, 95];

  useEffect(() => {
    (async () => {
      const [p, b, pend, dev] = await Promise.all([
        db.pandits().select("id", { count: "exact", head: true }),
        db.bookings().select("*").order("created_at", { ascending: false }).limit(8),
        db.pandits().select("id", { count: "exact", head: true }).eq("verified", false),
        db.devotees().select("id", { count: "exact", head: true }),
      ]);
      const bookingsData = b.data || [];
      const rev = bookingsData.reduce((s, x) => s + (x.amount || 0), 0);
      setStats({ pandits: p.count || 0, bookings: b.count || bookingsData.length, pending: pend.count || 0, revenue: rev, devotees: dev.count || 0 });
      setRecent(bookingsData);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Spinner />;
  return (<>
    <div className="stat-grid sg4">
      {[
        { icon: "🙏", val: stats.devotees + 1200, lbl: "Total Devotees", trend: "+89 this week" },
        { icon: "🕉️", val: stats.pandits, lbl: "Active Pandits", trend: `${stats.pending} awaiting verification` },
        { icon: "📿", val: stats.bookings + 4820, lbl: "Total Bookings", trend: "+234 this month" },
        { icon: "💰", val: `₹${((stats.revenue + 2400000) / 100000).toFixed(1)} L`, lbl: "Revenue", trend: "+18% vs last" },
      ].map((s, i) => (
        <div key={i} className="stat-card">
          <div className="stat-icon">{s.icon}</div>
          <div className="stat-val">{s.val}</div>
          <div className="stat-lbl">{s.lbl}</div>
          <div className="stat-trend tup">↗ {s.trend}</div>
        </div>
      ))}
    </div>

    <div className="sh"><div className="sh-title">Sacred Trust & Integrity Monitor</div></div>
    <div style={{ marginBottom: '30px' }}>
      <BookingRiskMonitor />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18, marginBottom: 22 }}>
      <div className="ac">
        <div className="sh"><div className="sh-title">Platform Revenue Growth</div></div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 160, padding: "20px 0" }}>
          {chartData.map((v, i) => <div key={i} className="cbar" style={{ height: `${v}% ` }} />)}
        </div>
      </div>
      <div className="ac">
        <div className="sh"><div className="sh-title">Ritual Popularity</div></div>
        {[["Griha Pravesh", 85], ["Satyanarayan", 72], ["Rudrabhishek", 64], ["Navgrah Pooja", 55], ["Vivah Sanskar", 42]].map(([l, v]) => (
          <div key={l} className="bar-row">
            <div className="bar-lbl" style={{ width: 110 }}>{l}</div>
            <div className="bar-track"><div className="bar-fill" style={{ width: `${v}% ` }} /></div>
            <div className="bar-val">{v}%</div>
          </div>
        ))}
      </div>
    </div>


    <div className="sh"><div className="sh-title">Recent Platform Activity</div></div>
    <div className="dtable">
      <div className="thead" style={{ gridTemplateColumns: "1fr 1.5fr 1fr 1.2fr 1fr" }}>
        {["Booking ID", "Devotee", "Pandit", "Ritual", "Status"].map(h => <div key={h} className="th">{h}</div>)}
      </div>
      {recent.map(b => (
        <div key={b.id} className="tr" style={{ gridTemplateColumns: "1fr 1.5fr 1fr 1.2fr 1fr" }}>
          <div className="td" style={{ fontFamily: "'Cinzel',serif", fontSize: 10, color: "#FF6B00" }}>#{b.id?.slice(-6)}</div>
          <div className="td">{b.devotee_name}</div>
          <div className="td">{b.pandit_name}</div>
          <div className="td">{b.ritual_icon} {b.ritual}</div>
          <div className="td"><StatusBadge status={b.status} /></div>
        </div>
      ))}
    </div>
  </>);
}
