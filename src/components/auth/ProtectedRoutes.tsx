// src/components/auth/ProtectedRoute.tsx
import React, { type ReactNode } from 'react'; 
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import LoadingSpinner from '../core/LoadingSpinner';


interface ProtectedRouteProps {
  children: ReactNode; 
}


function ProtectedRoute({ children }: ProtectedRouteProps) {

  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {

    return <LoadingSpinner message="Checking authentication..." />;
  }


  if (!user) {
    // Redirect to the login page, but save the current location they were trying to access
    // so they can be redirected back after logging in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the children (the protected content)
  return children;
}

export default ProtectedRoute;