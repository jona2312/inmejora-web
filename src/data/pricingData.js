export const pricingPlans = [
  {
    id: 'explorar',
    name: 'Explorar',
    price: '0',
    period: 'Gratis para siempre',
    renders: '3',
    description: 'Perfecto para probar la plataforma y descubrir el poder de la IA.',
    features: [
      '3 renders gratuitos',
      'Marca de agua',
      'Resolución estándar (HD)',
      'Estilos de diseño básicos',
      'Soporte comunitario'
    ],
    buttonText: 'Comenzar Gratis',
    color: '#9CA3AF',
    productId: null,
    type: 'free'
  },
  {
    id: 'basico',
    name: 'Básico',
    price: { monthly: '15.000', annual: '150.000' },
    period: { monthly: '/mes', annual: '/año' },
    renders: '10',
    description: 'Ideal para proyectos de redecoración de una habitación pequeña.',
    features: [
      '10 renders por mes',
      'Sin marca de agua',
      'Resolución Full HD',
      'Todos los estilos de diseño',
      'Soporte por email'
    ],
    buttonText: 'Comprar Ahora',
    color: '#fff',
    productId: { monthly: 'basico_mensual', annual: 'basico_anual' },
    type: 'paid'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: '22.000', annual: '220.000' },
    period: { monthly: '/mes', annual: '/año' },
    renders: '40',
    description: 'Para profesionales y personas reformando toda su casa.',
    badge: 'Más Popular',
    features: [
      '40 renders por mes',
      'Sin marca de agua',
      'Alta resolución Premium',
      'Acceso a todos los estilos',
      'Opciones avanzadas (luces, texturas)',
      'Soporte prioritario'
    ],
    exclusiveFeatures: ['Alta resolución Premium', 'Opciones avanzadas (luces, texturas)'],
    buttonText: 'Comprar Ahora',
    color: '#d4af37',
    productId: { monthly: 'pro_mensual', annual: 'pro_anual' },
    type: 'paid'
  },
  {
    id: 'mi_proyecto',
    name: 'Mi Proyecto',
    price: 'A Medida',
    period: 'Precio',
    renders: 'Ilimitados',
    description: 'Pre-proyecto listo para municipio. Presupuesto de obra completo, contacto con proveedores y renders a medida.',
    badge: 'PREMIUM',
    features: [
      'Pre-proyecto listo para municipio',
      'Renders ilimitados por un experto',
      'Presupuesto de obra detallado',
      'Cotización real de materiales',
      'Contacto con proveedores locales',
      'Soporte 1-a-1 por WhatsApp'
    ],
    buttonText: 'Comprar Ahora',
    color: '#10B981',
    productId: 'mi_proyecto',
    type: 'paid'
  }
];