import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-session";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: "Panel — 369 Detail",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; min?: string }>;
}) {
  if (await isAdminAuthenticated()) redirect("/admin");

  const { error, min } = await searchParams;
  const minutos = Number(min) > 0 ? Math.min(Number(min), 60) : 15;

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1>
          369 <span style={{ color: "var(--accent-primary)" }}>Panel</span>
        </h1>
        <p>Galería del taller — acceso privado</p>

        {error === "1" && <div className="admin-error">Clave incorrecta.</div>}
        {error === "bloqueado" && (
          <div className="admin-error">
            Demasiados intentos fallidos. Probá de nuevo en {minutos} minuto
            {minutos === 1 ? "" : "s"}.
          </div>
        )}
        {error === "config" && (
          <div className="admin-error">
            Falta configurar la clave del panel (ADMIN_PASSWORD).
          </div>
        )}

        <form action="/api/admin/login" method="post">
          <div className="admin-field">
            <label htmlFor="password">Clave</label>
            <input
              id="password"
              name="password"
              type="password"
              className="admin-input"
              autoComplete="current-password"
              autoFocus
              required
            />
          </div>
          <button type="submit" className="abtn abtn--primary" style={{ width: "100%", justifyContent: "center", padding: "0.7rem" }}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
