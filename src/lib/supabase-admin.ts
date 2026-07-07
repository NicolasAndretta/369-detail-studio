import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente con service_role: SOLO se usa en el servidor (lib/, app/api/, páginas
// server). Las claves viven en variables de entorno sin prefijo NEXT_PUBLIC_,
// así nunca llegan al navegador.

let cached: SupabaseClient | null | undefined;

/** Devuelve el cliente admin, o null si Supabase no está configurado todavía. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    cached = null;
    return cached;
  }

  try {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      // No usamos realtime; el transport dummy evita que reviente en
      // Node < 22 (sin WebSocket nativo), p. ej. según la versión de Hostinger.
      realtime: { transport: class {} as unknown as new (...args: unknown[]) => WebSocket },
    });
  } catch {
    cached = null;
  }

  return cached;
}

/** true si el panel puede operar (Supabase configurado). */
export function isSupabaseConfigured(): boolean {
  return getSupabaseAdmin() !== null;
}
