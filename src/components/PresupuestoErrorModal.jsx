import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PresupuestoErrorModal = ({ isOpen, onClose, error }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm bg-[#141414] border border-red-900/30 rounded-2xl shadow-2xl p-8 text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Hubo un problema</h2>
        <p className="text-gray-400 mb-6 text-sm">
          {error || 'No pudimos procesar tu solicitud en este momento. Por favor, intentá nuevamente.'}
        </p>

        <Button
          onClick={onClose}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors"
        >
          Entendido
        </Button>
      </motion.div>
    </div>
  );
};

export default PresupuestoErrorModal;