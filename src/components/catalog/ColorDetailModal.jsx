import React from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, X, Droplet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ColorDetailModal = ({ isOpen, onClose, color }) => {
  const { toast } = useToast();

  if (!color) return null;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: `${type} copiado al portapapeles: ${text}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border border-[#333] text-white p-0 overflow-hidden sm:max-w-3xl flex flex-col md:flex-row">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full transition-colors backdrop-blur-sm md:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Color Swatch */}
        <div 
          className="w-full md:w-1/2 h-64 md:h-auto min-h-[300px] relative"
          style={{ backgroundColor: color.hex }}
        >
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-start mb-6 hidden md:flex">
            <h2 className="text-2xl font-bold text-white pr-8">{color.nombre}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-white mb-6 md:hidden">{color.nombre}</h2>

          <div className="space-y-4 flex-grow">
            <div>
              <p className="text-sm text-gray-400">Código</p>
              <p className="text-lg font-medium">{color.codigo}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Familia</p>
              <span className="inline-block mt-1 px-3 py-1 bg-[#333] rounded-full text-sm">
                {color.familia}
              </span>
            </div>

            <div className="pt-4 border-t border-[#333] space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#222] rounded-lg">
                <div>
                  <p className="text-xs text-gray-400">HEX</p>
                  <p className="font-mono">{color.hex}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(color.hex, 'HEX')} className="hover:bg-[#333]">
                  <Copy className="w-4 h-4 text-gray-400 hover:text-[#FCB048]" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#222] rounded-lg">
                <div>
                  <p className="text-xs text-gray-400">RGB</p>
                  <p className="font-mono">{color.rgb}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(color.rgb, 'RGB')} className="hover:bg-[#333]">
                  <Copy className="w-4 h-4 text-gray-400 hover:text-[#FCB048]" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4">
            <Button 
              className="w-full bg-[#FCB048] text-black hover:bg-[#e09b3d] font-bold"
              onClick={() => {
                onClose();
                toast({ title: "Próximamente", description: "La vinculación de productos y colores estará disponible pronto." });
              }}
            >
              <Droplet className="w-4 h-4 mr-2" />
              Ver Productos Compatibles
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorDetailModal;