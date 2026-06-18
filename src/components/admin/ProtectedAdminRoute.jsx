import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Spinner from '@/components/Spinner';

// Emails con acceso admin durante desarrollo.
// En producción: asignar app_metadata.role = 'admin' en Supabase Auth Dashboard.
const ADMIN_EMAILS = ['jonabrewing@gmail.com'];

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

  // Verificar rol admin: app_metadata (Supabase) > user_metadata > email allowlist
  const isAdmin =
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin' ||
    ADMIN_EMAILS.includes(user.email);

  // Si hay sesión pero no es admin, redirigir a home (no exponer la ruta)
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedAdminRoute;