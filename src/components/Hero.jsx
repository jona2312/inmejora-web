import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import HeroVideo from './HeroVideo';
import CTAButton from '@/components/CTAButton';

const Hero = () => {
  const scrollToContent = () => {
    const nextSection = document.getElementById('hero-text');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="inicio" className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <HeroVideo />

      <div className="relative z-20 container mx-auto px-4 flex flex-col items-center justify-center h-full text-center">
        
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-baseline justify-center select-none mb-4">
            <span className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter shadow-black drop-shadow-2xl">
              IN
            </span>
            <span 
              className="text-6xl md:text-8xl lg:text-9xl font-black text-[#FCD34D] tracking-tighter ml-1 md:ml-2 drop-shadow-[0_0_25px_rgba(252,211,77,0.4)]"
            >
              MEJORA
            </span>
          </div>
          <h1 className="text-white text-lg md:text-2xl font-medium max-w-2xl mx-auto drop-shadow-lg leading-snug">
            Visualizá tu reforma antes de hacerla.<br className="hidden md:block"/> Renders con IA desde tu celular.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto px-4 sm:px-0"
        >
          <CTAButton 
            text="Probá gratis" 
            href="/registro" 
            size="lg" 
            icon={ArrowRight} 
            className="w-full sm:w-auto" 
          />
          <CTAButton 
            text="Ser Proveedor" 
            href="/proveedores" 
            variant="secondary" 
            size="lg" 
            className="w-full sm:w-auto text-white border-white/50 hover:bg-white/10 hover:border-white bg-black/30 backdrop-blur-sm" 
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
        onClick={scrollToContent}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="text-white/70 hover:text-[#FCD34D] w-8 h-8 md:w-10 md:h-10 transition-colors" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;