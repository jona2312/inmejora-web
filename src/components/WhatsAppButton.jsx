import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle as MessageCircleMore } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '+5491139066429';
  const prefilledMessage = encodeURIComponent('Hola, me interesa conocer más sobre los servicios de INMEJORA de reformas y diseño con IA.');
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${prefilledMessage}`;

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg flex items-center justify-center cursor-pointer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
      whileHover={{ scale: 1.1, boxShadow: '0 8px 16px rgba(37, 211, 102, 0.4)' }}
      whileTap={{ scale: 0.9 }}
      aria-label="Chatear con nosotros por WhatsApp"
    >
      <MessageCircleMore size={32} />
    </motion.a>
  );
};

export default WhatsAppButton;