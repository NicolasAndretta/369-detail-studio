import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { ErrorDeFoto, processAndUploadPhoto } from "@/lib/fotos-upload";
import { LinkInvalido, parsearInstagram, parsearTikTok } from "@/lib/videos";

export const maxDuration = 60;

// POST /api/admin/videos — agregar un reel (multipart)
// Campos: titulo, categoria, instagram_url?, tiktok_url?, thumbnail? (archivo)
export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase sin configurar" }, { status: 503 });
  }

  const form = await req.formData();
  const titulo = String(form.get("titulo") ?? "").trim();
  const categoria = String(form.get("categoria") ?? "").trim() || "Detailing";
  const igRaw = String(form.get("instagram_url") ?? "").trim();
  const ttRaw = String(form.get("tiktok_url") ?? "").trim();
  const thumbnail = form.get("thumbnail");

  if (!titulo) {
    return NextResponse.json(
      { error: "Poné un título (ej: Pulido de un Mercedes paso a paso)." },
      { status: 400 }
    );
  }
  if (!igRaw && !ttRaw) {
    return NextResponse.json(
      { error: "Pegá al menos un link: de Instagram o de TikTok." },
      { status: 400 }
    );
  }

  // De cada link se guarda solo el código. Si no se puede parsear, se corta
  // acá con un mensaje que dice qué hacer.
  let instagramCode: string | null = null;
  let tiktokId: string | null = null;
  try {
    if (igRaw) instagramCode = parsearInstagram(igRaw);
    if (ttRaw) tiktokId = parsearTikTok(ttRaw);
  } catch (e) {
    const msg = e instanceof LinkInvalido ? e.message : "El link no es válido.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Orden: al final de la lista
  const { data: maxRow } = await supabase
    .from("videos")
    .select("orden")
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();

  // La miniatura reusa el mismo camino que las fotos de la galería
  // (optimiza, saca metadatos y sube WebP + AVIF).
  let thumbnailUrl: string | null = null;
  if (thumbnail instanceof File && thumbnail.size > 0) {
    try {
      thumbnailUrl = await processAndUploadPhoto(thumbnail, "reels");
    } catch (e) {
      const msg =
        e instanceof ErrorDeFoto ? e.message : "No se pudo subir la miniatura.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  }

  const { error } = await supabase.from("videos").insert({
    titulo,
    categoria,
    instagram_code: instagramCode,
    tiktok_id: tiktokId,
    thumbnail_url: thumbnailUrl,
    visible: true,
    orden: (maxRow?.orden ?? 0) + 1,
  });

  if (error) {
    // El caso más probable: todavía no corrieron la migración.
    if (/relation .*videos.* does not exist|schema cache/i.test(error.message)) {
      return NextResponse.json(
        {
          error:
            "Falta crear la tabla de videos. Corré supabase/migracion-videos.sql en Supabase → SQL Editor.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/galeria");
  return NextResponse.json({ ok: true });
}
