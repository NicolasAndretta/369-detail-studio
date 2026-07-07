import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { EditWork, type EditFoto } from "../_components/edit-work";

export const dynamic = "force-dynamic";

export default async function EditarTrabajoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) notFound();

  const { id } = await params;
  const { data } = await supabase
    .from("trabajos")
    .select(
      "id, servicio, vehiculo, visible, en_inicio, fotos (id, etiqueta, antes_url, despues_url, orden)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const fotos = [...((data.fotos as EditFoto[] | null) ?? [])].sort(
    (a, b) => a.orden - b.orden
  );

  return (
    <EditWork
      id={data.id}
      servicio={data.servicio}
      vehiculo={data.vehiculo}
      fotos={fotos}
    />
  );
}
