import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Image as ImageIcon, Tag, UserPlus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AIAssistantModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const options = [
    {
      id: 'whatsapp',
      title: 'Probar el Asistente IA',
      description: 'Habla con nuestra IA por WhatsApp al instante.',
      icon: <MessageCircle className="w-8 h-8 text-[#25D366]" />,
      actionType: 'whatsapp',
      target: 'https://wa.me/5491158300611',
      hoverBorder: 'hover:border-[#25D366]',
      hoverBg: 'group-hover:bg-[#25D366]/5'
    },
    {
      id: 'renders',
      title: 'Ver renders de ejemplo',
      description: 'Explora nuestra galería de transformaciones.',
      icon: <ImageIcon className="w-8 h-8 text-[#d4af37]" />,
      actionType: 'scroll',
      target: 'proyectos',
      hoverBorder: 'hover:border-[#d4af37]',
      hoverBg: 'group-hover:bg-[#d4af37]/5'
    },
    {
      id: 'planes',
      title: 'Ver planes y precios',
      description: 'Conoce nuestras opciones y suscripciones.',
      icon: <Tag className="w-8 h-8 text-[#d4af37]" />,
      actionType: 'navigate',
      target: '/precios',
      hoverBorder: 'hover:border-[#d4af37]',
      hoverBg: 'group-hover:bg-[#d4af37]/5'
    },
    {
      id: 'registro',
      title: 'Registrarme gratis',
      description: 'Crea tu cuenta y empieza tu proyecto hoy.',
      icon: <UserPlus className="w-8 h-8 text-[#d4af37]" />,
      actionType: 'navigate',
      target: '/registro',
      hoverBorder: 'hover:border-[#d4af37]',
      hoverBg: 'group-hover:bg-[#d4af37]/5'
    },
  ];

  const handleAction = (option) => {
    onClose();

    if (option.actionType === 'whatsapp') {
      window.open(option.target, '_blank');
    } else if (option.actionType === 'navigate') {
      navigate(option.target);
      window.scrollTo(0, 0);
    } else if (option.actionType === 'scroll') {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => scrollToElement(option.target), 500);
      } else {
        scrollToElement(option.target);
      }
    }
  };

  const scrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998] bg-black/85 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[95%] max-w-2xl bg-[#0f0f0f] border border-[#333] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Elegant Header with Logo */}
            <div className="flex items-center justify-between p-6 border-b border-[#222] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/5 via-transparent to-transparent opacity-50 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col">
                <div className="flex items-baseline mb-1">
                  <span className="text-2xl font-black text-white tracking-tight">IN</span>
                  <span className="text-2xl font-black text-[#d4af37] tracking-tight ml-0.5">MEJORA</span>
                </div>
                <h2 className="text-lg font-medium text-gray-300">
                  ¿Cómo te gustaría empezar?
                </h2>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full w-10 h-10 transition-colors z-10"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {options.map((option) => (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAction(option)}
                    className={`bg-[#151515] border border-[#222] ${option.hoverBorder} rounded-xl p-6 cursor-pointer transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden`}
                  >
                    <div className={`absolute inset-0 ${option.hoverBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-[#2a2a2a] group-hover:border-transparent group-hover:shadow-lg transition-all duration-300 relative z-10">
                      {option.icon}
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 relative z-10">
                      {option.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm relative z-10">
                      {option.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIAssistantModal;