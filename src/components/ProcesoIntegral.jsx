import React from 'react';
import { motion } from 'framer-motion';
import { Search, Palette, FileText, Hammer, ArrowRight } from 'lucide-react';
import CTAButton from '@/components/CTAButton';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';

const pasos = [
  {
    numero: 1,
    icon: Search,
    titulo: 'Relevamiento y diagnóstico',
    descripcion:
      'Visitamos o analizamos tu espacio, escuchamos qué necesitás y detectamos lo que hay que resolver antes de empezar.'
  },
  {
    numero: 2,
    icon: Palette,
    titulo: 'Propuesta visual y alternativas',
    descripcion:
      'Te mostramos cómo puede quedar tu espacio con renders y opciones de materiales, colores y distribución.'
  },
  {
    numero: 3,
    icon: FileText,
    titulo: 'Presupuesto personalizado y planificación',
    descripcion:
      'Cotizamos según superficie, materiales, estado del inmueble y alcance. Definimos etapas y tiempos por escrito.'
  },
  {
    numero: 4,
    icon: Hammer,
    titulo: 'Ejecución, seguimiento y terminaciones',
    descripcion:
      'Coordinamos los trabajos, te mantenemos al tanto del avance y cuidamos los detalles finales.'
  }
];

const ProcesoIntegral = () => {
  return (
    <section className="py-20 md:py-32 bg-[#0a0a0a] relative" id="proceso">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-[#D4AF37] text-sm font-bold uppercase tracking-wider mb-3 block">
              Nuestro proceso
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Trabajamos cada proyecto de forma integral
            </h2>
            <p className="text-gray-400 text-lg">
              Sin letra chica: cada etapa se acuerda con vos antes de avanzar.
            </p>
          </div>
        </ScrollAnimationWrapper>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-14">
          {pasos.map((paso, index) => (
            <motion.div
              key={paso.numero}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-[#141414] border border-gray-800 rounded-2xl p-8 hover:border-[#D4AF37]/40 transition-colors duration-300"
            >
              <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-[#D4AF37] text-black font-black flex items-center justify-center text-sm">
                {paso.numero}
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-5">
                <paso.icon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{paso.titulo}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{paso.descripcion}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <CTAButton text="Cotizar mi reforma" href="/presupuesto" icon={ArrowRight} size="lg" />
        </div>
      </div>
    </section>
  );
};

export default ProcesoIntegral;
