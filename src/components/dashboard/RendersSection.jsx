import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const RendersSection = ({ renders = [] }) => {
  const { toast } = useToast();

  const handleNewRender = () => {
    toast({
      description: "🚧 La creación de renders estará disponible pronto. 🚀",
    });
  };

  return (
    <Card className="bg-[#141414] border-gray-800 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-800">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <ImageIcon className="text-[#D4AF37]" size={20} /> Mis Renders
        </CardTitle>
        <Button 
          onClick={handleNewRender}
          size="sm" 
          className="bg-[#D4AF37] text-black hover:bg-[#fbbf24] font-semibold"
        >
          <Plus className="w-4 h-4 mr-1" /> Nuevo Render
        </Button>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        {renders && renders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renders.map((render) => (
              <div 
                key={render.id} 
                className="group relative bg-[#0a0a0a] rounded-xl overflow-hidden border border-gray-800 hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                <div className="aspect-video bg-gray-800 relative">
                  {render.url ? (
                    <img 
                      src={render.url} 
                      alt={render.name || `Render ${render.id}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <ImageIcon className="text-gray-700 w-12 h-12" />
                    </div>
                  )}
                  
                  {/* Status Overlay */}
                  <div className="absolute top-2 right-2">
                    <Badge className={`${
                      render.status === 'completed' ? 'bg-green-500/90' : 
                      render.status === 'processing' ? 'bg-yellow-500/90' : 'bg-gray-500/90'
                    } text-black border-none font-bold backdrop-blur-sm`}>
                      {render.status === 'completed' ? 'Listo' : 
                       render.status === 'processing' ? 'Procesando' : render.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white line-clamp-1">{render.name || `Proyecto #${render.id}`}</h4>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{new Date(render.created_at).toLocaleDateString()}</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[#D4AF37] hover:text-[#fbbf24] hover:bg-[#D4AF37]/10">
                      Ver <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-800 rounded-xl bg-gray-900/20">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="text-gray-500 w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No tienes renders aún</h3>
            <p className="text-gray-400 text-sm max-w-xs mb-6">
              Comienza tu primer proyecto de diseño para visualizar tu espacio ideal.
            </p>
            <Button onClick={handleNewRender} variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
              Crear mi primer render
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RendersSection;