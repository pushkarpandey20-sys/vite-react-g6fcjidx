import React from 'react';

/**
 * ProtectedRoute — DevSetu
 *
 * POLICY:
 * - /user/*   routes: ALWAYS public. Pages handle auth state themselves.
 * - /pandit/* routes: ALWAYS public. Dashboard shows login UI when not authed.
 * - /admin/*  routes: Protected by AdminLayout's own login screen (not here).
 *
 * This component is a pass-through for all routes.
 * Individual pages show login modals when payment/protected actions need auth.
 */
export function ProtectedRoute({ children }) {
  return children;
}

export default ProtectedRoute;
