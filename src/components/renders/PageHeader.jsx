import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Construction } from 'lucide-react';

const PageHeader = () => {
  return (
    <div className="text-center mb-12 md:mb-16">
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-4 py-2 rounded-full mb-6"
      >
        <Construction className="w-4 h-4 text-[#D4AF37]" />
        <span className="text-sm font-semibold text-[#D4AF37]">
          En construcción — Próximamente herramienta self-service completa
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-4 mb-4"
      >
        <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center">
          <Wand2 className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white">
          Generador de Renders IA
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
      >
        Describe tu visión, sube tu foto y nuestro equipo la transforma
      </motion.p>

      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm"
      >
        <div className="h-px w-12 bg-gray-700" />
        <span>Tiempo de respuesta: menos de 2 horas</span>
        <div className="h-px w-12 bg-gray-700" />
      </motion.div>
    </div>
  );
};

export default PageHeader;