import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useMercadoPago = () => {
  const [loadingProductId, setLoadingProductId] = useState(null);
  const { toast } = useToast();

  const handleCheckout = async (productId, planName) => {
    setLoadingProductId(productId);
    
    try {
      toast({
        title: "Procesando pago",
        description: `Preparando redirecciÃ³n para el plan ${planName || productId}...`,
        className: "bg-[#141414] border-[#FCB048] text-white",
      });

      const response = await fetch('https://dkarmazdckwlpmftcoeh.supabase.co/functions/v1/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ productId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error creando preferencia de pago');
      }

      const initPoint = data.init_point || data.initPoint;

      if (initPoint) {
        window.location.href = initPoint;
      } else {
        throw new Error('Link de pago no encontrado en la respuesta');
      }
      
    } catch (error) {
      console.error('Error creating checkout preference:', error);
      toast({
        variant: "destructive",
        title: "Error de conexiÃ³n",
        description: "No se pudo conectar con Mercado Pago. Intenta nuevamente.",
      });
    } finally {
      setLoadingProductId(null);
    }
  };

  return { handleCheckout, loadingProductId };
};