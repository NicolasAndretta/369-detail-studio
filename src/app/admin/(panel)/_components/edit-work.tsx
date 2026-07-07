"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SERVICIOS = [
  "Lavado detallado",
  "Abrillantado y realce de pintura",
  "Tratamiento cerámico",
  "Tratamiento acrílico",
  "Limpieza de interior",
  "Lavado de motor y chasis",
];

export interface EditFoto {
  id: string;
  etiqueta: string;
  antes_url: string | null;
  despues_url: string;
  orden: number;
}

export function EditWork({
  id,
  servicio: servicioInicial,
  vehiculo: vehiculoInicial,
  fotos,
}: {
  id: string;
  servicio: string;
  vehiculo: string;
  fotos: EditFoto[];
}) {
  const router = useRouter();
  const [servicio, setServicio] = useState(servicioInicial);
  const [vehiculo, setVehiculo] = useState(vehiculoInicial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del "agregar ángulo"
  const [nuevoLabel, setNuevoLabel] = useState("");
  const [nuevoAntes, setNuevoAntes] = useState<File | null>(null);
  const [nuevoDespues, setNuevoDespues] = useState<File | null>(null);

  const guardarDatos = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/trabajos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servicio, vehiculo }),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) setError(j?.error ?? "No se pudo guardar");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const patchFoto = async (fotoId: string, fd: FormData) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/fotos/${fotoId}`, {
        method: "PATCH",
        body: fd,
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) setError(j?.error ?? "No se pudo guardar la foto");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const borrarFoto = async (foto: EditFoto) => {
    if (!confirm(`¿Borrar el ángulo "${foto.etiqueta}"?`)) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/fotos/${foto.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const mover = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= fotos.length) return;
    setBusy(true);
    try {
      const fdA = new FormData();
      fdA.set("orden", String(fotos[j].orden));
      const fdB = new FormData();
      fdB.set("orden", String(fotos[i].orden));
      await fetch(`/api/admin/fotos/${fotos[i].id}`, { method: "PATCH", body: fdA });
      await fetch(`/api/admin/fotos/${fotos[j].id}`, { method: "PATCH", body: fdB });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const agregarAngulo = async () => {
    setError(null);
    if (!nuevoDespues) {
      setError("El ángulo nuevo necesita al menos la foto de después.");
      return;
    }
    const fd = new FormData();
    fd.set("trabajo_id", id);
    fd.set("etiqueta", nuevoLabel.trim() || `Ángulo ${fotos.length + 1}`);
    fd.set("despues", nuevoDespues);
    if (nuevoAntes) fd.set("antes", nuevoAntes);

    setBusy(true);
    try {
      const res = await fetch("/api/admin/fotos", { method: "POST", body: fd });
      const j = await res.json().catch(() => null);
      if (!res.ok) {
        setError(j?.error ?? "No se pudo agregar el ángulo");
        return;
      }
      setNuevoLabel("");
      setNuevoAntes(null);
      setNuevoDespues(null);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="admin-title">Editar trabajo</h1>
      <p className="admin-subtitle">
        La primera foto es la cara de la tarjeta. Usá las flechas para ordenar.
      </p>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-field">
        <label>Servicio</label>
        <select
          className="admin-select"
          value={servicio}
          onChange={(e) => setServicio(e.target.value)}
        >
          {SERVICIOS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-field">
        <label>Vehículo</label>
        <input
          className="admin-input"
          value={vehiculo}
          onChange={(e) => setVehiculo(e.target.value)}
        />
      </div>

      <div className="admin-form-footer" style={{ marginBottom: "1.5rem" }}>
        <button
          type="button"
          className="abtn abtn--primary"
          disabled={busy}
          onClick={guardarDatos}
        >
          Guardar datos
        </button>
      </div>

      <div className="admin-angles">
        {fotos.map((f, i) => (
          <div key={f.id} className="admin-angle">
            <div className="admin-angle__head">
              <strong style={{ color: "var(--text-primary)" }}>
                {i + 1}. {f.etiqueta}
              </strong>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  type="button"
                  className="abtn"
                  disabled={busy || i === 0}
                  onClick={() => mover(i, -1)}
                  aria-label="Subir"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="abtn"
                  disabled={busy || i === fotos.length - 1}
                  onClick={() => mover(i, 1)}
                  aria-label="Bajar"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="abtn abtn--danger"
                  disabled={busy}
                  onClick={() => borrarFoto(f)}
                >
                  Borrar
                </button>
              </div>
            </div>

            <div className="admin-angle__pair">
              <div className="admin-photo-slot">
                <span className="admin-photo-slot__label">Antes</span>
                <div className="admin-photo-slot__preview">
                  {f.antes_url ? (
                    <img src={f.antes_url} alt="" loading="lazy" />
                  ) : (
                    <span>Sin antes</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.set("antes", file);
                    patchFoto(f.id, fd);
                  }}
                />
                {f.antes_url && (
                  <button
                    type="button"
                    className="abtn abtn--danger"
                    disabled={busy}
                    onClick={() => {
                      if (!confirm("¿Quitar la foto de antes de este ángulo?")) return;
                      const fd = new FormData();
                      fd.set("quitar_antes", "si");
                      patchFoto(f.id, fd);
                    }}
                  >
                    Quitar antes
                  </button>
                )}
              </div>

              <div className="admin-photo-slot">
                <span className="admin-photo-slot__label admin-photo-slot__label--after">
                  Después
                </span>
                <div className="admin-photo-slot__preview">
                  <img src={f.despues_url} alt="" loading="lazy" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.set("despues", file);
                    patchFoto(f.id, fd);
                  }}
                />
              </div>
            </div>

            <div className="admin-field" style={{ marginTop: "0.75rem", marginBottom: 0 }}>
              <label>Etiqueta</label>
              <input
                className="admin-input"
                defaultValue={f.etiqueta}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && v !== f.etiqueta) {
                    const fd = new FormData();
                    fd.set("etiqueta", v);
                    patchFoto(f.id, fd);
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Agregar ángulo nuevo */}
      <div className="admin-angle" style={{ marginTop: "1rem" }}>
        <div className="admin-angle__head">
          <input
            className="admin-input"
            style={{ maxWidth: 220 }}
            placeholder="Nuevo ángulo (ej: Interior)"
            value={nuevoLabel}
            onChange={(e) => setNuevoLabel(e.target.value)}
          />
        </div>
        <div className="admin-angle__pair">
          <div className="admin-photo-slot">
            <span className="admin-photo-slot__label">Antes (opcional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNuevoAntes(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="admin-photo-slot">
            <span className="admin-photo-slot__label admin-photo-slot__label--after">
              Después
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNuevoDespues(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>
        <div className="admin-form-footer">
          <button
            type="button"
            className="abtn"
            disabled={busy}
            onClick={agregarAngulo}
          >
            {busy ? "Subiendo…" : "+ Agregar ángulo"}
          </button>
        </div>
      </div>
    </>
  );
}
