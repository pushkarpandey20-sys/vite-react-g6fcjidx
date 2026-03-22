import PanditVerificationWorkflow from '../../features/admin-panel/components/PanditVerificationWorkflow';

export default function AdminPanditList() {
  const { db, toast } = useApp();
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    db.pandits().select("*").order("created_at", { ascending: false }).then(({ data }) => { 
      setPandits(data || []); 
      setLoading(false); 
    });
  }, [db]);

  const handleStatusChange = (id, updatePayload) => {
    setPandits(prev => prev.map(p => p.id === id ? { ...p, ...updatePayload } : p));
    toast(`Pandit Verification: ${updatePayload.verification_status.toUpperCase()}`, "✅");
  };

  if (loading) return <Spinner />;
  const filtered = filter === "All" ? pandits : (filter === "Verified" ? pandits.filter(p => p.verified) : pandits.filter(p => !p.verified));

  return (
    <div className="admin-pandit-view" style={{ padding: '0 20px' }}>
      <div className="sh" style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sh-title" style={{ fontSize: '1.5rem', fontWeight: 900 }}>Sacred Scholar Onboarding Workflow</div>
        <div className="sh-controls" style={{ display: 'flex', gap: '10px' }}>
          {["All", "Verified", "Pending"].map(f => (
            <button key={f} className={`chip ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: '15px' }}>{f}</button>
          ))}
        </div>
      </div>

      <div className="verification-list" style={{ display: 'grid', gap: '20px' }}>
        {filtered.map(p => (
          <PanditVerificationWorkflow 
            key={p.id} 
            pandit={p} 
            onUpdate={handleStatusChange} 
          />
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', opacity: 0.5 }}>
            <div style={{ fontSize: '40px' }}>🔍</div>
            <p>No scholars matching the current divine criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}


