import React, { useState } from 'react';
import { db } from '../../../services/supabase';
import { StatusBadge } from '../../../components/common/UIElements';

export default function PanditVerificationWorkflow({ pandit, onUpdate }) {
  const [viewDocs, setViewDocs] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // States: pending, docs_uploaded, under_review, approved, rejected
  const STATUS_STEPS = [
    { key: 'pending', label: 'Pending', icon: '🕒' },
    { key: 'docs_uploaded', label: 'Docs Uploaded', icon: '📄' },
    { key: 'under_review', label: 'Under Review', icon: '🔍' },
    { key: 'approved', label: 'Approved', icon: '✅' },
    { key: 'rejected', label: 'Rejected', icon: '❌' }
  ];

  const currentStatus = pandit.verification_status || (pandit.verified ? 'approved' : 'pending');
  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === currentStatus);

  const updateStatus = async (newStatus) => {
    setSubmitting(true);
    const updatePayload = {
      verification_status: newStatus,
      verified: newStatus === 'approved'
    };
    
    const { error } = await db.pandits().update(updatePayload).eq('id', pandit.id);
    if (!error) {
      if (onUpdate) onUpdate(pandit.id, updatePayload);
    }
    setSubmitting(false);
  };

  return (
    <div className="verification-workflow-card card" style={{ padding: '20px', marginBottom: '15px', border: '1px solid rgba(212,160,23,.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ fontSize: '30px', background: '#FFFAF5', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pandit.emoji || "🕉️"}</div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{pandit.name}</h4>
            <div style={{ fontSize: '12px', color: '#8B6347' }}>{pandit.specialization} · {pandit.experience_years}y exp · {pandit.city}</div>
          </div>
        </div>
        <StatusBadge status={currentStatus} />
      </div>

      {/* Stepper UI */}
      <div className="workflow-stepper" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', position: 'relative', padding: '0 10px' }}>
        <div style={{ position: 'absolute', top: '15px', left: '40px', right: '40px', height: '2px', background: '#eee', zIndex: 0 }} />
        {STATUS_STEPS.map((step, idx) => {
          const isActive = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return (
            <div key={step.key} style={{ zIndex: 1, textAlign: 'center', flex: 1 }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 8px',
                background: isActive ? (step.key === 'rejected' ? '#FF5252' : '#FF6B00') : '#eee',
                color: isActive ? '#fff' : '#888',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', border: isCurrent ? '3px solid #FFD4A1' : 'none'
              }}>
                {isActive ? '✓' : idx + 1}
              </div>
              <div style={{ fontSize: '11px', fontWeight: isActive ? 800 : 500, color: isActive ? '#2C1A0E' : '#888' }}>{step.label}</div>
            </div>
          );
        })}
      </div>

      {/* Actions & Docs */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
        <button className="btn btn-outline btn-sm" onClick={() => setViewDocs(!viewDocs)}>
          {viewDocs ? "Hide Documents" : "View Documents"}
        </button>
        
        {currentStatus !== 'approved' && currentStatus !== 'rejected' && (
          <>
            <button className="btn btn-primary btn-sm" onClick={() => updateStatus('under_review')} disabled={submitting || currentStatus === 'under_review'}>
              Mark Under Review
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary btn-sm" style={{ background: '#00C853' }} onClick={() => updateStatus('approved')} disabled={submitting}>Approve</button>
              <button className="btn btn-outline btn-sm" style={{ borderColor: '#FF5252', color: '#FF5252' }} onClick={() => updateStatus('rejected')} disabled={submitting}>Reject</button>
            </div>
          </>
        )}
      </div>

      {viewDocs && (
        <div className="doc-preview-grid" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '15px', background: '#F9F9F9', borderRadius: '12px' }}>
          <div className="doc-card" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '10px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>Vedic Certification</strong>
              <span style={{ fontSize: '10px', color: '#00C853', fontWeight: 800 }}>✓ Verified</span>
            </div>
            <div style={{ height: '100px', background: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>📜</div>
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>Dated: 12/04/2018 · Kashi Vidyapeeth</div>
          </div>
          <div className="doc-card" style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '10px', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>Aadhar Identity</strong>
              <span style={{ fontSize: '10px', color: '#00C853', fontWeight: 800 }}>✓ Matching</span>
            </div>
            <div style={{ height: '100px', background: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>🪪</div>
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>ID: **** **** 4920 · Verified via Digilocker</div>
          </div>
        </div>
      )}
    </div>
  );
}
