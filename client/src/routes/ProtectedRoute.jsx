import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkingAuth } = useAuth();
  const location = useLocation();

  if (checkingAuth) {
    return <Loader fullPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
