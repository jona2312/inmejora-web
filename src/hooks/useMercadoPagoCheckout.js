import { useToast } from '@/components/ui/use-toast';

// P0 UI containment: unconditional until server-side payment authorization is audited.
export const useMercadoPagoCheckout = (hookProductId = null) => {
  const { toast } = useToast();

  const handleSubscribe = async (params) => {
    void params;
    toast({
      title: 'Pagos temporalmente no disponibles',
      description: 'Las compras están deshabilitadas por el momento. No se inició ningún pago.',
    });
  };

  return { handleSubscribe, loadingProductId: null, hookProductId };
};
