import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";

import "./globals.css";
import "../styles/theme.css";
import "../styles/navbar.css";
import "../styles/hero.css";
import "../styles/services.css";
import "../styles/gallery.css";
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
  metadataBase: new URL("https://369detail.com.ar"),
  title: {
    default: "369 Detail | Detailing Automotriz Profesional en Lugano",
    template: "%s | 369 Detail",
  },
  description:
    "Estética vehicular profesional en Lugano, Buenos Aires. Corrección de pintura, tratamientos cerámicos y detailing especializado. Solicitá tu turno hoy.",
  keywords: [
    "detailing automotriz",
    "corrección de pintura",
    "ceramic coating",
    "pulido de autos",
    "lavado técnico",
    "tratamiento cerámico",
    "detailing Lugano",
    "detailing Buenos Aires",
    "369 Detail",
  ],
  openGraph: {
    title: "369 Detail | Detailing Automotriz Profesional",
    description:
      "Corrección de pintura, tratamientos cerámicos y detailing especializado en Lugano, Buenos Aires.",
    siteName: "369 Detail",
    locale: "es_AR",
    type: "website",
    url: "https://369detail.com.ar",
    images: [
      {
        url: "/images/branding/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "369 Detail — Detailing Automotriz Profesional en Lugano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "369 Detail | Detailing Automotriz Profesional",
    description:
      "Corrección de pintura, tratamientos cerámicos y detailing especializado en Lugano, Buenos Aires.",
    images: ["/images/branding/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://369detail.com.ar",
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

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "369 Detail",
  description:
    "Estética vehicular profesional en Lugano, Buenos Aires. Corrección de pintura, tratamientos cerámicos y detailing especializado.",
  url: "https://369detail.com.ar",
  telephone: "+5491154748668",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Dr. Horacio Casco 5140",
    addressLocality: "Lugano",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -34.6677,
    longitude: -58.4785,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/369detail/",
    "https://www.tiktok.com/@369detail",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA),
          }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}