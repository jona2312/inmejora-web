import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, WifiOff, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UploadErrorModal = ({ isOpen, onClose, error, onRetry, navigate }) => {
  if (!isOpen || !error) return null;

  // Determine error type based on message content
  const isCreditError = error.toLowerCase().includes('crédito') || error.toLowerCase().includes('plan');
  const isNetworkError = error.toLowerCase().includes('conexión') || error.toLowerCase().includes('network');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-[#141414] border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden z-50"
        >
          <div className="p-6 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isCreditError ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
              {isCreditError ? (
                <CreditCard className="w-8 h-8" />
              ) : isNetworkError ? (
                <WifiOff className="w-8 h-8" />
              ) : (
                <AlertCircle className="w-8 h-8" />
              )}
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {isCreditError ? 'Sin créditos suficientes' : 'Hubo un problema'}
            </h3>
            
            <p className="text-gray-400 mb-8 leading-relaxed">
              {error}
            </p>

            <div className="flex flex-col gap-3">
              {isCreditError ? (
                <Button 
                  onClick={() => navigate('/portal/planes')}
                  className="w-full bg-[#D4AF37] text-black font-bold hover:bg-[#fbbf24]"
                >
                  Cambiar Plan
                </Button>
              ) : isNetworkError ? (
                <Button 
                  onClick={onRetry}
                  className="w-full bg-white text-black font-bold hover:bg-gray-200"
                >
                  Reintentar
                </Button>
              ) : null}

              <Button 
                onClick={onClose}
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-white/5"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UploadErrorModal;