import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePresupuestoAnalytics } from '@/hooks/usePresupuestoAnalytics';

const PresupuestoSuccessModal = ({ isOpen, onClose, data }) => {
  const { trackWhatsAppClick } = usePresupuestoAnalytics();

  if (!isOpen) return null;

  const handleWhatsAppClick = () => {
    trackWhatsAppClick(data?.id);
    window.open(data?.whatsappLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 1, scale: 1, y: 0 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 1, scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-[#141414] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-8 text-center"
      >
        <motion.div 
          initial={{ scale: 1 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30"
        >
          <CheckCircle className="w-10 h-10 text-green-500" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2">¡Presupuesto enviado!</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Recibimos tu solicitud correctamente. Nos contactaremos con vos a la brevedad.
        </p>

        <div className="bg-[#1a1a1a] rounded-lg p-4 mb-6 border border-gray-800/50">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">ID de Referencia</p>
          <p className="text-gray-300 font-mono text-sm">{data?.id?.split('-')[0] || '---'}</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleWhatsAppClick}
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-6 text-lg rounded-xl shadow-lg shadow-[#25D366]/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Contactar por WhatsApp
          </Button>

          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-gray-400 hover:text-white hover:bg-white/5"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Enviar otro presupuesto
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PresupuestoSuccessModal;