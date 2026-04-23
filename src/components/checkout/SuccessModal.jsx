import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, LayoutDashboard, CreditCard } from 'lucide-react';

const SuccessModal = ({ customerEmail, sessionId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/portal/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#141414] border border-[#D4AF37]/50 rounded-xl p-8 max-w-md w-full shadow-[0_0_30px_rgba(212,175,55,0.15)] text-center relative overflow-hidden"
    >
       <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]" />
       
       <div className="mb-6 flex justify-center">
         <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
         >
            <CheckCircle2 className="w-20 h-20 text-[#D4AF37]" />
         </motion.div>
       </div>

       <h2 className="text-2xl font-bold text-white mb-2">¡Pago Completado!</h2>
       <p className="text-gray-400 mb-6">
         Tu suscripción ha sido activada correctamente. Hemos enviado un recibo a <span className="text-white font-medium">{customerEmail}</span>.
       </p>

       <div className="flex flex-col gap-3">
         <Button 
            onClick={() => navigate('/portal/dashboard')}
            className="w-full bg-[#D4AF37] hover:bg-[#fbbf24] text-black font-bold h-12 text-base"
         >
            <LayoutDashboard className="mr-2 h-5 w-5" /> Ir al Dashboard
         </Button>
         <Button 
            variant="ghost"
            onClick={() => navigate('/portal/planes')}
            className="w-full text-gray-400 hover:text-white hover:bg-white/5"
         >
            <CreditCard className="mr-2 h-4 w-4" /> Ver Planes
         </Button>
       </div>

       {sessionId && (
          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-[10px] text-gray-600 font-mono">ID: {sessionId}</p>
          </div>
       )}

       <div className="mt-4 text-xs text-gray-500 animate-pulse">
          Redirigiendo en 5 segundos...
       </div>
    </motion.div>
  );
};

export default SuccessModal;