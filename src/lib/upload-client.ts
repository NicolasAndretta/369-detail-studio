"use client";

// ============================================================
// Subida con progreso real.
//
// `fetch` no avisa cuánto lleva subido — solo devuelve al final o
// revienta. Desde el taller, con señal floja, eso deja al primo mirando
// un botón quieto sin saber si va lento o si ya murió, y tocando de
// nuevo (subiendo todo dos veces).
//
// XMLHttpRequest sí expone `upload.onprogress`, así que se usa ese.
// Además sirve de diagnóstico: si el porcentaje avanza de a poquito,
// el problema es la conexión y no el servidor.
// ============================================================

export interface RespuestaSubida {
  ok: boolean;
  status: number;
  /** Cuerpo ya parseado; null si no vino JSON. */
  body: { error?: string; id?: string; ok?: boolean } | null;
}

export class SubidaCortada extends Error {}
export class SubidaVencida extends Error {}

export function subirConProgreso(
  url: string,
  datos: FormData,
  onProgreso: (porcentaje: number) => void,
  timeoutMs = 120000
): Promise<RespuestaSubida> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.timeout = timeoutMs;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgreso(Math.round((e.loaded / e.total) * 100));
      }
    };

    // Terminó de subir pero el servidor todavía está procesando las fotos.
    xhr.upload.onload = () => onProgreso(100);

    xhr.onload = () => {
      let body: RespuestaSubida["body"] = null;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        // Respuesta que no es JSON (una página de error del proxy, por ejemplo)
      }
      resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, body });
    };

    xhr.onerror = () =>
      reject(new SubidaCortada("Se cortó la conexión durante la subida."));
    xhr.ontimeout = () =>
      reject(new SubidaVencida("La subida tardó más de lo permitido."));
    xhr.onabort = () => reject(new SubidaCortada("Subida cancelada."));

    xhr.send(datos);
  });
}
