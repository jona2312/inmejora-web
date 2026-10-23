import { useState } from 'react';
import { rendersAPI } from '@/utils/rendersAPI';

export const useImageUpload = () => {
  const [error, setError] = useState(null);
  const uploadImage = async () => {
    try {
      await rendersAPI.upload();
    } catch (failure) {
      setError(failure.message);
      return false;
    }
    return false;
  };
  return { uploadImage, loading: false, error, success: false, data: null,
    resetState: () => setError(null) };
};
