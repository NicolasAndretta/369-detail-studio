import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// PATCH /api/admin/videos/[id] — visible / orden / título / categoría (JSON)
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
    titulo?: string;
    categoria?: string;
    visible?: boolean;
    orden?: number;
  };

  const update: Record<string, unknown> = {};
  if (typeof body.visible === "boolean") update.visible = body.visible;
  if (typeof body.orden === "number" && Number.isFinite(body.orden)) {
    update.orden = Math.trunc(body.orden);
  }
  if (typeof body.titulo === "string" && body.titulo.trim()) {
    update.titulo = body.titulo.trim();
  }
  if (typeof body.categoria === "string" && body.categoria.trim()) {
    update.categoria = body.categoria.trim();
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 });
  }

  const { error } = await supabase.from("videos").update(update).eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/galeria");
  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/videos/[id]
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
  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/galeria");
  return NextResponse.json({ ok: true });
}
