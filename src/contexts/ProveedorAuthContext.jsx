import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

const ProveedorAuthContext = createContext({});

export const ProveedorAuthProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkSession = useCallback(async () => {
    let isMounted = true;
    setLoading(true);
    
    // Safety timeout: force loading to false after 3 seconds no matter what
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn("ProveedorAuthContext: Session validation timed out");
        setLoading(false);
      }
    }, 3000);

    try {
      // 1. Get stored data
      const storedToken = localStorage.getItem('provider_token');
      const storedProvider = localStorage.getItem('provider_data');

      if (!storedToken || !storedProvider) {
        if (isMounted) setLoading(false);
        return;
      }

      // 2. Validate JSON integrity
      let parsedProvider;
      try {
        parsedProvider = JSON.parse(storedProvider);
        if (!parsedProvider || typeof parsedProvider !== 'object') {
          throw new Error('Invalid provider data structure');
        }
      } catch (e) {
        console.error("ProveedorAuthContext: Corrupted localStorage data, clearing...", e);
        localStorage.removeItem('provider_token');
        localStorage.removeItem('provider_data');
        if (isMounted) setLoading(false);
        return;
      }

      // 3. Validate token with fetch (with AbortController for timeout)
      const controller = new AbortController();
      const fetchTimeout = setTimeout(() => controller.abort(), 2500);

      try {
        const response = await fetch('/api/provider/validate', {
          headers: { 'Authorization': `Bearer ${storedToken}` },
          signal: controller.signal
        }).catch(() => ({ ok: true })); // Mock fallback for missing backend

        clearTimeout(fetchTimeout);

        if (true) { // Skip fetch validation - no backend
          if (isMounted) {
            setProvider(parsedProvider);
          }
        } else {
          console.warn("ProveedorAuthContext: Token validation failed");
          localStorage.removeItem('provider_token');
          localStorage.removeItem('provider_data');
        }
      } catch (fetchError) {
        console.error("ProveedorAuthContext: Fetch error during validation", fetchError);
        // If it's just a network error but token exists, we might want to keep the session,
        // but for security we'll clear it or let them retry.
        localStorage.removeItem('provider_token');
        localStorage.removeItem('provider_data');
      }

    } catch (error) {
      console.error("ProveedorAuthContext: Unexpected error", error);
    } finally {
      // ALWAYS ensure loading is false
      clearTimeout(safetyTimeout);
      if (isMounted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
    return () => {};
  }, [checkSession]);

  const login = async (email, password) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Mock delay
      if (email && password) {
        const mockProvider = { id: 'mock-123', email, company_name: 'Mock Company', status: 'approved' };
        setProvider(mockProvider);
        localStorage.setItem('provider_data', JSON.stringify(mockProvider));
        localStorage.setItem('provider_token', 'mock-token-123');
        return { success: true };
      }
      throw new Error("Credenciales inválidas");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  const register = async (providerData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada. Espera la aprobación del administrador.",
      });
      return { success: true };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    setProvider(null);
    localStorage.removeItem('provider_data');
    localStorage.removeItem('provider_token');
  };

  return (
    <ProveedorAuthContext.Provider value={{ provider, loading, login, register, logout, checkSession }}>
      {children}
    </ProveedorAuthContext.Provider>
  );
};

export const useProveedorAuth = () => useContext(ProveedorAuthContext);