import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { deleteWorkPhotos } from "@/lib/fotos-upload";
import { SERVICIOS } from "@/lib/galeria";

// PATCH /api/admin/trabajos/[id] — actualizar datos del trabajo (JSON)
// Acepta: { vehiculo?, servicio?, visible?, en_inicio? }
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
  const body = (await req.json()) as {
    vehiculo?: string;
    servicio?: string;
    visible?: boolean;
    en_inicio?: boolean;
  };

  const update: Record<string, unknown> = {};

  if (typeof body.vehiculo === "string") update.vehiculo = body.vehiculo.trim();
  if (typeof body.visible === "boolean") update.visible = body.visible;
  if (typeof body.en_inicio === "boolean") update.en_inicio = body.en_inicio;
  if (typeof body.servicio === "string") {
    const svc = SERVICIOS.find((s) => s.service === body.servicio);
    if (!svc) {
      return NextResponse.json({ error: "Servicio inválido" }, { status: 400 });
    }
    update.servicio = svc.service;
    update.categoria = svc.category;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 });
  }

  const { error } = await supabase.from("trabajos").update(update).eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/galeria");
  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/trabajos/[id] — borrar trabajo completo (fotos incluidas)
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

  // Primero las fotos del storage (best-effort), después la fila (cascade borra `fotos`)
  await deleteWorkPhotos(id);
  const { error } = await supabase.from("trabajos").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/galeria");
  return NextResponse.json({ ok: true });
}
