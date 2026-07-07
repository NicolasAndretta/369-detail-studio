import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { processAndUploadPhoto } from "@/lib/fotos-upload";

export const maxDuration = 60;

// PATCH /api/admin/fotos/[id] — editar un ángulo (multipart)
// Campos opcionales: etiqueta, orden, quitar_antes ("si"),
//                    antes (archivo nuevo), despues (archivo nuevo)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase sin configurar" }, { status: 503 });
  }

  const { id } = await params;

  const { data: foto } = await supabase
    .from("fotos")
    .select("id, trabajo_id")
    .eq("id", id)
    .maybeSingle();
  if (!foto) {
    return NextResponse.json({ error: "Foto inexistente" }, { status: 404 });
  }

  const form = await req.formData();
  const update: Record<string, unknown> = {};

  const etiqueta = form.get("etiqueta");
  if (typeof etiqueta === "string" && etiqueta.trim()) {
    update.etiqueta = etiqueta.trim();
  }

  const orden = form.get("orden");
  if (typeof orden === "string" && orden !== "" && !Number.isNaN(Number(orden))) {
    update.orden = Number(orden);
  }

  if (form.get("quitar_antes") === "si") update.antes_url = null;

  try {
    const antes = form.get("antes");
    if (antes instanceof File && antes.size > 0) {
      update.antes_url = await processAndUploadPhoto(antes, foto.trabajo_id);
    }
    const despues = form.get("despues");
    if (despues instanceof File && despues.size > 0) {
      update.despues_url = await processAndUploadPhoto(despues, foto.trabajo_id);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error al subir";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 });
  }

  const { error } = await supabase.from("fotos").update(update).eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/galeria");
  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/fotos/[id] — borrar un ángulo
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase sin configurar" }, { status: 503 });
  }

  const { id } = await params;
  const { error } = await supabase.from("fotos").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/galeria");
  return NextResponse.json({ ok: true });
}
