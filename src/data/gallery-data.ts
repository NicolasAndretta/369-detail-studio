// ============================================================
//  GALERÍA — modelo por trabajo (multi-ángulo)
//  Cada trabajo es UNA tarjeta con uno o varios ángulos.
//  El PRIMER ángulo es la cara de la tarjeta → siempre la mejor foto.
//  Un ángulo con `beforeImage` muestra Antes/Después (click alterna).
//  El antes/después se usa SOLO donde el "antes" es real y notorio
//  (ruedas embarradas). El resto son galerías de fotos.
//  `home: true` → aparece en la galería del inicio (1 por servicio).
// ============================================================

export type GalleryCategory =
  | "Lavado"
  | "Abrillantado"
  | "Cerámico"
  | "Acrílico"
  | "Interior"
  | "Motor y Chasis";

export interface GalleryAngle {
  label: string;
  afterImage: string;
  /** "antes" opcional — solo cuando hay una transformación real. */
  beforeImage?: string;
}

export interface GalleryWork {
  id: string;
  service: string;
  category: GalleryCategory;
  home: boolean;
  angles: GalleryAngle[];
}

const G = "/images/gallery";

export const GALLERY_WORKS: GalleryWork[] = [
  // ─────────── INICIO: 1 trabajo por servicio (todos distintos) ───────────

  // Lavado detallado → MOTO (galería, sin antes real)
  {
    id: "lavado-moto",
    service: "Lavado detallado",
    category: "Lavado",
    home: true,
    angles: [
      {
        label: "Rueda trasera",
        beforeImage: `${G}/moto-bmw-rueda-antes.webp`,
        afterImage: `${G}/moto-bmw-rueda-despues.webp`,
      },
      { label: "Lateral", afterImage: `${G}/hero-2-bmw.webp` },
      { label: "Frente", afterImage: `${G}/moto-bmw-frente.webp` },
      { label: "Detalle", afterImage: `${G}/moto-bmw-detalle.webp` },
    ],
  },

  // Tratamiento cerámico → MERCEDES (galería)
  {
    id: "ceramico-mercedes",
    service: "Tratamiento cerámico",
    category: "Cerámico",
    home: true,
    angles: [
      { label: "Trasera", afterImage: `${G}/auto-mercedes-carroceria-despues.webp` },
      { label: "Frente", afterImage: `${G}/auto-mercedes-frente.webp` },
      { label: "Detalle", afterImage: `${G}/auto-mercedes-detalle.webp` },
      { label: "Bajos", afterImage: `${G}/auto-mercedes-bajos.webp` },
    ],
  },

  // Abrillantado → SONIC (galería)
  {
    id: "abrillantado-sonic",
    service: "Abrillantado y realce de pintura",
    category: "Abrillantado",
    home: true,
    angles: [
      { label: "Exterior", afterImage: `${G}/auto-sonic-exterior.webp` },
      { label: "Perfil", afterImage: `${G}/auto-sonic-perfil.webp` },
    ],
  },

  // Lavado de motor → SONIC (motor)
  {
    id: "motor-sonic",
    service: "Lavado de motor y chasis",
    category: "Motor y Chasis",
    home: true,
    angles: [
      { label: "Motor", afterImage: `${G}/auto-sonic-motor.webp` },
    ],
  },

  // Limpieza de interior → AMAROK gris
  {
    id: "interior-amarok",
    service: "Limpieza de interior",
    category: "Interior",
    home: true,
    angles: [
      { label: "Butacas y tablero", afterImage: `${G}/camioneta-amarok-gris-interior.webp` },
      { label: "Detalle", afterImage: `${G}/camioneta-amarok-gris-interior-2.webp` },
    ],
  },

  // Tratamiento acrílico → BERLINGO
  {
    id: "acrilico-berlingo",
    service: "Tratamiento acrílico",
    category: "Acrílico",
    home: true,
    angles: [
      { label: "Exterior", afterImage: `${G}/auto-berlingo-exterior.webp` },
    ],
  },

  // ─────────── SOLO /galeria: el resto de los trabajos ───────────
  // (las Amarok llevan el antes/después real en las ruedas)

  {
    id: "lavado-amarok-gris",
    service: "Lavado detallado",
    category: "Lavado",
    home: false,
    angles: [
      {
        label: "Ruedas",
        beforeImage: `${G}/camioneta-amarok-gris-rueda-antes.webp`,
        afterImage: `${G}/camioneta-amarok-gris-rueda-despues.webp`,
      },
      { label: "Exterior", afterImage: `${G}/hero-1-amarok.webp` },
      { label: "Interior", afterImage: `${G}/camioneta-amarok-gris-interior.webp` },
    ],
  },

  {
    id: "lavado-amarok-champagne",
    service: "Lavado detallado",
    category: "Lavado",
    home: false,
    angles: [
      {
        label: "Ruedas",
        beforeImage: `${G}/camioneta-amarok-champagne-rueda-antes.webp`,
        afterImage: `${G}/camioneta-amarok-champagne-rueda-despues.webp`,
      },
      { label: "Exterior", afterImage: `${G}/camioneta-amarok-champagne-exterior.webp` },
      { label: "Frente", afterImage: `${G}/camioneta-amarok-champagne-frente.webp` },
      { label: "Perfil", afterImage: `${G}/camioneta-amarok-champagne-perfil.webp` },
    ],
  },

  {
    id: "lavado-amarok-blanca",
    service: "Lavado detallado",
    category: "Lavado",
    home: false,
    angles: [
      {
        label: "Ruedas",
        beforeImage: `${G}/camioneta-amarok-blanca-rueda-antes.webp`,
        afterImage: `${G}/camioneta-amarok-blanca-rueda-despues.webp`,
      },
      { label: "Frente", afterImage: `${G}/camioneta-amarok-blanca-frente.webp` },
      { label: "Exterior", afterImage: `${G}/camioneta-amarok-blanca-exterior.webp` },
      { label: "Portón", afterImage: `${G}/camioneta-amarok-blanca-porton.webp` },
    ],
  },
];

/** Trabajos destacados para el inicio (1 por servicio, todos distintos). */
export const HOME_WORKS = GALLERY_WORKS.filter((w) => w.home);

// Categorías presentes (para los filtros), en orden, sin las vacías.
const PRESENT = new Set(GALLERY_WORKS.map((w) => w.category));
const ORDER: GalleryCategory[] = [
  "Lavado",
  "Abrillantado",
  "Cerámico",
  "Acrílico",
  "Interior",
  "Motor y Chasis",
];

export const GALLERY_CATEGORIES = [
  "Todos",
  ...ORDER.filter((c) => PRESENT.has(c)),
] as const;

export type GalleryFilter = "Todos" | GalleryCategory;
