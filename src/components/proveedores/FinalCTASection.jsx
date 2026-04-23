import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FinalCTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-[#0a0a0a] to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span className="text-sm text-[#d4af37] font-medium">Oportunidad Limitada</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para formar parte de <span className="text-[#d4af37]">INMEJORA</span>?
          </h2>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Unite a nuestra red de proveedores y empezá a recibir solicitudes de clientes calificados hoy mismo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/proveedores/registro">
              <Button 
                size="lg"
                className="bg-[#d4af37] hover:bg-[#b8992f] text-black font-bold px-8 py-6 text-lg group"
              >
                Registrarse como Proveedor
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link to="/contacto">
              <Button 
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Hablar con un Asesor
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;