import React from 'react';

export default function PanditVerificationTable({ pandits, onUpdateStatus }) {
  const getStatusStyle = (s) => {
    switch(s.toLowerCase()) {
      case 'verified': return { background: '#D1FADF', color: '#039855' };
      case 'rejected': return { background: '#FEE4E2', color: '#D92D20' };
      case 'pending': return { background: '#FEF0C7', color: '#B54708' };
      default: return { background: '#F2F4F7', color: '#475467' };
    }
  };

  return (
    <div className="admin-table-container card">
      <div className="dtable">
        <div className="thead" style={{ gridTemplateColumns: "1.5fr 1.2fr 1fr 1.2fr 2fr" }}>
          {["Pandit Name", "Documents", "Experience", "Current Status", "Actions"].map(h => (
            <div key={h} className="th">{h}</div>
          ))}
        </div>
        
        {pandits.map(p => (
          <div key={p.id} className="tr" style={{ gridTemplateColumns: "1.5fr 1.2fr 1fr 1.2fr 2fr" }}>
            <div className="td">
              <div style={{ fontWeight: 800, color: "#2C1A0E" }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "#8B6347" }}>{p.city} · {p.specialization}</div>
            </div>
            <div className="td">
              <div className="doc-links">
                {["Aadhhar", "Cert"].map(d => (
                  <span key={d} className="doc-tag" style={{ cursor: 'pointer', marginRight: 5 }}>📄 {d}</span>
                ))}
              </div>
            </div>
            <div className="td"><b>{p.experience}+ Yrs</b></div>
            <div className="td">
              <span className="status-badge" style={getStatusStyle(p.verified ? 'Verified' : 'Pending')}>
                {p.verified ? 'Verified' : 'Pending Approval'}
              </span>
            </div>
            <div className="td">
              <div style={{ display: 'flex', gap: 8 }}>
                {!p.verified && (
                  <>
                    <button className="btn btn-primary btn-xs" onClick={() => onUpdateStatus(p.id, true)}>Approve</button>
                    <button className="btn btn-outline btn-xs" style={{ borderColor: '#D92D20', color: '#D92D20' }} onClick={() => onUpdateStatus(p.id, false, 'rejected')}>Reject</button>
                  </>
                )}
                <button className="btn btn-outline btn-xs" onClick={() => onUpdateStatus(p.id, false, 'changes_requested')}>Ask Changes</button>
              </div>
            </div>
          </div>
        ))}

        {pandits.length === 0 && (
          <div className="ac" style={{ padding: 40, color: "#8B6347" }}>No pandits awaiting verification.</div>
        )}
      </div>
    </div>
  );
}
