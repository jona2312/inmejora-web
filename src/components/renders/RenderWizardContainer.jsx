import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import RenderWizardStep1 from './RenderWizardStep1';
import RenderWizardStep2 from './RenderWizardStep2';
import RenderWizardStep3 from './RenderWizardStep3';

const RenderWizardContainer = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [selectedSpace, setSelectedSpace] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleNext = () => {
    if (currentStep === 1 && !file) {
      toast({
        variant: "destructive",
        title: "Imagen requerida",
        description: "Por favor sube una imagen para continuar."
      });
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleFileRemove = () => {
    setFile(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!file) {
      toast({
        variant: "destructive",
        title: "Imagen requerida",
        description: "Debes subir una imagen."
      });
      return;
    }

    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Descripción requerida",
        description: "Debes describir los cambios que quieres."
      });
      return;
    }

    if (!selectedSpace) {
      toast({
        variant: "destructive",
        title: "Tipo de espacio requerido",
        description: "Debes seleccionar el tipo de espacio."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Backend integration placeholder
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmitSuccess(true);
      
      toast({
        title: "¡Solicitud enviada!",
        description: "Tu solicitud fue enviada exitosamente.",
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setCurrentStep(1);
        setFile(null);
        setDescription('');
        setSelectedSpace('');
      }, 3000);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al enviar",
        description: "Hubo un problema al enviar tu solicitud. Intenta nuevamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return !!file;
    if (currentStep === 2) return description.trim().length > 0;
    if (currentStep === 3) return !!selectedSpace;
    return false;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {submitSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 1, scale: 0.95 }}
            className="wizard-card py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </motion.div>
            
            <h3 className="text-2xl font-bold text-white mb-3">
              ✅ Tu solicitud fue enviada
            </h3>
            <p className="text-gray-300 text-lg max-w-md mx-auto">
              Te contactamos por WhatsApp en menos de 2 horas.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`step-${currentStep}`}
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <RenderWizardStep1
                file={file}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
              />
            )}
            
            {currentStep === 2 && (
              <RenderWizardStep2
                description={description}
                onDescriptionChange={setDescription}
              />
            )}
            
            {currentStep === 3 && (
              <RenderWizardStep3
                selectedSpace={selectedSpace}
                onSpaceSelect={setSelectedSpace}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!submitSuccess && (
        <div className="mt-8 flex items-center justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Anterior
          </Button>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all ${
                  step === currentStep
                    ? 'bg-[#D4AF37] w-8'
                    : step < currentStep
                    ? 'bg-[#D4AF37]/50'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-[#D4AF37] text-black hover:bg-[#b5952f] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Siguiente
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="bg-[#D4AF37] text-black hover:bg-[#b5952f] disabled:opacity-50 disabled:cursor-not-allowed font-semibold px-8 py-6 text-lg"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                  />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Solicitar Render
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default RenderWizardContainer;