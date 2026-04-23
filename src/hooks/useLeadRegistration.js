import { useState } from 'react';
import axios from 'axios';

export const useLeadRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const register = async ({ name, email, phone }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const sessionId = localStorage.getItem('chat_session_id') || crypto.randomUUID();
      if (!localStorage.getItem('chat_session_id')) {
        localStorage.setItem('chat_session_id', sessionId);
      }

      const response = await axios.post('https://3000-iq2uhcq4bsbq0f0nhc06a-14fd7811.us1.manus.computer/api/chat/register', {
        name,
        email,
        phone,
        session_id: sessionId
      });

      const data = response.data;
      setSuccess(true);
      
      // Attempt to open WhatsApp immediately
      const whatsappLink = data.whatsapp_link || `https://wa.me/5491112345678?text=Hola,%20soy%20${encodeURIComponent(name)}`;
      
      try {
        window.open(whatsappLink, '_blank');
      } catch (e) {
        console.error("Window open blocked", e);
      }

      // Fallback
      setTimeout(() => {
        if (!document.hidden) {
          // If window wasn't opened (e.g. popup blocked), redirect current window
          window.location.href = whatsappLink;
        }
      }, 3000);

      return { success: true, data, whatsappLink };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Ocurrió un error al registrar.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, register };
};