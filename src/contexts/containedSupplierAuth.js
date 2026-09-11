import { createContext, createElement, useContext } from 'react';
import { supplierAuthBlocked, denySupplierAuth, clearSupplierCache } from './identityContainment.js';

// This is the active SupplierContext flow, NOT the legacy ProveedorAuthContext.
// No async request, listener or setter exists that can restore a stale identity.
const denied = Object.freeze({
  supplier: null,
  isLoggedIn: false,
  isLoading: false,
  unavailableReason: supplierAuthBlocked.error,
  login: denySupplierAuth,
  register: denySupplierAuth,
  validateSession: denySupplierAuth,
  updateProfile: denySupplierAuth,
  logout: clearSupplierCache,
});
const SupplierContext = createContext(denied);
export const SupplierProvider = ({ children }) =>
  createElement(SupplierContext.Provider, { value: denied }, children);
export const useSupplier = () => useContext(SupplierContext);
