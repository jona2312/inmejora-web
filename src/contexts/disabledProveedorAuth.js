import { createContext, createElement, useContext } from 'react';

// Containment, NOT authentication. Do not restore browser-owned identities here.
const unavailable = Object.freeze({
  success: false,
  error: 'El acceso de proveedores legado está deshabilitado por seguridad.',
  code: 'LEGACY_PROVIDER_AUTH_DISABLED',
});
const deny = async () => unavailable;
const disabledSession = Object.freeze({
  provider: null,
  loading: false,
  login: deny,
  register: deny,
  checkSession: deny,
  logout: deny,
});
const ProveedorAuthContext = createContext(disabledSession);

export const ProveedorAuthProvider = ({ children }) =>
  createElement(ProveedorAuthContext.Provider, { value: disabledSession }, children);

export const useProveedorAuth = () => useContext(ProveedorAuthContext);
