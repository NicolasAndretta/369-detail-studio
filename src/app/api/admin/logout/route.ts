import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin-session";

export async function POST(req: Request) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto =
    req.headers.get("x-forwarded-proto") ??
    new URL(req.url).protocol.replace(":", "");
  const res = NextResponse.redirect(`${proto}://${host}/admin/login`, 303);
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
