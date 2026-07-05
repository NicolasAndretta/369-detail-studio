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
