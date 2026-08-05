import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin-session";

// Redirect relativo: el navegador lo resuelve contra el host real.
// Ver el comentario largo en `api/admin/login/route.ts`.
export async function POST() {
  const res = new NextResponse(null, {
    status: 303,
    headers: { Location: "/admin/login" },
  });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
