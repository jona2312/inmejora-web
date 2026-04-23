import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const UpgradeModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleViewPlans = () => {
    navigate('/precios');
    onClose();
  };

  const handleRegister = () => {
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-[#1a1a1a] rounded-3xl border border-[#333] shadow-2xl overflow-hidden"
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

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Content */}
            <div className="relative p-8 md:p-10">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center"
              >
                <Lock className="w-10 h-10 text-[#d4af37]" />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-black text-white text-center mb-3"
              >
                Ya usaste tu cotización gratuita
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 text-center mb-8 leading-relaxed"
              >
                Desbloquea cotizaciones ilimitadas y accede a todas las funciones premium con un plan pago
              </motion.p>

              {/* Benefits List */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#222] rounded-2xl p-6 mb-8 border border-[#333]"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm leading-relaxed">
                      <strong className="font-semibold text-white">Cotizaciones ilimitadas</strong> sin restricciones
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm leading-relaxed">
                      <strong className="font-semibold text-white">Renders con IA</strong> para visualizar tu proyecto
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm leading-relaxed">
                      <strong className="font-semibold text-white">Asesoramiento personalizado</strong> incluido
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <Button
                  onClick={handleViewPlans}
                  className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-black font-bold py-6 rounded-xl shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all"
                >
                  Ver Planes y Precios
                </Button>

                <Button
                  onClick={handleRegister}
                  variant="outline"
                  className="w-full bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 font-bold py-6 rounded-xl transition-all"
                >
                  Registrarme Gratis
                </Button>
              </motion.div>

              {/* Disclaimer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xs text-gray-500 text-center mt-6 leading-relaxed"
              >
                Plan gratuito: <strong className="text-gray-400">1 cotización</strong>
                <br />
                Plan Pro: <strong className="text-[#d4af37]">ilimitadas</strong>
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeModal;