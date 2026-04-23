import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, Eye, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContactModal } from '@/contexts/ContactModalContext';

const AsistenteIA = () => {
  const { openContactModal } = useContactModal();

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: 'Subí tus fotos y contanos tu idea',
      description: 'Cargá imágenes, medidas aproximadas y qué te gustaría cambiar o mejorar.',
      bgImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2531&auto=format&fit=crop',
      alt: 'Living con sillón beige y ventana, representando el espacio a reformar.'
    },
    {
      number: 2,
      icon: Sparkles,
      title: 'InAI arma el preproyecto',
      description: 'Nuestro asistente InAI genera propuestas y renders iniciales pensados para tu espacio.',
      bgImage: 'https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?q=80&w=2670&auto=format&fit=crop',
      alt: 'Render de diseño interior generado por IA mostrando un living moderno.'
    },
    {
      number: 3,
      icon: Eye,
      title: 'Revisamos las ideas con vos',
      description: 'Te mostramos las opciones en menos de 72 horas y ajustamos el diseño a tu forma de vivir.',
      bgImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2670&auto=format&fit=crop',
      alt: 'Equipo de diseño revisando planos y propuestas con un cliente.'
    },
    {
      number: 4,
      icon: User,
      title: 'Nuestro equipo visita tu casa',
      description: 'Si querés avanzar, un asesor de INMEJORA coordina una visita presencial en Zona Sur para ver el espacio, afinar detalles y preparar el presupuesto real.',
      bgImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop',
      alt: 'Asesor de INMEJORA realizando una visita técnica en la casa de un cliente.'
    }
  ];

  const handleTrialClick = () => {
    openContactModal();
  };

  return (
    <section id="asistente-ia" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-[#D4AF37]">
            Asistente + IA
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            InAI te muestra las primeras ideas en menos de 72 h. Nuestro equipo las convierte en obra real junto a vos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
               {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] bg-[#D4AF37]/30 z-0 -translate-x-8" aria-hidden="true" />
              )}

              <motion.div
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative bg-[#151515] rounded-xl border border-gray-800 p-8 h-full flex flex-col hover:border-[#D4AF37]/50 transition-colors duration-300 overflow-hidden"
              >
                 <div
                    className="absolute inset-0 w-full h-full z-0 transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${step.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    role="img"
                    aria-label={step.alt}
                  />
                
                <div className="absolute inset-0 bg-black/90 group-hover:bg-black/80 transition-colors duration-300 z-10" aria-hidden="true" />

                <div className="relative z-20 flex flex-col h-full">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#F59E0B] text-black font-bold rounded-full flex items-center justify-center shadow-lg shadow-[#F59E0B]/20 z-20">
                    {step.number}
                  </div>

                  <div className="w-14 h-14 rounded-lg bg-[#1a1a1a]/80 border border-gray-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 backdrop-blur-md">
                    <step.icon className="text-[#D4AF37]" size={28} />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleTrialClick}
                className="bg-[#F59E0B] text-black hover:bg-[#D4AF37] text-lg px-8 py-6 rounded-md font-semibold shadow-lg shadow-[#F59E0B]/20"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Probar Asistente IA Gratis
              </Button>
            </motion.div>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]"></span>
              </span>
              Asistente IA disponible: primeras pruebas gratuitas.
            </div>
          </div>

          <p className="text-gray-500 text-sm italic max-w-2xl text-center mt-8">
            "Si estás en otra zona, igual podés escribirnos: vemos juntos opciones de trabajo remoto o proyectos futuros."
          </p>
        </div>
      </div>
    </section>
  );
};

export default AsistenteIA;