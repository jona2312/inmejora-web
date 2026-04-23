import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { rendersAPI } from '@/utils/rendersAPI';

const DeleteRenderModal = ({ isOpen, onClose, renderId, onDeleteSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await rendersAPI.delete(renderId);

      toast({
        title: "Render eliminado",
        description: "El render se ha eliminado correctamente de tu galería.",
      });
      
      onDeleteSuccess(renderId);
      onClose(); // Close this modal
      // Note: The parent modal (RenderDetailModal) should ideally also be closed by the parent component logic when onDeleteSuccess fires.
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: error.message || "No se pudo eliminar el render.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border border-[#333] text-white sm:max-w-md z-[60]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="text-red-500 w-6 h-6" />
            ¿Eliminar render definitivamente?
          </DialogTitle>
          <DialogDescription className="text-gray-400 pt-2 text-base">
            ¿Estás seguro de que quieres eliminar este render? Esta acción no se puede deshacer y no se te devolverán los créditos utilizados.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isDeleting}
            className="border-[#444] text-white hover:bg-[#333]"
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2 hidden" />}
            {isDeleting ? "Eliminando..." : "Sí, eliminar render"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add icon import for the button
import { Trash2 } from 'lucide-react';

export default DeleteRenderModal;