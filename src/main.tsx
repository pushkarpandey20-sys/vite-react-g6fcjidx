import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './store/AppProvider';
import AppRoutes from './app/routes/AppRoutes';
import './assets/styles/globals.css';
import { initNotifications } from './services/notificationService';

// Sentry error monitoring (no-op if DSN is not set)
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
if (SENTRY_DSN) {
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>
);
