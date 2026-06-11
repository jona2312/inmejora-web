import { Hammer, Wrench, Sofa, Flower2, Sparkles, ClipboardList } from 'lucide-react';

export const solucionesData = [
  {
    id: 1,
    name: "Reformas integrales",
    icon: Hammer,
    description: "Renovación de viviendas, departamentos, oficinas y locales. Coordinamos albañilería, pintura, instalaciones y terminaciones.",
    includes: [
      "Albañilería y demoliciones",
      "Pintura y revestimientos",
      "Construcción en seco (Durlock)",
      "Instalaciones y artefactos",
      "Refacciones integrales"
    ],
    questions: [
      "¿Qué tipo de reforma necesitás?",
      "¿Cuántos m² aproximados son?",
      "¿En qué barrio es la obra?"
    ],
    whatsappMessage: "Hola INMEJORA, quiero cotizar una reforma integral. Les cuento brevemente el proyecto y coordinamos:"
  },
  {
    id: 2,
    name: "Mantenimiento y reparaciones",
    icon: Wrench,
    description: "Soluciones para humedad, pintura, electricidad, plomería, carpintería y arreglos generales.",
    includes: [
      "Reparación de humedades",
      "Plomería y gas",
      "Electricidad domiciliaria",
      "Carpintería y arreglos generales"
    ],
    questions: [
      "¿Qué necesitás reparar?",
      "¿Es urgente?",
      "¿Tenés fotos del problema?"
    ],
    whatsappMessage: "Hola INMEJORA, necesito mantenimiento o una reparación. El problema es:"
  },
  {
    id: 3,
    name: "Diseño de interiores",
    icon: Sofa,
    description: "Distribución, colores, iluminación, materiales, mobiliario y visualización previa del resultado.",
    includes: [
      "Distribución y optimización de espacios",
      "Paletas de color y materiales",
      "Iluminación y mobiliario",
      "Visualización previa del resultado"
    ],
    questions: [
      "¿Qué ambiente querés renovar?",
      "¿Buscás proyecto o ejecución?",
      "¿Cuál es tu estilo preferido?"
    ],
    whatsappMessage: "Hola INMEJORA, quiero consultar por un proyecto de diseño de interiores para:"
  },
  {
    id: 4,
    name: "Exteriores y paisajismo",
    icon: Flower2,
    description: "Patios, jardines, decks, pérgolas, iluminación exterior, riego y mantenimiento.",
    includes: [
      "Paisajismo y jardinería",
      "Decks y pérgolas",
      "Iluminación exterior",
      "Sistemas de riego y mantenimiento"
    ],
    questions: [
      "¿Qué espacio exterior tenés?",
      "¿M² aproximados?",
      "¿Qué uso le querés dar?"
    ],
    whatsappMessage: "Hola INMEJORA, quiero cotizar un trabajo de exteriores o paisajismo. El espacio es:"
  },
  {
    id: 5,
    name: "Visualización con IA",
    icon: Sparkles,
    description: "Probá colores, materiales, muebles y estilos antes de comenzar la obra.",
    includes: [
      "Renders a partir de fotos de tu espacio",
      "Variaciones de estilo y materiales",
      "Pre-visualización de reformas",
      "Apoyo para decidir antes de invertir"
    ],
    questions: [
      "¿Tenés foto del ambiente actual?",
      "¿Qué estilo te gustaría probar?",
      "¿Qué uso tiene el ambiente?"
    ],
    whatsappMessage: "Hola INMEJORA, quiero probar la visualización con IA para mi espacio:"
  },
  {
    id: 6,
    name: "Proyecto y presupuesto",
    icon: ClipboardList,
    description: "Relevamiento, definición de alcance, planificación por etapas y cotización personalizada.",
    includes: [
      "Relevamiento del espacio",
      "Definición de alcance",
      "Planificación por etapas",
      "Cotización personalizada por escrito"
    ],
    questions: [
      "¿Qué querés hacer en tu espacio?",
      "¿Cuántos m² aproximados son?",
      "¿En qué zona está el inmueble?"
    ],
    whatsappMessage: "Hola INMEJORA, quiero avanzar con un proyecto y necesito una cotización personalizada para:"
  }
];
