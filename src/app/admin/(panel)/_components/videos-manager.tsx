"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FotoInput } from "./foto-input";
import { CATEGORIAS_VIDEO, type VideoRow } from "@/lib/videos";

function Preview({ file }: { file: File | null }) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    if (!url) return;
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return (
    <div className="admin-photo-slot__preview">
      {url ? <img src={url} alt="" /> : <span>Sin miniatura</span>}
    </div>
  );
}

export function VideosManager({
  videos,
  tablaLista,
}: {
  videos: VideoRow[];
  tablaLista: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  // Formulario de alta
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState<string>(CATEGORIAS_VIDEO[0]);
  const [instagramUrl, setInstagramUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const limpiar = () => {
    setTitulo("");
    setInstagramUrl("");
    setTiktokUrl("");
    setThumbnail(null);
  };

  const agregar = async () => {
    setError(null);
    setOk(null);

    if (!titulo.trim()) {
      setError("Poné un título. Es lo que se lee abajo de la miniatura.");
      return;
    }
    if (!instagramUrl.trim() && !tiktokUrl.trim()) {
      setError("Pegá al menos un link: de Instagram o de TikTok.");
      return;
    }
    // La portada es lo único que se ve antes de que alguien toque la
    // tarjeta. Sin ella queda un cuadro oscuro con el logo: funciona,
    // pero vende mucho menos que una foto del trabajo.
    if (
      !thumbnail &&
      !confirm(
        "Este video va sin portada, así que en la galería se va a ver un cuadro oscuro con el logo.\n\n" +
          "Una foto del trabajo llama mucho más. ¿Guardar igual?"
      )
    ) {
      return;
    }

    const fd = new FormData();
    fd.set("titulo", titulo.trim());
    fd.set("categoria", categoria);
    if (instagramUrl.trim()) fd.set("instagram_url", instagramUrl.trim());
    if (tiktokUrl.trim()) fd.set("tiktok_url", tiktokUrl.trim());
    if (thumbnail) fd.set("thumbnail", thumbnail);

    setBusy(true);
    try {
      const res = await fetch("/api/admin/videos", { method: "POST", body: fd });
      const j = await res.json().catch(() => null);
      if (!res.ok) {
        setError(j?.error ?? "No se pudo agregar el video.");
        return;
      }
      limpiar();
      setOk("Video agregado. Ya se ve en la galería.");
      router.refresh();
    } catch {
      setError("Error de conexión. Probá de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  const patch = async (id: string, body: Record<string, unknown>) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/videos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) setError(j?.error ?? "No se pudo guardar.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const borrar = async (v: VideoRow) => {
    if (!confirm(`¿Borrar el video "${v.titulo}"?`)) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/videos/${v.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const mover = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= videos.length) return;
    setBusy(true);
    try {
      await Promise.all([
        fetch(`/api/admin/videos/${videos[i].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orden: videos[j].orden }),
        }),
        fetch(`/api/admin/videos/${videos[j].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orden: videos[i].orden }),
        }),
      ]);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="admin-title">Videos</h1>
      <p className="admin-subtitle">
        Reels de Instagram y TikTok que se muestran en la{" "}
        <strong>galería completa</strong>. Pegás el link y listo — el video se
        abre embebido cuando alguien toca la tarjeta.
      </p>

      {!tablaLista && (
        <div className="admin-notice">
          <strong>Falta un paso de una sola vez.</strong>
          <br />
          Andá a Supabase → <em>SQL Editor</em> → New query, pegá todo el
          contenido de <code>supabase/migracion-videos.sql</code> y tocá Run.
          Después volvé acá.
        </div>
      )}

      {error && <div className="admin-error">{error}</div>}
      {ok && <div className="admin-notice">{ok}</div>}

      {/* ── Lista ── */}
      <div className="admin-works" style={{ marginBottom: "2rem" }}>
        {videos.map((v, i) => (
          <article
            key={v.id}
            className={`admin-work ${v.visible ? "" : "admin-work--hidden"}`}
          >
            {v.thumbnail_url ? (
              <img
                src={v.thumbnail_url}
                alt=""
                className="admin-work__thumb"
                loading="lazy"
              />
            ) : (
              <div className="admin-work__thumb" />
            )}

            <div className="admin-work__body">
              <p className="admin-work__title">{v.titulo}</p>
              <p className="admin-work__meta">
                {v.categoria}
                {v.instagram_code && " · Instagram"}
                {v.tiktok_id && " · TikTok"}
                {!v.thumbnail_url && " · ⚠ sin miniatura"}
              </p>

              <div className="admin-work__badges">
                <span className={`admin-badge ${v.visible ? "admin-badge--on" : ""}`}>
                  {v.visible ? "Visible" : "Oculto"}
                </span>
                {v.en_inicio && (
                  <span className="admin-badge admin-badge--on">Inicio</span>
                )}
              </div>

              <div className="admin-work__actions">
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
                  disabled={busy || i === videos.length - 1}
                  onClick={() => mover(i, 1)}
                  aria-label="Bajar"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="abtn"
                  disabled={busy}
                  onClick={() => patch(v.id, { visible: !v.visible })}
                >
                  {v.visible ? "Ocultar" : "Mostrar"}
                </button>
                <button
                  type="button"
                  className="abtn"
                  disabled={busy || !v.visible}
                  title={
                    v.visible
                      ? undefined
                      : "Un video oculto no puede ir al inicio"
                  }
                  onClick={() => patch(v.id, { en_inicio: !v.en_inicio })}
                >
                  {v.en_inicio ? "Sacar del inicio" : "Poner en inicio"}
                </button>
                <button
                  type="button"
                  className="abtn abtn--danger"
                  disabled={busy}
                  onClick={() => borrar(v)}
                >
                  Borrar
                </button>
              </div>
            </div>
          </article>
        ))}

        {videos.length === 0 && tablaLista && (
          <div className="admin-notice">
            Todavía no hay videos cargados. Agregá el primero acá abajo.
          </div>
        )}
      </div>

      {/* ── Alta ── */}
      <div className="admin-angle">
        <h2 className="admin-title" style={{ fontSize: "1.1rem" }}>
          Agregar un video
        </h2>

        <div className="admin-field">
          <label htmlFor="video-titulo">Título</label>
          <input
            id="video-titulo"
            className="admin-input"
            placeholder="Ej: Pulido de un Mercedes paso a paso"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="admin-field">
          <label htmlFor="video-categoria">Categoría</label>
          <select
            id="video-categoria"
            className="admin-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {CATEGORIAS_VIDEO.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label htmlFor="video-ig">Link de Instagram</label>
          <input
            id="video-ig"
            className="admin-input"
            inputMode="url"
            placeholder="https://www.instagram.com/reel/XXXXXXX/"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
          />
          <span className="admin-hint">
            En Instagram: abrí el reel → tres puntitos → <strong>Copiar enlace</strong>.
            Los links de &quot;Compartir&quot; no sirven.
          </span>
        </div>

        <div className="admin-field">
          <label htmlFor="video-tt">Link de TikTok (opcional)</label>
          <input
            id="video-tt"
            className="admin-input"
            inputMode="url"
            placeholder="https://www.tiktok.com/@369detail/video/123456789"
            value={tiktokUrl}
            onChange={(e) => setTiktokUrl(e.target.value)}
          />
          <span className="admin-hint">
            Si el mismo video está en las dos, se puede elegir cuál ver.
          </span>
        </div>

        <div className="admin-field">
          <label>Miniatura</label>
          <span className="admin-hint" style={{ marginBottom: "0.5rem" }}>
            Instagram no nos deja sacar la portada, así que la elegís vos: una
            foto del trabajo. Si no ponés ninguna, se usa el logo.
          </span>
          <div style={{ maxWidth: 240 }}>
            <Preview file={thumbnail} />
          </div>
          <FotoInput
            hasFile={!!thumbnail}
            disabled={busy}
            onError={setError}
            label="Elegir miniatura"
            onFile={setThumbnail}
          />
        </div>

        <div className="admin-form-footer">
          <button
            type="button"
            className="abtn abtn--primary"
            disabled={busy || !tablaLista}
            onClick={agregar}
            style={{ padding: "0.7rem 1.6rem" }}
          >
            {busy ? "Guardando…" : "Agregar video"}
          </button>
        </div>
      </div>
    </>
  );
}
