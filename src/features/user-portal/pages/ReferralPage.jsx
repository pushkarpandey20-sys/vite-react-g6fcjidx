import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppCtx';
import { db } from '../../services/supabase';

export default function ReferralPage() {
  const { devoteeId, toast } = useApp();
  const [refCode, setRefCode] = useState('');
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!devoteeId) return;
    
    // Generate or fetch referral code
    db.devotees().select("referral_code, wallet_balance").eq("id", devoteeId).single()
      .then(({ data }) => {
        if (data?.referral_code) {
          setRefCode(data.referral_code);
        } else {
          const newCode = `DEV${devoteeId.slice(-4)}${Math.random().toString(36).substring(7).toUpperCase()}`;
          db.devotees().update({ referral_code: newCode }).eq("id", devoteeId).then(() => setRefCode(newCode));
        }
        setLoading(false);
      });

    // Fetch rewards
    db.referral_rewards().select("*").eq("devotee_id", devoteeId).then(({ data }) => setRewards(data || []));
  }, [devoteeId]);

  const copyCode = () => {
    navigator.clipboard.writeText(refCode);
    toast("Referral Code Copied! 📋", "🎁");
  };

  return (
    <div className="referral-page">
      <div className="card card-p" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', background: 'linear-gradient(135deg, #FFF9F0, #FFF)' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎁</div>
        <h2 className="ph-title" style={{ color: '#F0C040' }}>Refer & Spread Divine Grace</h2>
        <p className="ph-sub">Invite your friends to DevSetu. They get ₹200 off their first booking, and you earn spiritual credits!</p>

        <div style={{ marginTop: '40px', background: '#fff', border: '2px dashed #FFD4B2', padding: '30px', borderRadius: '24px', display: 'inline-block', minWidth: '300px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#8B6347', letterSpacing: '2px', marginBottom: '10px' }}>YOUR UNIQUE CODE</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FF6B00', fontFamily: 'monospace', marginBottom: '15px' }}>{refCode || 'GENERATING...'}</div>
          <button className="btn btn-primary" onClick={copyCode}>📋 Copy Referral Code</button>
        </div>

        <div style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card" style={{ padding: '20px', background: '#FFFAF5' }}>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#FF6B00' }}>₹200</div>
            <div style={{ fontSize: '12px', color: '#8B6347' }}>Discount for your Friends</div>
          </div>
          <div className="card" style={{ padding: '20px', background: '#FFFAF5' }}>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#FF6B00' }}>₹100</div>
            <div style={{ fontSize: '12px', color: '#8B6347' }}>Credit for Every Success</div>
          </div>
        </div>

        <div style={{ marginTop: '50px', textAlign: 'left' }}>
          <h4 style={{ marginBottom: '20px' }}>Recent Referral Activity</h4>
          {rewards.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', background: '#f9f9f9', borderRadius: '15px', color: '#888', fontStyle: 'italic' }}>
              No referrals yet. Start sharing to earn rewards! 🕉️
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {rewards.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#fff', border: '1px solid #eee', borderRadius: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>Friend Joined: {r.referred_name}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{new Date(r.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ color: '#00C853', fontWeight: 800 }}>+₹{r.amount}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
