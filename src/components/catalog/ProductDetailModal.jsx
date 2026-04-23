import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, CheckCircle, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  const { toast } = useToast();

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border border-[#333] text-white max-w-4xl p-0 overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[85vh]">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full transition-colors backdrop-blur-sm md:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="w-full md:w-5/12 h-64 md:h-auto bg-[#0f0f0f] border-b md:border-b-0 md:border-r border-[#333] flex items-center justify-center p-8 relative">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.nombre} className="max-w-full max-h-full object-contain mix-blend-screen drop-shadow-2xl" />
          ) : (
            <div className="w-32 h-32 bg-[#222] rounded-full flex items-center justify-center">
              <span className="text-gray-500">Sin Imagen</span>
            </div>
          )}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge className="w-fit bg-[#FCB048] text-black hover:bg-[#e09b3d]">{product.categoria}</Badge>
            <Badge variant="outline" className="w-fit border-[#333] text-gray-300 bg-[#1a1a1a]/80">{product.uso}</Badge>
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start mb-4 hidden md:flex">
            <h2 className="text-2xl lg:text-3xl font-bold text-white pr-8">{product.nombre}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 md:hidden">{product.nombre}</h2>

          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {product.descripcion}
          </p>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Características Principales</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.caracteristicas.map((carac, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>{carac}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Especificaciones</h3>
            <div className="bg-[#222] rounded-xl border border-[#333] p-4 grid grid-cols-2 gap-4">
              {Object.entries(product.especificaciones).map(([key, val]) => (
                <div key={key}>
                  <p className="text-xs text-gray-500 capitalize mb-1">{key}</p>
                  <p className="text-sm text-white font-medium">{val}</p>
                </div>
              ))}
              <div>
                <p className="text-xs text-gray-500 capitalize mb-1">Acabado</p>
                <p className="text-sm text-white font-medium">{product.acabado}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-[#333] grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              className="w-full bg-[#FCB048] text-black hover:bg-[#e09b3d] font-bold"
              onClick={() => window.open('https://wa.me/5491100000000', '_blank')}
            >
              Consultar Disponibilidad
            </Button>
            <Button 
              variant="outline"
              className="w-full border-[#444] text-white hover:bg-[#333]"
              onClick={() => toast({ title: "Descarga iniciada", description: "Ficha técnica en proceso de descarga." })}
            >
              <Download className="w-4 h-4 mr-2" />
              Ficha Técnica
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;