import React, { useState } from 'react';
import LeadBanner from './LeadBanner';
import AnimatedCTAButton from './AnimatedCTAButton';
import RegistrationModal from './RegistrationModal';
import { useLeadRegistration } from '@/hooks/useLeadRegistration';
import { useToast } from '@/components/ui/use-toast';

const LeadCaptureWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, loading, error, success } = useLeadRegistration();
  const { toast } = useToast();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    if (!loading && !success) {
      setIsModalOpen(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    const result = await register(formData);
    
    if (result.success) {
      toast({
        title: "¡Registro exitoso!",
        description: "Redirigiendo a WhatsApp...",
        className: "bg-green-50 border-green-200 text-green-900"
      });
      // Modal will show success state and close itself or redirect
      setTimeout(() => setIsModalOpen(false), 3500);
    } else {
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: result.error || "Hubo un problema. Por favor intentá nuevamente."
      });
    }
  };

  return (
    <div className="w-full">
      <LeadBanner>
        <AnimatedCTAButton onClick={handleOpenModal} />
      </LeadBanner>
      
      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        loading={loading}
        showSuccess={success}
      />
    </div>
  );
};

export default LeadCaptureWidget;