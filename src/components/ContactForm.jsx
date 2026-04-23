import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import PhoneInput from '@/components/ui/PhoneInput';
import ContactFormModal from '@/components/ContactFormModal';
import { submitContactForm } from '@/utils/supabaseUtils';
import { useToast } from '@/components/ui/use-toast';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email requerido (formato válido)";
    }
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = "Teléfono requerido (formato válido)";
    }
    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es requerido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setShowModal(true);
        toast({
          title: "Mensaje Enviado",
          description: "Nos pondremos en contacto a la brevedad.",
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
        setErrors({});
      } else {
          toast({
              variant: "destructive",
              title: "Error al enviar",
              description: result.message || "No pudimos enviar tu mensaje.",
          });
      }
    } catch (error) {
      toast({
          variant: "destructive",
          title: "Error inesperado",
          description: "Hubo un error de red. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handlePhoneChange = (e) => {
      setFormData(prev => ({ ...prev, phone: e.target.value }));
      if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
  };

  return (
    <>
      <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <h3 className="text-2xl font-bold text-white mb-6">Contanos tu proyecto</h3>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
              Nombre Completo <span className="text-[#D4AF37]">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="Juan Pérez"
              className={`bg-gray-900 text-white border-gray-700 h-11 focus:border-[#D4AF37] ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
              Email <span className="text-[#D4AF37]">*</span>
            </label>
            <Input
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="juan@ejemplo.com"
              type="email"
              className={`bg-gray-900 text-white border-gray-700 h-11 focus:border-[#D4AF37] ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
              Teléfono <span className="text-[#D4AF37]">*</span>
            </label>
            <PhoneInput 
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="549 1155551234"
                className={`bg-gray-900 border-gray-700 h-11 focus:border-[#D4AF37]`}
                error={errors.phone}
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5 ml-1">
                <label className="block text-xs font-medium text-gray-400">
                Mensaje <span className="text-[#D4AF37]">*</span>
                </label>
                <span className="text-[10px] text-gray-600">
                    {formData.message.length}/500
                </span>
            </div>
            <Textarea
              value={formData.message}
              onChange={(e) => {
                  if (e.target.value.length <= 500) handleChange('message')(e);
              }}
              placeholder="Hola, me gustaría recibir asesoramiento para..."
              className={`bg-gray-900 text-white border-gray-700 min-h-[120px] focus:border-[#D4AF37] resize-none ${errors.message ? 'border-red-500' : ''}`}
            />
            {errors.message && <p className="text-red-500 text-xs mt-1 ml-1">{errors.message}</p>}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D4AF37] hover:bg-[#fbbf24] text-black font-bold h-12 text-base transition-all shadow-lg shadow-[#D4AF37]/10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Mensaje
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <ContactFormModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
};

export default ContactForm;