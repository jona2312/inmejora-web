import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// A credit journal entry is not a render. No legacy lookup or synthetic detail.
const RenderDetailModal = ({ isOpen, onClose }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogTitle>Render no disponible</DialogTitle>
      <p role="status">La generación y el detalle de renders todavía no están habilitados.</p>
      <Button onClick={onClose}>Cerrar</Button>
    </DialogContent>
  </Dialog>
);
export default RenderDetailModal;
