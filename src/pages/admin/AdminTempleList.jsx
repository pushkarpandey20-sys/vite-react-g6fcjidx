import TempleManagementModule from '../../features/admin-panel/components/TempleManagementModule';

export default function AdminTempleList() {
  const { db, toast } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.temples().select("*").order("name").then(({ data }) => { 
      setItems(data || []); 
      setLoading(false); 
    });
  }, [db]);

  const handleUpdate = (id, data) => {
    setItems(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    toast("Shrine Metadata Synchronized! 🙏", "🕉️");
  };

  if (loading) return <Spinner />;

  return (
    <div className="admin-temple-view" style={{ padding: '0 20px' }}>
      <div className="sh" style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sh-title" style={{ fontSize: '1.5rem', fontWeight: 900 }}>Sacred Shrine Management Dashboard</div>
      </div>

      <TempleManagementModule 
        temples={items} 
        onUpdate={handleUpdate} 
      />
    </div>
  );
}

