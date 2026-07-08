"use client";

import { useId } from "react";

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

/** Botón claro para elegir/cambiar una foto (el input real queda oculto). */
export function FotoInput({
  hasFile,
  label = "Elegir foto",
  changeLabel = "Cambiar foto",
  onFile,
}: {
  hasFile: boolean;
  label?: string;
  changeLabel?: string;
  onFile: (file: File) => void;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={`admin-file-btn ${hasFile ? "admin-file-btn--set" : ""}`}
    >
      <IconCamera />
      {hasFile ? `✓ ${changeLabel}` : label}
      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </label>
  );
}
