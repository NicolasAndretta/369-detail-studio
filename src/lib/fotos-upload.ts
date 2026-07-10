import { randomUUID } from "crypto";
import sharp from "sharp";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// ============================================================
// Procesado y subida de fotos del panel.
// El primo saca la foto con el celu → acá se optimiza (rotación
// EXIF, máx 1920px, WebP + AVIF) y se sube al bucket `galeria`.
// La web pide siempre `.webp` y el navegador moderno usa el
// `.avif` hermano (misma ruta, otra extensión) → hay que subir los dos.
// ============================================================

const BUCKET = "galeria";
const MAX_EDGE = 1920;

// sharp en su variante WASM (cuando el binario nativo no carga, p. ej. en
// Hostinger) devuelve buffers sobre memoria compartida, que el fetch de Node
// rechaza al subirlos: "ArrayBuffer: SharedArrayBuffer is not allowed".
const unshare = (b: Buffer) =>
  b.buffer instanceof SharedArrayBuffer ? Buffer.from(b) : b;

export async function processAndUploadPhoto(
  file: File,
  trabajoId: string
): Promise<string> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase no está configurado");

  const input = Buffer.from(await file.arrayBuffer());

  const base = sharp(input).rotate().resize(MAX_EDGE, MAX_EDGE, {
    fit: "inside",
    withoutEnlargement: true,
  });

  const [webp, avif] = await Promise.all([
    base.clone().webp({ quality: 82 }).toBuffer().then(unshare),
    base.clone().avif({ quality: 60 }).toBuffer().then(unshare),
  ]);

  const name = randomUUID();
  const dir = `trabajos/${trabajoId}`;

  const upWebp = await supabase.storage
    .from(BUCKET)
    .upload(`${dir}/${name}.webp`, webp, {
      contentType: "image/webp",
      cacheControl: "31536000",
    });
  if (upWebp.error) throw upWebp.error;

  const upAvif = await supabase.storage
    .from(BUCKET)
    .upload(`${dir}/${name}.avif`, avif, {
      contentType: "image/avif",
      cacheControl: "31536000",
    });
  if (upAvif.error) throw upAvif.error;

  return supabase.storage.from(BUCKET).getPublicUrl(`${dir}/${name}.webp`).data
    .publicUrl;
}

/** Borra del Storage todas las fotos subidas de un trabajo (best-effort). */
export async function deleteWorkPhotos(trabajoId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const dir = `trabajos/${trabajoId}`;
  const { data } = await supabase.storage.from(BUCKET).list(dir);
  if (data && data.length > 0) {
    await supabase.storage
      .from(BUCKET)
      .remove(data.map((f) => `${dir}/${f.name}`));
  }
}
