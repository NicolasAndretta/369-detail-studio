import { NextResponse } from "next/server";
import {
  createSessionToken,
  isValidPassword,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/admin-session";

// Redirigir respetando el host desde el que entró el usuario (celu por IP de
// red, dominio en prod, etc.) — `req.url` puede venir normalizado a localhost.
function redirectTo(req: Request, path: string) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto =
    req.headers.get("x-forwarded-proto") ??
    new URL(req.url).protocol.replace(":", "");
  return NextResponse.redirect(`${proto}://${host}${path}`, 303);
}

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");

  if (!isValidPassword(password)) {
    // Freno chico contra fuerza bruta
    await new Promise((r) => setTimeout(r, 500));
    return redirectTo(req, "/admin/login?error=1");
  }

  const token = createSessionToken();
  if (!token) {
    return redirectTo(req, "/admin/login?error=config");
  }

  const res = redirectTo(req, "/admin");
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
