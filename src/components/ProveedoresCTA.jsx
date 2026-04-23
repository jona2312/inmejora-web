import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ArrowRight, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProveedoresCTA = () => {
  return (
    <section className="py-16 md:py-24 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FCD34D]/20 via-black to-black pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-[#141414] border border-gray-800 rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(0,0,0,0.5)] text-center flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-[#2d2d2d] rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-gray-700">
            <Building2 className="text-[#FCD34D] w-8 h-8" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            ¿Tu empresa quiere llegar a miles de hogares?
          </h2>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
            Únete a nuestra red de proveedores y aliados estratégicos. Publica tus productos, ofrece promociones exclusivas y conecta directamente con clientes que están realizando reformas y construcciones.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-10 text-left">
            <div className="bg-[#1a1a1a] p-5 rounded-xl border border-gray-800 flex items-start space-x-4">
              <TrendingUp className="text-[#10B981] w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-semibold mb-1">Aumenta tus ventas</h4>
                <p className="text-gray-500 text-sm">Posiciona tus materiales y servicios justo en el momento de la decisión de compra.</p>
              </div>
            </div>
            <div className="bg-[#1a1a1a] p-5 rounded-xl border border-gray-800 flex items-start space-x-4">
              <Users className="text-[#3B82F6] w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-semibold mb-1">Visibilidad directa</h4>
                <p className="text-gray-500 text-sm">Destaca tu marca en presupuestos generados y galerías de inspiración de usuarios.</p>
              </div>
            </div>
          </div>
          
          <Link to="/proveedores/registro" className="group">
            <button className="bg-[#FCD34D] hover:bg-[#fbbf24] text-black font-bold py-4 px-8 rounded-xl text-lg shadow-[0_0_20px_rgba(252,211,77,0.3)] transition-all duration-300 flex items-center space-x-3 transform group-hover:scale-105">
              <span>Registrarse como Proveedor</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          
          <p className="text-gray-500 text-sm mt-6">
            El registro es rápido y te da acceso inmediato a nuestro panel de proveedores.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProveedoresCTA;