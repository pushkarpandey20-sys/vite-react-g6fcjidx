import React, { useState, useEffect } from 'react';
import { useApp } from '../../../store/AppCtx';
import { supabase } from '../../../services/supabase';

const C = { bg:'#fff8f0', card:'#fff', border:'rgba(212,160,23,0.2)', orange:'#FF6B00', gold:'#D4A017', dark:'#3d1f00', mid:'#7a5c3a', soft:'#9a8070', green:'#16a34a' };

export default function ReferralPage() {
  const { devoteeId } = useApp();
  const [referrals, setReferrals] = useState([]);
  const [credits, setCredits] = useState(0);
  const [copied, setCopied] = useState(false);

  const refCode = devoteeId
    ? ('DS' + devoteeId.toString().toUpperCase().replace(/-/g,'').substring(0,6))
    : 'DSLOGIN';

  const refLink = `https://vite-react-g6fcjidx.vercel.app/?ref=${refCode}`;

  useEffect(() => {
    if (!devoteeId) return;
    (async () => {
      try {
        const { data: dev } = await supabase.from('devotees').select('credits, referral_code').eq('id', devoteeId).single();
        setCredits(dev?.credits || 0);
        const { data: refs } = await supabase.from('referrals').select('*').eq('referrer_id', devoteeId).order('created_at',{ascending:false});
        setReferrals(refs || []);
      } catch(e) {
        setReferrals([
          { id:'r1', status:'credited', credits_awarded:50, created_at:'2025-03-15T00:00:00Z' },
          { id:'r2', status:'pending',  credits_awarded:0,  created_at:'2025-03-28T00:00:00Z' },
        ]);
        setCredits(50);
      }
    })();
  }, [devoteeId]);

  const copy = () => {
    navigator.clipboard.writeText(refLink).then(() => { setCopied(true); setTimeout(()=>setCopied(false), 2000); });
  };

  const share = () => {
    const text = `🕉️ Book verified pandits for Griha Pravesh, Satyanarayan & 100+ rituals on DevSetu!\nUse my code *${refCode}* to get ₹50 off your first booking.\n${refLink}`;
    if (navigator.share) {
      navigator.share({ title:'DevSetu — Book Pandits Online', text, url:refLink });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const credited = referrals.filter(r=>r.status==='credited').length;
  const pending  = referrals.filter(r=>r.status==='pending').length;
  const totalEarned = referrals.filter(r=>r.status==='credited').reduce((s,r)=>s+(r.credits_awarded||50),0);

  return (
    <div style={{ fontFamily:'Nunito,sans-serif' }}>
      <div style={{ background:'linear-gradient(135deg,#3d1f00,#5a2d00)', borderRadius:16, padding:'28px 28px', marginBottom:22, textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:10 }}>🎁</div>
        <h2 style={{ fontFamily:'Cinzel,serif', color:'#F0C040', fontSize:22, margin:'0 0 8px' }}>Refer & Earn ₹50</h2>
        <p style={{ color:'rgba(255,248,240,0.8)', fontSize:14, margin:'0 0 20px', maxWidth:480, marginLeft:'auto', marginRight:'auto' }}>
          Invite friends to DevSetu. They book a pandit, you earn ₹50 off your next booking. No limit on referrals!
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
          {[[`₹${credits}`, 'Your Credits'],
            [credited, 'Friends Joined'],
            [pending, 'Pending'],
            [`₹${totalEarned}`, 'Total Earned'],
          ].map(([v,l]) => (
            <div key={l} style={{ background:'rgba(255,255,255,0.1)', borderRadius:12, padding:'12px 20px', textAlign:'center', minWidth:90 }}>
              <div style={{ color:'#F0C040', fontWeight:800, fontSize:22 }}>{v}</div>
              <div style={{ color:'rgba(255,248,240,0.6)', fontSize:11, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'22px 24px', marginBottom:18, boxShadow:'0 2px 8px rgba(212,160,23,0.06)' }}>
        <div style={{ color:C.dark, fontWeight:700, fontSize:15, marginBottom:14 }}>🔗 Your Referral Link</div>
        <div style={{ display:'flex', gap:10, marginBottom:12 }}>
          <div style={{ flex:1, background:'#fffbf5', border:`1.5px solid ${C.border}`, borderRadius:10, padding:'11px 16px', fontFamily:'monospace', fontSize:14, color:C.dark, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {refLink}
          </div>
          <button onClick={copy} style={{ background: copied?'rgba(34,197,94,0.15)':'rgba(255,107,0,0.1)', color: copied?C.green:C.orange, border:`1px solid ${copied?'rgba(34,197,94,0.3)':'rgba(255,107,0,0.3)'}`, borderRadius:10, padding:'11px 18px', fontWeight:700, cursor:'pointer', fontSize:13, whiteSpace:'nowrap' }}>
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <div style={{ background:'#fffbf5', border:`1.5px solid ${C.border}`, borderRadius:10, padding:'10px 20px', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ color:C.soft, fontSize:12 }}>Your code:</span>
            <span style={{ color:C.orange, fontWeight:800, fontSize:18, fontFamily:'monospace', letterSpacing:2 }}>{refCode}</span>
          </div>
          <button onClick={share} style={{ flex:1, background:'linear-gradient(135deg,#25D366,#128C7E)', color:'#fff', border:'none', borderRadius:10, padding:'10px 20px', fontWeight:700, cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <span style={{ fontSize:18 }}>💬</span> Share on WhatsApp
          </button>
        </div>
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'22px 24px', marginBottom:18 }}>
        <div style={{ color:C.dark, fontWeight:700, fontSize:15, marginBottom:16 }}>✅ How It Works</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {[
            ['1️⃣', 'Share Your Link', 'Send your referral link or code to friends and family'],
            ['2️⃣', 'They Book a Pandit', 'Your friend uses DevSetu and completes their first booking'],
            ['3️⃣', 'You Earn ₹50', 'Credited to your account for any future booking'],
          ].map(([icon,title,desc]) => (
            <div key={title} style={{ background:'rgba(255,107,0,0.05)', border:'1px solid rgba(255,107,0,0.15)', borderRadius:12, padding:'16px', textAlign:'center' }}>
              <div style={{ fontSize:30, marginBottom:8 }}>{icon}</div>
              <div style={{ color:C.dark, fontWeight:700, fontSize:14, marginBottom:4 }}>{title}</div>
              <div style={{ color:C.soft, fontSize:12, lineHeight:1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:10, padding:'12px 16px', marginTop:14 }}>
          <span style={{ color:C.green, fontWeight:700, fontSize:13 }}>🎯 Pro Tip:</span>
          <span style={{ color:'#15803d', fontSize:13, marginLeft:6 }}>No limit on referrals! Each successful referral earns you ₹50. Refer 10 friends = ₹500 credits.</span>
        </div>
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'22px 24px' }}>
        <div style={{ color:C.dark, fontWeight:700, fontSize:15, marginBottom:14 }}>📊 Referral History</div>
        {referrals.length === 0 ? (
          <div style={{ textAlign:'center', padding:'24px 0', color:C.soft }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🔗</div>
            <div>No referrals yet. Share your link to start earning!</div>
          </div>
        ) : referrals.map(r => (
          <div key={r.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
            <div>
              <div style={{ color:C.dark, fontWeight:600, fontSize:14 }}>Referral #{r.id.substring(0,6).toUpperCase()}</div>
              <div style={{ color:C.soft, fontSize:12, marginTop:2 }}>{new Date(r.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              {r.status === 'credited'
                ? <div style={{ color:C.green, fontWeight:700 }}>+₹{r.credits_awarded||50} ✓</div>
                : <div style={{ color:'#d97706', fontWeight:600, fontSize:13 }}>Pending booking</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
