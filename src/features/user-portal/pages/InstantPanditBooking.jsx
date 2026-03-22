import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../store/AppCtx';
import { bookingApi } from '../../../api/bookingApi';
import { AvailablePanditList } from '../components/AvailablePanditList';
import { paymentService } from '../../../services/paymentService';
import { notificationService } from '../../../services/notificationService';
import { Spinner } from '../../../components/common/UIElements';

export default function InstantPanditBooking() {
  const { devoteeId, devoteeName, toast } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pandits, setPandits] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    city: '',
    address: '',
    language: 'Hindi',
    ritualType: '',
    duration: '1 Hour',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!formData.address || !formData.city) return toast("City and Address are required!", "⚠️");
    setLoading(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const results = await bookingApi.getNearestPandits(pos.coords.latitude, pos.coords.longitude, 10);
        if (results.length === 0) {
          const { data } = await bookingApi.getAvailablePandits(null, formData.city);
          setPandits(data || []);
        } else {
          setPandits(results);
        }
        setLoading(false);
        setStep(2);
      }, async () => {
        const { data } = await bookingApi.getAvailablePandits(null, formData.city);
        setPandits(data || []);
        setLoading(false);
        setStep(2);
      });
    } else {
      const { data } = await bookingApi.getAvailablePandits(null, formData.city);
      setPandits(data || []);
      setLoading(false);
      setStep(2);
    }
  };

  const handleBooking = async (pandit) => {
    setSubmitting(true);
    try {
      const payment = await paymentService.processPayment({
        amount: 501, 
        name: devoteeName,
        description: `Instant Booking with Pt. ${pandit.name}`
      });

      if (payment.success) {
        const payload = {
          ...formData,
          devoteeId,
          devoteeName,
          panditId: pandit.id,
          panditName: pandit.name,
          amount: 501,
          instantBooking: true,
          payment_id: payment.payment_id,
          payment_status: 'paid'
        };

        const { error } = await bookingApi.createBooking(payload);
        if (error) throw error;

        await notificationService.notifyPanditOfNewBooking(pandit.id, "Instant Consultation");
        toast("Instant Booking Confirmed! 🙏", "🕉️");
        navigate('/user/history');
      }
    } catch (err) {
      toast(err.message || "Booking Failed", "❌");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="instant-booking-container">
      <div className="wizard-card card" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
        {step === 1 && (
          <form onSubmit={handleSearch}>
            <h2 className="ph-title" style={{ color: '#F0C040' }}>Express Pandit Booking</h2>
            <p className="ph-sub">Need a priest immediately? Let us find the nearest scholar for you.</p>

            <div className="fgrid" style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 1fr', gap: '20px', marginTop: '30px' }}>
              <div className="fg">
                <label className="fl">City</label>
                <select className="fs" required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })}>
                  <option value="">Select City</option>
                  {["Kashi", "Delhi", "Mumbai", "Bangalore", "Ayodhya", "Agra", "Ujjain", "Haridwar", "Pune"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="fg">
                <label className="fl">Language Preference</label>
                <select className="fs" value={formData.language} onChange={e => setFormData({ ...formData, language: e.target.value })}>
                  {["Hindi", "Sanskrit", "English", "Marathi", "Gujarati", "Tamil", "Bengali"].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="fg ffw" style={{ gridColumn: 'span 2' }}>
                <label className="fl">Location (Full Address)</label>
                <textarea className="fta" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Where should Pt. Ji arrive?" />
              </div>
              <div className="fg">
                <label className="fl">Service Type (Optional)</label>
                <input className="fi" value={formData.ritualType} onChange={e => setFormData({ ...formData, ritualType: e.target.value })} placeholder="Ex: Grah Shanti, Bhoomi Pujan..." />
              </div>
              <div className="fg">
                <label className="fl">Estimated Duration</label>
                <select className="fs" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })}>
                  {["1 Hour", "2 Hours", "Half Day", "Full Day", "2+ Days"].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '40px', padding: '15px' }}>
              🕉️ Find Available Pandits Now
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="results-step">
            <h2 className="ph-title" style={{ color: '#F0C040' }}>Choose Your Scholar</h2>
            <p className="ph-sub">Found {pandits.length} nearby experts available for immediate booking.</p>
            <div style={{ marginTop: '30px' }}>
              <AvailablePanditList 
                pandits={pandits} 
                loading={loading} 
                onSelect={handleBooking} 
              />
            </div>
            <button className="btn btn-outline" style={{ marginTop: '30px' }} onClick={() => setStep(1)}>← Change Details</button>
          </div>
        )}
      </div>

      {submitting && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,107,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ textAlign: 'center' }}>
            <Spinner />
            <p style={{ marginTop: '15px', color: '#FF6B00', fontWeight: 800 }}>Securing Your Instant Booking...</p>
          </div>
        </div>
      )}
    </div>
  );
}
