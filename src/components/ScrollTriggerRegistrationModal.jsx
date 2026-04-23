import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Loader2, User, Phone, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { registerUser } from '@/utils/supabaseUtils';

const POPUP_KEY = 'inmejora_popup_shown';

const ScrollTriggerRegistrationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const { toast } = useToast();

  // Initialize checks immediately before mounting effects trigger side-effects
  useEffect(() => {
    const isRegistered = localStorage.getItem('inmejora_registered') === 'true';
    const hasSeenPopup = sessionStorage.getItem(POPUP_KEY) === 'true';

    // 1. & 2. IMMEDIATELY check if we should even set up listeners
    if (isRegistered || hasSeenPopup) {
      // 3. Prevent rendering and abort early
      setShouldRender(false);
      return;
    }

    // 4. ONLY if session storage is empty, set up the listener
    const handleScroll = () => {
      if (window.scrollY > 350) {
        // Double check just to be perfectly thread-safe
        if (sessionStorage.getItem(POPUP_KEY) !== 'true') {
          // 5. When scroll trigger fires, set storage flag
          sessionStorage.setItem(POPUP_KEY, 'true');
          setIsOpen(true);
        }
        // Remove listener immediately after firing once
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres.';
      isValid = false;
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email es inválido.';
      isValid = false;
    }

    if (!formData.phone || formData.phone.trim().length < 8) {
      newErrors.phone = 'Teléfono inválido.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    
    try {
      const res = await registerUser(formData);

      if (res.success) {
        localStorage.setItem('inmejora_registered', 'true');
        setShowSuccess(true);
        setFormData({ name: '', email: '', phone: '', company: '' });
        
        setTimeout(() => {
          setShowSuccess(false);
          handleClose();
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.message,
        });
      }

    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error de conexión. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.phone.trim().length >= 8;

  if (!shouldRender) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-[90%] max-w-[450px] bg-[#141414] border border-[#FCD34D]/20 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.6)] p-6 md:p-8 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors w-8 h-8 z-50"
            >
              <X size={18} />
            </Button>

            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-0 bg-[#141414] rounded-xl flex flex-col items-center justify-center z-40 border border-[#10B981]/30"
                >
                  <div className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center mb-4">
                    <Mail className="text-[#10B981]" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">¡Gracias!</h3>
                  <p className="text-gray-300 text-center px-6">Revisá tu email para los accesos.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FCD34D]/20 to-[#F59E0B]/20 rounded-xl flex items-center justify-center mb-4 border border-[#FCD34D]/30">
                <Mail className="text-[#FCD34D]" size={32} />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">Unite a nuestra comunidad</h3>
              
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Desbloqueá el <span className="text-[#FCD34D] font-semibold">Asistente IA de INMEJORA</span>. Registrate y accedé al asistente.
              </p>

              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="relative">
                  <div className="relative flex items-center">
                    <User className="absolute left-3 text-gray-400" size={18} />
                    <Input
                      type="text"
                      placeholder="Nombre completo"
                      value={formData.name}
                      onChange={handleChange('name')}
                      className={`bg-[#1a1a1a] border-gray-700 text-white h-12 pl-10 rounded-lg transition-all duration-300 focus:border-[#10B981] ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && <p className="text-red-400 text-xs mt-1 text-left">{errors.name}</p>}
                </div>

                <div className="relative">
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 text-gray-400" size={18} />
                    <Input
                      type="email"
                      placeholder="Tu mejor email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      className={`bg-[#1a1a1a] border-gray-700 text-white h-12 pl-10 rounded-lg transition-all duration-300 focus:border-[#10B981] ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1 text-left">{errors.email}</p>}
                </div>

                <div className="relative">
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3 text-gray-400" size={18} />
                    <Input
                      type="tel"
                      placeholder="Teléfono"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      className={`bg-[#1a1a1a] border-gray-700 text-white h-12 pl-10 rounded-lg transition-all duration-300 focus:border-[#10B981] ${
                        errors.phone ? 'border-red-500' : ''
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-xs mt-1 text-left">{errors.phone}</p>}
                </div>

                <div className="relative">
                  <div className="relative flex items-center">
                    <Building className="absolute left-3 text-gray-400" size={18} />
                    <Input
                      type="text"
                      placeholder="Empresa (Opcional)"
                      value={formData.company}
                      onChange={handleChange('company')}
                      className="bg-[#1a1a1a] border-gray-700 text-white h-12 pl-10 rounded-lg transition-all duration-300 focus:border-[#10B981]"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#FCD34D] hover:bg-[#fbbf24] text-black font-bold py-3 rounded-lg text-base shadow-lg transition-all duration-300 disabled:opacity-50 mt-2"
                  disabled={isLoading || (!isFormValid && (formData.name.length > 0))}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Registrando...
                    </>
                  ) : (
                    'Suscribirme y Desbloquear IA'
                  )}
                </Button>
              </form>

              <p className="text-xs text-gray-500 mt-4">
                Al suscribirte, aceptás recibir emails de INMEJORA y accesos al asistente.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollTriggerRegistrationModal;