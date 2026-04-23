import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('inmejora_cookie_consent');
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('inmejora_cookie_consent', 'all');
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('inmejora_cookie_consent', 'essential');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#1a1a1a] border-t border-[#333] shadow-2xl"
        >
          <div className="container mx-auto px-4 py-6 md:py-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
              {/* Icon and Text Content */}
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-[#d4af37]" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-bold text-base md:text-lg">
                      Uso de Cookies
                    </h3>
                    <Shield className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    Usamos cookies para mejorar tu experiencia conforme a la{' '}
                    <span className="text-[#d4af37] font-semibold">
                      Ley 25.326 de Protección de Datos Personales
                    </span>
                    . Puedes aceptar todas las cookies o utilizar solo las esenciales para el funcionamiento del sitio.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:flex-shrink-0">
                <Button
                  onClick={handleEssentialOnly}
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 font-semibold px-6 py-5 rounded-xl transition-all duration-300"
                >
                  Solo esenciales
                </Button>
                
                <Button
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold px-6 py-5 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300"
                >
                  Aceptar todo
                </Button>
              </div>
            </div>

            {/* Privacy Link */}
            <div className="mt-4 pt-4 border-t border-[#333]">
              <p className="text-gray-500 text-xs md:text-sm text-center md:text-left">
                Para más información, consulta nuestra{' '}
                <a 
                  href="/politica-de-privacidad" 
                  className="text-[#d4af37] hover:underline font-medium transition-colors"
                >
                  Política de Privacidad
                </a>
                {' '}y{' '}
                <a 
                  href="/terminos-y-condiciones" 
                  className="text-[#d4af37] hover:underline font-medium transition-colors"
                >
                  Términos y Condiciones
                </a>
                .
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;