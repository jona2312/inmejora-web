import React, { useState } from 'react';
import { useCatalog } from '@/contexts/CatalogContext';
import { Palette } from 'lucide-react';
import ColorDetailModal from './ColorDetailModal';

const ColorGrid = () => {
  const { filteredColors, loadingColors } = useCatalog();
  const [selectedColor, setSelectedColor] = useState(null);

  if (loadingColors) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="aspect-square bg-[#222] rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (filteredColors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#333] rounded-2xl bg-[#1a1a1a]">
        <Palette className="w-12 h-12 text-gray-500 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">No se encontraron colores</h3>
        <p className="text-gray-400">Intenta cambiar los filtros o el término de búsqueda.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredColors.map(color => (
          <div 
            key={color.id}
            onClick={() => setSelectedColor(color)}
            className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-[#333] hover:border-[#FCB048] transition-all"
          >
            <div 
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundColor: color.hex }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <span className="text-xs text-gray-300 font-mono mb-1">{color.codigo}</span>
              <p className="text-white font-bold truncate">{color.nombre}</p>
              <p className="text-xs text-gray-400 mt-1">{color.familia}</p>
            </div>
            
            {/* Base name visible for light colors without hover */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/40 backdrop-blur-sm group-hover:hidden flex justify-between items-center">
              <span className="text-xs text-white font-medium truncate pr-2">{color.nombre}</span>
              <span className="w-4 h-4 rounded-full border border-white/20" style={{backgroundColor: color.hex}}></span>
            </div>
          </div>
        ))}
      </div>

      <ColorDetailModal 
        isOpen={!!selectedColor} 
        onClose={() => setSelectedColor(null)} 
        color={selectedColor} 
      />
    </>
  );
};

export default ColorGrid;