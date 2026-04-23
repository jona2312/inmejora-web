import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/InmejoraAuthContext';
import { useNavigate } from 'react-router-dom';

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const initiateCheckout = async (productId) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('inmejora_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        'https://inmejora-dash-n45svwn6.manus.space/api/horizon/checkout',
        { 
          productId,
          userId: user?.id || null,
          userEmail: user?.email || null,
          userName: user?.full_name || user?.name || null
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.url) {
        window.open(response.data.url, '_blank');
      } else {
        throw new Error('No se recibió la URL de pago.');
      }

    } catch (err) {
      console.error("Checkout error:", err);
      
      if (err.response) {
        // Handle specific HTTP errors
        if (err.response.status === 401 || err.response.status === 403) {
          logout();
          navigate('/login');
          return;
        }
        
        const msg = err.response.data?.message || err.response.data?.error;
        setError(msg || 'No pudimos procesar tu solicitud. Intentá de nuevo.');
      } else if (err.request) {
        // Network error
        setError('Hubo un error de conexión. Intentá de nuevo.');
      } else {
        // Other errors
        setError('No pudimos procesar tu solicitud. Intentá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    initiateCheckout
  };
};