"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FotoInput } from "../_components/foto-input";

const SERVICIOS = [
  "Lavado detallado",
  "Abrillantado y realce de pintura",
  "Tratamiento cerámico",
  "Tratamiento acrílico",
  "Limpieza de interior",
  "Lavado de motor y chasis",
];

interface AngleDraft {
  etiqueta: string;
  antes: File | null;
  despues: File | null;
}

// Formato de la casa: cada trabajo con 2 pares antes/después
// (carrocería + rueda). Se pueden agregar más ángulos o dejar
// un "antes" vacío si de verdad no existe.
const DEFAULT_ANGLES: AngleDraft[] = [
  { etiqueta: "Carrocería", antes: null, despues: null },
  { etiqueta: "Rueda", antes: null, despues: null },
];

function Preview({ file, hint }: { file: File | null; hint: string }) {
  const url = useRef<string | null>(null);
  if (url.current) URL.revokeObjectURL(url.current);
  url.current = file ? URL.createObjectURL(file) : null;

  return (
    <div className="admin-photo-slot__preview">
      {url.current ? <img src={url.current} alt="" /> : <span>{hint}</span>}
    </div>
  );
}

export default function NuevoTrabajoPage() {
  const router = useRouter();
  const [servicio, setServicio] = useState(SERVICIOS[0]);
  const [vehiculo, setVehiculo] = useState("");
  const [enInicio, setEnInicio] = useState(false);
  const [angles, setAngles] = useState<AngleDraft[]>(DEFAULT_ANGLES);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAngle = (i: number, patch: Partial<AngleDraft>) =>
    setAngles((prev) => prev.map((a, j) => (j === i ? { ...a, ...patch } : a)));

  const addAngle = () =>
    setAngles((prev) =>
      prev.length >= 10
        ? prev
        : [...prev, { etiqueta: "", antes: null, despues: null }]
    );

  const removeAngle = (i: number) =>
    setAngles((prev) => prev.filter((_, j) => j !== i));

  const submit = async () => {
    setError(null);

    if (!vehiculo.trim()) {
      setError("Poné el vehículo (ej: VW Amarok gris).");
      return;
    }
    const conFoto = angles.filter((a) => a.despues);
    if (conFoto.length === 0) {
      setError("Cargá al menos una foto de DESPUÉS.");
      return;
    }
    const sinAntes = conFoto.filter((a) => !a.antes).length;
    if (
      sinAntes > 0 &&
      !confirm(
        `${sinAntes} ángulo(s) van sin foto de ANTES. La transformación vende más con el par completo. ¿Cargar igual?`
      )
    ) {
      return;
    }

    const fd = new FormData();
    fd.set("servicio", servicio);
    fd.set("vehiculo", vehiculo.trim());
    fd.set("en_inicio", enInicio ? "si" : "no");
    conFoto.forEach((a, i) => {
      fd.set(`etiqueta_${i}`, a.etiqueta.trim() || `Ángulo ${i + 1}`);
      fd.set(`despues_${i}`, a.despues!);
      if (a.antes) fd.set(`antes_${i}`, a.antes);
    });

    setBusy(true);
    try {
      const res = await fetch("/api/admin/trabajos", { method: "POST", body: fd });
      const j = await res.json().catch(() => null);
      if (!res.ok) {
        setError(
          j?.error ??
            "No se pudo guardar. Puede ser la señal o alguna foto muy pesada — probá de nuevo con buena conexión."
        );
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError(
        "Se cortó la subida. Revisá la señal y probá de nuevo (si son muchas fotos, cargá menos por vez)."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="admin-title">Nuevo trabajo</h1>
      <p className="admin-subtitle">
        El formato ideal: foto de ANTES y DESPUÉS del mismo ángulo (carrocería y
        rueda). Sacalas desde la galería del celu, acá se optimizan solas.
      </p>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-field">
        <label htmlFor="servicio">Servicio</label>
        <select
          id="servicio"
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
        <label htmlFor="vehiculo">Vehículo</label>
        <input
          id="vehiculo"
          className="admin-input"
          placeholder="Ej: VW Amarok gris"
          value={vehiculo}
          onChange={(e) => setVehiculo(e.target.value)}
        />
      </div>

      <label className="admin-check" style={{ marginBottom: "1.25rem" }}>
        <input
          type="checkbox"
          checked={enInicio}
          onChange={(e) => setEnInicio(e.target.checked)}
        />
        Mostrar en la página de inicio
      </label>

      <div className="admin-angles">
        {angles.map((a, i) => (
          <div key={i} className="admin-angle">
            <div className="admin-angle__head">
              <input
                className="admin-input"
                style={{ maxWidth: 220 }}
                placeholder={`Ángulo ${i + 1} (ej: Rueda)`}
                value={a.etiqueta}
                onChange={(e) => setAngle(i, { etiqueta: e.target.value })}
              />
              {angles.length > 1 && (
                <button
                  type="button"
                  className="abtn abtn--danger"
                  onClick={() => removeAngle(i)}
                >
                  Quitar
                </button>
              )}
            </div>

            <div className="admin-angle__pair">
              <div className="admin-photo-slot">
                <span className="admin-photo-slot__label">Antes (opcional)</span>
                <Preview file={a.antes} hint="Sin foto de antes" />
                <FotoInput
                  hasFile={!!a.antes}
                  onFile={(file) => setAngle(i, { antes: file })}
                />
              </div>
              <div className="admin-photo-slot">
                <span className="admin-photo-slot__label admin-photo-slot__label--after">
                  Después
                </span>
                <Preview file={a.despues} hint="Elegí la foto terminada" />
                <FotoInput
                  hasFile={!!a.despues}
                  onFile={(file) => setAngle(i, { despues: file })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="abtn" onClick={addAngle}>
        + Agregar otro ángulo
      </button>

      <div className="admin-form-footer">
        <button
          type="button"
          className="abtn abtn--primary"
          disabled={busy}
          onClick={submit}
          style={{ padding: "0.7rem 1.6rem" }}
        >
          {busy ? "Subiendo fotos…" : "Guardar trabajo"}
        </button>
        {busy && (
          <span className="admin-progress">
            Optimizando y subiendo, puede tardar unos segundos…
          </span>
        )}
      </div>
    </>
  );
}
