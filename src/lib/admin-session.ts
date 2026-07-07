import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ============================================================
// Sesión del panel: clave compartida (ADMIN_PASSWORD) → cookie
// httpOnly firmada con HMAC. Sin dependencias externas.
// ============================================================

export const SESSION_COOKIE = "admin_session_369";
const SESSION_DAYS = 7;

function getSecret(): string | null {
  // Secreto propio o, si no está (o quedó vacío), derivado de la clave.
  return (
    process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null
  );
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/** ¿La clave ingresada es la correcta? (comparación a tiempo constante) */
export function isValidPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Crea el valor de la cookie de sesión: expiración + firma. */
export function createSessionToken(): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return `${exp}.${sign(String(exp), secret)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;

  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  if (Number(exp) < Date.now()) return false;

  const expected = sign(exp, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Guardia para páginas y API del panel. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(SESSION_COOKIE)?.value);
}

/**
 * Guardia OBLIGATORIA en cada page server del panel (además del layout).
 * En App Router el layout y la página se renderizan en paralelo: si el guard
 * está solo en el layout, los datos de la página viajan igual en la respuesta
 * aunque haya redirect. Con esto, la página no consulta nada sin sesión.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};
