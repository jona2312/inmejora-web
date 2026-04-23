import React, { useState } from 'react';
import { useCatalog } from '@/contexts/CatalogContext';
import { Package, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ProductDetailModal from './ProductDetailModal';

const ProductGrid = () => {
  const { filteredProducts, loadingProducts } = useCatalog();
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (loadingProducts) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-80 bg-[#222] rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#333] rounded-2xl bg-[#1a1a1a]">
        <Package className="w-12 h-12 text-gray-500 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">No se encontraron productos</h3>
        <p className="text-gray-400">Intenta ajustar tus filtros de búsqueda.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div 
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="group flex flex-col bg-[#1a1a1a] rounded-2xl border border-[#333] hover:border-[#FCB048] transition-all overflow-hidden cursor-pointer"
          >
            <div className="h-48 bg-[#0f0f0f] relative flex items-center justify-center p-6 border-b border-[#333]">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.nombre} 
                  className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <Package className="w-16 h-16 text-gray-600" />
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className="bg-[#FCB048] text-black hover:bg-[#e09b3d] border-none">{product.categoria}</Badge>
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex gap-2 mb-3">
                <span className="text-xs text-gray-400 border border-[#444] px-2 py-0.5 rounded bg-[#222]">{product.uso}</span>
                <span className="text-xs text-gray-400 border border-[#444] px-2 py-0.5 rounded bg-[#222]">{product.acabado}</span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{product.nombre}</h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-grow">{product.descripcion}</p>
              
              <button className="flex items-center text-sm font-medium text-[#FCB048] group-hover:text-white transition-colors mt-auto">
                Ver Detalles <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ProductDetailModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />
    </>
  );
};

export default ProductGrid;