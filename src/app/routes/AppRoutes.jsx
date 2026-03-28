import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';

// Layouts
import UserLayout from '../../layouts/UserLayout';
import PanditLayout from '../../layouts/PanditLayout';
import AdminLayout from '../../layouts/AdminLayout';

// Pages
import Landing from '../../pages/Landing';
import UserHome from '../../pages/devotee/UserHome';
import MuhuratPage from '../../pages/devotee/MuhuratPage';
import BookPandit from '../../pages/devotee/BookPandit';
import HistoryPage from '../../pages/devotee/HistoryPage';
import SevaPage from '../../pages/devotee/SevaPage';
import VirtualPoojaPage from '../../pages/devotee/VirtualPoojaPage';

// Pandit Pages
import PanditDashboard from '../../features/pandit-portal/pages/Dashboard';
import PanditReqPage from '../../pages/pandit/PanditReqPage';
import PanditProfilePage from '../../pages/pandit/PanditProfilePage';
import PanditEarningsPage from '../../pages/pandit/PanditEarningsPage';
import PanditAvailPage from '../../pages/pandit/PanditAvailPage';
import PanditOnboardingPage from '../../pages/pandit/PanditOnboardingPage';

// Admin Pages
import AdminHome from '../../pages/admin/AdminHome';
import AdminPanditList from '../../pages/admin/AdminPanditList';
import AdminRitualList from '../../pages/admin/AdminRitualList';
import AdminBookingList from '../../pages/admin/AdminBookingList';
import AdminTempleList from '../../pages/admin/AdminTempleList';
import AdminSamagriList from '../../pages/admin/AdminSamagriList';
import AdminPermissionPage from '../../pages/admin/AdminPermissionPage';
import SuperAdminLogin from '../../pages/admin/SuperAdminLogin';

// Feature Pages
import PanditMarketplacePage from '../../features/user-portal/pages/PanditMarketplacePage';
import BookingWizard from '../../features/user-portal/pages/BookingWizard';
import RitualCatalogPage from '../../features/user-portal/pages/RitualCatalogPage';
import InstantPanditBooking from '../../features/user-portal/pages/InstantPanditBooking';
import SamagriStorePage from '../../features/user-portal/pages/SamagriStorePage';
import TempleListPage from '../../features/user-portal/pages/TempleListPage';
import TemplePoojaBookingPage from '../../features/user-portal/pages/TemplePoojaBookingPage';
import ReferralPage from '../../features/user-portal/pages/ReferralPage';
import SankalpProfile from '../../features/user-portal/sankalp-engine/SankalpProfile';
import Roadmap from '../../pages/Roadmap';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const el = document.getElementById('main-content');
    if (el) el.scrollTop = 0;
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Devotee Routes */}
        <Route path="/user" element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/user/home" replace />} />
          <Route path="home" element={<UserHome />} />
          <Route path="muhurta" element={<MuhuratPage />} />
          <Route path="rituals" element={<RitualCatalogPage />} />
          <Route path="rituals-correct" element={<RitualCatalogPage />} />
          <Route path="instant-booking" element={<InstantPanditBooking />} />
          <Route path="marketplace" element={<PanditMarketplacePage />} />
          <Route path="booking" element={<BookingWizard />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="temples" element={<TempleListPage />} />
          <Route path="temples/book/:id" element={<TemplePoojaBookingPage />} />
          <Route path="sankalp" element={<SankalpProfile />} />
          <Route path="referral" element={<ReferralPage />} />
          <Route path="samagri" element={<SamagriStorePage />} />
          <Route path="donations" element={<SevaPage />} />
          <Route path="virtual-pooja" element={<VirtualPoojaPage />} />
          <Route path="roadmap" element={<Roadmap />} />
        </Route>

        {/* Pandit Onboarding (standalone, no sidebar layout) */}
        <Route path="/pandit/onboard" element={<PanditOnboardingPage />} />

        {/* Pandit Routes */}
        <Route path="/pandit" element={<ProtectedRoute role="pandit"><PanditLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/pandit/dashboard" replace />} />
          <Route path="dashboard" element={<PanditDashboard />} />
          <Route path="requests" element={<PanditReqPage />} />
          <Route path="history" element={<PanditReqPage propFilter="accepted" />} />
          <Route path="profile" element={<PanditProfilePage />} />
          <Route path="earnings" element={<PanditEarningsPage />} />
          <Route path="schedule" element={<PanditAvailPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview" element={<AdminHome />} />
          <Route path="pandits" element={<AdminPanditList />} />
          <Route path="rituals" element={<AdminRitualList />} />
          <Route path="bookings" element={<AdminBookingList />} />
          <Route path="temples" element={<AdminTempleList />} />
          <Route path="samagri" element={<AdminSamagriList />} />
          <Route path="settings" element={<AdminPermissionPage />} />
        </Route>

        {/* Super Admin Login — public standalone page */}
        <Route path="/admin-login" element={<SuperAdminLogin />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

