import React from 'react';
import { motion } from 'framer-motion';
import { Home, Bath, Sofa, Bed, Building2, Briefcase } from 'lucide-react';

const SPACE_TYPES = [
  { id: 'cocina', label: 'Cocina', icon: Home, color: '#D4AF37' },
  { id: 'bano', label: 'Baño', icon: Bath, color: '#3B82F6' },
  { id: 'living', label: 'Living', icon: Sofa, color: '#10B981' },
  { id: 'dormitorio', label: 'Dormitorio', icon: Bed, color: '#8B5CF6' },
  { id: 'fachada', label: 'Fachada', icon: Building2, color: '#F59E0B' },
  { id: 'oficina', label: 'Oficina', icon: Briefcase, color: '#EC4899' }
];

const RenderWizardStep3 = ({ selectedSpace, onSpaceSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white">Selecciona tipo de espacio</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Paso</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span className="text-gray-500">/</span>
              <span className="text-gray-500">3</span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#D4AF37] rounded-full transition-all duration-500" style={{ width: '100%' }} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {SPACE_TYPES.map((space) => {
          const Icon = space.icon;
          const isSelected = selectedSpace === space.id;
          
          return (
            <motion.button
              key={space.id}
              onClick={() => onSpaceSelect(space.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: SPACE_TYPES.indexOf(space) * 0.05 }}
              className={`wizard-card flex flex-col items-center justify-center p-6 min-h-[140px] cursor-pointer ${
                isSelected
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all ${
                  isSelected
                    ? 'bg-[#D4AF37]'
                    : 'bg-gray-800'
                }`}
              >
                <Icon
                  className={`w-8 h-8 transition-colors ${
                    isSelected ? 'text-black' : 'text-gray-400'
                  }`}
                />
              </div>
              
              <span
                className={`text-sm font-semibold transition-colors ${
                  isSelected ? 'text-[#D4AF37]' : 'text-gray-300'
                }`}
              >
                {space.label}
              </span>
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-2 w-2 h-2 bg-[#D4AF37] rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
        <p className="text-sm text-green-300">
          ✅ Selecciona el tipo de ambiente para optimizar el resultado del render.
        </p>
      </div>
    </motion.div>
  );
};

export default RenderWizardStep3;