import SamagriInventoryManager from '../../features/admin-panel/components/SamagriInventoryManager';

export default function AdminSamagriList() {
  return (
    <div className="admin-samagri-view" style={{ padding: '0 20px' }}>
      <div className="sh" style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sh-title" style={{ fontSize: '1.5rem', fontWeight: 900 }}>Inventory Hub: Sacred Pooja Samagri</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary btn-sm">+ Divine SKU Onboarding</button>
        </div>
      </div>
      <SamagriInventoryManager />
    </div>
  );
}

