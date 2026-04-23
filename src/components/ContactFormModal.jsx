import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

const ContactFormModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => {
        onClose();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-[#1a1a1a] border border-[#D4AF37]/30 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
             
             <button 
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
             >
                <X size={18} />
             </button>

             <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4"
             >
                <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
             </motion.div>

             <h3 className="text-xl font-bold text-white mb-2">¡Gracias!</h3>
             <p className="text-gray-400 text-sm">
                Nos pondremos en contacto pronto.
             </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactFormModal;