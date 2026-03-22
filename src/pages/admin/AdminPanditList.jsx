import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';
import { Spinner } from '../../components/common/UIElements';
import PanditVerificationTable from '../../features/admin-panel/components/PanditVerificationTable';

export default function AdminPanditList() {
  const { db, toast } = useApp();
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    db.pandits().select("*").order("created_at", { ascending: false }).then(({ data }) => { 
      setPandits(data?.map(p => ({ ...p, experience: p.experience_years })) || []); 
      setLoading(false); 
    });
  }, [db]);

  const handleUpdateStatus = async (id, isVerified, statusLabel) => {
    const { error } = await db.pandits().update({ verified: isVerified }).eq("id", id);
    if (!error) {
      setPandits(prev => prev.map(p => p.id === id ? { ...p, verified: isVerified } : p));
      toast(`Pandit status updated: ${statusLabel || (isVerified ? 'Approved' : 'Updated')}`, "✅");
    }
  };

  if (loading) return <Spinner />;
  const filtered = filter === "All" ? pandits : (filter === "Verified" ? pandits.filter(p => p.verified) : pandits.filter(p => !p.verified));

  return (
    <div className="admin-pandit-view">
      <div className="sh">
        <div className="sh-title">Verification Dashboard</div>
        <div className="sh-controls">
          {["All", "Verified", "Pending"].map(f => (
            <button key={f} className={`chip ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <PanditVerificationTable 
        pandits={filtered} 
        onUpdateStatus={handleUpdateStatus} 
      />
    </div>
  );
}

