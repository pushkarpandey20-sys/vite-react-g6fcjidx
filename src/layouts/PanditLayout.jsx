import { Outlet, useLocation } from 'react-router-dom';
import MainLayout from './MainLayout';
import { PanditSidebar } from '../components/Sidebar';
import NotificationOverlay from '../components/NotificationOverlay';

export default function PanditLayout() {
  const location = useLocation();
  const path = location.pathname;

  let title = "Pandit Dashboard";
  let sub = "Namaste Pt. Ji! Manage your sacred duties";

  if (path.includes('requests')) { title = "Service Requests"; sub = "Manage incoming pooja and ritual requests"; }
  else if (path.includes('profile')) { title = "Pandit Profile"; sub = "Showcase your Vedic expertise to the world"; }
  else if (path.includes('earnings')) { title = "Earnings & Dakshina"; sub = "Track your spiritual services income"; }
  else if (path.includes('schedule')) { title = "My Schedule"; sub = "Set your weekly availability for rituals"; }
  else if (path.includes('history')) { title = "Booking History"; sub = "Log of all successfully performed rituals"; }

  return (
    <MainLayout sidebar={<PanditSidebar />}>
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


