import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, MessageCircle, Home, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useWebhookMessage } from '@/hooks/useWebhookMessage';

const RegistrationSection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { sendWebhookMessage, loading: isSubmitting } = useWebhookMessage();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    whatsapp: '',
    city: '',
    newsletter_opt_in: true
  });

  const COMPANY_WHATSAPP_NUMBER = '5491168000741';

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  useEffect(() => {
    let timeout;
    if (showSuccessModal) {
      timeout = setTimeout(() => {
        handleCloseModal();
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [showSuccessModal]);

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const handleHomeRedirect = () => {
    setShowSuccessModal(false);
    navigate('/');
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.whatsapp || !formData.city) {
        toast({
            variant: "destructive",
            title: "Campos incompletos",
            description: "Por favor completá todos los campos requeridos: nombre, email, WhatsApp y ciudad.",
        });
        return;
    }

    const result = await sendWebhookMessage({
      clientPhone: formData.whatsapp,
      clientName: formData.full_name,
      message: `Registro web: Ciudad=${formData.city}, Email=${formData.email}, Newsletter=${formData.newsletter_opt_in ? 'Sí' : 'No'}`,
      tipo: "registro_web"
    });

    if (result.success) {
      setShowSuccessModal(true);
      setFormData({
        full_name: '',
        email: '',
        whatsapp: '',
        city: '',
        newsletter_opt_in: true
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error al registrarse",
        description: result.error || "Hubo un error, intentá de nuevo.",
      });
    }
  };

  return (
    <section id="unite" className="py-16 bg-[#151515] border-t border-[#222] relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-[#0f0f0f] rounded-2xl p-8 md:p-12 border border-[#333] shadow-2xl shadow-[#d4af37]/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-bl-full pointer-events-none" />

          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-white">Unite a INMEJORA</h2>
              <p className="text-gray-400 mb-6">
                Registrate gratis para recibir novedades, tendencias en diseño y acceso prioritario a nuestros servicios.
              </p>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" /> Descuentos exclusivos</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" /> Tips de arquitectura y diseño</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" /> Invitaciones a eventos</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Nombre completo *"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:outline-none focus:border-[#d4af37] transition-colors text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Tu Email *"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:outline-none focus:border-[#d4af37] transition-colors text-white placeholder:text-gray-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="whatsapp"
                  placeholder="WhatsApp *"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:outline-none focus:border-[#d4af37] transition-colors text-white placeholder:text-gray-500"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Ciudad *"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:outline-none focus:border-[#d4af37] transition-colors text-white placeholder:text-gray-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="newsletter_opt_in"
                  id="newsletter"
                  checked={formData.newsletter_opt_in}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#333] text-[#d4af37] focus:ring-[#d4af37] bg-[#1a1a1a]"
                />
                <label htmlFor="newsletter" className="text-sm text-gray-400 cursor-pointer select-none">
                  Quiero recibir noticias y novedades
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-6 text-lg transition-all"
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Registrando...</>
                ) : (
                  <>Registrarme gratis</>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={handleCloseModal}
            />

            <motion.div
              initial={{ opacity: 1, scale: 1, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 1, scale: 0.9, y: 20 }}
              className="relative bg-[#1a1a1a] border border-[#d4af37]/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-[#d4af37]/10 overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-[#d4af37]" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">¡Registro exitoso!</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Te contactaremos por WhatsApp para comenzar tu proyecto.
                </p>

                <div className="flex flex-col gap-3 w-full">
                  <a 
                    href={`https://wa.me/${COMPANY_WHATSAPP_NUMBER}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={handleCloseModal}
                    className="w-full"
                  >
                    <Button className="w-full bg-[#25D366] hover:bg-[#1fb855] text-white font-bold py-6 rounded-xl shadow-lg shadow-green-900/20">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Hablar con nuestro asistente
                    </Button>
                  </a>

                  <Button 
                    onClick={handleHomeRedirect}
                    variant="outline" 
                    className="w-full border-[#333] text-gray-300 hover:bg-[#222] hover:text-white py-6 rounded-xl"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Volver al inicio
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RegistrationSection;