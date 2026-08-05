"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FotoInput } from "../_components/foto-input";
import {
  SubidaVencida,
  subirConProgreso,
} from "@/lib/upload-client";

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

/**
 * Miniatura de la foto elegida.
 *
 * Antes esto creaba y revocaba la URL del blob durante el render: con solo
 * escribir en el campo "Vehículo" se volvía a renderizar todo, la foto ya
 * cargada quedaba revocada y las miniaturas parpadeaban o desaparecían.
 * Ahora la URL se crea una sola vez por archivo y se libera al cambiarlo.
 */
/** "412 KB" / "8,4 MB" — para que se vea de un vistazo si el achique corrió. */
function pesoLegible(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

function Preview({ file, hint }: { file: File | null; hint: string }) {
  // La URL se calcula una sola vez por archivo, y el efecto solo se ocupa
  // de liberarla cuando cambia la foto o se desmonta la tarjeta.
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    if (!url) return;
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return (
    <>
      <div className="admin-photo-slot__preview">
        {url ? <img src={url} alt="" /> : <span>{hint}</span>}
      </div>
      {/* El peso a la vista: si dice más de 1 MB, el achique del celular no
          corrió y la subida va a sufrir. Es el dato que hace falta para
          saber si un problema de carga es de la foto o de la conexión. */}
      {file && (
        <span
          className={`admin-photo-slot__peso ${
            file.size > 1024 * 1024 ? "admin-photo-slot__peso--pesada" : ""
          }`}
        >
          {pesoLegible(file.size)}
          {file.size > 1024 * 1024 && " ⚠ no se pudo achicar"}
        </span>
      )}
    </>
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
  /** Texto en vivo de la subida ("subiendo 45%", "optimizando…"). */
  const [progreso, setProgreso] = useState<string | null>(null);

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

  /**
   * Guarda el trabajo subiendo UN ÁNGULO POR PEDIDO.
   *
   * Antes iba todo en un solo POST: con 2 ángulos son 4 fotos, y desde el
   * celular del taller ese pedido tarda lo suficiente como para que se
   * corte — y cuando se cortaba, se perdía el trabajo entero.
   *
   * Así, cada pedido lleva 2 fotos como mucho. Si uno falla, lo anterior
   * ya quedó guardado y se completa desde "Editar" sin volver a empezar.
   */
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

    const etiquetaDe = (a: AngleDraft, i: number) =>
      a.etiqueta.trim() || `Ángulo ${i + 1}`;

    const total = conFoto.length;

    // Dos minutos por ángulo: de sobra para 2 fotos, y si se colgó de
    // verdad corta con un mensaje en vez de dejar el botón girando.
    const pedir = (url: string, body: FormData, i: number) =>
      subirConProgreso(url, body, (pct) => {
        const cual = total > 1 ? `Ángulo ${i + 1} de ${total} — ` : "";
        setProgreso(
          pct < 100
            ? `${cual}subiendo ${pct}%`
            : `${cual}optimizando las fotos en el servidor…`
        );
      });

    setBusy(true);
    setProgreso("Preparando el envío…");

    try {
      // ── 1. El trabajo se crea junto con el primer ángulo ──
      const primero = conFoto[0];
      const fd = new FormData();
      fd.set("servicio", servicio);
      fd.set("vehiculo", vehiculo.trim());
      fd.set("en_inicio", enInicio ? "si" : "no");
      fd.set("etiqueta_0", etiquetaDe(primero, 0));
      fd.set("despues_0", primero.despues!);
      if (primero.antes) fd.set("antes_0", primero.antes);

      const res = await pedir("/api/admin/trabajos", fd, 0);
      if (!res.ok || !res.body?.id) {
        setError(res.body?.error ?? "No se pudo crear el trabajo. Probá de nuevo.");
        return;
      }
      const trabajoId = res.body.id;

      // ── 2. Los demás ángulos, de a uno ──
      for (let i = 1; i < total; i++) {
        const a = conFoto[i];
        const fdA = new FormData();
        fdA.set("trabajo_id", trabajoId);
        fdA.set("etiqueta", etiquetaDe(a, i));
        fdA.set("despues", a.despues!);
        if (a.antes) fdA.set("antes", a.antes);

        const r = await pedir("/api/admin/fotos", fdA, i);
        if (!r.ok) {
          setError(
            `El trabajo se guardó con ${i} ángulo(s), pero el ${i + 1} falló: ${
              r.body?.error ?? "se cortó la subida"
            }. Entrá a "Editar" y agregá los que faltan — no hace falta empezar de nuevo.`
          );
          router.refresh();
          return;
        }
      }

      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError(
        e instanceof SubidaVencida
          ? "La subida tardó más de 2 minutos y se cortó. Buscá wifi o mejor señal y probá de nuevo."
          : "Se cortó la conexión durante la subida. Si el trabajo llegó a crearse, aparece en el listado y se completa desde 'Editar' — no hace falta empezar de nuevo."
      );
      router.refresh();
    } finally {
      setBusy(false);
      setProgreso(null);
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
                  disabled={busy}
                  onFile={(file) => setAngle(i, { antes: file })}
                  onError={setError}
                />
              </div>
              <div className="admin-photo-slot">
                <span className="admin-photo-slot__label admin-photo-slot__label--after">
                  Después
                </span>
                <Preview file={a.despues} hint="Elegí la foto terminada" />
                <FotoInput
                  hasFile={!!a.despues}
                  disabled={busy}
                  onFile={(file) => setAngle(i, { despues: file })}
                  onError={setError}
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
          {busy ? "Subiendo…" : "Guardar trabajo"}
        </button>
        {busy && (
          <span className="admin-progress">
            {progreso ?? "Preparando…"}
            <br />
            <small>No cierres esta pantalla.</small>
          </span>
        )}
      </div>
    </>
  );
}
