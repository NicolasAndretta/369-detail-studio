import { NextResponse } from "next/server";
import {
  createSessionToken,
  isValidPassword,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/admin-session";

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");

  if (!isValidPassword(password)) {
    // Freno chico contra fuerza bruta
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.redirect(new URL("/admin/login?error=1", req.url), 303);
  }

  const token = createSessionToken();
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login?error=config", req.url), 303);
  }

  const res = NextResponse.redirect(new URL("/admin", req.url), 303);
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
