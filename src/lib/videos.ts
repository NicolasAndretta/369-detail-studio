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
  /** Además de visible, ¿sube a la portada? Mismo criterio que `trabajos`. */
  en_inicio: boolean;
  orden: number;
}

/** Columnas que se piden siempre. En un solo lugar para no desincronizarlas. */
const COLUMNAS =
  "id, titulo, categoria, instagram_code, tiktok_id, thumbnail_url, visible, en_inicio, orden";

function rowToSlot(row: VideoRow): VideoSlot {
  return {
    id: row.id,
    title: row.titulo,
    category: row.categoria,
    // Sin portada no se inventa una: la tarjeta dibuja su propio
    // placeholder, que queda mejor que una foto recortada al azar.
    ...(row.thumbnail_url ? { thumbnail: row.thumbnail_url } : {}),
    ...(row.instagram_code
      ? { instagramUrl: urlInstagram(row.instagram_code) }
      : {}),
    ...(row.tiktok_id ? { tiktokUrl: urlTikTok(row.tiktok_id) } : {}),
  };
}

/**
 * Reels visibles, ordenados. Cae a los estáticos si no hay base.
 * @param soloInicio pide únicamente los marcados para la portada.
 */
export async function getVideos(soloInicio = false): Promise<VideoSlot[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return soloInicio ? [] : VIDEO_SLOTS;

  try {
    let consulta = supabase
      .from("videos")
      .select(COLUMNAS)
      .eq("visible", true);

    if (soloInicio) consulta = consulta.eq("en_inicio", true);

    const { data, error } = await consulta.order("orden", { ascending: true });
    if (error || !data) throw error ?? new Error("sin datos");

    const slots = (data as VideoRow[]).map(rowToSlot);

    // En la portada NO se cae a los estáticos: si Nico no eligió ninguno,
    // la sección no va y listo. En la galería sí, para no dejarla vacía.
    if (soloInicio) return slots;
    return slots.length > 0 ? slots : VIDEO_SLOTS;
  } catch {
    // Tabla sin migrar todavía, o Supabase caído: la web no se rompe.
    return soloInicio ? [] : VIDEO_SLOTS;
  }
}

/** Todos los videos, incluidos los ocultos — solo para el panel. */
export async function getVideosAdmin(): Promise<VideoRow[] | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("videos")
    .select(COLUMNAS)
    .order("orden", { ascending: true });

  if (error) return null;
  return (data ?? []) as VideoRow[];
}

export type { VideoRow };
