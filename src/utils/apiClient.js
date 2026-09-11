import axios from 'axios';
import { clientAuthError } from '../contexts/identityContainment.js';

const baseURL = import.meta.env.VITE_API_URL || 'https://aprobacion.inmejora.com.ar';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(() => {
  throw clientAuthError();
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('inmejora_token');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
