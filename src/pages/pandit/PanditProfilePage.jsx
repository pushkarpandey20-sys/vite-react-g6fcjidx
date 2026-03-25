import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';
import { Spinner } from '../../components/common/UIElements';

export default function PanditProfilePage() {
  const { db, panditId, toast } = useApp();
  const allSpecs = ["Griha Pravesh", "Satyanarayan Katha", "Navgrah Pooja", "Rudrabhishek", "Vivah", "Mundan", "Kaal Sarp Dosh", "Havan", "Vastu Puja", "Maha Mrityunjaya"];
  const [form, setForm] = useState({ name: "Pt. Ramesh Sharma", speciality: "Vedic & Tantric", experience_years: 15, city: "Varanasi", bio: "", tags: [], phone: "+91 9876543210" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!panditId) { setLoading(false); return; }
    db.pandits().select("*").eq("id", panditId).single().then(({ data }) => { if (data) { setForm(data); } setLoading(false); });
  }, [panditId]);

  const save = async () => {
    setSaving(true);
    if (panditId) { await db.pandits().update(form).eq("id", panditId); }
    setSaving(false);
    toast("Profile saved!", "✅");
  };

  if (loading) return <Spinner />;
  const completeness = [form.name, form.speciality, form.experience_years, form.city, form.bio, (form.tags || []).length > 0].filter(Boolean).length;

  return (<>
    <div className="card card-p" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: "#5C3317" }}>Profile Completeness</span>
        <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, color: "#FF6B00" }}>{Math.round((completeness / 6) * 100)}%</span>
      </div>
      <div className="prog-bar"><div className="prog-fill" style={{ width: `${(completeness / 6) * 100}% ` }} /></div>
    </div>
    <div className="card card-p" style={{ marginBottom: 20 }}>
      <div className="profile-header-grid" style={{ marginBottom: 22 }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg,var(--s),var(--g))", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", fontSize: 44, border: "4px solid var(--cream)" }}>🕉️</div>
        <div>
          <div className="fgrid">
            <div className="fg"><label className="fl">Full Name</label><input className="fi" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="fg"><label className="fl">Speciality</label><input className="fi" value={form.speciality} onChange={e => setForm({ ...form, speciality: e.target.value })} /></div>
            <div className="fg"><label className="fl">Experience (Yrs)</label><input className="fi" type="number" value={form.experience_years} onChange={e => setForm({ ...form, experience_years: e.target.value })} /></div>
            <div className="fg"><label className="fl">Location (City)</label><input className="fi" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
            <div className="fg">
              <label className="fl">Latitude</label>
              <input className="fi" type="number" step="any" value={form.latitude} onChange={e => setForm({ ...form, latitude: parseFloat(e.target.value) })} />
            </div>
            <div className="fg">
              <label className="fl">Longitude</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input className="fi" type="number" step="any" value={form.longitude} onChange={e => setForm({ ...form, longitude: parseFloat(e.target.value) })} />
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigator.geolocation.getCurrentPosition(pos => setForm({ ...form, latitude: pos.coords.latitude, longitude: pos.coords.longitude }))}>📍 Get</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fg" style={{ marginBottom: 20 }}><label className="fl">Bio / About You</label><textarea className="fta" placeholder="Briefly describe your Vedic education and spiritual lineage..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
      <div className="fg"><label className="fl">Expertise Tags</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 5 }}>
          {allSpecs.map(s => <span key={s} className={`chip ${(form.tags || []).includes(s) ? "on" : ""} `} onClick={() => setForm({ ...form, tags: (form.tags || []).includes(s) ? form.tags.filter(t => t !== s) : [...(form.tags || []), s] })}>{s}</span>)}
        </div>
      </div>
    </div>
    <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Profile Details"}</button>
  </>);
}
