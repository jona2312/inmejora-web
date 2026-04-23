import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useProveedorAuth } from '@/contexts/ProveedorAuthContext';
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';

const ProtectedProveedorRoute = ({ children }) => {
  const { provider, loading, checkSession } = useProveedorAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (loading) {
      // Set a 3-second timeout for the loading state inside the component
      timer = setTimeout(() => {
        setTimeoutReached(true);
      }, 3000);
    } else {
      setTimeoutReached(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading]);

  const handleRetry = () => {
    setTimeoutReached(false);
    if (checkSession) {
      checkSession();
    } else {
      window.location.reload();
    }
  };

  const handleGoToLogin = () => {
    navigate('/proveedores/login');
  };

  if (loading) {
    if (timeoutReached) {
      return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-4">
          <div className="text-center max-w-md p-8 bg-gray-900 rounded-xl shadow-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Problema de conexión</h2>
            <p className="text-gray-400 mb-8">El tiempo de espera para validar tu sesión se ha agotado. Por favor, intenta nuevamente o vuelve a iniciar sesión.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleRetry} variant="default" className="w-full sm:w-auto">
                Reintentar
              </Button>
              <Button onClick={handleGoToLogin} variant="outline" className="w-full sm:w-auto text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white">
                Ir al Login
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
        <Spinner />
        <p className="mt-4 text-gray-500 animate-pulse text-sm">Validando sesión...</p>
      </div>
    );
  }

  if (!provider) {
    return <Navigate to="/proveedores/login" replace />;
  }

  // Si está suspendido o rechazado, mandarlo a una página de estado
  if (provider.status === 'suspended' || provider.status === 'rejected') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4">
        <div className="text-center p-8 bg-gray-900 rounded-xl border border-gray-800 max-w-md shadow-2xl">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Cuenta {provider.status === 'suspended' ? 'Suspendida' : 'Rechazada'}
          </h2>
          <p className="text-gray-400 mb-6">Por favor, contacta a soporte para más información acerca del estado de tu cuenta.</p>
          <Button onClick={() => navigate('/contacto')} variant="outline" className="text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white">
            Contactar Soporte
          </Button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedProveedorRoute;