import { useEffect } from 'react';

// Mock analytics hook - replace with actual provider (Segment, Mixpanel, etc.)
export const usePresupuestoAnalytics = () => {
  const trackEvent = (eventName, properties = {}) => {
    try {
      console.log(`[Analytics] ${eventName}`, properties);
      // window.analytics?.track(eventName, properties); // Segment example
      // mixpanel.track(eventName, properties); // Mixpanel example
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  };

  const trackView = () => {
    trackEvent('presupuesto_form_viewed', {
      timestamp: new Date().toISOString(),
      path: window.location.pathname
    });
  };

  const trackSubmission = (data) => {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('utm_source') || 'direct';

    trackEvent('presupuesto_enviado', {
      tipo_proyecto: data.tipo_proyecto,
      metraje: data.metraje,
      source: source,
      has_photo: !!data.foto_url
    });
  };

  const trackWhatsAppClick = (presupuestoId) => {
    trackEvent('presupuesto_whatsapp_clicked', {
      presupuesto_id: presupuestoId
    });
  };

  return {
    trackEvent,
    trackView,
    trackSubmission,
    trackWhatsAppClick
  };
};