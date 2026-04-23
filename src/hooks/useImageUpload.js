import { useState } from 'react';
import { useAuth } from '@/contexts/InmejoraAuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

export const useImageUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const uploadImage = async (file, description) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setData(null);

    const token = localStorage.getItem('inmejora_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Mock implementation since external API is removed
      // and we are using Supabase directly
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData({ imageUrl: URL.createObjectURL(file), renderJobId: 'dummy-job', analysis: description, creditsRemaining: 5 });
      setSuccess(true);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setData(null);
  };

  return {
    uploadImage,
    loading,
    error,
    success,
    data,
    resetState
  };
};