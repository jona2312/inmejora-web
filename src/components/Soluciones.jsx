import React, { useState } from 'react';
import { solucionesData } from '@/data/SolucionesData';
import ServiceCard from '@/components/ServiceCard';
import ServiceModal from '@/components/ServiceModal';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';

const Soluciones = () => {
  const [selectedService, setSelectedService] = useState(null);

  const handleCardClick = (service) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  return (
    <section className="py-20 md:py-32 bg-[#0a0a0a] relative overflow-hidden" id="soluciones">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#0a0a0a] to-[#000000] z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <ScrollAnimationWrapper>
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] text-sm font-bold uppercase tracking-wider mb-2 block">
              SERVICIOS
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Soluciones Integrales
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Explorá nuestros servicios y cotizá al instante. Desde pequeñas reparaciones hasta grandes reformas.
            </p>
          </div>
        </ScrollAnimationWrapper>

        {/* Grid Layout: 
            Mobile: 1 col
            Tablet: 2-3 cols 
            Desktop: 4 cols
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-items-stretch">
          {solucionesData.map((service, index) => (
            <div 
              key={service.id} 
              className=""
            >
              <ServiceCard 
                service={service} 
                index={index} 
                onClick={handleCardClick} 
              />
            </div>
          ))}
        </div>
      </div>

      <ServiceModal 
        isOpen={!!selectedService} 
        onClose={handleCloseModal} 
        service={selectedService} 
      />
    </section>
  );
};

export default Soluciones;