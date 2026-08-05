// ============================================================
// Content Security Policy — fuente única.
//
// Se emite por DOS caminos a propósito:
//   1. Header HTTP (next.config.ts) — es lo correcto y funciona en
//      cualquier hosting.
//   2. Etiqueta <meta> en el <head> (layout.tsx) — porque el CDN de
//      Hostinger ("Server: hcdn") REEMPLAZA el header por uno propio
//      que solo dice `upgrade-insecure-requests`. Verificado el
//      05/08/2026: el CSP de Hostinger aparece hasta en /api/health,
//      donde esta app no define ninguno.
//
// Limitación conocida del <meta>: los navegadores ignoran ahí
// `frame-ancestors`. Por eso el clickjacking queda cubierto con
// `X-Frame-Options: DENY`, que Hostinger sí deja pasar intacto.
// ============================================================

// Widget de consulta de órdenes del taller.
const GESTIOO = "https://taller.gestioo.net https://*.gestioo.net";

// Embeds de reels en /galeria. Se cargan como iframe y solo cuando
// alguien abre el modal — no hay JS de Instagram en la página.
const EMBEDS_VIDEO =
  "https://www.instagram.com https://instagram.com https://www.tiktok.com";

/** Origen del storage de Supabase, de donde bajan las fotos del panel. */
function supabaseOrigin(): string {
  try {
    return new URL(process.env.SUPABASE_URL!).origin;
  } catch {
    return "https://*.supabase.co";
  }
}

/**
 * Arma la política.
 *
 * Nota sobre `'unsafe-inline'` en script-src: Next.js inyecta scripts
 * inline para hidratar. Sacarlo obliga a usar nonces, y los nonces
 * obligan a renderizar todo dinámico — se pierde el prerender y el sitio
 * se vuelve más lento (peor Core Web Vitals, peor SEO). Para un sitio
 * institucional sin login de usuarios ni contenido de terceros no
 * compensa. Lo que sí bloquea, que es lo que importa acá: scripts de
 * dominios ajenos, `eval`, y que un formulario postee afuera.
 *
 * @param paraMeta omite las directivas que el navegador ignora en <meta>.
 */
export function buildCsp(paraMeta = false): string {
  const directivas = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${GESTIOO}`,
    `style-src 'self' 'unsafe-inline' ${GESTIOO}`,
    `img-src 'self' data: blob: ${supabaseOrigin()} ${GESTIOO}`,
    `font-src 'self' data: ${GESTIOO}`,
    `connect-src 'self' ${GESTIOO}`,
    `frame-src ${GESTIOO} ${EMBEDS_VIDEO}`,
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ];

  // `frame-ancestors` solo tiene efecto por header; en <meta> se ignora
  // (y algunos navegadores avisan por consola). Lo cubre X-Frame-Options.
  if (!paraMeta) directivas.splice(7, 0, "frame-ancestors 'none'");

  return directivas.join("; ");
}
