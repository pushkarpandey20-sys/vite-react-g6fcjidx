import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../store/AppCtx';

/**
 * ProtectedRoute component to guard routes that require authentication.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Component to render if authenticated
 * @param {string} props.role - Required role ('user', 'pandit', 'admin')
 */
export const ProtectedRoute = ({ children, role }) => {
  const { devoteeId, panditId, adminRole, authLoading } = useApp();
  const location = useLocation();

  if (authLoading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#1a0f07',
        color: '#F0C040',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '15px' }}>🕉️</div>
        <p style={{ fontFamily: 'Cinzel', letterSpacing: '2px' }}>Loading Sacred Space...</p>
      </div>
    );
  }

  // Check based on role
  let isAuthorized = false;
  if (role === 'admin') isAuthorized = !!adminRole;
  else if (role === 'pandit') isAuthorized = !!panditId;
  else if (role === 'user') isAuthorized = !!devoteeId;

  if (!isAuthorized) {
    // Redirect to landing or login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

