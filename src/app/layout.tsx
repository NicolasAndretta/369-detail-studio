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
  title: "369 Detail | Detailing Automotriz Profesional en Lugano",
  description:
    "Estética vehicular profesional en Lugano, Buenos Aires. Corrección de pintura, tratamientos cerámicos y detailing especializado. Solicitá tu turno hoy.",
  keywords: [
    "detailing automotriz",
    "corrección de pintura",
    "ceramic coating",
    "pulido de autos",
    "Lugano",
    "Buenos Aires",
    "369 Detail",
  ],
  openGraph: {
    title: "369 Detail | Detailing Automotriz Profesional",
    description:
      "Corrección de pintura, tratamientos cerámicos y detailing especializado en Lugano, Buenos Aires.",
    siteName: "369 Detail",
    locale: "es_AR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}