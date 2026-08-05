import type { Metadata } from "next";
import { GalleryPageClient } from "./_components/gallery-page-client";
import { categoriesOf, getGalleryWorks } from "@/lib/galeria";
import { getVideos } from "@/lib/videos";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbSchema, gallerySchema, jsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Galería de Trabajos — Antes y Después",
  description:
    "Antes y después reales de pulido, corrección de pintura, tratamiento cerámico y lavado de motor. Trabajos hechos en el taller de Lugano, Buenos Aires.",
  openGraph: {
    title: "Galería de Trabajos | 369 Detail — Detailing en Lugano",
    description:
      "Antes y después reales de pulido, tratamiento cerámico y detailing en Lugano, Buenos Aires.",
    url: absoluteUrl("/galeria"),
    type: "website",
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
    canonical: absoluteUrl("/galeria"),
  },
};

// Igual que la home: consulta en cada visita para reflejar el panel al instante.
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  // En paralelo: la galería y los reels no dependen entre sí.
  const [works, videos] = await Promise.all([getGalleryWorks(), getVideos()]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { nombre: "Inicio", path: "/" },
              { nombre: "Galería de trabajos", path: "/galeria" },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(gallerySchema(works)) }}
      />
      <GalleryPageClient
        works={works}
        categories={categoriesOf(works)}
        videos={videos}
      />
    </>
  );
}
