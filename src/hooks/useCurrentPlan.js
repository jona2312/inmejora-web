import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const BASE_URL = 'https://inmejora-dash-n45svwn6.manus.space';

export const useCurrentPlan = () => {
  const { user, logout } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentPlan = useCallback(async () => {
    const token = localStorage.getItem('inmejora_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // We use the dashboard endpoint as it contains the user's plan info
      const response = await axios.get(`${BASE_URL}/api/horizon/client/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.plan) {
        setCurrentPlan(response.data.plan);
      } else {
        // Fallback or default free plan structure if not found
        setCurrentPlan({ id: 'free', name: 'Gratuito' });
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching current plan:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
         // Token might be invalid
         logout();
      }
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (user) {
      fetchCurrentPlan();
    } else {
      setLoading(false);
    }
  }, [user, fetchCurrentPlan]);

  return { currentPlan, loading, error, refetch: fetchCurrentPlan };
};