import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Loader2, ArrowRight, Home, Building, Factory, Grid } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { presupuestoSchema, validateFile } from '@/schemas/presupuestoSchema';
import { submitPresupuesto } from '@/utils/presupuestoApi';
import PresupuestoSuccessModal from '@/components/PresupuestoSuccessModal';
import PresupuestoErrorModal from '@/components/PresupuestoErrorModal';
import { usePresupuestoAnalytics } from '@/hooks/usePresupuestoAnalytics';

const TIPOS_PROYECTO = [
  { id: 'Vivienda', icon: Home, label: 'Vivienda' },
  { id: 'Comercial', icon: Building, label: 'Local Comercial' },
  { id: 'Industrial', icon: Factory, label: 'Nave Industrial' },
  { id: 'Otro', icon: Grid, label: 'Otro' },
];

const PresupuestoPage = () => {
  const { trackView, trackSubmission } = usePresupuestoAnalytics();
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    tipo_proyecto: '',
    metraje: '',
    descripcion: '',
    website: '' // honeypot
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [successData, setSuccessData] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    trackView();
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-format phone (basic)
    let formattedValue = value;
    if (name === 'telefono') {
        formattedValue = value.replace(/[^\d+]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectTipo = (tipo) => {
    setFormData(prev => ({ ...prev, tipo_proyecto: tipo }));
    if (errors.tipo_proyecto) {
      setErrors(prev => ({ ...prev, tipo_proyecto: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "Error en archivo",
        description: validation.error
      });
      return;
    }

    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    try {
      const dataToValidate = {
        ...formData,
        metraje: formData.metraje ? Number(formData.metraje) : undefined
      };
      presupuestoSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error.errors) {
        const formattedErrors = {};
        error.errors.forEach(err => {
          formattedErrors[err.path[0]] = err.message;
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
            toast({
                variant: "destructive",
                title: "Error de validación",
                description: "Revisá los campos marcados en rojo."
            });
        }
        return;
    }

    setIsSubmitting(true);

    try {
      // Parse metraje before sending
      const submissionData = {
          ...formData,
          metraje: Number(formData.metraje)
      };

      const result = await submitPresupuesto(submissionData, photo);
      
      trackSubmission(submissionData);
      setSuccessData(result);
      
      // Reset form
      setFormData({
        nombre: '',
        telefono: '',
        tipo_proyecto: '',
        metraje: '',
        descripcion: '',
        website: ''
      });
      removePhoto();
      
    } catch (err) {
      setErrorMessage(err.message || 'Error inesperado al enviar el presupuesto.');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      <SEOHead 
        title="Solicitar Presupuesto | INMEJORA - Renders 3D Gratis"
        description="Solicita tu presupuesto de renders 3D gratis. Completa el formulario y nos contactaremos en breve con una propuesta personalizada."
        ogUrl="https://inmejora.com/presupuesto"
        ogTitle="Solicitar Presupuesto Gratis | INMEJORA"
        ogDescription="Presupuesto gratis de renders 3D. Completa el formulario y recibe una propuesta personalizada."
      />

      <Header />

      <main className="flex-grow pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-10">
            <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="inline-block bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full px-4 py-1.5 text-[#d4af37] text-sm font-semibold mb-4">
                    Cotización Rápida
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                    Solicitá tu <span className="text-[#d4af37]">Presupuesto</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-xl mx-auto">
                    Contanos sobre tu proyecto. Un asesor analizará tu solicitud y te contactará con una estimación detallada.
                </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#141414] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Honeypot */}
              <input 
                type="text" 
                name="website" 
                value={formData.website} 
                onChange={handleChange} 
                className="hidden" 
                tabIndex="-1" 
                autoComplete="off" 
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-gray-300">Nombre completo *</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    placeholder="Ej. Juan Pérez"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`bg-gray-900/50 border-gray-700 text-white focus:border-[#d4af37] focus:ring-[#d4af37]/20 ${errors.nombre ? 'border-red-500' : ''}`}
                  />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-gray-300">Teléfono (WhatsApp) *</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    placeholder="+54 9 11 1234-5678"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={`bg-gray-900/50 border-gray-700 text-white focus:border-[#d4af37] focus:ring-[#d4af37]/20 ${errors.telefono ? 'border-red-500' : ''}`}
                  />
                  {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                </div>
              </div>

              {/* Tipo de Proyecto */}
              <div className="space-y-3 pt-2">
                <Label className="text-gray-300">Tipo de Proyecto *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TIPOS_PROYECTO.map((tipo) => {
                    const Icon = tipo.icon;
                    const isSelected = formData.tipo_proyecto === tipo.id;
                    return (
                      <div
                        key={tipo.id}
                        onClick={() => handleSelectTipo(tipo.id)}
                        className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                          isSelected 
                            ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37]' 
                            : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-600 hover:bg-gray-800'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-[#d4af37]' : 'text-gray-500'}`} />
                        <span className="text-sm font-medium text-center">{tipo.label}</span>
                      </div>
                    )
                  })}
                </div>
                {errors.tipo_proyecto && <p className="text-red-500 text-xs">{errors.tipo_proyecto}</p>}
              </div>

              {/* Metraje */}
              <div className="space-y-2 pt-2">
                <Label htmlFor="metraje" className="text-gray-300">Metraje estimado (m²) *</Label>
                <div className="relative">
                    <Input
                        id="metraje"
                        name="metraje"
                        type="number"
                        min="1"
                        placeholder="Ej. 120"
                        value={formData.metraje}
                        onChange={handleChange}
                        className={`bg-gray-900/50 border-gray-700 text-white focus:border-[#d4af37] focus:ring-[#d4af37]/20 pr-12 ${errors.metraje ? 'border-red-500' : ''}`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">m²</span>
                </div>
                {errors.metraje && <p className="text-red-500 text-xs mt-1">{errors.metraje}</p>}
              </div>

              {/* Descripción */}
              <div className="space-y-2 pt-2">
                <Label htmlFor="descripcion" className="text-gray-300">Detalles del proyecto *</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Contanos qué querés hacer. Ej: Quiero remodelar la cocina completa, cambiar pisos y muebles..."
                  rows={4}
                  value={formData.descripcion}
                  onChange={handleChange}
                  className={`bg-gray-900/50 border-gray-700 text-white focus:border-[#d4af37] focus:ring-[#d4af37]/20 resize-none ${errors.descripcion ? 'border-red-500' : ''}`}
                />
                <div className="flex justify-between mt-1">
                    {errors.descripcion ? (
                        <p className="text-red-500 text-xs">{errors.descripcion}</p>
                    ) : (
                        <span className="text-xs text-transparent">Espaciador</span>
                    )}
                    <span className="text-xs text-gray-500">{formData.descripcion.length}/1000</span>
                </div>
              </div>

              {/* Foto Upload */}
              <div className="space-y-2 pt-2">
                <Label className="text-gray-300">Foto del estado actual (Opcional)</Label>
                
                {!photoPreview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-700 hover:border-[#d4af37]/50 rounded-xl p-8 text-center cursor-pointer transition-colors bg-gray-900/30 group"
                  >
                    <Upload className="w-8 h-8 text-gray-500 mx-auto mb-3 group-hover:text-[#d4af37] transition-colors" />
                    <p className="text-sm text-gray-400 group-hover:text-gray-300">
                      Hacé clic para subir una foto
                    </p>
                    <p className="text-xs text-gray-600 mt-1">JPG, PNG o WEBP (Máx. 5MB)</p>
                  </div>
                ) : (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-700">
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-red-500/80 text-white p-2 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-800">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-[#d4af37] hover:bg-[#b5952f] text-black font-bold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-[#d4af37]/20 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Enviando...</>
                  ) : (
                    <>Solicitar Presupuesto <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </Button>
                <p className="text-center text-xs text-gray-500 mt-4">
                  Al enviar este formulario aceptás nuestros Términos y Condiciones.
                </p>
              </div>

            </form>
          </motion.div>
        </div>
      </main>

      <Footer />

      <PresupuestoSuccessModal 
        isOpen={!!successData} 
        onClose={() => setSuccessData(null)} 
        data={successData} 
      />
      <PresupuestoErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)} 
        error={errorMessage} 
      />
    </div>
  );
};

export default PresupuestoPage;