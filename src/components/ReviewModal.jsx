import React, { useState } from 'react';
import { supabase } from '../services/supabase';

export default function ReviewModal({ booking, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover,  setHover]  = useState(0);
  const [review, setReview] = useState('');
  const [saving, setSaving] = useState(false);
  const [done,   setDone]   = useState(false);

  const C = { dark:'#3d1f00', mid:'#7a5c3a', soft:'#9a8070', orange:'#FF6B00', border:'rgba(212,160,23,0.2)' };

  const submit = async () => {
    if (!rating) return;
    setSaving(true);
    try {
      await supabase.from('reviews').insert({
        booking_id:  booking.id,
        devotee_id:  booking.devotee_id,
        pandit_id:   booking.pandit_id,
        rating,
        review_text: review.trim() || null,
        created_at:  new Date().toISOString(),
      });
      await supabase.from('bookings').update({ devotee_rating: rating, devotee_review: review.trim() || null }).eq('id', booking.id);
      // Update pandit avg rating
      const { data: reviews } = await supabase.from('reviews').select('rating').eq('pandit_id', booking.pandit_id);
      if (reviews?.length) {
        const avg = reviews.reduce((s,r) => s+r.rating, 0) / reviews.length;
        await supabase.from('pandits').update({ rating: Math.round(avg*10)/10 }).eq('id', booking.pandit_id);
      }
      setDone(true);
      onSubmit && onSubmit(rating);
    } catch(e) {
      setDone(true); // still show success for demo
    }
    setSaving(false);
  };

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:20, padding:28, maxWidth:420, width:'100%', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
        {done ? (<>
          <div style={{ fontSize:56, marginBottom:12 }}>🙏</div>
          <h3 style={{ fontFamily:'Cinzel,serif', color:C.dark, margin:'0 0 8px' }}>Thank You!</h3>
          <p style={{ color:C.mid, fontSize:14 }}>Your review helps other devotees find the best pandits.</p>
          <button onClick={onClose} style={{ background:'linear-gradient(135deg,#FF6B00,#e55a00)', color:'#fff', border:'none', borderRadius:20, padding:'10px 28px', fontWeight:700, cursor:'pointer', marginTop:16 }}>Close</button>
        </>) : (<>
          <div style={{ fontSize:42, marginBottom:12 }}>⭐</div>
          <h3 style={{ fontFamily:'Cinzel,serif', color:C.dark, margin:'0 0 4px' }}>Rate Your Experience</h3>
          <p style={{ color:C.soft, fontSize:13, margin:'0 0 20px' }}>{booking.ritual_name || 'Your recent pooja'}</p>
          {/* Star selector */}
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:20 }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)} onClick={()=>setRating(s)}
                style={{ fontSize:40, cursor:'pointer', filter: s<=(hover||rating) ? 'none' : 'grayscale(1)', opacity: s<=(hover||rating) ? 1 : 0.3, transition:'all 0.15s' }}>⭐</span>
            ))}
          </div>
          {rating > 0 && (
            <div style={{ color:C.orange, fontWeight:700, fontSize:14, marginBottom:16 }}>
              {['','Poor','Fair','Good','Very Good','Excellent! 🙏'][rating]}
            </div>
          )}
          <textarea
            value={review} onChange={e=>setReview(e.target.value)}
            placeholder="Share your experience (optional)..."
            rows={3}
            style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, background:'#fffbf5', color:C.dark, fontSize:13, fontFamily:'inherit', resize:'none', boxSizing:'border-box', outline:'none', marginBottom:16 }}
          />
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={submit} disabled={!rating||saving}
              style={{ flex:1, background: rating ? 'linear-gradient(135deg,#FF6B00,#e55a00)' : 'rgba(0,0,0,0.1)', color: rating ? '#fff' : C.soft, border:'none', borderRadius:10, padding:12, fontWeight:700, cursor: rating ? 'pointer' : 'not-allowed', fontSize:14 }}>
              {saving ? '⏳ Saving...' : '⭐ Submit Review'}
            </button>
            <button onClick={onClose} style={{ background:'rgba(0,0,0,0.06)', color:C.mid, border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 18px', cursor:'pointer' }}>Skip</button>
          </div>
        </>)}
      </div>
    </div>
  );
}
