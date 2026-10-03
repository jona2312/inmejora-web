// Commercial content. Rules: no prices, no invented projects/testimonials/metrics, no promise we cannot keep.

export const SERVICES = [
  {
    slug: 'remodelaciones',
    name: 'Remodelaciones',
    short: 'Cocinas, baños y ambientes completos.',
    detail: 'Renovación de ambientes: demolición, instalaciones, revestimientos y terminaciones.',
    ask: ['Qué ambiente querés renovar', 'Qué te gustaría cambiar', 'Fotos y medidas aproximadas'],
    icon: 'hammer',
  },
  {
    slug: 'pintura-y-terminaciones',
    name: 'Pintura y terminaciones',
    short: 'Interiores, exteriores y detalles finales.',
    detail: 'Pintura de interiores y exteriores, reparación de paredes y terminaciones.',
    ask: ['Qué superficies o ambientes', 'Estado actual de las paredes', 'Fotos'],
    icon: 'paint',
  },
  {
    slug: 'impermeabilizacion',
    name: 'Impermeabilización',
    short: 'Terrazas, techos, humedad y filtraciones.',
    detail: 'Soluciones para humedad, filtraciones y terrazas. Suele requerir ver el lugar para diagnosticar bien.',
    ask: ['Dónde aparece la humedad o la filtración', 'Hace cuánto', 'Fotos de la zona afectada'],
    icon: 'drop',
  },
  {
    slug: 'pisos-y-revestimientos',
    name: 'Pisos y revestimientos',
    short: 'Colocación y renovación de pisos y paredes.',
    detail: 'Colocación y renovación de pisos y revestimientos en interiores y exteriores.',
    ask: ['Ambiente y metros cuadrados aproximados', 'Material que tenés en mente (si ya lo elegiste)', 'Fotos'],
    icon: 'grid',
  },
  {
    slug: 'construccion-y-ampliaciones',
    name: 'Construcción y ampliaciones',
    short: 'Ampliá tu casa o sumá un ambiente.',
    detail: 'Ampliaciones y obra nueva de escala doméstica. Requiere relevamiento y, en general, planos.',
    ask: ['Qué querés construir o ampliar', 'Terreno o superficie disponible', 'Si tenés planos o fotos'],
    icon: 'home',
  },
  {
    slug: 'diseno-y-visualizacion',
    name: 'Diseño y visualización',
    short: 'Mirá cómo podría quedar tu ambiente.',
    detail: 'Propuestas visuales para decidir antes de obrar. Las imágenes generadas con IA son ilustrativas y se identifican como tales.',
    ask: ['Ambiente a visualizar', 'Estilo que te gusta', 'Fotos del estado actual'],
    icon: 'eye',
  },
  {
    slug: 'presupuestos-y-relevamientos',
    name: 'Presupuestos y relevamientos',
    short: 'Ordená tu proyecto y sabé con qué contás.',
    detail: 'Presupuesto a partir de la información y las fotos que nos envíes; cuando hace falta, coordinamos un relevamiento.',
    ask: ['Qué trabajo querés presupuestar', 'Fotos y medidas si las tenés', 'Para cuándo lo pensás'],
    icon: 'clipboard',
  },
];

export const ZONES = [
  {
    slug: 'berazategui',
    name: 'Berazategui',
    title: 'Reformas y remodelaciones en Berazategui',
    intro: 'Trabajamos en Berazategui con remodelaciones, pintura y terminaciones, impermeabilización, pisos y revestimientos, y ampliaciones.',
    note: 'Contanos tu proyecto y confirmamos la cobertura de tu barrio en la consulta.',
  },
  {
    slug: 'hudson',
    name: 'Hudson',
    title: 'Reformas y remodelaciones en Hudson',
    intro: 'Atendemos consultas de Hudson (partido de Berazategui) para remodelaciones, pintura, impermeabilización, pisos y ampliaciones.',
    note: 'Contanos tu proyecto y confirmamos la cobertura de tu barrio en la consulta.',
  },
  {
    slug: 'quilmes',
    name: 'Quilmes',
    title: 'Reformas y remodelaciones en Quilmes',
    intro: 'Atendemos consultas de Quilmes para remodelaciones, pintura y terminaciones, impermeabilización, pisos y revestimientos, y ampliaciones.',
    note: 'Contanos tu proyecto y confirmamos la cobertura de tu barrio en la consulta.',
  },
];

export const STEPS = [
  { n: 1, title: 'Contanos tu proyecto', text: 'Qué querés hacer, dónde y para cuándo. Podés sumar fotos y medidas por WhatsApp.' },
  { n: 2, title: 'Revisamos tu consulta', text: 'Si falta información, te la pedimos. Si hace falta una visita o un relevamiento, te lo decimos en esta etapa.' },
  { n: 3, title: 'Recibís tu presupuesto', text: 'En 24 a 72 horas desde que tenemos la información necesaria.' },
  { n: 4, title: 'Decidís con información', text: 'Revisás el presupuesto, hacés tus preguntas y definís si seguimos.' },
];

export const FAQS = [
  {
    q: '¿Cuándo recibo el presupuesto?',
    a: 'En 24 a 72 horas desde que tenemos la información necesaria. Si tu trabajo requiere una visita o un relevamiento, te lo informamos durante la consulta.',
  },
  {
    q: '¿Trabajan en mi zona?',
    a: 'Nuestro foco inicial es Hudson, Berazategui y Quilmes. Si estás cerca, consultanos y confirmamos la cobertura.',
  },
  {
    q: '¿Cómo les cuento mi proyecto?',
    a: 'Con el botón “Contanos tu proyecto” armás tu consulta en un minuto y la enviás por WhatsApp. Ahí mismo podés sumar fotos y medidas.',
  },
  {
    q: '¿Me pueden dar un precio ahora?',
    a: 'No damos precios sin conocer el trabajo. Necesitamos entender tu proyecto para presupuestar; por eso la consulta es el primer paso.',
  },
  {
    q: '¿Usan inteligencia artificial?',
    a: 'Podemos usar herramientas de IA para organizar tu consulta o mostrarte visualizaciones. Toda imagen generada con IA se identifica como tal y es ilustrativa, no una obra construida.',
  },
];

// Real finished works. Intentionally EMPTY until Jona supplies real photos with the client's consent.
// The "Obras" section renders only when this list has items. Never add stock or AI images here.
// Item shape: { id, title, zone, service, image, alt }
export const WORKS = [];

export const TIMING_OPTIONS = [
  { value: 'lo-antes-posible', label: 'Lo antes posible' },
  { value: '1-3-meses', label: 'En 1 a 3 meses' },
  { value: 'explorando', label: 'Todavía estoy explorando' },
];

export const serviceBySlug = slug => SERVICES.find(s => s.slug === slug);
export const zoneBySlug = slug => ZONES.find(s => s.slug === slug);
