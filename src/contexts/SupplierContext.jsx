import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  // FIX: wrapped in useCallback so the reference is stable between renders.
  // Only changes when supplierToken changes — prevents infinite loops in consumers.
  const validateSession = useCallback(async () => {
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
  }, [supplierToken]); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for 401 events (e.g. expired token from any API call)
  useEffect(() => {
    const handleUnauthorized = () => {
      setSupplier(null);
      setIsLoggedIn(false);
      setSupplierToken(null);
      toast({
        variant: "destructive",
        title: "Sesi\u00f3n expirada",
        description: "Por favor, inicia sesi\u00f3n nuevamente.",
      });
      window.location.href = '/proveedores/login';
    };
    window.addEventListener('supplier:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('supplier:unauthorized', handleUnauthorized);
  }, []);

  // Validate on mount and whenever token changes
  useEffect(() => {
    validateSession();
  }, [validateSession]);

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
      }
      return { success: false, error: 'Respuesta inv\u00e1lida del servidor' };
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

  const updateProfile = async (_profileData) => {
    toast({ title: "\uD83D\uDD27 Funcionalidad de actualizaci\u00f3n en desarrollo" });
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
