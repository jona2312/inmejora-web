import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroTextSection = () => {
  const navigate = useNavigate();

  const handleCtaClick = (e) => {
    e.preventDefault();
    navigate('/proveedores/registro');
  };

  const scrollToAssistant = (e) => {
    e.preventDefault();
    navigate('/proveedores/login');
  };

  return (
    <section className="relative py-16 md:py-24 bg-[#0a0a0a] overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl text-center">
            
            <motion.div 
              initial={{ opacity: 1 }} 
              whileInView={{ opacity: 1 }} 
              transition={{ delay: 0.3 }}
              className="inline-block mb-4"
            >
              <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
                RED DE PROVEEDORES + CONEXIONES
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              Aumentá tus ventas integrándote a nuestra red
            </h2>

            <p className="text-gray-300 text-base md:text-xl leading-relaxed max-w-2xl mx-auto mb-4 font-light">
              Conectá tus productos con miles de clientes en proceso de reforma. Gestioná tus catálogos fácilmente y multiplicá tu alcance.
            </p>
            <p className="text-gray-400 text-sm md:text-base font-medium mb-10">
                Pinturerías · Corralones · Iluminación · Sanitaros
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button
                  onClick={handleCtaClick}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#C49B2E] hover:to-[#E08E00] text-black font-bold px-8 py-6 text-base md:text-lg shadow-lg shadow-[#D4AF37]/20 rounded-xl"
                >
                  Unirse a la Red
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button
                  onClick={scrollToAssistant}
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-8 py-6 text-base md:text-lg rounded-xl bg-transparent"
                >
                  <Sparkles className="mr-2 h-5 w-5 text-[#8B5CF6]" />
                  Ingresar al Portal
                </Button>
              </motion.div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroTextSection;