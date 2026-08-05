import type { NextConfig } from "next";

// ── Origen del storage de Supabase (para dejar pasar las fotos del panel) ──
// SUPABASE_URL es solo de servidor; acá se usa nada más que para armar el CSP.
function supabaseOrigin(): string {
  try {
    return new URL(process.env.SUPABASE_URL!).origin;
  } catch {
    return "https://*.supabase.co";
  }
}

const esProd = process.env.NODE_ENV === "production";

// Widget de consulta de órdenes del taller (sección "CONSULTAR ORDEN").
// Es un servicio externo real y en uso: si no se lo deja pasar en el CSP,
// el botón queda muerto y el cliente no puede ver el estado de su auto.
const GESTIOO = "https://taller.gestioo.net https://*.gestioo.net";

// Embeds de reels en /galeria. Se cargan como iframe y SOLO cuando alguien
// abre el modal — no hay JS de Instagram ni de TikTok en la página, así que
// no pagamos velocidad por tenerlos.
const EMBEDS_VIDEO = [
  "https://www.instagram.com",
  "https://instagram.com",
  "https://www.tiktok.com",
].join(" ");

// ── Content Security Policy ───────────────────────────────────────────────
// Nota honesta sobre `'unsafe-inline'` en script-src: Next.js inyecta scripts
// inline para hidratar. Sacarlo obliga a usar nonces, y los nonces obligan a
// renderizar todo dinámico — se pierde el prerender y el sitio se vuelve más
// lento (peor Core Web Vitals, peor SEO). Para un sitio institucional sin
// login de usuarios ni contenido de terceros no compensa. Lo que sí bloquea
// este CSP, que es lo que importa acá: scripts de dominios ajenos, `eval`,
// que alguien meta la web en un iframe y que un formulario postee afuera.
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${GESTIOO}`,
  `style-src 'self' 'unsafe-inline' ${GESTIOO}`,
  `img-src 'self' data: blob: ${supabaseOrigin()} ${GESTIOO}`,
  `font-src 'self' data: ${GESTIOO}`,
  `connect-src 'self' ${GESTIOO}`,
  // El widget de Gestioo abre su modal en un iframe propio; los reels
  // se embeben desde Instagram/TikTok.
  `frame-src ${GESTIOO} ${EMBEDS_VIDEO}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Obliga HTTPS por 2 años. Solo tiene efecto sobre HTTPS, así que en local no molesta.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Que el navegador no adivine el tipo de archivo (vector clásico de XSS).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Nadie puede meter el sitio en un iframe (clickjacking). Duplica
  // frame-ancestors del CSP para navegadores viejos.
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
          ? [...securityHeaders, { key: "Content-Security-Policy", value: CSP }]
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
