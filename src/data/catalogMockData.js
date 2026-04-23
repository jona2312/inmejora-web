export const FAMILIAS_MOCK = [
  "Blancos",
  "Neutros",
  "Rojos",
  "Naranjas",
  "Amarillos",
  "Verdes",
  "Azules",
  "Violetas"
];

export const COLORES_MOCK = [
  { id: "c1", nombre: "Blanco Puro", codigo: "BL001", familia: "Blancos", rgb: "255, 255, 255", hex: "#FFFFFF" },
  { id: "c2", nombre: "Blanco Antiguo", codigo: "BL002", familia: "Blancos", rgb: "250, 240, 230", hex: "#FAF0E6" },
  { id: "c3", nombre: "Gris Nube", codigo: "NE001", familia: "Neutros", rgb: "192, 192, 192", hex: "#C0C0C0" },
  { id: "c4", nombre: "Piedra Oscura", codigo: "NE002", familia: "Neutros", rgb: "105, 105, 105", hex: "#696969" },
  { id: "c5", nombre: "Rojo Carmesí", codigo: "RO001", familia: "Rojos", rgb: "220, 20, 60", hex: "#DC143C" },
  { id: "c6", nombre: "Naranja Atardecer", codigo: "NA001", familia: "Naranjas", rgb: "255, 140, 0", hex: "#FF8C00" },
  { id: "c7", nombre: "Amarillo Sol", codigo: "AM001", familia: "Amarillos", rgb: "255, 215, 0", hex: "#FFD700" },
  { id: "c8", nombre: "Verde Bosque", codigo: "VE001", familia: "Verdes", rgb: "34, 139, 34", hex: "#228B22" },
  { id: "c9", nombre: "Azul Profundo", codigo: "AZ001", familia: "Azules", rgb: "0, 0, 139", hex: "#00008B" },
  { id: "c10", nombre: "Violeta Místico", codigo: "VI001", familia: "Violetas", rgb: "138, 43, 226", hex: "#8A2BE2" },
  { id: "c11", nombre: "Crema Suave", codigo: "NE003", familia: "Neutros", rgb: "255, 253, 208", hex: "#FFFDD0" },
  { id: "c12", nombre: "Celeste Cielo", codigo: "AZ002", familia: "Azules", rgb: "135, 206, 235", hex: "#87CEEB" }
];

export const CATEGORIAS_MOCK = ["Pintura", "Esmalte", "Imprimación"];
export const USOS_MOCK = ["Interior", "Exterior", "Interior/Exterior"];
export const ACABADOS_MOCK = ["Mate", "Brillante", "Satinado"];

export const PRODUCTOS_MOCK = [
  {
    id: "p1",
    nombre: "Alba Látex Interior Mate",
    categoria: "Pintura",
    uso: "Interior",
    acabado: "Mate",
    descripcion: "Pintura al látex para interiores de excelente poder cubritivo, resistencia a los lavados y acabado mate perfecto.",
    caracteristicas: ["Alto poder cubritivo", "Lavable", "Antihongo", "Secado rápido"],
    especificaciones: { rendimiento: "10 a 12 m2 por litro por mano", secado: "1 hora al tacto", manos: "2 manos" },
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "p2",
    nombre: "Albatox Esmalte Sintético",
    categoria: "Esmalte",
    uso: "Interior/Exterior",
    acabado: "Brillante",
    descripcion: "Esmalte sintético brillante de máxima resistencia, ideal para maderas y metales en interiores y exteriores.",
    caracteristicas: ["Máxima durabilidad", "Excelente nivelación", "Resistente a la intemperie", "Fácil aplicación"],
    especificaciones: { rendimiento: "12 a 15 m2 por litro por mano", secado: "4 horas al tacto", manos: "2 manos" },
    imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "p3",
    nombre: "Fijador Sellador al Agua",
    categoria: "Imprimación",
    uso: "Interior/Exterior",
    acabado: "Mate",
    descripcion: "Producto al agua formulado para sellar, fijar y uniformar la absorción de las superficies antes de pintar.",
    caracteristicas: ["Uniforma absorción", "Mejora el rendimiento de la pintura", "Secado rápido al agua", "Bajo olor"],
    especificaciones: { rendimiento: "15 a 20 m2 por litro", secado: "1 hora al tacto", manos: "1 mano" },
    imageUrl: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "p4",
    nombre: "Frentes y Muros Exterior",
    categoria: "Pintura",
    uso: "Exterior",
    acabado: "Mate",
    descripcion: "Pintura impermeabilizante para exteriores que protege contra la humedad y los rayos UV.",
    caracteristicas: ["Impermeable", "Elástico (no cuartea)", "Protección UV", "Antialgas"],
    especificaciones: { rendimiento: "8 a 10 m2 por litro por mano", secado: "2 horas al tacto", manos: "3 manos (recomendado)" },
    imageUrl: "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?auto=format&fit=crop&q=80&w=400"
  }
];