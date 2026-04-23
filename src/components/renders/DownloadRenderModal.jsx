import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Loader2, Download, Monitor, FileText, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const DownloadRenderModal = ({ isOpen, onClose, renderId, renderData }) => {
  const [downloading, setDownloading] = useState(null);
  const { toast } = useToast();

  const handleDownload = async (format) => {
    setDownloading(format);
    try {
      const token = localStorage.getItem('inmejora_token');
      // En un entorno real, esto devolvería un blob o una URL
      const response = await fetch(`https://inmejora-dash-n45svwn6.manus.space/api/horizon/renders/${renderId}/download?format=${format}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al descargar');

      toast({
        title: "Descarga iniciada",
        description: `Descargando formato ${format.toUpperCase()}`,
      });
      
      // Simular descarga exitosa para UI
      setTimeout(() => {
        setDownloading(null);
        onClose();
      }, 1000);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de descarga",
        description: "No se pudo iniciar la descarga. Intenta de nuevo.",
      });
      setDownloading(null);
    }
  };

  const options = [
    { id: '4k', label: '4K Ultra HD', desc: '3840 x 2160 px', icon: Monitor },
    { id: 'hd', label: 'Full HD', desc: '1920 x 1080 px', icon: ImageIcon },
    { id: 'preview', label: 'Vista Previa', desc: '1280 x 720 px', icon: ImageIcon },
    { id: 'pdf', label: 'Reporte PDF', desc: 'Incluye metadatos', icon: FileText },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border border-[#333] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Descargar Render</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-3 mt-4">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleDownload(opt.id)}
              disabled={downloading !== null}
              className="flex items-center justify-between p-4 rounded-xl border border-[#333] bg-[#222] hover:border-[#d4af37] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#333] flex items-center justify-center group-hover:bg-[#d4af37]/20 transition-colors">
                  <opt.icon className="w-5 h-5 text-gray-400 group-hover:text-[#d4af37]" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">{opt.label}</p>
                  <p className="text-sm text-gray-400">{opt.desc}</p>
                </div>
              </div>
              {downloading === opt.id ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#d4af37]" />
              ) : (
                <Download className="w-5 h-5 text-gray-500 group-hover:text-[#d4af37]" />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadRenderModal;