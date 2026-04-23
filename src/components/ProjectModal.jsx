import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Ruler, LayoutTemplate } from 'lucide-react';

const ProjectModal = ({ isOpen, onClose, project }) => {
  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 1, scale: 1, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 1, scale: 0.95, y: 20 }}
          className="relative bg-[#141414] border border-[#D4AF37]/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-[#D4AF37] rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>

          {/* Image Section */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative">
            <img
              src={project.image}
              alt={project.category}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#141414]/10 pointer-events-none" />
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
            <span className="text-[#D4AF37] text-sm font-bold uppercase tracking-wider mb-2">
              {project.category}
            </span>
            <h3 className="text-3xl font-bold text-white mb-4">Detalles del Proyecto</h3>
            
            <p className="text-gray-300 leading-relaxed mb-8">
              {project.description}
            </p>

            {project.stats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <Ruler className="text-[#D4AF37] w-5 h-5 mb-2" />
                  <div className="text-xs text-gray-400">Tamaño</div>
                  <div className="font-semibold text-white">{project.stats.size}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <Calendar className="text-[#D4AF37] w-5 h-5 mb-2" />
                  <div className="text-xs text-gray-400">Duración</div>
                  <div className="font-semibold text-white">{project.stats.duration}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <LayoutTemplate className="text-[#D4AF37] w-5 h-5 mb-2" />
                  <div className="text-xs text-gray-400">Estilo</div>
                  <div className="font-semibold text-white">{project.stats.style}</div>
                </div>
              </div>
            )}

            <button 
                onClick={onClose}
                className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-xl hover:bg-[#fbbf24] transition-colors"
            >
                Cerrar Detalles
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;