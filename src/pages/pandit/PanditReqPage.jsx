import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';
import { Spinner } from '../../components/common/UIElements';
import { ReqCard } from '../../components/Cards';

export default function PanditReqPage({ propFilter }) {
  const { db, panditId, toast } = useApp();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialFilter = propFilter ? propFilter.charAt(0).toUpperCase() + propFilter.slice(1) : "All";
  const [filter, setFilter] = useState(initialFilter);


  useEffect(() => {
    if (!panditId) { setLoading(false); return; }
    db.requests().select("*").eq("pandit_id", panditId).order("created_at", { ascending: false })
      .then(({ data }) => { setRequests(data || []); setLoading(false); });
  }, [panditId]);

  const handleReq = async (id, status) => {
    await db.requests().update({ status }).eq("id", id);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast(status === "accepted" ? "Accepted!" : "Declined.", status === "accepted" ? "✅" : "❌");
  };

  if (loading) return <Spinner />;
  const filtered = filter === "All" ? requests : requests.filter(r => r.status === filter.toLowerCase());
  return (<>
    <div style={{ marginBottom: 16 }}>
      {["All", "Pending", "Accepted", "Rejected"].map(f => (
        <span key={f} className={`chip ${filter === f ? "on" : ""} `} onClick={() => setFilter(f)}>
          {f} ({f === "All" ? requests.length : requests.filter(r => r.status === f.toLowerCase()).length})
        </span>
      ))}
    </div>
    {filtered.map(r => <ReqCard key={r.id} r={r} onAction={handleReq} readOnly={r.status !== "pending"} />)}
  </>);
}
