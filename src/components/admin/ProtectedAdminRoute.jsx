import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Spinner from '@/components/Spinner';

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Spinner />
      </div>
    );
  }

  // In a real app, check user.role or metadata for 'admin'
  // For this prototype, we'll allow any authenticated user to see admin for testing, 
  // or restrict to a specific hardcoded email.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;