import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, LayoutDashboard } from 'lucide-react';

const PendingModal = ({ customerEmail, isRetrying, onManualRetry, sessionId }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#141414] border border-blue-500/30 rounded-xl p-8 max-w-md w-full shadow-[0_0_30px_rgba(59,130,246,0.1)] text-center relative"
    >
       <div className="mb-6 flex justify-center">
         <div className="relative">
             <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
             <Loader2 className="w-20 h-20 text-blue-500 animate-spin relative z-10" />
         </div>
       </div>

       <h2 className="text-2xl font-bold text-white mb-2">Pago Pendiente</h2>
       <p className="text-gray-400 mb-6">
         Tu pago aún está siendo procesado. Por favor, espera mientras verificamos la transacción{customerEmail ? ` para ${customerEmail}` : ''}.
       </p>

       <div className="flex flex-col gap-3">
         <Button 
            onClick={onManualRetry}
            disabled={isRetrying}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 text-base"
         >
            {isRetrying ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verificando...
                </>
            ) : (
                <>
                    <RefreshCw className="mr-2 h-5 w-5" /> Verificar Estado
                </>
            )}
         </Button>
         <Button 
            variant="ghost"
            onClick={() => navigate('/portal/dashboard')}
            className="w-full text-gray-400 hover:text-white hover:bg-white/5"
         >
            <LayoutDashboard className="mr-2 h-4 w-4" /> Ir al Dashboard
         </Button>
       </div>

       {sessionId && (
          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-[10px] text-gray-600 font-mono">ID: {sessionId}</p>
          </div>
       )}
    </motion.div>
  );
};

export default PendingModal;