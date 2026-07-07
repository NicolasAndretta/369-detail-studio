import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-session";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: "Panel de galería — 369 Detail",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <Link href="/admin" className="admin-header__brand">
          369 <span>PANEL</span>
        </Link>
        <nav className="admin-header__nav">
          <Link href="/admin/nuevo" className="abtn abtn--primary">
            + Nuevo trabajo
          </Link>
          <form action="/api/admin/logout" method="post">
            <button type="submit" className="abtn">
              Salir
            </button>
          </form>
        </nav>
      </header>
      <div className="admin-container">{children}</div>
    </div>
  );
}
