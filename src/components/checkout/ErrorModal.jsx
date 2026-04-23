import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, LayoutDashboard, MessageCircle } from 'lucide-react';
import WhatsAppButton from '@/components/WhatsAppButton'; // Assuming we can trigger it or link similarly

const ErrorModal = ({ message, customerEmail, sessionId }) => {
  const navigate = useNavigate();

  const handleWhatsAppSupport = () => {
    // Basic redirect to WhatsApp API
    const text = `Hola, tuve un problema con mi pago en INMEJORA. ID de Sesión: ${sessionId}`;
    window.open(`https://wa.me/5491112345678?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#141414] border border-red-500/30 rounded-xl p-8 max-w-md w-full shadow-[0_0_30px_rgba(239,68,68,0.1)] text-center relative"
    >
       <div className="mb-6 flex justify-center">
         <div className="bg-red-500/10 p-4 rounded-full">
            <AlertCircle className="w-16 h-16 text-red-500" />
         </div>
       </div>

       <h2 className="text-2xl font-bold text-white mb-2">Pago Expirado o Cancelado</h2>
       <p className="text-gray-400 mb-6">
         {message || "Tu sesión de pago ha expirado o no pudo completarse. Por favor, intenta de nuevo."}
         {customerEmail && <span className="block mt-1 text-sm text-gray-500">Email: {customerEmail}</span>}
       </p>

       <div className="flex flex-col gap-3">
         <Button 
            onClick={() => navigate('/portal/planes')}
            className="w-full bg-[#D4AF37] hover:bg-[#fbbf24] text-black font-bold h-12 text-base"
         >
            <ArrowLeft className="mr-2 h-5 w-5" /> Volver a Intentar
         </Button>
         
         <Button 
            variant="outline"
            onClick={handleWhatsAppSupport}
            className="w-full border-gray-700 text-white hover:bg-gray-800"
         >
            <MessageCircle className="mr-2 h-4 w-4" /> Contactar Soporte
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

export default ErrorModal;