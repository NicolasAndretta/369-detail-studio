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

  // Un pipeline nuevo por formato + `sequentialRead`: procesa un encode a la
  // vez para no duplicar el pico de memoria con fotos grandes de celular.
  const pipeline = () =>
    sharp(input, { sequentialRead: true }).rotate().resize(MAX_EDGE, MAX_EDGE, {
      fit: "inside",
      withoutEnlargement: true,
    });

  // `effort: 0` es CLAVE: en Hostinger sharp corre en WebAssembly (un solo
  // núcleo) y el effort AVIF por defecto (4) tarda ~90s por foto → la subida
  // se corta por timeout. Con effort 0 baja a ~1s y el archivo queda igual o
  // más chico. El WebP es el formato principal; el AVIF es el hermano opcional.
  const webp = unshare(await pipeline().webp({ quality: 82 }).toBuffer());
  const avif = unshare(
    await pipeline().avif({ quality: 60, effort: 0 }).toBuffer()
  );

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
