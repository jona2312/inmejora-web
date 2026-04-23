import { Hammer, Wrench, Zap, Tv as Cctv, Sofa, Flower2, Sparkles, Leaf } from 'lucide-react';

export const solucionesData = [
  {
    id: 1,
    name: "Reformas y Obra",
    icon: Hammer,
    description: "Ejecutamos tu obra con equipos especializados y dirección técnica profesional, garantizando calidad y plazos.",
    includes: [
      "Albañilería y demoliciones",
      "Pintura y revestimientos",
      "Construcción en seco (Durlock)",
      "Refacciones integrales"
    ],
    questions: [
      "¿Qué tipo de reforma necesitás?",
      "¿Cuántos m² aproximados son?",
      "¿En qué barrio es la obra?"
    ],
    whatsappMessage: "Hola, me interesa cotizar una Reforma u Obra. Tengo algunas dudas sobre..."
  },
  {
    id: 2,
    name: "Mantenimiento",
    icon: Wrench,
    description: "Soluciones rápidas y efectivas para los problemas cotidianos de tu hogar o comercio.",
    includes: [
      "Plomería y gas",
      "Electricidad domiciliaria",
      "Reparación de humedades",
      "Arreglos generales"
    ],
    questions: [
      "¿Qué necesitás reparar?",
      "¿Es urgente?",
      "¿Tenés fotos del problema?"
    ],
    whatsappMessage: "Hola, necesito un servicio de Mantenimiento. El problema es..."
  },
  {
    id: 3,
    name: "Instalaciones",
    icon: Zap,
    description: "Instalación profesional de artefactos y equipos con garantía de funcionamiento seguro.",
    includes: [
      "Aires Acondicionados",
      "Estufas y calefacción",
      "Luminarias y ventiladores",
      "Artefactos sanitarios"
    ],
    questions: [
      "¿Qué equipo necesitás instalar?",
      "¿Ya tenés el equipo comprado?",
      "¿Hay instalación previa?"
    ],
    whatsappMessage: "Hola, quisiera cotizar una Instalación. Se trata de..."
  },
  {
    id: 4,
    name: "Cámaras y Electrónica",
    icon: Cctv,
    description: "Sistemas de seguridad y tecnología para proteger y modernizar tu espacio.",
    includes: [
      "Cámaras de seguridad (CCTV)",
      "Alarmas monitoreadas",
      "Porteros eléctricos",
      "Automatización (Domótica)"
    ],
    questions: [
      "¿Qué sistema te interesa?",
      "¿Es para casa, edificio o local?",
      "¿Cuántos puntos/cámaras estimás?"
    ],
    whatsappMessage: "Hola, me interesa saber más sobre Cámaras y sistemas de seguridad..."
  },
  {
    id: 5,
    name: "Diseño de Interiores",
    icon: Sofa,
    description: "Proyectos de interiorismo que fusionan estética y funcionalidad para potenciar tu calidad de vida.",
    includes: [
      "Diseño de mobiliario a medida",
      "Elección de paletas y texturas",
      "Optimización de espacios",
      "Planos técnicos y dirección"
    ],
    questions: [
      "¿Qué ambiente querés renovar?",
      "¿Buscás proyecto o ejecución?",
      "¿Cuál es tu estilo preferido?"
    ],
    whatsappMessage: "Hola, quiero consultar por un proyecto de Diseño de Interiores..."
  },
  {
    id: 6,
    name: "Diseño de Exteriores",
    icon: Flower2,
    description: "Transformamos patios, terrazas y jardines en espacios de disfrute y conexión con la naturaleza.",
    includes: [
      "Paisajismo y jardinería",
      "Piletas y solariums",
      "Iluminación exterior",
      "Pérgolas y decks"
    ],
    questions: [
      "¿Qué espacio exterior tenés?",
      "¿M² aproximados?",
      "¿Qué uso le querés dar?"
    ],
    whatsappMessage: "Hola, me gustaría cotizar un Diseño de Exterior / Paisajismo..."
  },
  {
    id: 7,
    name: "Visualización con IA",
    icon: Sparkles,
    description: "Visualizá el potencial de tu espacio en segundos con nuestra tecnología de Inteligencia Artificial.",
    includes: [
      "Renders hiperrealistas rápidos",
      "Variaciones de estilo instantáneas",
      "Pre-visualización de reformas",
      "Costo accesible y entrega rápida"
    ],
    questions: [
      "¿Tenés foto del ambiente actual?",
      "¿Qué estilo te gustaría probar?",
      "¿Qué uso tiene la habitación?"
    ],
    whatsappMessage: "Hola, quiero probar el servicio de Visualización con IA para mi espacio...",
    extraNote: "Ideal para decidir antes de invertir."
  },
  {
    id: 8,
    name: "Parquización y Riego",
    icon: Leaf,
    description: "Dejamos tu jardín prolijo y funcional: césped, riego y mantenimiento.",
    includes: [
      "Corte de pasto",
      "Plantación de césped",
      "Sistema de riego",
      "Puesta a punto y mantenimiento"
    ],
    questions: [
      "¿Metros aprox?",
      "¿Tenés riego hoy?",
      "¿Zona? ¿Barrio?"
    ],
    whatsappMessage: "Hola INMEJORA, quiero parquización/riego. Zona: __. Metros aprox: __. Tengo riego actual: sí/no. Te envío fotos."
  }
];