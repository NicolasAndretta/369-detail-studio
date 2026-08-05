import type { NextConfig } from "next";
import { buildCsp } from "./src/lib/csp";

const esProd = process.env.NODE_ENV === "production";

const securityHeaders = [
  // Obliga HTTPS por 2 años. Solo tiene efecto sobre HTTPS, así que en local no molesta.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Que el navegador no adivine el tipo de archivo (vector clásico de XSS).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Nadie puede meter el sitio en un iframe (clickjacking). Es además el
  // que cubre lo que el <meta> del CSP no puede (frame-ancestors).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Se apagan APIs que el sitio no usa. `camera=(self)` queda habilitado
  // porque el panel abre la cámara del celu para cargar fotos.
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.4", "192.168.0.12"],

  // No anunciar que corre Next.js: menos información gratis para un atacante.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: esProd
          ? [
              ...securityHeaders,
              // Ojo: en Hostinger este header lo reemplaza el CDN. La política
              // real viaja por <meta> desde el layout. Se manda igual porque es
              // lo correcto y funciona en cualquier otro hosting.
              { key: "Content-Security-Policy", value: buildCsp() },
            ]
          : securityHeaders, // en dev el CSP rompe el hot reload
      },
      {
        // El panel nunca se cachea ni se indexa, ni por error.
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
