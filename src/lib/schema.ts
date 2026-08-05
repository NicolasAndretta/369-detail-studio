import { BUSINESS, absoluteUrl } from "@/lib/site";
import type { GalleryWork } from "@/data/gallery-data";

// ============================================================
// JSON-LD (schema.org).
//
// Es lo que Google lee para entender QUÉ es este negocio, no solo qué
// palabras usa. En un negocio local es lo que habilita el panel de la
// derecha, el mapa y el horario en los resultados.
//
// Regla que no se rompe: acá NO se inventan datos. Nada de estrellas,
// cantidad de reseñas ni precios que no existan de verdad — Google
// penaliza a mano el structured data que miente, y perder la ficha del
// negocio cuesta meses de recuperar.
// ============================================================

/**
 * Serializa el JSON-LD para meterlo en un <script>.
 * Escapa `<` y `&` porque parte del contenido sale de la base (el
 * vehículo y las etiquetas los escribe el primo desde el panel): si
 * alguien escribiera `</script>` en el nombre de un vehículo, cerraría
 * la etiqueta y el resto se ejecutaría como código.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

const ID_NEGOCIO = absoluteUrl("/#negocio");

/** Los 6 servicios del taller, tal cual se ofrecen. */
const SERVICIOS_SCHEMA = [
  {
    nombre: "Lavado detallado",
    detalle:
      "Lavado con técnica de dos baldes, descontaminación férrica y química, umbrales, ruedas y pasos de rueda.",
  },
  {
    nombre: "Abrillantado y realce de pintura",
    detalle:
      "Realce del brillo natural de la pintura con productos específicos, entre tratamientos más profundos.",
  },
  {
    nombre: "Tratamiento cerámico",
    detalle:
      "Recubrimiento cerámico de larga duración, desde 1 año. Protección UV, química y efecto hidrofóbico.",
  },
  {
    nombre: "Tratamiento acrílico",
    detalle:
      "Protección acrílica de alta adherencia, duración aproximada de 6 meses, con brillo e hidrofobicidad.",
  },
  {
    nombre: "Limpieza de interior",
    detalle:
      "Acondicionamiento profundo de habitáculo: tapizados, paneles, tablero, cristales y butacas.",
  },
  {
    nombre: "Lavado de motor y chasis",
    detalle:
      "Limpieza del compartimiento de motor y chasis con desengrasantes específicos.",
  },
] as const;

/** Ficha del negocio local. Es el schema que más pesa para búsquedas de zona. */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    // Detailing cae en AutoWash; se suma AutoRepair porque la gente busca
    // el taller por las dos vías.
    "@type": ["AutoWash", "AutoRepair"],
    "@id": ID_NEGOCIO,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    description: BUSINESS.description,
    url: absoluteUrl("/"),
    telephone: BUSINESS.phone,
    image: absoluteUrl("/images/branding/og-image.jpg"),
    logo: absoluteUrl("/images/branding/logo-369-detail.jpeg"),
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.street,
      addressLocality: BUSINESS.locality,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.lat,
      longitude: BUSINESS.lng,
    },
    // Los barrios donde el taller quiere aparecer.
    areaServed: BUSINESS.areas.map((zona) => ({
      "@type": "Place",
      name: zona,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: BUSINESS.opens,
        closes: BUSINESS.closes,
      },
    ],
    currenciesAccepted: "ARS",
    // El catálogo va SIN precios a propósito: se cotiza según el estado del
    // vehículo. Poner precios inventados sería mentirle a Google y al cliente.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de detailing",
      itemListElement: SERVICIOS_SCHEMA.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.nombre,
          description: s.detalle,
          serviceType: s.nombre,
          provider: { "@id": ID_NEGOCIO },
          areaServed: BUSINESS.areas.map((zona) => ({
            "@type": "Place",
            name: zona,
          })),
        },
      })),
    },
    sameAs: [BUSINESS.instagram, BUSINESS.tiktok],
  };
}

/** Migas de pan: le dice a Google la jerarquía de la página. */
export function breadcrumbSchema(
  items: { nombre: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nombre,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * Galería de imágenes. Le da contexto a cada foto para búsqueda de
 * imágenes, que en un taller es tráfico real ("antes y después pulido auto").
 */
export function gallerySchema(works: GalleryWork[]) {
  const fotos = works.flatMap((work) =>
    work.angles.flatMap((angle) => {
      const partes = [work.vehicle, work.service, angle.label].filter(Boolean);
      const base = partes.join(" — ");
      const imagenes = [
        {
          url: angle.afterImage,
          caption: `${base} — Después. Trabajo realizado en 369 Detail, ${BUSINESS.locality}.`,
        },
      ];
      if (angle.beforeImage) {
        imagenes.unshift({
          url: angle.beforeImage,
          caption: `${base} — Antes del trabajo en 369 Detail, ${BUSINESS.locality}.`,
        });
      }
      return imagenes.map((img) => ({
        "@type": "ImageObject",
        contentUrl: img.url.startsWith("http") ? img.url : absoluteUrl(img.url),
        caption: img.caption,
        creditText: BUSINESS.name,
      }));
    })
  );

  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": absoluteUrl("/galeria#galeria"),
    name: `Galería de trabajos — ${BUSINESS.name}`,
    description:
      "Antes y después reales de corrección de pintura, tratamientos cerámicos y detailing en Lugano, Buenos Aires.",
    url: absoluteUrl("/galeria"),
    about: { "@id": ID_NEGOCIO },
    // Se recorta para que el JSON no se vaya de tamaño en la página.
    image: fotos.slice(0, 40),
  };
}
