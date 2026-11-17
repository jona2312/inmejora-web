import React from 'react';
import { MapPin, Video, UserCheck, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSection = () => {
  const exclusiveFeatures = [
    {
      icon: MapPin,
      title: "Alcance por confirmar",
      description: "El equipo revisa las medidas, la localidad y los requisitos antes de definir una propuesta."
    },
    {
      icon: Video,
      title: "Visualización en preparación",
      description: "La generación automática de imágenes y videos no está habilitada para uso comercial."
    },
    {
      icon: UserCheck,
      title: "Revisión humana",
      description: "Un responsable debe confirmar que la información es suficiente y revisar la próxima acción."
    },
    {
      icon: Calculator,
      title: "Presupuesto sujeto a aprobación",
      description: "Los costos, el alcance y la versión formal requieren revisión y aprobación humana. No se envían presupuestos automáticos."
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5 mt-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Antes de <span className="text-[#F59E0B]">presupuestar</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          El catálogo permite consultar opciones. Las compras y las suscripciones siguen deshabilitadas hasta completar su revisión.
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
