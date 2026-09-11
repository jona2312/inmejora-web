import React, { useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Phone, Mail, MapPin } from 'lucide-react';
import { useContactModal } from '@/contexts/ContactModalContext';

const ContactModal = () => {
  const { isContactModalOpen, closeContactModal } = useContactModal();
  const returnFocus = useRef(null);
  const optionClass = 'flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FCD34D]';
  return (
    <Dialog.Root open={isContactModalOpen} onOpenChange={open => { if (!open) closeContactModal(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={() => { returnFocus.current = document.activeElement; }}
          onCloseAutoFocus={event => {
            event.preventDefault();
            const target = returnFocus.current;
            if (target && target !== document.body && !target.closest('#mobile-navigation') && target.isConnected && target.getClientRects().length) target.focus();
            else document.querySelector('button[aria-controls="mobile-navigation"]')?.focus();
          }}
          className="fixed z-[101] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%_-_2rem)] max-w-[400px] max-h-[90dvh] overflow-y-auto bg-[#141414] border border-[#FCD34D]/20 rounded-2xl text-white shadow-2xl"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <Dialog.Title className="text-xl font-bold">Contacto</Dialog.Title>
            <Dialog.Close aria-label="Cerrar contacto" className="p-2 rounded-full hover:bg-white/10"><X size={20} /></Dialog.Close>
          </div>
          <div className="p-6 space-y-4">
            <a href="https://wa.me/5491158300611" target="_blank" rel="noopener noreferrer" className={optionClass}>
              <Phone className="shrink-0 text-[#FCD34D]" /><span><strong>WhatsApp</strong><span className="block text-sm text-gray-400">Respuesta inmediata</span></span>
            </a>
            <a href="mailto:hola@inmejora.com" className={optionClass}>
              <Mail className="shrink-0 text-[#FCD34D]" /><span><strong>Email</strong><span className="block text-sm text-gray-400">hola@inmejora.com</span></span>
            </a>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5">
              <MapPin className="shrink-0 text-[#FCD34D]" /><span><strong>Oficina</strong><span className="block text-sm text-gray-400">Buenos Aires, Argentina</span></span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
export default ContactModal;
