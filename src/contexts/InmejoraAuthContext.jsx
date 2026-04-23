import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYXJtYXpkY2t3bHBtZnRjb2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0OTkxMTgsImV4cCI6MjA3OTA3NTExOH0.dT6aMWXqbTLV_J9wQvgHdTF1nJhh4o2FTsC_Ys2AWNI';

export const InmejoraAuthProvider = ({ children }) => {
  const { toast } = useToast();
  
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('inmejora_user');
      const token = localStorage.getItem('inmejora_token');
      
      if (savedUser && token) {
        return JSON.parse(savedUser);
      }
      return null;
    } catch { 
      return null; 
    }
  });

  const isAuthenticated = !!user;
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const savedUser = localStorage.getItem('inmejora_user');
      const token = localStorage.getItem('inmejora_token');

      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
        return { success: true, user: JSON.parse(savedUser) };
      } else {
        setUser(null);
        return { success: false };
      }
    } catch (e) {
      setUser(null);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const res = await fetch('https://dkarmazdckwlpmftcoeh.supabase.co/functions/v1/auth-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_API_KEY,
          'Authorization': `Bearer ${SUPABASE_API_KEY}`
        },
        body: JSON.stringify({ email, password })
      });
      
      const response = await res.json();
      
      if (!res.ok) {
        throw new Error(response.error || response.message || 'Error al iniciar sesión');
      }

      if (response.user) {
        response.user.provider = 'supabase';
        localStorage.setItem('inmejora_user', JSON.stringify(response.user));
        localStorage.setItem('inmejora_token', String(response.user.id));
        setUser(response.user);
        
        window.location.href = '/portal';
        return { success: true, ok: true };
      } else if (response.token) {
        // Fallback for custom endpoints returning token
        localStorage.setItem('inmejora_token', response.token);
        localStorage.setItem('inmejora_user', JSON.stringify({ id: 'user', email }));
        await checkAuth();
        return { success: true, ok: true };
      }
      
      throw new Error('Datos de usuario no recibidos del servidor');
    } catch (err) {
      return { success: false, ok: false, error: err.message };
    }
  };

  const register = async (name, email, password, phone, terms) => {
    try {
      const payload = { 
        name, 
        email, 
        password, 
        phone, 
        terms: Boolean(terms) 
      };
      
      const res = await fetch('https://dkarmazdckwlpmftcoeh.supabase.co/functions/v1/auth-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_API_KEY,
          'Authorization': `Bearer ${SUPABASE_API_KEY}`
        },
        body: JSON.stringify(payload)
      });
      
      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.error || response.message || 'Error al registrarse');
      }

      if (response.user) {
        response.user.provider = 'supabase';
        localStorage.setItem('inmejora_user', JSON.stringify(response.user));
        localStorage.setItem('inmejora_token', String(response.user.id));
        setUser(response.user);
        window.location.href = '/portal';
        return { success: true, ok: true };
      }
      
      throw new Error('Datos de usuario no recibidos al registrar');
    } catch (err) {
      let errorMessage = err.message || "Ocurrió un error inesperado al procesar el registro.";
      
      const lowerError = errorMessage.toLowerCase();
      if (lowerError.includes('user already exists')) {
        errorMessage = 'Este email ya está registrado';
      } else if (lowerError.includes('invalid email')) {
        errorMessage = 'Email inválido';
      } else if (lowerError.includes('invalid password')) {
        errorMessage = 'La contraseña debe tener al menos 8 caracteres';
      }

      return { success: false, ok: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('inmejora_token');
    localStorage.removeItem('inmejora_user');
    setUser(null);
    toast({ title: "Sesión cerrada", description: "Has cerrado sesión correctamente." });
    window.location.href = '/login';
  };

  const forgotPassword = async (email) => {
    return { success: true, ok: true }; // Mock implementation since external API removed
  };

  const resetPassword = async (token, password) => {
    return { success: true, ok: true }; // Mock implementation since external API removed
  };

  const updateProfile = async (updates) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('inmejora_user') || '{}');
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('inmejora_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, ok: true, data: updatedUser };
    } catch (err) {
      return { success: false, ok: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, isLoading,
      login, register, logout, forgotPassword, resetPassword, updateProfile, checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an InmejoraAuthProvider');
  }
  return context;
};