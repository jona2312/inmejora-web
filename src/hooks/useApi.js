import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://inmejora-dash-n45svwn6.manus.space';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const request = useCallback(async (method, endpoint, data = null, headers = {}) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('inmejora_token');
    
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      data,
    };

    try {
      const response = await axios(config);
      setLoading(false);
      return { data: response.data, error: null };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      setError(errorMessage);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('inmejora_token');
        navigate('/login');
      }

      return { data: null, error: errorMessage };
    }
  }, [navigate]);

  return { request, loading, error };
};