import { useToast } from '@/components/ui/use-toast';

// P0 UI containment: all callers receive the same explicit unavailable state.
export const useMercadoPago = () => {
  const { toast } = useToast();

  const handleCheckout = async (productId, planName) => {
    void productId;
    void planName;
    toast({
      title: 'Pagos temporalmente no disponibles',
      description: 'Las compras están deshabilitadas por el momento. No se inició ningún pago.',
    });
  };

  return { handleCheckout, loadingProductId: null };
};
