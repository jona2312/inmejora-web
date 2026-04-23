import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useChat } from '@/contexts/ChatContext';
import { useChatLogic } from '@/hooks/useChatLogic';
import { X, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const RegistrationModal = () => {
  const { showRegistrationModal, setShowRegistrationModal, isLoading } = useChat();
  const { registerUser } = useChatLogic();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    terms: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.terms) {
      toast({
        variant: "destructive",
        title: "Campos requeridos",
        description: "Por favor completá nombre, email y aceptá los términos."
      });
      return;
    }

    const result = await registerUser(formData);
    
    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo completar el registro. Intentalo de nuevo."
      });
    } else {
        toast({
            title: "¡Registro exitoso!",
            description: "Te redirigimos a WhatsApp para continuar con el asistente completo.",
            className: "bg-green-50 border-green-200"
        });

        // Close modal
        setShowRegistrationModal(false);

        // Redirect to WhatsApp if link exists
        if (result.whatsapp_link) {
            setTimeout(() => {
                window.open(result.whatsapp_link, '_blank');
            }, 1000); // Small delay for better UX
        }
    }
  };

  if (!showRegistrationModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 rounded-t-2xl md:rounded-2xl"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200"
        >
          {/* Header - White background as requested in Task 3 */}
          <div className="bg-white p-6 pb-2 text-center relative">
             <button 
                onClick={() => setShowRegistrationModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
             >
                <X size={20} />
             </button>

             <h3 className="text-2xl font-bold text-[#10B981] mb-2">
                🏠 ¡Desbloqueá el Asistente INMEJORA!
             </h3>
          </div>

          <div className="p-6 pt-2">
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle2 className="text-[#10B981] w-5 h-5 mr-3 flex-shrink-0" />
                <span>Renders personalizados de tu espacio</span>
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle2 className="text-[#10B981] w-5 h-5 mr-3 flex-shrink-0" />
                <span>Cotizaciones detalladas</span>
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle2 className="text-[#10B981] w-5 h-5 mr-3 flex-shrink-0" />
                <span>Asesoramiento en diseño completo</span>
              </li>
            </ul>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Nombre completo"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="bg-white border-gray-200 focus:border-[#10B981] focus:ring-[#10B981] text-gray-900 placeholder:text-gray-400"
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="bg-white border-gray-200 focus:border-[#10B981] focus:ring-[#10B981] text-gray-900 placeholder:text-gray-400"
                required
              />
              <Input
                type="tel"
                placeholder="Teléfono (Opcional)"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="bg-white border-gray-200 focus:border-[#10B981] focus:ring-[#10B981] text-gray-900 placeholder:text-gray-400"
              />

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.terms}
                  onChange={e => setFormData({...formData, terms: e.target.checked})}
                  className="mt-1 w-4 h-4 text-[#10B981] rounded border-gray-300 focus:ring-[#10B981]"
                />
                <label htmlFor="terms" className="text-xs text-gray-500">
                  Acepto los términos y condiciones y recibir novedades.
                </label>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-5 rounded-lg shadow-lg shadow-green-500/20 transition-all duration-300 transform hover:scale-[1.02]"
              >
                {isLoading ? "Procesando..." : "🚀 Registrarme y continuar"}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
                {/* Fixed potential nested link issue by using Link directly without wrapping 'a' tag */}
                <Link to="/login" className="text-xs text-gray-500 hover:text-[#10B981] transition-colors">
                    ¿Ya tenés cuenta? <span className="font-semibold underline">Iniciar sesión</span>
                </Link>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-1 text-[10px] text-gray-400">
                <Lock size={10} />
                <span>Tus datos están protegidos y seguros.</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegistrationModal;