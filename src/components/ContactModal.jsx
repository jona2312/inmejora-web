import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import { useContactModal } from '@/contexts/ContactModalContext';
import { cn } from '@/lib/utils';

const ContactModal = () => {
  const { isContactModalOpen, closeContactModal } = useContactModal();

  const contactOptions = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      subtext: 'Respuesta inmediata',
      icon: Phone,
      action: () => window.open('https://wa.me/5491168000741', '_blank'),
      isLink: true
    },
    {
      id: 'email',
      label: 'Email',
      subtext: 'hola@inmejora.com',
      icon: Mail,
      action: () => window.location.href = 'mailto:hola@inmejora.com',
      isLink: true
    },
    {
      id: 'office',
      label: 'Oficina',
      subtext: 'Buenos Aires, Argentina',
      icon: MapPin,
      action: null,
      isLink: false
    }
  ];

  return (
    <AnimatePresence>
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeContactModal}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[400px] bg-[#141414] border border-[#FCD34D]/20 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#1a1a1a]">
              <h2 className="text-xl font-bold text-white">Contacto</h2>
              <button
                onClick={closeContactModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {contactOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={option.action ? option.action : undefined}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 transition-all duration-300",
                    option.isLink 
                      ? "cursor-pointer hover:bg-white/10 hover:border-[#FCD34D]/30 hover:shadow-[0_0_15px_rgba(252,211,77,0.1)] group" 
                      : "cursor-default opacity-90"
                  )}
                >
                  <div className="w-12 h-12 rounded-full bg-[#FCD34D]/10 flex items-center justify-center border border-[#FCD34D]/20 group-hover:border-[#FCD34D]/50 transition-colors">
                    <option.icon className="w-5 h-5 text-[#FCD34D]" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-base flex items-center gap-2">
                      {option.label}
                      {option.isLink && <ExternalLink size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                    </h3>
                    <p className="text-sm text-gray-400">{option.subtext}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer decoration */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#FCD34D]/50 to-transparent opacity-30" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;