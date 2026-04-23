import axios from 'axios';

const BASE_URL = 'https://inmejora-dash-n45svwn6.manus.space/api/horizon';

const apiCall = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Token
apiCall.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('inmejora_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
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