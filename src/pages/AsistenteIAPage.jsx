import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';

export default function AsistenteIAPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/cotizador', { replace: true });
  }, [navigate]);
  return (
    <SEOHead
      title="Asistente IA - INMEJORA"
      description="Nuestro asistente IA te ayuda a cotizar tu reforma al instante."
      ogUrl="https://inmejora.com/cotizador"
    />
  );
}
