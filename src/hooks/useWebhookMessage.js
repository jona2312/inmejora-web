import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

export const useWebhookMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const sendWebhookMessage = async ({ clientPhone, clientName, message = "", tipo }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'https://inmejora-dash-n45svwn6.manus.space/api/webhook/guardar-mensaje',
        {
          clientPhone,
          clientName,
          message,
          tipo
        }
      );

      setLoading(false);
      
      if (response.data && response.data.success === false) {
          throw new Error(response.data.message || "Error en el servidor");
      }

      return { success: true, data: response.data };

    } catch (err) {
      console.error("Webhook error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Error al conectar con el servidor";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    loading,
    error,
    sendWebhookMessage
  };
};