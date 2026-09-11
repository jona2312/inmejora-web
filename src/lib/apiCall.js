import axios from 'axios';
import { clientAuthError } from '../contexts/identityContainment.js';

const BASE_URL = `${import.meta.env.VITE_API_URL || 'https://aprobacion.inmejora.com.ar'}/api/horizon`;

const apiCall = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// This legacy client has no verified credential contract.
apiCall.interceptors.request.use(
  () => {
    throw clientAuthError();
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Errors (401, 403)
apiCall.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response && (response.status === 401 || response.status === 403)) {
      // Clear token
      localStorage.removeItem('inmejora_token');
      localStorage.removeItem('inmejora_user');
      
      // Dispatch custom event for UI handling (redirect & toast)
      // This allows us to handle UI side effects from the central App component
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    return Promise.reject(error);
  }
);

export default apiCall;
