import { requireAdmin } from "@/lib/admin-session";
import { getVideosAdmin } from "@/lib/videos";
import { VideosManager } from "../_components/videos-manager";

export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  await requireAdmin();

  // `null` = la tabla todavía no existe (falta correr la migración) o
  // Supabase no está configurado. El componente lo explica en pantalla.
  const videos = await getVideosAdmin();

  return (
    <VideosManager videos={videos ?? []} tablaLista={videos !== null} />
  );
}
