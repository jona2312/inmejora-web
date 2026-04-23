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
        description: `Preparando redirección para el plan ${planName || productId}...`,
        className: "bg-[#141414] border-[#FCB048] text-white",
      });

      const response = await fetch('https://dkarmazdckwlpmftcoeh.supabase.co/functions/v1/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYXJtYXpkY2t3bHBtZnRjb2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0OTkxMTgsImV4cCI6MjA3OTA3NTExOH0.dT6aMWXqbTLV_J9wQvgHdTF1nJhh4o2FTsC_Ys2AWNI',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYXJtYXpkY2t3bHBtZnRjb2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0OTkxMTgsImV4cCI6MjA3OTA3NTExOH0.dT6aMWXqbTLV_J9wQvgHdTF1nJhh4o2FTsC_Ys2AWNI'
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
        title: "Error de conexión",
        description: "No se pudo conectar con Mercado Pago. Intenta nuevamente.",
      });
    } finally {
      setLoadingProductId(null);
    }
  };

  return { handleCheckout, loadingProductId };
};