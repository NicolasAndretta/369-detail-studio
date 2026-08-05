import { VIDEO_SLOTS, type VideoSlot } from "@/data/video-data";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// ============================================================
// Reels del taller.
//
// Mismo criterio que la galería: si Supabase no está o falla, se cae a
// los videos estáticos y la web nunca queda sin la sección.
//
// Decisión de seguridad importante: de un link pegado en el panel se
// guarda SOLO el código del posteo, nunca la URL entera. La URL del
// iframe la arma este archivo. Si algún día alguien entra al panel, no
// puede embeber una página cualquiera adentro de 369.
// ============================================================

/** Categorías sugeridas para los reels (texto libre igual). */
export const CATEGORIAS_VIDEO = [
  "Pulido",
  "Cerámico",
  "Acrílico",
  "Lavado",
  "Interior",
  "Motor y Chasis",
  "Detailing",
] as const;

/** Códigos válidos de Instagram y TikTok: nada de barras, puntos ni dos puntos. */
const CODIGO_IG = /^[A-Za-z0-9_-]{5,30}$/;
const ID_TIKTOK = /^\d{6,25}$/;

export class LinkInvalido extends Error {}

/**
 * Saca el código de un link de Instagram.
 * Acepta /reel/, /reels/, /p/ y /tv/, con o sin parámetros al final.
 */
export function parsearInstagram(input: string): string {
  const url = input.trim();
  if (!url) throw new LinkInvalido("Pegá el link del posteo de Instagram.");

  // Los links de "Compartir" (/share/...) son redirecciones: el código real
  // no está en el texto, así que no hay forma de resolverlos sin abrirlos.
  if (/instagram\.com\/share/i.test(url)) {
    throw new LinkInvalido(
      "Ese es un link de 'Compartir' y no sirve. Abrí el reel en Instagram, " +
        "tocá los tres puntitos → 'Copiar enlace', y pegá ese."
    );
  }

  const m = url.match(
    /instagram\.com\/(?:reels?|p|tv)\/([A-Za-z0-9_-]+)/i
  );
  if (!m) {
    throw new LinkInvalido(
      "No parece un link de Instagram. Tiene que ser tipo " +
        "instagram.com/reel/XXXXX o instagram.com/p/XXXXX"
    );
  }

  const codigo = m[1];
  if (!CODIGO_IG.test(codigo)) {
    throw new LinkInvalido("El código del posteo no es válido.");
  }
  return codigo;
}

/** Saca el id numérico de un link de TikTok. */
export function parsearTikTok(input: string): string {
  const url = input.trim();
  if (!url) throw new LinkInvalido("Pegá el link del video de TikTok.");

  if (/vm\.tiktok\.com|vt\.tiktok\.com/i.test(url)) {
    throw new LinkInvalido(
      "Ese link corto de TikTok no sirve. Abrí el video en la app, " +
        "tocá 'Compartir' → 'Copiar enlace' desde la web, y pegá el largo."
    );
  }

  const m = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/i);
  if (!m || !ID_TIKTOK.test(m[1])) {
    throw new LinkInvalido(
      "No parece un link de TikTok. Tiene que ser tipo " +
        "tiktok.com/@369detail/video/1234567890"
    );
  }
  return m[1];
}

/** URL pública del posteo (para el botón "Ver en Instagram"). */
export function urlInstagram(codigo: string): string {
  return `https://www.instagram.com/reel/${codigo}/`;
}

export function urlTikTok(id: string): string {
  return `https://www.tiktok.com/@369detail/video/${id}`;
}

interface VideoRow {
  id: string;
  titulo: string;
  categoria: string;
  instagram_code: string | null;
  tiktok_id: string | null;
  thumbnail_url: string | null;
  visible: boolean;
  orden: number;
}

/** Miniatura por defecto si todavía no cargaron una. */
const THUMB_FALLBACK = "/images/branding/og-image.jpg";

function rowToSlot(row: VideoRow): VideoSlot {
  return {
    id: row.id,
    title: row.titulo,
    category: row.categoria,
    thumbnail: row.thumbnail_url || THUMB_FALLBACK,
    ...(row.instagram_code
      ? { instagramUrl: urlInstagram(row.instagram_code) }
      : {}),
    ...(row.tiktok_id ? { tiktokUrl: urlTikTok(row.tiktok_id) } : {}),
  };
}

/** Reels visibles, ordenados. Cae a los estáticos si no hay base. */
export async function getVideos(): Promise<VideoSlot[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return VIDEO_SLOTS;

  try {
    const { data, error } = await supabase
      .from("videos")
      .select(
        "id, titulo, categoria, instagram_code, tiktok_id, thumbnail_url, visible, orden"
      )
      .eq("visible", true)
      .order("orden", { ascending: true });

    if (error || !data) throw error ?? new Error("sin datos");

    const slots = (data as VideoRow[]).map(rowToSlot);
    return slots.length > 0 ? slots : VIDEO_SLOTS;
  } catch {
    // Tabla sin crear todavía, o Supabase caído: la sección sigue viva.
    return VIDEO_SLOTS;
  }
}

/** Todos los videos, incluidos los ocultos — solo para el panel. */
export async function getVideosAdmin(): Promise<VideoRow[] | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("videos")
    .select(
      "id, titulo, categoria, instagram_code, tiktok_id, thumbnail_url, visible, orden"
    )
    .order("orden", { ascending: true });

  if (error) return null;
  return (data ?? []) as VideoRow[];
}

export type { VideoRow };
