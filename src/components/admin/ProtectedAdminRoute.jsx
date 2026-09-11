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

  // Default-deny: redirigir a login si no hay sesión
  if (!user) return <Navigate to="/login" replace />;

  // UI gate only: every privileged API must independently verify session and role.
  // Never grant access from user-editable metadata or an email allowlist.
  const isAdmin = user.app_metadata?.role === 'admin';

  // Si hay sesión pero no es admin, redirigir a home (no exponer la ruta)
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedAdminRoute;
