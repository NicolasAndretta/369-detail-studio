import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { BUSINESS, SITE_URL, absoluteUrl } from "@/lib/site";
import { jsonLd, localBusinessSchema } from "@/lib/schema";
import { buildCsp } from "@/lib/csp";

import "./globals.css";
import "../styles/theme.css";
import "../styles/navbar.css";
import "../styles/hero.css";
import "../styles/services.css";
import "../styles/gallery.css";
import "../styles/nuestro-espacio.css";
import "../styles/contact.css";
import "../styles/whatsapp-sticky.css";
import "../styles/footer.css";
import "../styles/order-status.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // 58 caracteres: entra completo en Google sin que lo corte con "…"
    default: "369 Detail | Detailing Automotriz en Lugano, CABA",
    template: "%s | 369 Detail",
  },
  description:
    "Detailing automotriz en Lugano, Buenos Aires. Pulido y corrección de pintura, tratamiento cerámico, lavado de motor y limpieza de interior. Turnos por WhatsApp.",
  applicationName: BUSINESS.name,
  authors: [{ name: BUSINESS.name }],
  creator: BUSINESS.name,
  publisher: BUSINESS.name,
  keywords: [
    "detailing automotriz",
    "corrección de pintura",
    "ceramic coating",
    "pulido de autos",
    "lavado técnico",
    "tratamiento cerámico",
    "detailing Lugano",
    "detailing Mataderos",
    "detailing Buenos Aires",
    "lavado de motor",
    "369 Detail",
  ],
  category: "Automotive",
  openGraph: {
    title: "369 Detail | Detailing Automotriz en Lugano, CABA",
    description:
      "Pulido y corrección de pintura, tratamientos cerámicos y detailing especializado en Lugano, Buenos Aires.",
    siteName: BUSINESS.name,
    locale: "es_AR",
    type: "website",
    url: absoluteUrl("/"),
    images: [
      {
        url: "/images/branding/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "369 Detail — Detailing automotriz profesional en Lugano, Buenos Aires",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "369 Detail | Detailing Automotriz en Lugano, CABA",
    description:
      "Pulido y corrección de pintura, tratamientos cerámicos y detailing especializado en Lugano, Buenos Aires.",
    images: ["/images/branding/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Que Google pueda usar la foto grande en el resultado y no recorte el texto.
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: absoluteUrl("/"),
  },
  // Señales de zona: se las lee Google y también los buscadores con IA.
  other: {
    "geo.region": "AR-C",
    "geo.placename": `${BUSINESS.locality}, Buenos Aires`,
    "geo.position": `${BUSINESS.lat};${BUSINESS.lng}`,
    ICBM: `${BUSINESS.lat}, ${BUSINESS.lng}`,
  },
  icons: {
    icon: [
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    shortcut: "/favicon.ico",
  },
};

/** Origen del storage de Supabase, para el preconnect. Vacío si no está configurado. */
function origenSupabase(): string | null {
  try {
    return new URL(process.env.SUPABASE_URL!).origin;
  } catch {
    return null;
  }
}

const supabaseHost = origenSupabase();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <head>
        {/* El CSP va por <meta> porque el CDN de Hostinger reemplaza el header
            HTTP por uno propio. Tiene que ir lo más arriba posible del <head>:
            solo aplica a lo que se carga DESPUÉS de esta línea. */}
        {process.env.NODE_ENV === "production" && (
          <meta httpEquiv="Content-Security-Policy" content={buildCsp(true)} />
        )}

        {/* La primera foto del hero es el LCP. Precargarla la empieza a bajar
            antes de que el navegador llegue a parsear el componente. Se pide
            el AVIF: el que no lo soporta ignora esta línea y baja el WebP. */}
        <link
          rel="preload"
          as="image"
          href="/images/gallery/hero-1-amarok.avif"
          type="image/avif"
          fetchPriority="high"
        />

        {/* Las fotos que sube el primo viven en Supabase. Abrir la conexión
            (DNS + TLS) apenas empieza la página ahorra ~200-300ms cuando
            después aparecen las imágenes de la galería. */}
        {supabaseHost && (
          <>
            <link rel="preconnect" href={supabaseHost} crossOrigin="" />
            <link rel="dns-prefetch" href={supabaseHost} />
          </>
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(localBusinessSchema()) }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}