import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupplier } from '@/contexts/SupplierContext';
import { Loader2 } from 'lucide-react';

const SupplierProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useSupplier();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#d4af37] mb-4" />
        <p className="text-gray-400">Verificando sesión...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/proveedores/login" state={{ from: location }} replace />;
  }

  return children;
};

export default SupplierProtectedRoute;