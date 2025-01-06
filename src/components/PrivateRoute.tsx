import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { user, userRole } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(userRole || '')) {
    // Redirect admin to admin dashboard and producers to their dashboard
    return <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} />;
  }
  
  return <>{children}</>;
}