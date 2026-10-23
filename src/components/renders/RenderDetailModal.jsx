import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Legacy render IDs were credit-transaction IDs, not real render artifact IDs.
// The canonical private gallery is the only supported way to read uploaded originals.
const RenderDetailModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f0f0f] border border-[#333] text-white max-w-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Detalle del render no disponible</h2>
        <p role="status">No existe un resultado acreditado por el Renderista. No se mostrará una transacción de créditos como imagen.</p>
        <Button onClick={onClose} className="bg-[#d4af37] text-black">Cerrar</Button>
      </DialogContent>
    </Dialog>
  );
};
export default RenderDetailModal;
