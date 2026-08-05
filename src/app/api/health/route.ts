import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// ============================================================
// Chequeo de salud + anti-pausa de Supabase.
//
// POR QUÉ EXISTE (05/08/2026): el plan gratis de Supabase pausa un
// proyecto tras 7 días sin actividad. Como los sitios todavía no tienen
// tráfico real, el proyecto de 369/Finos se pausó solo y el panel dejó
// de andar — nos enteramos de casualidad, semanas después.
//
// Este endpoint hace una consulta mínima a la base. Apuntándole
// UptimeRobot cada 5 minutos pasan dos cosas:
//   1. La base nunca queda 7 días quieta → no se vuelve a pausar.
//   2. Si la base se cae, devuelve 503 y UptimeRobot te avisa por
//      Telegram en minutos, en vez de que lo descubras cuando el
//      primo no puede cargar una foto.
//
// La consulta es un count con `head: true`: no baja ninguna fila, solo
// pregunta. Es lo más barato que se puede pedir.
// ============================================================

// Nunca cachear: si se sirviera de caché no tocaría la base y no
// serviría para ninguna de las dos cosas.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json(
      { ok: false, db: "sin-configurar" },
      { status: 503 }
    );
  }

  try {
    const { error } = await supabase
      .from("trabajos")
      .select("id", { count: "exact", head: true });

    if (error) throw error;

    return NextResponse.json({ ok: true, db: "ok" });
  } catch {
    // Sin detalle del error a propósito: este endpoint es público y no
    // tiene por qué contarle a nadie cómo está armada la base.
    return NextResponse.json(
      { ok: false, db: "sin-conexion" },
      { status: 503 }
    );
  }
}
