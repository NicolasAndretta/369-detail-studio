// ────────────────────────────────────────────────────────────────────────────
//  Feature flags del sitio.
//  Módulo server-safe (SIN "use client"): se puede importar tanto desde
//  Server Components como Client Components y el valor real llega intacto.
//  (Si esto viviera en un módulo "use client", un Server Component recibiría
//   una referencia de cliente —truthy— en lugar del booleano.)
// ────────────────────────────────────────────────────────────────────────────

/** Sección "Nuestro espacio": dejar en `false` hasta tener las fotos
 *  del frente terminado. Cambiar a `true` la publica (ya está maquetada). */
export const SHOW_NUESTRO_ESPACIO = false;

/**
 * Sección "CONSULTAR ORDEN" (widget de Gestioo).
 *
 * Apagada el 05/08/2026. Motivo verificado en Chrome contra el sitio en vivo:
 * el script `taller.gestioo.net/gwidget/.../gtaller_modal.init.js` responde con
 * `Cross-Origin-Resource-Policy: same-origin`, así que el navegador lo bloquea
 * y NUNCA habilita el botón. Queda un botón que dice "CONSULTAR ORDEN", está
 * gris y no hace nada — peor que no tenerlo.
 *
 * No se arregla desde acá: el header lo manda el servidor de Gestioo. Hay que
 * pedirles que habiliten el dominio de 369 (y que saquen ese CORP para el
 * archivo del widget).
 *
 * Cuando lo arreglen: poner `true` acá y listo, el código ya está.
 */
export const SHOW_ORDER_STATUS = false;
