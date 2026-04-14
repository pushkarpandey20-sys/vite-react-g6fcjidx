import { useLocation, Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';
import { UserSidebar } from '../components/Sidebar';
import MobileNav from '../components/MobileNav';

export default function UserLayout() {
  const location = useLocation();
  const path = location.pathname;

  let title = "BhaktiGo Devotee";
  let sub = "Your spiritual companion in the digital age";

  if (path.includes('muhurta')) { title = "Panchang & Muhurtas"; sub = "Auspicious timings for your sacred rituals"; }
  else if (path.includes('instant-booking')) { title = "Instant Pandit Booking"; sub = "Book a certified scholar in under 60 seconds"; }
  else if (path.includes('marketplace')) { title = "Find Pandits"; sub = "Browse certified Vedic scholars near you"; }
  else if (path.includes('booking')) { title = "Book a Pandit"; sub = "Certified Vedic scholars for your home or temple"; }
  else if (path.includes('history')) { title = "My Sacred Journey"; sub = "Track your ritual history and upcoming poojas"; }
  else if (path.includes('temples')) { title = "Sacred Temples"; sub = "Connect with divine energies across Bharat"; }
  else if (path.includes('samagri')) { title = "Pooja Samagri"; sub = "Complete ritual kits delivered to your doorstep"; }
  else if (path.includes('donations')) { title = "Seva & Donations"; sub = "Support sacred traditions and earn divine blessings"; }
  else if (path.includes('rituals')) { title = "Ritual Catalog"; sub = "Explore hundreds of sacred rituals and poojas"; }
  else if (path.includes('sankalp')) { title = "Sankalp Profile"; sub = "Set your spiritual intentions and goals"; }
  else if (path.includes('referral')) { title = "Referral Program"; sub = "Invite friends and earn divine rewards"; }
  else if (path.includes('virtual-pooja')) { title = "Virtual Pooja"; sub = "Participate in sacred rituals from anywhere"; }
  else if (path.includes('roadmap')) { title = "Product Roadmap"; sub = "See where BhaktiGo is headed"; }

  return (
    <MainLayout sidebar={<UserSidebar />} portalLabel="🙏 Devotee Portal" portalColor="#FF6B00">
      <header className="ph" style={{
        background: 'linear-gradient(135deg, rgba(61,31,0,0.95) 0%, rgba(26,10,0,0.9) 100%)',
        borderBottom: '1px solid rgba(255,107,0,0.2)',
        padding: '20px 24px',
        position: 'relative',
        zIndex: 5
      }}>
        <h1 className="ph-title" style={{ fontFamily:'Cinzel, serif', color:'#F0C040', fontWeight:900, fontSize:24, marginBottom:4 }}>{title}</h1>
        <p className="ph-sub" style={{ color:'rgba(255,248,240,0.6)', fontSize:14, fontWeight:600, margin:0 }}>{sub}</p>
      </header>
      <main className="cb ds-user-content" style={{ paddingBottom: 80 }}>
        <Outlet />
      </main>
      <MobileNav />
    </MainLayout>
  );
}
