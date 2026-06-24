import type { Metadata } from "next";
import { GalleryPageClient } from "./_components/gallery-page-client";

export const metadata: Metadata = {
  title: "Galería de Trabajos",
  description:
    "Resultados reales de corrección de pintura, tratamientos cerámicos y detailing en Lugano, Buenos Aires. Antes y después de cada vehículo.",
  openGraph: {
    title: "Galería | 369 Detail — Detailing Automotriz en Lugano",
    description:
      "Resultados reales de corrección de pintura, tratamientos cerámicos y detailing en Lugano, Buenos Aires.",
    url: "https://369detail.com.ar/galeria",
    images: [
      {
        url: "/images/branding/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "369 Detail — Galería de trabajos de detailing automotriz",
      },
    ],
  },
  alternates: {
    canonical: "https://369detail.com.ar/galeria",
  },
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
