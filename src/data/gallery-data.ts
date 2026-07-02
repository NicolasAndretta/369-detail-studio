export interface GallerySlot {
  id: string;
  label: string;
  category: "Lavado" | "Abrillantado" | "Interior" | "Acrílico" | "Cerámico" | "Motor y Chasis";
  aspect: "wide" | "square";
  beforeImage?: string;
  afterImage?: string;
}

export const GALLERY_SLOTS: GallerySlot[] = [
  {
    id: "slot-1",
    label: "Lavado detallado completo",
    category: "Lavado",
    aspect: "wide",
  },
  {
    id: "slot-2",
    label: "Tratamiento cerámico 9H",
    category: "Cerámico",
    aspect: "square",
  },
  {
    id: "slot-3",
    label: "Limpieza y acondicionamiento interior",
    category: "Interior",
    aspect: "square",
  },
  {
    id: "slot-4",
    label: "Abrillantado y realce de pintura",
    category: "Abrillantado",
    aspect: "wide",
  },
  {
    id: "slot-5",
    label: "Tratamiento acrílico 6 meses",
    category: "Acrílico",
    aspect: "square",
  },
  {
    id: "slot-6",
    label: "Lavado de motor y chasis",
    category: "Motor y Chasis",
    aspect: "square",
  },

  // ── Slots futuros — descomentá cuando tengas las fotos ──────────────────────

  // {
  //   id: "slot-7",
  //   label: "Lavado detallado — SUV",
  //   category: "Lavado",
  //   aspect: "wide",
  //   beforeImage: "/images/gallery/before-7.jpg",
  //   afterImage: "/images/gallery/after-7.jpg",
  // },

  // {
  //   id: "slot-8",
  //   label: "Tratamiento cerámico — sedan",
  //   category: "Cerámico",
  //   aspect: "square",
  //   beforeImage: "/images/gallery/before-8.jpg",
  //   afterImage: "/images/gallery/after-8.jpg",
  // },

  // {
  //   id: "slot-9",
  //   label: "Limpieza de interior — pickup",
  //   category: "Interior",
  //   aspect: "square",
  //   beforeImage: "/images/gallery/before-9.jpg",
  //   afterImage: "/images/gallery/after-9.jpg",
  // },

  // {
  //   id: "slot-10",
  //   label: "Abrillantado — deportivo",
  //   category: "Abrillantado",
  //   aspect: "wide",
  //   beforeImage: "/images/gallery/before-10.jpg",
  //   afterImage: "/images/gallery/after-10.jpg",
  // },

  // {
  //   id: "slot-11",
  //   label: "Tratamiento acrílico — hatchback",
  //   category: "Acrílico",
  //   aspect: "square",
  //   beforeImage: "/images/gallery/before-11.jpg",
  //   afterImage: "/images/gallery/after-11.jpg",
  // },

  // {
  //   id: "slot-12",
  //   label: "Lavado de motor — camioneta",
  //   category: "Motor y Chasis",
  //   aspect: "square",
  //   beforeImage: "/images/gallery/before-12.jpg",
  //   afterImage: "/images/gallery/after-12.jpg",
  // },
];

export const GALLERY_CATEGORIES = [
  "Todos",
  "Lavado",
  "Abrillantado",
  "Interior",
  "Acrílico",
  "Cerámico",
  "Motor y Chasis",
] as const;

export type GalleryCategory = typeof GALLERY_CATEGORIES[number];