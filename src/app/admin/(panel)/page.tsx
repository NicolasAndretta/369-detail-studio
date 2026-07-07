import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin } from "@/lib/admin-session";
import { WorkActions } from "./_components/work-actions";

export const dynamic = "force-dynamic";

interface AdminFoto {
  id: string;
  etiqueta: string;
  antes_url: string | null;
  despues_url: string;
  orden: number;
}

interface AdminTrabajo {
  id: string;
  servicio: string;
  vehiculo: string;
  visible: boolean;
  en_inicio: boolean;
  orden: number;
  fotos: AdminFoto[];
}

export default async function AdminHomePage() {
  await requireAdmin();
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return (
      <>
        <h1 className="admin-title">Panel de galería</h1>
        <div className="admin-notice">
          <strong>Falta conectar la base de datos.</strong>
          <br />
          Seguí los pasos de <code>docs/PANEL-GALERIA.md</code>: crear el proyecto
          en Supabase, correr <code>schema.sql</code> y <code>seed.sql</code>, y
          completar el archivo <code>.env.local</code>. Mientras tanto, la web
          pública sigue mostrando la galería actual sin cambios.
        </div>
      </>
    );
  }

  const { data, error } = await supabase
    .from("trabajos")
    .select(
      "id, servicio, vehiculo, visible, en_inicio, orden, fotos (id, etiqueta, antes_url, despues_url, orden)"
    )
    .order("orden", { ascending: true });

  if (error) {
    return (
      <>
        <h1 className="admin-title">Panel de galería</h1>
        <div className="admin-error">
          No pude leer la base: {error.message}. ¿Corriste{" "}
          <code>schema.sql</code> en Supabase?
        </div>
      </>
    );
  }

  const trabajos = (data ?? []) as unknown as AdminTrabajo[];
  const enInicio = trabajos.filter((t) => t.en_inicio && t.visible).length;

  return (
    <>
      <h1 className="admin-title">Trabajos</h1>
      <p className="admin-subtitle">
        {trabajos.length} en total · {enInicio} en la página de inicio
        {enInicio !== 6 && " (lo ideal es 6, uno por servicio)"}
      </p>

      <div className="admin-works">
        {trabajos.map((t) => {
          const fotos = [...t.fotos].sort((a, b) => a.orden - b.orden);
          const pares = fotos.filter((f) => f.antes_url).length;
          const thumb = fotos[0]?.despues_url;

          return (
            <article
              key={t.id}
              className={`admin-work ${t.visible ? "" : "admin-work--hidden"}`}
            >
              {thumb ? (
                <img
                  src={thumb}
                  alt=""
                  className="admin-work__thumb"
                  loading="lazy"
                />
              ) : (
                <div className="admin-work__thumb" />
              )}

              <div className="admin-work__body">
                <p className="admin-work__title">{t.vehiculo || "(sin vehículo)"}</p>
                <p className="admin-work__meta">
                  {t.servicio} · {fotos.length} foto{fotos.length === 1 ? "" : "s"} ·{" "}
                  {pares} par{pares === 1 ? "" : "es"} antes/después
                </p>

                <div className="admin-work__badges">
                  <span className={`admin-badge ${t.visible ? "admin-badge--on" : ""}`}>
                    {t.visible ? "Visible" : "Oculto"}
                  </span>
                  {t.en_inicio && (
                    <span className="admin-badge admin-badge--on">Inicio</span>
                  )}
                </div>

                <div className="admin-work__actions">
                  <Link href={`/admin/${t.id}`} className="abtn">
                    Editar
                  </Link>
                  <WorkActions
                    id={t.id}
                    visible={t.visible}
                    enInicio={t.en_inicio}
                    vehiculo={t.vehiculo}
                  />
                </div>
              </div>
            </article>
          );
        })}

        {trabajos.length === 0 && (
          <div className="admin-notice">
            La base está vacía. Corré <code>supabase/seed.sql</code> para cargar
            la galería actual, o creá el primer trabajo con “+ Nuevo trabajo”.
          </div>
        )}
      </div>
    </>
  );
}
