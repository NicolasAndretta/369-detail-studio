import { randomUUID } from "crypto";
import sharp from "sharp";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// ============================================================
// Procesado y subida de fotos del panel.
// El primo saca la foto con el celu → el navegador ya la achicó
// (ver `lib/image-client.ts`) → acá se optimiza (rotación EXIF,
// máx 1920px, WebP + AVIF) y se sube al bucket `galeria`.
// La web pide siempre `.webp` y el navegador moderno usa el
// `.avif` hermano (misma ruta, otra extensión) → hay que subir los dos.
// ============================================================

const BUCKET = "galeria";
const MAX_EDGE = 1920;

/** Techo de servidor. El cliente ya achica, esto es el cinturón por si lo saltean. */
const MAX_BYTES = 15 * 1024 * 1024;

const TIPOS_ACEPTADOS = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/tiff",
  "image/gif",
]);

// sharp en su variante WASM (cuando el binario nativo no carga, p. ej. en
// Hostinger) devuelve buffers sobre memoria compartida, que el fetch de Node
// rechaza al subirlos: "ArrayBuffer: SharedArrayBuffer is not allowed".
const unshare = (b: Buffer) =>
  b.buffer instanceof SharedArrayBuffer ? Buffer.from(b) : b;

/** Error con un mensaje que se le puede mostrar al primo tal cual. */
export class ErrorDeFoto extends Error {}

/**
 * Traduce los errores crípticos de sharp/Supabase a algo accionable.
 * Antes llegaba "Input buffer contains unsupported image format" a la
 * pantalla y no había forma de saber qué hacer con eso.
 */
function mensajeAmigable(e: unknown): string {
  const crudo = e instanceof Error ? e.message : String(e);

  if (/unsupported image format|Input buffer/i.test(crudo)) {
    return (
      "El formato de esa foto no se puede procesar. Si es una foto de iPhone, " +
      "poné Ajustes → Cámara → Formatos → 'Más compatible' y sacala de nuevo."
    );
  }
  if (/premature end|corrupt|truncated/i.test(crudo)) {
    return "La foto llegó incompleta. Probá subirla de nuevo con mejor señal.";
  }
  if (/SharedArrayBuffer/i.test(crudo)) {
    return "Error interno al procesar la foto en el servidor. Avisale a Nico.";
  }
  if (/exceeded the maximum allowed size|Payload too large|413/i.test(crudo)) {
    return "La foto pesa demasiado para el servidor.";
  }
  if (/duplicate|already exists/i.test(crudo)) {
    return "Ya existe una foto con ese nombre. Probá de nuevo.";
  }
  if (/fetch failed|ECONNRESET|ETIMEDOUT|network/i.test(crudo)) {
    return "Se cortó la conexión con el servidor de fotos. Probá de nuevo.";
  }
  return `No se pudo subir la foto (${crudo}).`;
}

function validar(file: File): void {
  if (file.size === 0) {
    throw new ErrorDeFoto("La foto llegó vacía. Elegila de nuevo.");
  }
  if (file.size > MAX_BYTES) {
    const mb = Math.round(file.size / 1024 / 1024);
    throw new ErrorDeFoto(`La foto pesa ${mb} MB y el máximo es 15 MB.`);
  }
  // El tipo lo declara el navegador, así que no alcanza solo con esto —
  // sharp abajo confirma que el contenido de verdad sea una imagen.
  if (file.type && !TIPOS_ACEPTADOS.has(file.type)) {
    throw new ErrorDeFoto(
      `Formato no soportado (${file.type}). Usá JPG, PNG o WebP.`
    );
  }
}

export async function processAndUploadPhoto(
  file: File,
  trabajoId: string
): Promise<string> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new ErrorDeFoto("Supabase no está configurado.");

  validar(file);

  const input = Buffer.from(await file.arrayBuffer());

  // Un pipeline nuevo por formato + `sequentialRead`: procesa un encode a la
  // vez para no duplicar el pico de memoria con fotos grandes de celular.
  const pipeline = () =>
    sharp(input, { sequentialRead: true }).rotate().resize(MAX_EDGE, MAX_EDGE, {
      fit: "inside",
      withoutEnlargement: true,
    });

  let webp: Buffer;
  let avif: Buffer;
  try {
    // `effort: 0` es CLAVE: en Hostinger sharp corre en WebAssembly (un solo
    // núcleo) y el effort AVIF por defecto (4) tarda ~90s por foto → la subida
    // se corta por timeout. Con effort 0 baja a ~1s y el archivo queda igual o
    // más chico. El WebP es el formato principal; el AVIF es el hermano opcional.
    // Los dos encodes van en serie a propósito: en un solo núcleo, hacerlos en
    // paralelo no acelera nada y duplica la memoria.
    webp = unshare(await pipeline().webp({ quality: 82 }).toBuffer());
    avif = unshare(await pipeline().avif({ quality: 60, effort: 0 }).toBuffer());
  } catch (e) {
    throw new ErrorDeFoto(mensajeAmigable(e));
  }

  const name = randomUUID();
  const dir = `trabajos/${trabajoId}`;

  // Las subidas sí van en paralelo: es red, no CPU.
  const [upWebp, upAvif] = await Promise.all([
    supabase.storage.from(BUCKET).upload(`${dir}/${name}.webp`, webp, {
      contentType: "image/webp",
      cacheControl: "31536000",
    }),
    supabase.storage.from(BUCKET).upload(`${dir}/${name}.avif`, avif, {
      contentType: "image/avif",
      cacheControl: "31536000",
    }),
  ]);

  if (upWebp.error || upAvif.error) {
    // Si una de las dos entró, se limpia para no dejar basura en el storage.
    try {
      await supabase.storage
        .from(BUCKET)
        .remove([`${dir}/${name}.webp`, `${dir}/${name}.avif`]);
    } catch {
      // Si la limpieza falla no importa: el error que vale es el de arriba.
    }
    throw new ErrorDeFoto(mensajeAmigable(upWebp.error ?? upAvif.error));
  }

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
