import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/InmejoraAuthContext';

export const useMercadoPagoCheckout = (hookProductId = null) => {
  const [loadingProductId, setLoadingProductId] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubscribe = async (params) => {
    let productId;
    
    // Handle different parameter formats
    if (typeof params === 'object' && params !== null) {
      productId = params.productId || params.id;
    } else if (params !== undefined && params !== null) {
      productId = params;
    } else {
      productId = hookProductId;
    }

    if (!productId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "ID de producto no válido o no definido.",
      });
      return;
    }

    const token = localStorage.getItem('inmejora_token');
    if (!token) {
      toast({
        title: "Inicia sesión",
        description: "Debes registrarte o iniciar sesión para suscribirte.",
      });
      navigate(`/registro?plan=${productId}`);
      return;
    }

    // Prevent double submission
    if (loadingProductId === productId) return;

    setLoadingProductId(productId);
    
    try {
      // 1. Send POST request to Supabase Edge Function
      const response = await fetch('https://dkarmazdckwlpmftcoeh.supabase.co/functions/v1/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYXJtYXpkY2t3bHBtZnRjb2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0OTkxMTgsImV4cCI6MjA3OTA3NTExOH0.dT6aMWXqbTLV_J9wQvgHdTF1nJhh4o2FTsC_Ys2AWNI',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYXJtYXpkY2t3bHBtZnRjb2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0OTkxMTgsImV4cCI6MjA3OTA3NTExOH0.dT6aMWXqbTLV_J9wQvgHdTF1nJhh4o2FTsC_Ys2AWNI'
        },
        body: JSON.stringify({ 
          productId,
          userId: user?.id || null,
          userEmail: user?.email || null,
          userName: user?.full_name || user?.name || null
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el checkout');
      }

      const initPoint = data.init_point || data.initPoint;
      
      if (initPoint) {
        toast({
          title: "Redirigiendo a Mercado Pago",
          description: "Te estamos redirigiendo de forma segura...",
        });
        // Redirect user to init_point using window.location.href
        window.location.href = initPoint;
      } else {
        throw new Error('La respuesta del servidor no incluyó un enlace de pago válido.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      
      // Handle errors gracefully with Spanish message via toast
      let errorMessage = "Error al procesar el pago. Intenta nuevamente.";
      
      if (typeof error === 'object' && error !== null) {
        if (error.message && error.message.includes('not found')) {
            errorMessage = "El plan seleccionado no está disponible.";
        } else if (error.message) {
            errorMessage = error.message;
        }
      }
        
      toast({
        variant: "destructive",
        title: "Error de pago",
        description: errorMessage,
      });
    } finally {
      // Release loading state
      setLoadingProductId(null);
    }
  };

  return { handleSubscribe, loadingProductId, hookProductId };
};