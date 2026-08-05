import { NextResponse } from "next/server";
import {
  createSessionToken,
  isValidPassword,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/admin-session";
import { chequearLimite, clientIp, limpiarFallos, registrarFallo } from "@/lib/rate-limit";

/**
 * Redirección con ruta RELATIVA.
 *
 * Antes se armaba la URL absoluta con el header `x-forwarded-host`, que lo
 * manda quien hace el pedido: cualquiera podía forzar un redirect a un sitio
 * ajeno desde una URL de 369 (phishing). Con `Location` relativo el navegador
 * lo resuelve contra el host real, así que sigue funcionando igual desde el
 * celu por IP de red, desde localhost o desde el dominio — y no hay nada que
 * un tercero pueda inyectar.
 */
function redirectTo(path: string): NextResponse {
  return new NextResponse(null, { status: 303, headers: { Location: path } });
}

export async function POST(req: Request) {
  const ip = clientIp(req);

  const limite = chequearLimite(ip);
  if (!limite.permitido) {
    const minutos = Math.ceil(limite.esperaSegundos / 60);
    return redirectTo(`/admin/login?error=bloqueado&min=${minutos}`);
  }

  const form = await req.formData();
  const password = String(form.get("password") ?? "");

  if (!isValidPassword(password)) {
    registrarFallo(ip);
    // Freno chico para que probar claves de a una sea lento
    await new Promise((r) => setTimeout(r, 500));
    return redirectTo("/admin/login?error=1");
  }

  const token = createSessionToken();
  if (!token) {
    return redirectTo("/admin/login?error=config");
  }

  limpiarFallos(ip);
  const res = redirectTo("/admin");
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
