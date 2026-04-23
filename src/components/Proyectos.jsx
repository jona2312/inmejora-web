import React from 'react';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';
import BeforeAfterGallery from '@/components/BeforeAfterGallery';

const Proyectos = () => {
  return (
    <section id="proyectos" className="py-16 md:py-32 bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4">
        <ScrollAnimationWrapper>
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs md:text-sm md:text-base text-[#D4AF37] font-semibold uppercase tracking-wider">Nuestro Trabajo</span>
            <h2 className="text-2xl md:text-5xl font-black mt-2 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent">Proyectos Destacados</h2>
            <p className="text-base md:text-xl text-gray-400 mt-2 md:mt-4 max-w-2xl mx-auto px-2">
              Explorá la transformación completa de espacios reales. Interactuá con cada imagen para ver el proceso de renovación.
            </p>
          </div>
        </ScrollAnimationWrapper>

        <BeforeAfterGallery />
      </div>
    </section>
  );
};

export default Proyectos;