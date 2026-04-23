import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { useToast } from '@/components/ui/use-toast';

const PlanSelectionModal = ({ isOpen, onClose, selectedPlan }) => {
  const { initiateCheckout, loading, error } = useStripeCheckout();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }
  }, [error, toast]);

  const handleProceed = async () => {
    if (!selectedPlan?.id) return;
    await initiateCheckout(selectedPlan.id);
    // Note: We don't close the modal automatically on success because the user is redirected in a new tab.
    // They might want to close it manually or retry if the popup was blocked.
  };

  if (!selectedPlan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#141414] border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
             <CreditCard className="text-[#D4AF37]" size={24} /> 
             Suscripción a {selectedPlan.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400 pt-2">
            Serás redirigido a Stripe para completar tu pago de forma segura.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
           <div className="bg-[#0a0a0a] p-4 rounded-lg border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Plan Seleccionado</span>
                  <span className="font-bold text-white">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Precio</span>
                  <span className="font-bold text-[#D4AF37]">{selectedPlan.priceString}</span>
              </div>
              {selectedPlan.savingsText && (
                 <div className="mt-2 text-right text-xs text-green-500 font-medium">
                    {selectedPlan.savingsText}
                 </div>
              )}
           </div>
           
           {error && (
             <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex gap-2 items-start text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
             </div>
           )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={loading}
            className="text-gray-400 hover:text-white hover:bg-white/5"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleProceed} 
            disabled={loading}
            className="bg-[#D4AF37] text-black hover:bg-[#fbbf24] font-bold"
          >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
                </>
            ) : (
                "Ir a Pagar en Stripe"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanSelectionModal;