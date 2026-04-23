import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  supplierApiCall, 
  setSupplierToken as setStorageToken, 
  clearSupplierToken, 
  isSupplierLoggedIn,
  getSupplierToken
} from '@/utils/supplierApi';
import { getApiErrorMessage } from '@/utils/supplierValidation';
import { useToast } from '@/components/ui/use-toast';

const SupplierContext = createContext(null);

export const useSupplier = () => {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error('useSupplier must be used within a SupplierProvider');
  }
  return context;
};

export const SupplierProvider = ({ children }) => {
  const [supplier, setSupplier] = useState(() => {
    try {
      const data = localStorage.getItem('supplier_data');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });
  
  const [supplierToken, setSupplierToken] = useState(() => getSupplierToken());
  const [isLoggedIn, setIsLoggedIn] = useState(() => isSupplierLoggedIn());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const validateSession = async () => {
    setIsLoading(true);
    if (!supplierToken) {
      setSupplier(null);
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    try {
      const data = await supplierApiCall('/supplier-login', { method: 'GET' });
      if (data.provider) {
        setSupplier(data.provider);
        localStorage.setItem('supplier_data', JSON.stringify(data.provider));
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Check auth failed:', error);
      clearSupplierToken();
      setSupplierToken(null);
      setSupplier(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  // First useEffect: empty array [] (runs once on mount)
  useEffect(() => {
    const handleUnauthorized = () => {
      setSupplier(null);
      setIsLoggedIn(false);
      setSupplierToken(null);
      toast({
        variant: "destructive",
        title: "Sesión expirada",
        description: "Por favor, inicia sesión nuevamente.",
      });
      window.location.href = '/proveedores/login';
    };

    window.addEventListener('supplier:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('supplier:unauthorized', handleUnauthorized);
  }, []);

  // Second useEffect: [supplierToken] (runs only when token changes)
  useEffect(() => {
    validateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierToken]);

  const login = async (email, password) => {
    try {
      const data = await supplierApiCall('/supplier-login', {
        method: 'POST',
        body: JSON.stringify({ action: 'login', email, password }),
      });

      if (data.token && data.provider) {
        setStorageToken(data.token);
        setSupplierToken(data.token);
        localStorage.setItem('supplier_data', JSON.stringify(data.provider));
        setSupplier(data.provider);
        setIsLoggedIn(true);
        return { success: true, data };
      } else {
        return { success: false, error: 'Respuesta inválida del servidor' };
      }
    } catch (error) {
      return { success: false, error: getApiErrorMessage(error?.status, error?.message) };
    }
  };

  const register = async (supplierData) => {
    try {
      const data = await supplierApiCall('/supplier-login', {
        method: 'POST',
        body: JSON.stringify({ action: 'register', ...supplierData }),
      });
      
      if (data.token && data.provider) {
        setStorageToken(data.token);
        setSupplierToken(data.token);
        localStorage.setItem('supplier_data', JSON.stringify(data.provider));
        setSupplier(data.provider);
        setIsLoggedIn(true);
        return { success: true, data };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getApiErrorMessage(error?.status, error?.message) };
    }
  };

  const logout = () => {
    clearSupplierToken();
    setSupplierToken(null);
    setSupplier(null);
    setIsLoggedIn(false);
    window.location.href = '/proveedores/login';
  };

  const updateProfile = async (profileData) => {
    toast({ title: "🚧 Funcionalidad de actualización en desarrollo" });
    return { success: true };
  };

  const value = {
    supplier,
    isLoggedIn,
    isLoading,
    login,
    register,
    logout,
    validateSession,
    updateProfile,
  };

  return (
    <SupplierContext.Provider value={value}>
      {children}
    </SupplierContext.Provider>
  );
};