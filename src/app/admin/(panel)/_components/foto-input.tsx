"use client";

import { useId, useState } from "react";
import { ImagenInvalida, prepararFoto } from "@/lib/image-client";

const IconCamera = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="admin-file-btn__icon"
    aria-hidden="true"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

/**
 * Botón claro para elegir/cambiar una foto (el input real queda oculto).
 *
 * La foto se valida y se achica acá mismo, en el celular, antes de que
 * `onFile` la reciba: así lo que viaja son ~300 KB y no los 8 MB del
 * original. Si el archivo no sirve, avisa por `onError` con un mensaje
 * en criollo en vez de dejar que reviente el servidor.
 */
export function FotoInput({
  hasFile,
  label = "Elegir foto",
  changeLabel = "Cambiar foto",
  onFile,
  onError,
  disabled = false,
}: {
  hasFile: boolean;
  label?: string;
  changeLabel?: string;
  onFile: (file: File) => void;
  onError?: (mensaje: string) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const [preparando, setPreparando] = useState(false);

  const bloqueado = disabled || preparando;

  return (
    <label
      htmlFor={id}
      className={`admin-file-btn ${hasFile ? "admin-file-btn--set" : ""} ${
        bloqueado ? "admin-file-btn--busy" : ""
      }`}
      aria-busy={preparando}
    >
      <IconCamera />
      {preparando ? "Preparando…" : hasFile ? `✓ ${changeLabel}` : label}
      <input
        id={id}
        type="file"
        accept="image/*"
        disabled={bloqueado}
        onChange={async (e) => {
          const elegido = e.target.files?.[0];
          // Se limpia enseguida para poder volver a elegir el mismo archivo.
          e.target.value = "";
          if (!elegido) return;

          setPreparando(true);
          try {
            onFile(await prepararFoto(elegido));
          } catch (err) {
            const mensaje =
              err instanceof ImagenInvalida
                ? err.message
                : "No se pudo preparar la foto. Probá con otra.";
            if (onError) onError(mensaje);
            else alert(mensaje);
          } finally {
            setPreparando(false);
          }
        }}
      />
    </label>
  );
}
