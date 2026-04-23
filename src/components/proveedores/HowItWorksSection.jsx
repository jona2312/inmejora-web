import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardEdit, Key, UploadCloud, Rocket } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const steps = [
  {
    icon: ClipboardEdit,
    title: "Registrate",
    description: "Completá el formulario con los datos de tu empresa."
  },
  {
    icon: Key,
    title: "Te activamos",
    description: "Nuestro equipo revisa tu solicitud y te envía el código de activación."
  },
  {
    icon: UploadCloud,
    title: "Cargá tus precios",
    description: "Ingresá a tu panel y subí tu lista de precios (Excel, PDF o manual)."
  },
  {
    icon: Rocket,
    title: "Empezá a vender",
    description: "Tus productos aparecen en nuestras cotizaciones automáticas."
  }
];

const HowItWorksSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-16 md:py-24 bg-[#141414] relative z-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Un proceso simple y rápido para empezar a llegar a más clientes.
          </p>
        </div>

        <div ref={ref} className="relative max-w-5xl mx-auto">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-800" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-[#0a0a0a] rounded-full border-4 border-[#FCD34D] flex items-center justify-center mb-6 relative z-10 shadow-[0_0_20px_rgba(252,211,77,0.2)]">
                  <step.icon className="w-10 h-10 text-[#FCD34D]" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#FCD34D] rounded-full flex items-center justify-center text-black font-bold border-4 border-[#141414]">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;