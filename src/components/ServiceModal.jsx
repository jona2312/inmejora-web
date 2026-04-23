import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ServiceModal = ({ isOpen, onClose, service }) => {
  if (!isOpen || !service) return null;

  // Function to open WhatsApp
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(service.whatsappMessage);
    window.open(`https://wa.me/5491112345678?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 1, scale: 1, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 1, scale: 0.9, y: 20 }}
          className="relative bg-[#1a1a1a] border border-[#D4AF37]/30 w-full max-w-[600px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="p-6 md:p-8 bg-[#141414] border-b border-white/5">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <service.icon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{service.name}</h2>
            </div>
            {service.extraNote && (
              <span className="inline-block mt-2 px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold rounded-full uppercase tracking-wide">
                {service.extraNote}
              </span>
            )}
          </div>

          {/* Scrollable Body */}
          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
            {/* Qué hacemos */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">Qué hacemos</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {service.description}
              </p>
            </div>

            {/* Incluye */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" /> Incluye
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.includes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Para cotizar */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#D4AF37]" /> Para cotizar rápido
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Envianos un mensaje con esta info para agilizar tu presupuesto:
              </p>
              <ul className="space-y-3">
                {service.questions.map((q, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-200">
                    <span className="w-6 h-6 rounded-full bg-[#252525] border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-500">
                      {idx + 1}
                    </span>
                    {q}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="mt-6">
                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-[#25D366] hover:bg-[#1ebc57] text-white font-bold h-12 text-lg rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Cotizar por WhatsApp
                </Button>
                <p className="text-center text-xs text-gray-500 mt-3">
                  Si ya tenés fotos, mandalas y te respondemos con la propuesta más rápida posible.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ServiceModal;