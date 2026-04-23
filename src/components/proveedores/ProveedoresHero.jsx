import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, LogIn } from 'lucide-react';

const ProveedoresHero = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNotImplemented = (e, path) => {
    e.preventDefault();
    toast({
      title: "Próximamente",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      variant: "default",
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1469289759076-d1484757abc3"
          alt="Almacén de materiales de construcción profesional"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#0a0a0a]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-[#FCD34D]/10 text-[#FCD34D] text-sm md:text-base font-semibold tracking-wider mb-6 border border-[#FCD34D]/20">
            RED DE PROVEEDORES
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
            ¿Querés ser proveedor de <span className="text-[#FCD34D]">INMEJORA</span>?
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Sumá tus productos a nuestra red de proveedores y accedé a nuevos clientes. Trabajamos con los mejores del mercado.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button
              onClick={() => navigate('/proveedores/registro')}
              className="w-full sm:w-auto bg-[#FCD34D] hover:bg-[#fbbf24] text-black font-bold text-lg px-8 py-6 rounded-xl shadow-[0_0_30px_-5px_rgba(252,211,77,0.5)] hover:shadow-[0_0_50px_-10px_rgba(252,211,77,0.7)] hover:scale-105 transition-all duration-300 border-2 border-[#FCD34D]"
            >
              Registrarme como proveedor
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button
              onClick={() => navigate('/proveedores/login')}
              variant="outline"
              className="w-full sm:w-auto bg-black/40 hover:bg-white/10 text-white border-gray-600 hover:border-[#FCD34D] font-bold text-lg px-8 py-6 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105"
            >
              Ya soy proveedor - Ingresar
              <LogIn className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative gradient element */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />
    </section>
  );
};

export default ProveedoresHero;