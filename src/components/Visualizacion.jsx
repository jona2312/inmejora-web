import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const Visualizacion = () => {
  const scrollToAssistant = () => {
    const element = document.getElementById('asistente-ia');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 md:py-20 bg-[#1a1a1a] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
          
          <motion.div 
            initial={{ opacity: 1, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative rounded-xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl shadow-[#D4AF37]/10 aspect-video group">
              <img 
                src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop" 
                alt="Render vs Realidad" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 flex">
                 <div className="w-1/2 h-full bg-black/40 flex items-center justify-center border-r border-white/20 backdrop-blur-[1px]">
                    <span className="text-white font-bold tracking-widest bg-black/50 px-2 py-1 md:px-3 rounded text-[10px] md:text-sm">IA RENDER</span>
                 </div>
                 <div className="w-1/2 h-full bg-transparent flex items-center justify-center">
                    <span className="text-white font-bold tracking-widest bg-[#D4AF37]/80 px-2 py-1 md:px-3 rounded text-[10px] md:text-sm shadow-lg">REALIDAD</span>
                 </div>
              </div>
              
              <motion.div 
                className="absolute top-0 bottom-0 left-1/2 w-1 bg-white/50 shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10"
                animate={{ x: [-100, 100, -100] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 1, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-white">
              Así se ve tu espacio <span className="text-[#D4AF37]">antes de la obra</span>
            </h2>
            
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-200">
              Visualizá el cambio antes de empezar
            </h3>
            
            <p className="text-gray-400 text-sm md:text-lg mb-6 md:mb-8 leading-relaxed px-2 lg:px-0">
              Te mostramos propuestas y renders generados con IA para que veas cómo puede transformarse tu casa antes de tomar decisiones de obra.
            </p>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={scrollToAssistant}
                className="bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-6 py-5 md:px-8 md:py-6 text-base md:text-lg font-semibold transition-all duration-300 group"
              >
                Ver ejemplos de renders
                <Eye className="ml-2 group-hover:scale-110 transition-transform w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Visualizacion;