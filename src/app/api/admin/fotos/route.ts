import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { processAndUploadPhoto } from "@/lib/fotos-upload";

export const maxDuration = 60;

// POST /api/admin/fotos — agregar un ángulo a un trabajo (multipart)
// Campos: trabajo_id, etiqueta, despues (archivo), antes (archivo opcional)
export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase sin configurar" }, { status: 503 });
  }

  const form = await req.formData();
  const trabajoId = String(form.get("trabajo_id") ?? "");
  const etiqueta = String(form.get("etiqueta") ?? "").trim();
  const despues = form.get("despues");
  const antes = form.get("antes");

  if (!trabajoId || !etiqueta) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }
  if (!(despues instanceof File) || despues.size === 0) {
    return NextResponse.json({ error: "Falta la foto de después" }, { status: 400 });
  }

  const { data: maxRow } = await supabase
    .from("fotos")
    .select("orden")
    .eq("trabajo_id", trabajoId)
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();

  try {
    const despuesUrl = await processAndUploadPhoto(despues, trabajoId);
    const antesUrl =
      antes instanceof File && antes.size > 0
        ? await processAndUploadPhoto(antes, trabajoId)
        : null;

    const { error } = await supabase.from("fotos").insert({
      trabajo_id: trabajoId,
      etiqueta,
      antes_url: antesUrl,
      despues_url: despuesUrl,
      orden: (maxRow?.orden ?? 0) + 1,
    });
    if (error) throw error;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error al subir";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/galeria");
  return NextResponse.json({ ok: true });
}
