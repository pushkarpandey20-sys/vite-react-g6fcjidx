import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Layouts
const UserLayout = lazy(() => import('../../layouts/UserLayout'));
const PanditLayout = lazy(() => import('../../layouts/PanditLayout'));
const AdminLayout = lazy(() => import('../../layouts/AdminLayout'));

// Pages
const Landing = lazy(() => import('../../pages/Landing'));
const UserHome = lazy(() => import('../../pages/devotee/UserHome'));
const MuhuratPage = lazy(() => import('../../pages/devotee/MuhuratPage'));
const HistoryPage = lazy(() => import('../../pages/devotee/HistoryPage'));
const SevaPage = lazy(() => import('../../pages/devotee/SevaPage'));
const VirtualPoojaPage = lazy(() => import('../../pages/devotee/VirtualPoojaPage'));

// Pandit Pages
const PanditDashboard = lazy(() => import('../../features/pandit-portal/pages/Dashboard'));
const PanditReqPage = lazy(() => import('../../pages/pandit/PanditReqPage'));
const PanditProfilePage = lazy(() => import('../../pages/pandit/PanditProfilePage'));
const PanditEarningsPage = lazy(() => import('../../pages/pandit/PanditEarningsPage'));
const PanditAvailPage = lazy(() => import('../../pages/pandit/PanditAvailPage'));
const PanditOnboardingPage = lazy(() => import('../../pages/pandit/PanditOnboardingPage'));

// Admin Pages
const AdminHome = lazy(() => import('../../pages/admin/AdminHome'));
const AdminPanditList = lazy(() => import('../../pages/admin/AdminPanditList'));
const AdminRitualList = lazy(() => import('../../pages/admin/AdminRitualList'));
const AdminBookingList = lazy(() => import('../../pages/admin/AdminBookingList'));
const AdminTempleList = lazy(() => import('../../pages/admin/AdminTempleList'));
const AdminSamagriList = lazy(() => import('../../pages/admin/AdminSamagriList'));
const AdminPermissionPage = lazy(() => import('../../pages/admin/AdminPermissionPage'));
const SuperAdminLogin = lazy(() => import('../../pages/admin/SuperAdminLogin'));

// Feature Pages
const PanditMarketplacePage = lazy(() => import('../../features/user-portal/pages/PanditMarketplacePage'));
const BookingWizard = lazy(() => import('../../features/user-portal/pages/BookingWizard'));
const RitualCatalogPage = lazy(() => import('../../features/user-portal/pages/RitualCatalogPage'));
const InstantPanditBooking = lazy(() => import('../../features/user-portal/pages/InstantPanditBooking'));
const SamagriStorePage = lazy(() => import('../../features/user-portal/pages/SamagriStorePage'));
const TempleListPage = lazy(() => import('../../features/user-portal/pages/TempleListPage'));
const TemplePoojaBookingPage = lazy(() => import('../../features/user-portal/pages/TemplePoojaBookingPage'));
const ReferralPage = lazy(() => import('../../features/user-portal/pages/ReferralPage'));
const SankalpProfile = lazy(() => import('../../features/user-portal/sankalp-engine/SankalpProfile'));
const Roadmap = lazy(() => import('../../pages/Roadmap'));

function RouteLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#120B08', color: 'rgba(255,248,240,0.82)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, letterSpacing: 1.2, textTransform: 'uppercase', color: '#F0C040', marginBottom: 10 }}>DevSetu</div>
        <div style={{ fontSize: 15 }}>Loading experience...</div>
      </div>
    </div>
  );
}

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
    <Suspense fallback={<RouteLoader />}>
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* Devotee Routes — public, no login required to browse */}
          <Route path="/user" element={<UserLayout />}>
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

          {/* Pandit Routes — public; dashboard shows login UI when not authed */}
          <Route path="/pandit" element={<PanditLayout />}>
            <Route index element={<Navigate to="/pandit/dashboard" replace />} />
            <Route path="dashboard" element={<PanditDashboard />} />
            <Route path="requests" element={<PanditReqPage />} />
            <Route path="history" element={<PanditReqPage propFilter="accepted" />} />
            <Route path="profile" element={<PanditProfilePage />} />
            <Route path="earnings" element={<PanditEarningsPage />} />
            <Route path="schedule" element={<PanditAvailPage />} />
          </Route>

          {/* Admin Routes — AdminLayout handles its own auth */}
          <Route path="/admin" element={<AdminLayout />}>
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
    </Suspense>
  );
}
