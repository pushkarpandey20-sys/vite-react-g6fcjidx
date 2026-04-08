import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './store/AppProvider';
import AppRoutes from './app/routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import './assets/styles/globals.css';
import { initNotifications } from './services/notificationService';

// Sentry error monitoring (no-op if DSN is not set)
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
if (SENTRY_DSN && !SENTRY_DSN.startsWith('your_')) {
  import('@sentry/react').then(Sentry => {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: import.meta.env.VITE_APP_ENV || 'production',
      tracesSampleRate: 0.2,
      replaysOnErrorSampleRate: 1.0,
    });
  });
}

initNotifications();

// ── Register Service Worker for PWA ──────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('[DevSetu PWA] SW registered:', reg.scope))
      .catch((err) => console.warn('[DevSetu PWA] SW registration failed:', err));
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
