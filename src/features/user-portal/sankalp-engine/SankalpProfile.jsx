import React, { useState, useEffect } from 'react';
import { useApp } from '../../../store/AppCtx';
import { db } from '../../../services/supabase';

export default function SankalpProfile() {
  const { devoteeId, toast } = useApp();
  const [profile, setProfile] = useState({
    name: '',
    dob: '',
    gotra: '',
    kuldevta: '',
    family: [],
    important_dates: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!devoteeId) return;
    db.devotees().select("*").eq("id", devoteeId).single()
      .then(({ data }) => {
        if (data) setProfile(prev => ({ ...prev, ...data }));
        setLoading(false);
      });
  }, [devoteeId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await db.devotees().update(profile).eq("id", devoteeId);
    if (!error) toast("Sankalp Identity Updated! 🙏", "🕉️");
    else toast("Sacred Update Failed", "⚠️");
  };

  const addFamily = () => setProfile(p => ({ ...p, family: [...p.family, { name: '', relation: '', dob: '' }] }));
  const addDate = () => setProfile(p => ({ ...p, important_dates: [...p.important_dates, { event: '', date: '' }] }));

  return (
    <div className="sankalp-profile-editor">
      <form onSubmit={handleUpdate} className="card card-p" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="ph-title" style={{ color: '#F0C040' }}>Your Spiritual Identity (Sankalp)</h2>
        <p className="ph-sub">Define your roots and lineage for more personalized spiritual services.</p>

        <div className="fgrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
          <div className="fg">
            <label className="fl">Girdhari Name (Spiritual Name)</label>
            <input className="fi" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
          </div>
          <div className="fg">
            <label className="fl">Date of Birth (Tithi Calculation)</label>
            <input type="date" className="fi" value={profile.dob} onChange={e => setProfile({...profile, dob: e.target.value})} />
          </div>
          <div className="fg">
            <label className="fl">Gotra (Sage Lineage)</label>
            <input className="fi" placeholder="Ex: Bharadwaj, Kashyap" value={profile.gotra} onChange={e => setProfile({...profile, gotra: e.target.value})} />
          </div>
          <div className="fg">
            <label className="fl">Kuldevta / Kuldevi</label>
            <input className="fi" placeholder="Ex: Shri Kedarnath, Amba Maa" value={profile.kuldevta} onChange={e => setProfile({...profile, kuldevta: e.target.value})} />
          </div>
        </div>

        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h4 style={{ margin: 0 }}>Family Members (Included in Sankalp)</h4>
            <button type="button" className="btn btn-ghost btn-sm" onClick={addFamily}>+ Add Member</button>
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            {profile.family.map((f, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px' }}>
                <input className="fi" placeholder="Name" value={f.name} onChange={e => {
                  const nf = [...profile.family]; nf[i].name = e.target.value; setProfile({...profile, family: nf});
                }} />
                <input className="fi" placeholder="Relation" value={f.relation} onChange={e => {
                  const nf = [...profile.family]; nf[i].relation = e.target.value; setProfile({...profile, family: nf});
                }} />
                <input type="date" className="fi" value={f.dob} onChange={e => {
                  const nf = [...profile.family]; nf[i].dob = e.target.value; setProfile({...profile, family: nf});
                }} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '40px', padding: '15px' }}>
          📿 Seal Your Spiritual Identity
        </button>
      </form>
    </div>
  );
}
