"use client";

// ============================================================
// Preparación de fotos EN EL CELULAR, antes de subirlas.
//
// Por qué existe: una foto de celular moderno pesa 5-12 MB y mide
// 4000×3000. Antes se subía tal cual y el servidor hacía todo el
// trabajo pesado — de ahí venían los errores de carga:
//   · subidas eternas con datos móviles, que se cortaban solas
//   · el proxy rebotando el archivo por tamaño (error 413)
//   · el servidor pasándose del tiempo máximo generando AVIF
//
// Achicando acá, sube ~300 KB en vez de 8 MB: entra rápido, no se
// corta, y al servidor le queda un trabajo liviano.
// ============================================================

/**
 * Lado máximo que se sube: exactamente el mismo al que el servidor va a
 * reducirla igual (MAX_EDGE en `lib/fotos-upload.ts`). Mandar más grande
 * es pagar datos móviles por píxeles que se tiran del otro lado.
 */
const LADO_MAX = 1920;
/**
 * Calidad del JPEG que viaja. No es la calidad final: el servidor
 * recomprime a WebP 82 y AVIF 60. Con 0.85 la diferencia visual es nula
 * y el archivo pesa casi la mitad que con 0.92.
 */
const CALIDAD = 0.85;
/** Techo del archivo original: más que esto es un video o un error. */
const MAX_ORIGINAL = 30 * 1024 * 1024;
/** Debajo de esto y ya chica, se sube tal cual (no vale la pena recomprimir). */
const YA_ESTA_BIEN = 900 * 1024;

/** Error con mensaje listo para mostrarle al usuario. */
export class ImagenInvalida extends Error {}

function esHeic(file: File): boolean {
  return (
    /image\/hei[cf]/i.test(file.type) || /\.(heic|heif)$/i.test(file.name)
  );
}

/** Decodifica el archivo respetando la orientación EXIF de la cámara. */
async function decodificar(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // Sigue al plan B: algunos navegadores no soportan la opción.
    }
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("no se pudo decodificar"));
    };
    img.src = url;
  });
}

function medidas(src: ImageBitmap | HTMLImageElement): { w: number; h: number } {
  return src instanceof HTMLImageElement
    ? { w: src.naturalWidth, h: src.naturalHeight }
    : { w: src.width, h: src.height };
}

/**
 * Valida y achica una foto elegida en el panel.
 * Devuelve el archivo listo para subir, o tira `ImagenInvalida` con un
 * mensaje que se puede mostrar tal cual.
 */
export async function prepararFoto(original: File): Promise<File> {
  if (original.size === 0) {
    throw new ImagenInvalida("El archivo está vacío. Probá elegirlo de nuevo.");
  }

  if (!original.type.startsWith("image/") && !esHeic(original)) {
    throw new ImagenInvalida(
      "Eso no es una foto. Elegí una imagen de la galería del celular."
    );
  }

  if (original.size > MAX_ORIGINAL) {
    const mb = Math.round(original.size / 1024 / 1024);
    throw new ImagenInvalida(
      `La foto pesa ${mb} MB y es demasiado. ¿Seguro que no elegiste un video?`
    );
  }

  let fuente: ImageBitmap | HTMLImageElement;
  try {
    fuente = await decodificar(original);
  } catch {
    if (esHeic(original)) {
      throw new ImagenInvalida(
        "La foto está en formato HEIC y este navegador no la puede leer. " +
          "En el iPhone: Ajustes → Cámara → Formatos → 'Más compatible', y sacala de nuevo."
      );
    }
    throw new ImagenInvalida(
      "No se pudo abrir esa foto. Puede estar dañada o a medio descargar."
    );
  }

  const { w, h } = medidas(fuente);
  if (!w || !h) {
    throw new ImagenInvalida("No se pudo leer el tamaño de la foto.");
  }

  const escala = Math.min(1, LADO_MAX / Math.max(w, h));

  // Ya es chica y liviana: no tiene sentido recomprimirla y perder calidad.
  if (escala === 1 && original.size <= YA_ESTA_BIEN) {
    if (fuente instanceof ImageBitmap) fuente.close();
    return original;
  }

  const destinoW = Math.round(w * escala);
  const destinoH = Math.round(h * escala);

  const canvas = document.createElement("canvas");
  canvas.width = destinoW;
  canvas.height = destinoH;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    if (fuente instanceof ImageBitmap) fuente.close();
    throw new ImagenInvalida("El navegador no pudo procesar la foto.");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(fuente, 0, 0, destinoW, destinoH);
  if (fuente instanceof ImageBitmap) fuente.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", CALIDAD)
  );

  if (!blob) {
    throw new ImagenInvalida("No se pudo preparar la foto para subir.");
  }

  // El canvas ya aplicó la orientación EXIF, así que el archivo sale derecho
  // y sin metadatos (también saca la ubicación GPS de la foto, que no queremos
  // publicar). El nombre se normaliza para que el servidor no reciba rarezas.
  return new File([blob], `foto-${Date.now()}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}
