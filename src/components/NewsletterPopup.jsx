import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { subscribeNewsletter } from '@/utils/supabaseUtils';

const POPUP_KEY = 'inmejora_popup_shown';

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // 1. Critical Session Check: If key exists, don't even start the timer
    const hasSeenPopup = sessionStorage.getItem(POPUP_KEY) === 'true';
    
    if (hasSeenPopup) {
      setShouldRender(false);
      return;
    }

    // 2. Delayed trigger (5 seconds)
    const timer = setTimeout(() => {
      // 3. Double check session storage before showing to prevent race conditions
      if (sessionStorage.getItem(POPUP_KEY) !== 'true') {
        // 4. IMMEDIATELY set sessionStorage BEFORE displaying the popup
        sessionStorage.setItem(POPUP_KEY, 'true');
        setIsOpen(true);
      } else {
        setShouldRender(false);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    // Ensure key is set on close as a fallback
    sessionStorage.setItem(POPUP_KEY, 'true');
    setIsOpen(false);
  };
  
  const validateEmail = () => {
    if (!email) {
      setError('El email es requerido.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('El formato del email es inválido.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      const res = await subscribeNewsletter(email);

      if (res.success) {
        toast({
          title: '¡Suscripción exitosa!',
          description: res.message,
        });
        setEmail('');
        handleClose();
      } else {
        toast({
            variant: "destructive",
            title: 'Error en la suscripción',
            description: res.message,
        });
      }
    } catch (err) {
      toast({
          variant: "destructive",
          title: 'Error inesperado',
          description: 'Hubo un problema. Por favor, intentá de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Do not render anything if the session flag was found on mount
  if (!shouldRender) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center sm:justify-end pointer-events-none">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 1, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-sm bg-[#141414] border border-gray-800 rounded-2xl shadow-2xl p-8 pointer-events-auto"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </Button>
            
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6]/20 to-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-4 border border-gray-800">
                    <Mail className="text-[#D4AF37]" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Unite a nuestra comunidad</h3>
                <p className="text-gray-400 mb-6 text-sm">Recibí inspiración, tendencias y novedades sobre diseño y reformas directamente en tu email.</p>

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="relative">
                        <Input
                            type="email"
                            placeholder="Tu mejor email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError('');
                            }}
                            className={`bg-gray-900 text-white border-gray-700 h-12 pr-12 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${error ? 'border-red-500' : ''}`}
                        />
                         {error && <p className="text-red-500 text-xs mt-1 text-left">{error}</p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-4 bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold py-3 text-base shadow-lg shadow-[#D4AF37]/20 transition-all duration-300 rounded-lg"
                        disabled={isLoading}
                    >
                         {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Suscribirme'}
                    </Button>
                </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;