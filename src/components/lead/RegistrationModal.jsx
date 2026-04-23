import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import { validateName, validateEmail, validatePhone } from '@/utils/FormValidation';

const RegistrationModal = ({ isOpen, onClose, onSubmit, loading, showSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({ name: null, email: null, phone: null });
  const [touched, setTouched] = useState({ name: false, email: false, phone: false });

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', email: '', phone: '' });
      setErrors({ name: null, email: null, phone: null });
      setTouched({ name: false, email: false, phone: false });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on change if touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let result = { isValid: true, error: null };
    if (name === 'name') result = validateName(value);
    if (name === 'email') result = validateEmail(value);
    if (name === 'phone') result = validatePhone(value);
    
    setErrors(prev => ({ ...prev, [name]: result.error }));
    return result.isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all touched
    setTouched({ name: true, email: true, phone: true });
    
    const isNameValid = validateField('name', formData.name);
    const isEmailValid = validateField('email', formData.email);
    const isPhoneValid = validateField('phone', formData.phone);

    if (isNameValid && isEmailValid && isPhoneValid) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-[90%] md:w-[500px] lg:w-[600px] overflow-hidden relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
            disabled={loading}
          >
            <X size={24} />
          </button>

          <div className="p-8 text-center bg-gray-50 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-[#10B981] mb-2">
              🏠 ¡Desbloqueá el Asistente INMEJORA!
            </h2>
            <p className="text-gray-600">Registrate GRATIS y accedé a:</p>
          </div>

          <div className="p-8">
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-gray-700">
                <CheckCircle2 className="text-[#10B981] mr-3" size={20} />
                <span>Renders personalizados de tu espacio</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle2 className="text-[#10B981] mr-3" size={20} />
                <span>Cotizaciones detalladas</span>
              </li>
              <li className="flex items-center text-gray-700">
                <CheckCircle2 className="text-[#10B981] mr-3" size={20} />
                <span>Asesoramiento en diseño completo</span>
              </li>
            </ul>

            <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm text-center mb-6 font-medium border border-green-200">
              🎁 Todo incluido sin costo para que pruebes el servicio
            </div>

            {showSuccess ? (
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 text-[#10B981] animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">¡Registro exitoso!</h3>
                <p className="text-gray-600">Te estamos redirigiendo a WhatsApp...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre completo *"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 bg-white text-gray-900 placeholder:text-gray-400 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#10B981] focus:ring-[#10B981]'}`}
                    disabled={loading}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1 ml-1">{errors.name}</p>}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 bg-white text-gray-900 placeholder:text-gray-400 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#10B981] focus:ring-[#10B981]'}`}
                    disabled={loading}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1 ml-1">{errors.email}</p>}
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Teléfono (Opcional)"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 bg-white text-gray-900 placeholder:text-gray-400 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#10B981] focus:ring-[#10B981]'}`}
                    disabled={loading}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1 ml-1">{errors.phone}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Procesando...</>
                  ) : (
                    "🚀 Continuar en WhatsApp"
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegistrationModal;