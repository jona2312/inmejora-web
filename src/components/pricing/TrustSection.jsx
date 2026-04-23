import React from 'react';
import { MapPin, Video, UserCheck, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSection = () => {
  const exclusiveFeatures = [
    {
      icon: MapPin,
      title: "Planos técnicos a escala",
      description: "Documentación detallada y a escala lista para entregar a contratistas y comenzar la obra sin contratiempos."
    },
    {
      icon: Video,
      title: "Videos del hogar",
      description: "Recorridos virtuales interactivos para visualizar el resultado final desde todos los ángulos antes de empezar."
    },
    {
      icon: UserCheck,
      title: "Asesor dedicado",
      description: "Un profesional a tu disposición para guiarte en cada etapa del proyecto y asegurar resultados óptimos."
    },
    {
      icon: Calculator,
      title: "Cotización real de obra",
      description: "Presupuestos precisos basados en precios del mercado argentino actualizados, sin sorpresas."
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5 mt-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          La experiencia <span className="text-[#F59E0B]">Mi Proyecto</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Llevamos tu diseño al siguiente nivel con herramientas exclusivas pensadas para hacer realidad tu visión con precisión milimétrica y atención personalizada.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {exclusiveFeatures.map((feature, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -5 }}
            className="bg-[#141414] border border-[#F59E0B]/20 rounded-2xl p-8 text-center hover:border-[#F59E0B]/50 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 mx-auto bg-[#F59E0B]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <feature.icon className="w-8 h-8 text-[#F59E0B]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrustSection;