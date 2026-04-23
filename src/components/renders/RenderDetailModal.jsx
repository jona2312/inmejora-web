import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Share2, Download, Trash2, Edit3, X, Calendar, Layers, Home, Loader2, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const RenderDetailModal = ({ isOpen, onClose, renderId, onDeleteSuccess }) => {
  const [render, setRender] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && renderId) {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('client_credits')
            .select('*')
            .eq('id', renderId)
            .single();
            
          if (error) throw error;
          setRender(data);
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el detalle del render." });
          onClose();
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    } else {
      setRender(null);
    }
  }, [isOpen, renderId, onClose, toast]);

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-AR', {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f0f0f] border border-[#333] text-white max-w-xl w-[95vw] h-[90vh] p-0 flex flex-col overflow-hidden rounded-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full transition-colors backdrop-blur-sm">
          <X className="w-5 h-5" />
        </button>

        {loading || !render ? (
           <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#d4af37] mb-4" />
                <p className="text-gray-400">Cargando detalles...</p>
              </div>
           </div>
        ) : (
          <div className="w-full h-full bg-[#1a1a1a] p-6 flex flex-col overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-white border-b border-[#333] pb-4">Detalles del Registro</h2>
            
            <div className="space-y-5 mb-8 flex-grow">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#d4af37] mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Fecha</p>
                  <p className="font-medium text-white">{formatDate(render.created_at)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#d4af37] mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Tipo</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 mt-1">
                    {render.transaction_type || 'N/A'}
                  </span>
                </div>
              </div>

              {render.description && (
                <div className="mt-6 p-4 bg-[#222] rounded-xl border border-[#333]">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Descripción</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{render.description}</p>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-[#333]">
              <Button onClick={onClose} className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-semibold">
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RenderDetailModal;