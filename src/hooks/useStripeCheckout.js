import { useToast } from '@/components/ui/use-toast';

// Keep the historical hook contract; no purchase is pending or attempted.
export const useStripeCheckout = () => {
  const { toast } = useToast();

  const initiateCheckout = async (productId) => {
    void productId;
    toast({
      title: 'Pagos temporalmente no disponibles',
      description: 'Las compras están deshabilitadas por el momento. No se inició ningún pago.',
    });
  };

  return { loading: false, error: null, initiateCheckout };
};
