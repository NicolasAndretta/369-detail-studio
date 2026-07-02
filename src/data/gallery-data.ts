// ============================================================
//  GALERÍA — modelo multi-ángulo
//  Cada vehículo es UNA tarjeta con uno o varios ángulos.
//  Un ángulo con `beforeImage` se muestra como Antes/Después;
//  sin `beforeImage`, se muestra como imagen única.
// ============================================================

export type GalleryCategory = "Lavado" | "Abrillantado" | "Cerámico" | "Acrílico";

export interface GalleryAngle {
  /** Zona del trabajo: "Ruedas", "Carrocería", "Interior", ... */
  label: string;
  /** Imagen "después" / resultado (siempre presente). */
  afterImage: string;
  /** Imagen "antes" (opcional). Si existe, la tarjeta permite alternar. */
  beforeImage?: string;
}

export interface GalleryVehicle {
  id: string;
  /** Título de la tarjeta (modelo del vehículo). */
  vehicle: string;
  /** Servicio realizado (subtítulo). */
  detail: string;
  category: GalleryCategory;
  aspect: "wide" | "square";
  angles: GalleryAngle[];
}

const G = "/images/gallery";

export const GALLERY_VEHICLES: GalleryVehicle[] = [
  {
    id: "amarok-gris",
    vehicle: "VW Amarok",
    detail: "Lavado detallado",
    category: "Lavado",
    aspect: "wide",
    angles: [
      {
        label: "Ruedas",
        beforeImage: `${G}/camioneta-amarok-gris-rueda-antes.webp`,
        afterImage: `${G}/camioneta-amarok-gris-rueda-despues.webp`,
      },
      { label: "Exterior", afterImage: `${G}/hero-1-amarok.webp` },
      { label: "Interior", afterImage: `${G}/camioneta-amarok-gris-interior.webp` },
      { label: "Interior · detalle", afterImage: `${G}/camioneta-amarok-gris-interior-2.webp` },
    ],
  },
  {
    id: "mercedes-300ce",
    vehicle: "Mercedes-Benz 300 CE",
    detail: "Tratamiento cerámico",
    category: "Cerámico",
    aspect: "square",
    angles: [
      {
        label: "Carrocería",
        beforeImage: `${G}/auto-mercedes-carroceria-antes.webp`,
        afterImage: `${G}/auto-mercedes-carroceria-despues.webp`,
      },
      { label: "Tratamiento cerámico", afterImage: `${G}/auto-mercedes-ceramico.webp` },
      { label: "Frente", afterImage: `${G}/auto-mercedes-frente.webp` },
      { label: "Detalle", afterImage: `${G}/auto-mercedes-detalle.webp` },
      { label: "Bajos", afterImage: `${G}/auto-mercedes-bajos.webp` },
    ],
  },
  {
    id: "bmw-s1000r",
    vehicle: "BMW S1000R",
    detail: "Lavado detallado",
    category: "Lavado",
    aspect: "square",
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
  {
    id: "amarok-champagne",
    vehicle: "VW Amarok V6",
    detail: "Lavado detallado",
    category: "Lavado",
    aspect: "wide",
    angles: [
      {
        label: "Ruedas",
        beforeImage: `${G}/camioneta-amarok-champagne-rueda-antes.webp`,
        afterImage: `${G}/camioneta-amarok-champagne-rueda-despues.webp`,
      },
      { label: "Exterior", afterImage: `${G}/camioneta-amarok-champagne-exterior.webp` },
      { label: "Perfil", afterImage: `${G}/camioneta-amarok-champagne-perfil.webp` },
      { label: "Frente", afterImage: `${G}/camioneta-amarok-champagne-frente.webp` },
    ],
  },
  {
    id: "sonic",
    vehicle: "Chevrolet Sonic",
    detail: "Abrillantado y realce de pintura",
    category: "Abrillantado",
    aspect: "square",
    angles: [
      { label: "Exterior", afterImage: `${G}/auto-sonic-exterior.webp` },
      { label: "Perfil", afterImage: `${G}/auto-sonic-perfil.webp` },
      { label: "Motor", afterImage: `${G}/auto-sonic-motor.webp` },
      { label: "Llantas · estado inicial", afterImage: `${G}/auto-sonic-llanta-inicial.webp` },
    ],
  },
  {
    id: "amarok-blanca",
    vehicle: "VW Amarok",
    detail: "Lavado detallado",
    category: "Lavado",
    aspect: "square",
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
  {
    id: "berlingo",
    vehicle: "Citroën Berlingo",
    detail: "Tratamiento acrílico",
    category: "Acrílico",
    aspect: "square",
    angles: [
      { label: "Exterior", afterImage: `${G}/auto-berlingo-exterior.webp` },
    ],
  },
];

// Categorías presentes (sin las que quedaron vacías) — para los filtros.
const PRESENT = GALLERY_VEHICLES.map((v) => v.category);
const ORDER: GalleryCategory[] = ["Lavado", "Abrillantado", "Cerámico", "Acrílico"];

export const GALLERY_CATEGORIES = [
  "Todos",
  ...ORDER.filter((c) => PRESENT.includes(c)),
] as const;

export type GalleryFilter = "Todos" | GalleryCategory;
