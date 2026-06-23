import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, checkingAuth } = useAuth();

  if (checkingAuth) {
    return <Loader fullPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default RoleRoute;
