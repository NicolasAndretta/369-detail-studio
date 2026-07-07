import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { processAndUploadPhoto } from "@/lib/fotos-upload";
import { SERVICIOS } from "@/lib/galeria";

export const maxDuration = 60;

// POST /api/admin/trabajos — crear un trabajo con sus fotos (multipart)
// Campos: servicio, vehiculo, en_inicio ("si"/"no") y por cada ángulo i:
//   etiqueta_i (texto) · despues_i (archivo, obligatorio) · antes_i (archivo, opcional)
export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase sin configurar" }, { status: 503 });
  }

  const form = await req.formData();
  const servicio = String(form.get("servicio") ?? "");
  const vehiculo = String(form.get("vehiculo") ?? "").trim();
  const enInicio = form.get("en_inicio") === "si";

  const svc = SERVICIOS.find((s) => s.service === servicio);
  if (!svc) {
    return NextResponse.json({ error: "Servicio inválido" }, { status: 400 });
  }
  if (!vehiculo) {
    return NextResponse.json({ error: "Falta el vehículo" }, { status: 400 });
  }

  // Ángulos presentes en el form
  const angulos: { etiqueta: string; despues: File; antes: File | null }[] = [];
  for (let i = 0; i < 10; i++) {
    const etiqueta = form.get(`etiqueta_${i}`);
    if (etiqueta === null) continue;
    const despues = form.get(`despues_${i}`);
    const antes = form.get(`antes_${i}`);
    if (!(despues instanceof File) || despues.size === 0) continue;
    angulos.push({
      etiqueta: String(etiqueta).trim() || `Ángulo ${i + 1}`,
      despues,
      antes: antes instanceof File && antes.size > 0 ? antes : null,
    });
  }

  if (angulos.length === 0) {
    return NextResponse.json(
      { error: "Cargá al menos una foto de después" },
      { status: 400 }
    );
  }

  // Orden: al final de la lista actual
  const { data: maxRow } = await supabase
    .from("trabajos")
    .select("orden")
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();
  const orden = (maxRow?.orden ?? 0) + 1;

  const { data: trabajo, error: insertError } = await supabase
    .from("trabajos")
    .insert({
      servicio: svc.service,
      categoria: svc.category,
      vehiculo,
      visible: true,
      en_inicio: enInicio,
      orden,
    })
    .select("id")
    .single();

  if (insertError || !trabajo) {
    return NextResponse.json(
      { error: `No se pudo crear el trabajo: ${insertError?.message ?? ""}` },
      { status: 500 }
    );
  }

  try {
    for (let i = 0; i < angulos.length; i++) {
      const a = angulos[i];
      const despuesUrl = await processAndUploadPhoto(a.despues, trabajo.id);
      const antesUrl = a.antes
        ? await processAndUploadPhoto(a.antes, trabajo.id)
        : null;

      const { error: fotoError } = await supabase.from("fotos").insert({
        trabajo_id: trabajo.id,
        etiqueta: a.etiqueta,
        antes_url: antesUrl,
        despues_url: despuesUrl,
        orden: i + 1,
      });
      if (fotoError) throw fotoError;
    }
  } catch (e) {
    // Si falló la carga de fotos, no dejar un trabajo a medias
    await supabase.from("trabajos").delete().eq("id", trabajo.id);
    const msg = e instanceof Error ? e.message : "error al subir fotos";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/galeria");
  return NextResponse.json({ ok: true, id: trabajo.id });
}
