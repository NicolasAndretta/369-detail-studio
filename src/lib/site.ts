// ============================================================
// Datos del negocio en un solo lugar.
// Antes estaban repetidos en layout, sitemap, robots y secciones:
// si cambiaba el teléfono había que tocar seis archivos y siempre
// quedaba uno viejo. Google castiga los datos inconsistentes (NAP),
// así que esto también es SEO local.
// ============================================================

/**
 * URL pública del sitio. Se puede pisar con NEXT_PUBLIC_SITE_URL mientras
 * el dominio no esté propagado (poner ahí la URL provisoria de Hostinger).
 * Cuando 369detail.com.ar esté andando, se borra la variable y listo.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://369detail.com.ar"
).replace(/\/+$/, "");

/** Teléfono en formato internacional (el que entiende WhatsApp y schema.org). */
const PHONE_E164 = "+5491154748668";

export const BUSINESS = {
  name: "369 Detail",
  legalName: "369 Detail Studio",
  /** Descripción corta reutilizada en metadata y JSON-LD. */
  description:
    "Estética vehicular profesional en Lugano, Buenos Aires. Corrección de pintura, tratamientos cerámicos y detailing especializado.",
  phone: PHONE_E164,
  whatsapp: PHONE_E164.replace("+", ""),
  street: "Dr. Horacio Casco 5140",
  locality: "Lugano",
  region: "Ciudad Autónoma de Buenos Aires",
  postalCode: "C1439",
  country: "AR",
  lat: -34.6677,
  lng: -58.4785,
  instagram: "https://www.instagram.com/369detail/",
  tiktok: "https://www.tiktok.com/@369detail",
  /** Zonas donde el taller quiere aparecer en las búsquedas. */
  areas: [
    "Villa Lugano",
    "Mataderos",
    "Liniers",
    "Villa Riachuelo",
    "Parque Avellaneda",
    "Ciudad Autónoma de Buenos Aires",
  ],
  opens: "09:00",
  closes: "18:00",
} as const;

/** Link de WhatsApp con mensaje prellenado. */
export function whatsappUrl(
  mensaje = "Hola, quiero solicitar un turno en 369 Detail."
): string {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** URL absoluta a partir de una ruta interna (para canonical, sitemap, JSON-LD). */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
