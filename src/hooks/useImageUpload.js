import { useState } from 'react';

// Legacy analysis/render upload was a local mock. Keep the hook contract for
// existing callers, but fail closed without storing a fake job or spending credits.
export const useImageUpload = () => {
  const [loading] = useState(false);
  const [error, setError] = useState(null);
  const [success] = useState(false);
  const [data] = useState(null);
  const uploadImage = async () => {
    const message = 'La generación de imágenes todavía no está habilitada. No se registró ningún render ni se descontaron créditos.';
    setError(message);
    const err = new Error(message);
    err.code = 'BLOCKED_SOURCE_EXPORT';
    throw err;
  };
  const resetState = () => { setError(null); };
  return { uploadImage, loading, error, success, data, resetState };
};
