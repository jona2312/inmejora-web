import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const LeadBanner = ({ children }) => {
  return (
    <div className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] py-16 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-white" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full border-4 border-white" />
      </div>

      <div className="max-w-[1200px] mx-auto flex flex-col items-center justify-center text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
          🏠 Asistente IA de INMEJORA
        </h1>
        <p className="text-xl md:text-2xl text-indigo-100 mb-10 font-medium">
          Transformá tu espacio con inteligencia artificial
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-12 text-left md:text-center">
          <div className="flex items-center text-white bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            <CheckCircle2 className="text-green-400 mr-2" size={24} />
            <span className="font-semibold text-lg">Renders personalizados GRATIS</span>
          </div>
          <div className="flex items-center text-white bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            <CheckCircle2 className="text-green-400 mr-2" size={24} />
            <span className="font-semibold text-lg">Cotizaciones detalladas GRATIS</span>
          </div>
          <div className="flex items-center text-white bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            <CheckCircle2 className="text-green-400 mr-2" size={24} />
            <span className="font-semibold text-lg">Asesoramiento profesional GRATIS</span>
          </div>
        </div>

        {/* This will render the AnimatedCTAButton passed as children */}
        {children}
      </div>
    </div>
  );
};

export default LeadBanner;