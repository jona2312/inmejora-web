import { createContext, createElement, useContext } from 'react';
import { clientAuthBlocked, denyClientAuth, clearClientCache } from './identityContainment.js';

const denied = Object.freeze({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  unavailableReason: clientAuthBlocked.error,
  login: denyClientAuth,
  register: denyClientAuth,
  checkAuth: denyClientAuth,
  forgotPassword: denyClientAuth,
  resetPassword: denyClientAuth,
  updateProfile: denyClientAuth,
  logout: clearClientCache,
});
const ClientContext = createContext(denied);
export const InmejoraAuthProvider = ({ children }) =>
  createElement(ClientContext.Provider, { value: denied }, children);
export const useAuth = () => useContext(ClientContext);
