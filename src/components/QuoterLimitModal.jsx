import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const QuoterLimitModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/registro');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md bg-[#111] rounded-3xl border border-[#333] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[#222] hover:bg-[#333] text-gray-400 hover:text-white transition-all"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-8 md:p-10 text-center">
              {/* Lock Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[#C5A55A]/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-[#C5A55A]" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
                ¡Límite de cotizaciones alcanzado!
              </h2>

              {/* Description */}
              <p className="text-gray-400 mb-8 text-base leading-relaxed">
                Has usado tu cotización gratuita. Creá una cuenta gratis para desbloquear cotizaciones ilimitadas y acceder a funciones exclusivas.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleCreateAccount}
                  className="w-full bg-[#C5A55A] hover:bg-[#b5952f] text-white font-bold py-6 rounded-xl text-lg shadow-[0_0_30px_rgba(197,165,90,0.3)] hover:shadow-[0_0_50px_rgba(197,165,90,0.5)] transition-all"
                >
                  Crear cuenta gratis
                </Button>

                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-6 rounded-xl text-lg transition-all"
                >
                  Cerrar
                </Button>
              </div>

              {/* Extra Info */}
              <p className="text-gray-500 text-xs mt-6">
                La cuenta es 100% gratuita. Sin cargos automáticos.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuoterLimitModal;