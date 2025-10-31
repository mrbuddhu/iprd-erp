import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleGuard = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Guest has full access to everything
  if (user.role === 'Guest') {
    return children;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Viewer can only access search
    if (user.role === 'Viewer') {
      return <Navigate to="/search" replace />;
    }
    // Others get redirected to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleGuard;

