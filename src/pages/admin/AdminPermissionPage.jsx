import React, { useState } from 'react';
import { useApp } from '../../store/AppCtx';

export default function AdminPermissionPage() {
  const { toast } = useApp();
  const [admins, setAdmins] = useState([
    { id: 1, name: "Super User", role: "superadmin", email: "super@devsetu.com", status: "active" },
    { id: 2, name: "Inventory Mgr", role: "manager", email: "inv@devsetu.com", status: "active" },
    { id: 3, name: "Support Staff", role: "viewer", email: "support@devsetu.com", status: "active" }
  ]);

  const updateRole = (id, role) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, role } : a));
    toast("Admin role updated!", "🛡️");
  };

  return (<>
    <div className="sh"><div className="sh-title">System Users & Permissions</div><button className="btn btn-primary btn-sm">+ Add Admin</button></div>
    <div className="dtable">
      <div className="thead" style={{ gridTemplateColumns: "1.5fr 1.5fr .8fr 1fr .8fr" }}>
        {["Admin User", "Contact", "Role", "Permission Level", "Actions"].map(h => <div key={h} className="th">{h}</div>)}
      </div>
      {admins.map(a => (
        <div key={a.id} className="tr" style={{ gridTemplateColumns: "1.5fr 1.5fr .8fr 1fr .8fr" }}>
          <div className="td"><div style={{ fontWeight: 800 }}>{a.name}</div></div>
          <div className="td" style={{ fontSize: 12, color: "#8B6347" }}>{a.email}</div>
          <div className="td">
            <span className={`role-badge ${a.role === 'superadmin' ? 'role-super' : a.role === 'manager' ? 'role-manager' : 'role-viewer'} `}>
              {a.role.toUpperCase()}
            </span>
          </div>
          <div className="td">
            <select className="fs" value={a.role} onChange={(e) => updateRole(a.id, e.target.value)} style={{ padding: "4px 8px", fontSize: 11 }}>
              <option value="superadmin">Super Admin</option>
              <option value="manager">Manager</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="td"><button className="btn btn-outline btn-sm" onClick={() => toast("User removed", "🗑️")}>🗑️</button></div>
        </div>
      ))}
    </div>
  </>);
}
