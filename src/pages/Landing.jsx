import { useNavigate } from 'react-router-dom';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Pro:ital,wght@0,400;1,400&family=Nunito:wght@400;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Nunito',sans-serif;}
:root{--s:#FF6B00;--g:#D4A017;--gl:#F0C040;}
@keyframes glow{0%,100%{box-shadow:0 0 10px rgba(255,107,0,.4);}50%{box-shadow:0 0 32px rgba(255,107,0,.9),0 0 56px rgba(212,160,23,.5);}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
.land{min-height:100vh;background:radial-gradient(ellipse at top,#2c1a0e 0%,#0d0700 60%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;position:relative;overflow:hidden;}
.land::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A017' fill-opacity='0.04'%3E%3Cpath d='M30 0L60 30L30 60L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");pointer-events:none;}
.hero{text-align:center;animation:fadeUp .8s ease;position:relative;z-index:1;}
.hero-icon{font-size:80px;animation:float 4s ease-in-out infinite,glow 3s ease-in-out infinite;display:inline-block;margin-bottom:24px;}
.hero-title{font-family:'Cinzel',serif;font-size:52px;font-weight:900;background:linear-gradient(135deg,#FF6B00,#F0C040,#FF6B00);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:8px;letter-spacing:2px;}
.hero-subtitle{font-family:'Crimson Pro',serif;font-style:italic;color:rgba(255,248,240,.5);font-size:18px;margin-bottom:48px;letter-spacing:1px;}
.portal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:860px;width:100%;animation:fadeUp 1s ease .2s both;}
.pcard{background:rgba(255,255,255,.035);border:1px solid rgba(212,160,23,.2);border-radius:22px;padding:36px 24px;text-align:center;cursor:pointer;transition:all .35s;text-decoration:none;display:block;position:relative;overflow:hidden;}
.pcard::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,107,0,.06),rgba(212,160,23,.03));opacity:0;transition:opacity .35s;}
.pcard:hover{border-color:rgba(255,107,0,.6);transform:translateY(-10px);box-shadow:0 24px 60px rgba(255,107,0,.2);}
.pcard:hover::before{opacity:1;}
.pcard-icon{font-size:52px;margin-bottom:16px;display:block;transition:transform .3s;}
.pcard:hover .pcard-icon{transform:scale(1.15);}
.pcard-title{font-family:'Cinzel',serif;color:#F0C040;font-size:19px;font-weight:700;margin-bottom:8px;}
.pcard-desc{color:rgba(255,248,240,.45);font-size:12.5px;font-family:'Crimson Pro',serif;font-style:italic;line-height:1.6;margin-bottom:20px;}
.pcard-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 22px;border-radius:28px;font-size:12px;font-weight:800;letter-spacing:.4px;transition:all .2s;}
.p-devotee .pcard-btn{background:linear-gradient(135deg,#FF6B00,#FF8C35);color:#fff;box-shadow:0 4px 14px rgba(255,107,0,.3);}
.p-pandit .pcard-btn{background:linear-gradient(135deg,#D4A017,#F0C040);color:#1a0f07;}
.p-admin .pcard-btn{background:linear-gradient(135deg,#2980B9,#3498db);color:#fff;box-shadow:0 4px 14px rgba(41,128,185,.3);}
.pcard:hover .pcard-btn{transform:scale(1.05);}
.footer-note{color:rgba(255,248,240,.2);font-size:11px;margin-top:40px;letter-spacing:1px;font-family:'Cinzel',serif;}
@media(max-width:640px){.portal-grid{grid-template-columns:1fr;}.hero-title{font-size:34px;}}
`;

const portals = [
  {
    cls: 'p-devotee',
    icon: '🙏',
    title: 'Devotee Portal',
    desc: 'Book pandits, explore muhurtas, temple poojas & samagri',
    btn: '✨ Enter as Devotee',
    path: '/user',
  },
  {
    cls: 'p-pandit',
    icon: '🕉️',
    title: 'Pandit Portal',
    desc: 'Manage bookings, earnings, schedule & your pandit profile',
    btn: '🪔 Enter as Pandit',
    path: '/pandit',
  },
  {
    cls: 'p-admin',
    icon: '⚙️',
    title: 'Admin Portal',
    desc: 'Platform management with full role-based access control',
    btn: '🔐 Admin Login',
    path: '/admin',
  },
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <>
      <style>{S}</style>
      <div className="land">
        <div className="hero">
          <span className="hero-icon">🕉️</span>
          <div className="hero-title">DevSetu</div>
          <div className="hero-subtitle">Bridge to Divine Services — Choose Your Portal</div>
          <div className="portal-grid">
            {portals.map(p => (
              <div key={p.path} className={`pcard ${p.cls}`} onClick={() => navigate(p.path)}>
                <span className="pcard-icon">{p.icon}</span>
                <div className="pcard-title">{p.title}</div>
                <div className="pcard-desc">{p.desc}</div>
                <span className="pcard-btn">{p.btn}</span>
              </div>
            ))}
          </div>
          <div className="footer-note">🕉️ &nbsp; Yatra Dharma, tatra Vijaya &nbsp; 🕉️</div>
        </div>
      </div>
    </>
  );
}
