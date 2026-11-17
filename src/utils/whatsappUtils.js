import { buildWhatsappUrl } from '@/config/commercial';

export const handleMiProyecto = () => {
  const url = buildWhatsappUrl('Hola! Me interesa consultar por mi proyecto con INMEJORA.');
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
};

