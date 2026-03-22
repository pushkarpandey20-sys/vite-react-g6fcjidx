import { useLocation, Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';
import { UserSidebar } from '../components/Sidebar';
import NotificationOverlay from '../components/NotificationOverlay';

export default function UserLayout() {
  const location = useLocation();
  const path = location.pathname;

  let title = "DevSetu Devotee";
  let sub = "Your spiritual companion in the digital age";

  if (path.includes('muhurta')) { title = "Panchang & Muhurtas"; sub = "Auspicious timings for your sacred rituals"; }
  else if (path.includes('booking')) { title = "Book a Pandit"; sub = "Certified Vedic scholars for your home or temple"; }
  else if (path.includes('history')) { title = "My Sacred Journey"; sub = "Track your ritual history and upcoming poojas"; }
  else if (path.includes('temples')) { title = "Sacred Temples"; sub = "Connect with divine energies across Bharat"; }
  else if (path.includes('samagri')) { title = "Pooja Samagri"; sub = "Complete ritual kits delivered to your doorstep"; }
  else if (path.includes('donations')) { title = "Seva & Donations"; sub = "Support sacred traditions and earn divine blessings"; }

  return (
    <MainLayout sidebar={<UserSidebar />}>
      <header className="ph" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="ph-title">{title}</h1>
          <p className="ph-sub">{sub}</p>
        </div>
        <NotificationOverlay />
      </header>
      <main className="cb">
        <Outlet />
      </main>
    </MainLayout>
  );
}


