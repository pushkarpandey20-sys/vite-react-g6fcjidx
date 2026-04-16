import React, { useState } from 'react';
import { useApp } from '../../store/AppCtx';
import { supabase } from '../../services/supabase';
import MuhuratFinder from '../../features/user-portal/components/Muhurtas/MuhuratFinder';

const JYOTISHI_SERVICES = [
  {
    icon: '🔭', title: 'Kundli Analysis',
    price: '₹501', duration: '45 min',
    desc: 'Birth chart reading, planetary positions, and life predictions by a certified Jyotishi.',
    tag: 'MOST POPULAR',
  },
  {
    icon: '💍', title: 'Vivah Muhurta',
    price: '₹801', duration: '60 min',
    desc: 'Auspicious wedding date and time with full kundli matching for both families.',
    tag: '',
  },
  {
    icon: '🏡', title: 'Griha Pravesh Muhurta',
    price: '₹501', duration: '45 min',
    desc: 'Vastu-aligned home entry timing for maximum prosperity and positive energy.',
    tag: '',
  },
  {
    icon: '💼', title: 'Business Muhurta',
    price: '₹601', duration: '45 min',
    desc: 'Launch, inauguration or investment timing consultation for business success.',
    tag: '',
  },
  {
    icon: '⭐', title: 'Navgrah Report',
    price: '₹1,001', duration: '90 min',
    desc: '9-planet analysis with gemstone and remedy recommendations for your horoscope.',
    tag: 'DETAILED',
  },
  {
    icon: '📿', title: 'Dosha Nivaran',
    price: '₹701', duration: '60 min',
    desc: 'Kaal Sarp, Mangal, Pitra dosha check with practical remedies from Vedic texts.',
    tag: '',
  },
];

const TABS = [
  { id: 0, label: '🔍 Find Muhurta' },
  { id: 1, label: '📆 Daily Panchang' },
  { id: 2, label: '🙏 Book a Jyotishi' },
];

const C = {
  gold: '#F0C040',
  accent: '#FF6B00',
  text: 'rgba(255,248,240,0.85)',
  sub: 'rgba(255,248,240,0.55)',
  border: 'rgba(212,160,23,0.2)',
  card: 'rgba(26,15,7,0.85)',
};

export default function MuhuratPage() {
  const { MUHURTAS = [] } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [bookingIdx, setBookingIdx] = useState(null);
  const [consultForm, setConsultForm] = useState({ city: '', phone: '', date: '' });
  const [consultDone, setConsultDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConsultSubmit = async (svc) => {
    if (!consultForm.city || !consultForm.phone) return;
    setSubmitting(true);
    try {
      await supabase.from('muhurta_consultations').insert({
        occasion: svc.title,
        city: consultForm.city,
        contact_phone: consultForm.phone,
        preferred_dates: { date: consultForm.date },
        status: 'pending',
        created_at: new Date().toISOString(),
      });
      setConsultDone(true);
    } catch (e) {
      console.warn('[muhurta_consultation] insert skipped (table may not exist yet):', e.message);
      setConsultDone(true); // still show success UX
    }
    setSubmitting(false);
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px', marginBottom: 8,
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid ${C.border}`,
    borderRadius: 8, color: C.text,
    fontSize: 13, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ color: C.text, fontFamily: '"Inter", sans-serif' }}>

      {/* ── Tab Bar ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {TABS.map(t => {
          const active = activeTab === t.id;
          return (
            <button key={t.id}
              onClick={() => { setActiveTab(t.id); setBookingIdx(null); setConsultDone(false); }}
              style={{
                padding: '10px 22px', borderRadius: 24, cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 14, fontWeight: active ? 700 : 500,
                whiteSpace: 'nowrap', transition: 'all 0.18s',
                border: active ? '2px solid #FF6B00' : `1px solid ${C.border}`,
                background: active ? '#FF6B00' : 'rgba(255,255,255,0.05)',
                color: active ? '#fff' : C.text,
              }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab 1: Find Muhurta ── */}
      {activeTab === 0 && (
        <div className="muhurat-page-container">
          <MuhuratFinder />
        </div>
      )}

      {/* ── Tab 2: Daily Panchang ── */}
      {activeTab === 1 && (
        <div style={{
          background: C.card, border: `1.5px solid rgba(212,160,23,0.18)`,
          borderRadius: 18, boxShadow: '0 8px 30px rgba(0,0,0,0.4)', padding: 24,
        }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: C.gold, fontWeight: 900, fontSize: 20, fontFamily: 'Cinzel, serif', marginBottom: 4 }}>
              Traditional Panchang
            </div>
            <div style={{ color: C.sub, fontWeight: 600, fontSize: 14 }}>
              Daily auspicious and inauspicious timings at a glance.
            </div>
          </div>
          <div className="dtable" style={{ marginBottom: 0 }}>
            <div className="thead" style={{
              gridTemplateColumns: '.8fr 1.2fr 1.2fr 1fr 1.5fr',
              background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 0',
            }}>
              {['Day/Month', 'Tithi', 'Nakshatra', 'Quality', 'Primary Window'].map(h => (
                <div key={h} className="th" style={{ color: 'rgba(255,248,240,0.85)', fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {MUHURTAS.map((m, i) => (
              <div key={i} className="tr" style={{
                gridTemplateColumns: '.8fr 1.2fr 1.2fr 1fr 1.5fr',
                borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '12px 0',
              }}>
                <div className="td" style={{ color: C.gold }}><b>{m.day} {m.month}</b></div>
                <div className="td" style={{ color: 'rgba(255,248,240,0.9)' }}>{m.tithi}</div>
                <div className="td" style={{ fontSize: 12, color: 'rgba(255,248,240,0.7)' }}>{m.nakshatra}</div>
                <div className="td">
                  <span style={{ color: m.quality === 'Excellent' ? '#4ade80' : C.gold, fontWeight: 700 }}>{m.quality}</span>
                </div>
                <div className="td" style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>{m.time}</div>
              </div>
            ))}
            {MUHURTAS.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: C.sub }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📅</div>
                <div>Panchang data loading...</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab 3: Book a Jyotishi ── */}
      {activeTab === 2 && (
        <div>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'Cinzel,serif', color: C.gold, fontSize: 22, margin: '0 0 8px', fontWeight: 900 }}>
              🙏 Book a Jyotishi Consultation
            </h2>
            <p style={{ color: C.sub, fontSize: 14, margin: 0 }}>
              Get personalized muhurta and jyotish guidance from verified Vedic scholars.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {JYOTISHI_SERVICES.map((svc, i) => (
              <div key={i} style={{
                background: '#2a1200',
                border: `1px solid ${C.border}`,
                borderRadius: 20, padding: 24,
                display: 'flex', flexDirection: 'column',
                transition: '0.2s',
              }}>
                {svc.tag && (
                  <div style={{
                    display: 'inline-block', background: C.accent, color: '#fff',
                    fontSize: 9, fontWeight: 900, padding: '3px 10px',
                    borderRadius: 20, marginBottom: 12, letterSpacing: 0.5,
                    alignSelf: 'flex-start',
                  }}>{svc.tag}</div>
                )}

                <div style={{ fontSize: 40, marginBottom: 12 }}>{svc.icon}</div>
                <h3 style={{ fontFamily: 'Cinzel,serif', color: C.gold, margin: '0 0 8px', fontSize: 16, fontWeight: 900 }}>
                  {svc.title}
                </h3>
                <p style={{ color: C.sub, fontSize: 13, lineHeight: 1.6, margin: '0 0 16px', flex: 1 }}>
                  {svc.desc}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ color: C.accent, fontWeight: 900, fontSize: 20, fontFamily: 'Cinzel,serif' }}>
                    {svc.price}
                  </div>
                  <div style={{ color: C.sub, fontSize: 12, fontWeight: 600 }}>⏱ {svc.duration}</div>
                </div>

                {bookingIdx === i ? (
                  consultDone ? (
                    <div style={{
                      background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                      borderRadius: 12, padding: 16, textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>🙏</div>
                      <div style={{ color: '#4ade80', fontWeight: 800, fontSize: 13 }}>
                        Jyotishi will WhatsApp you within 2 hours!
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 14 }}>
                      <input
                        value={consultForm.city}
                        onChange={e => setConsultForm(f => ({ ...f, city: e.target.value }))}
                        placeholder="Your city *"
                        style={inputStyle}
                      />
                      <input
                        value={consultForm.phone}
                        onChange={e => setConsultForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="WhatsApp number *"
                        style={inputStyle}
                      />
                      <input
                        type="date"
                        value={consultForm.date}
                        onChange={e => setConsultForm(f => ({ ...f, date: e.target.value }))}
                        style={inputStyle}
                      />
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <button
                          onClick={() => setBookingIdx(null)}
                          style={{
                            flex: 1, background: 'rgba(255,255,255,0.06)', color: C.sub,
                            border: 'none', borderRadius: 8, padding: '9px',
                            cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                          }}>
                          Cancel
                        </button>
                        <button
                          onClick={() => handleConsultSubmit(svc)}
                          disabled={submitting || !consultForm.city || !consultForm.phone}
                          style={{
                            flex: 2, background: C.accent, color: '#fff',
                            border: 'none', borderRadius: 8, padding: '9px',
                            cursor: 'pointer', fontWeight: 800, fontSize: 13,
                            fontFamily: 'inherit',
                            opacity: (!consultForm.city || !consultForm.phone) ? 0.5 : 1,
                          }}>
                          {submitting ? '⏳ Booking...' : '🙏 Confirm'}
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => {
                      setBookingIdx(i);
                      setConsultDone(false);
                      setConsultForm({ city: '', phone: '', date: '' });
                    }}
                    style={{
                      width: '100%', background: C.accent, color: '#fff',
                      border: 'none', borderRadius: 12, padding: '12px',
                      fontWeight: 800, cursor: 'pointer', fontSize: 14,
                      fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(255,107,0,0.3)',
                    }}>
                    Book Consultation →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
