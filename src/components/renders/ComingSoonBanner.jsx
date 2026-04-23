import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Check, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FEATURES = [
  'Renders instantáneos con IA en minutos',
  'Editor de estilos en tiempo real',
  'Comparativa antes/después con slider',
  'Integración con catálogo de materiales',
  'Exportación en alta resolución'
];

const ComingSoonBanner = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCTA = () => {
    const message = encodeURIComponent('Hola! Me interesa el acceso anticipado al Self-Service de Renders 🚀');
    window.open(`https://wa.me/5491168000741?text=${message}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#141414] to-[#0a0a0a] rounded-2xl border-2 border-[#D4AF37]/50 p-8 md:p-12 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent"
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 1 : 0.5
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center">
            <Rocket className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#D4AF37]" />
              Próximamente: Self-Service de Renders
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Generación automática sin esperas
            </p>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 1, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-4 bg-[#1a1a1a] rounded-lg border border-gray-800 hover:border-[#D4AF37]/30 transition-colors"
            >
              <div className="w-6 h-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span className="text-gray-300 text-sm md:text-base leading-relaxed">
                {feature}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/30">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              Sé de los primeros en probarlo
            </h3>
            <p className="text-gray-400 text-sm">
              Registrate para recibir acceso anticipado y beneficios exclusivos
            </p>
          </div>
          
          <Button
            onClick={handleCTA}
            className="bg-[#D4AF37] text-black hover:bg-[#b5952f] font-bold px-8 py-6 text-base rounded-xl whitespace-nowrap shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 transition-all"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Acceso Anticipado
          </Button>
        </div>

        {/* Beta badge */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
          <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider bg-[#D4AF37]/10 px-3 py-1 rounded-full">
            🚧 En construcción
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
        </div>
      </div>
    </motion.div>
  );
};

export default ComingSoonBanner;