import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';
import { handleMiProyecto } from '@/utils/whatsappUtils';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-center md:text-left">
          
          {/* Column 1: INMEJORA */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-3xl font-black text-white tracking-tighter mb-4"
              >
                IN<span className="text-[#d4af37]">MEJORA</span>
              </motion.div>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-[250px] leading-relaxed mx-auto md:mx-0">
              Visualizá tu reforma antes de hacerla. Renders con IA desde tu celular.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href="https://www.instagram.com/inmejora.ar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center transition-all duration-300 group border border-white/10 hover:border-[#d4af37] hover:bg-[#d4af37]"
              >
                <Instagram className="text-gray-400 group-hover:text-black transition-colors w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/inmejora"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center transition-all duration-300 group border border-white/10 hover:border-[#d4af37] hover:bg-[#d4af37]"
              >
                <Facebook className="text-gray-400 group-hover:text-black transition-colors w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Producto */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-lg font-bold text-white mb-6">Producto</span>
            <nav className="flex flex-col space-y-4">
              <Link to="/precios" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">
                Planes y Precios
              </Link>
              <button 
                onClick={handleMiProyecto} 
                className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300 text-left"
              >
                Asistente IA
              </button>
              <Link to="/portal/renders" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">
                Renders con IA
              </Link>
              <Link to="/proveedores" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">
                Red de Proveedores
              </Link>
            </nav>
          </div>

          {/* Column 3: Empresa */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-lg font-bold text-white mb-6">Empresa</span>
            <nav className="flex flex-col space-y-4">
              <a href="mailto:hola@inmejora.com" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2">
                <Mail className="w-4 h-4" /> hola@inmejora.com
              </a>
              <a href="https://wa.me/5491139066429" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300 flex items-center gap-2">
                <Phone className="w-4 h-4" /> +54 9 11 3906-6429
              </a>
            </nav>
          </div>
          
          {/* Column 4: Legal */}
          <div className="flex flex-col items-center md:items-start">
             <span className="text-lg font-bold text-white mb-6">Legal</span>
             <nav className="flex flex-col space-y-4">
                <Link to="/politica-de-privacidad" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">
                    Política de Privacidad
                </Link>
                <Link to="/terminos-y-condiciones" className="text-gray-400 hover:text-[#d4af37] transition-colors duration-300">
                    Términos y Condiciones
                </Link>
             </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
            <p>© 2026 INMEJORA. Todos los derechos reservados.</p>
            <p>
              Parte del grupo <span className="text-white font-bold tracking-wider">INB</span>
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;