import {
  GALLERY_WORKS,
  type GalleryCategory,
  type GalleryWork,
} from "@/data/gallery-data";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// ============================================================
// Fuente de datos de la galería PÚBLICA.
// Lee de Supabase; si Supabase no está configurado o falla,
// cae a los datos estáticos de gallery-data.ts → la web NUNCA
// se queda sin galería.
// ============================================================

/** Servicios del taller (fijos) y su categoría de filtro. */
export const SERVICIOS: { service: string; category: GalleryCategory }[] = [
  { service: "Lavado detallado", category: "Lavado" },
  { service: "Abrillantado y realce de pintura", category: "Abrillantado" },
  { service: "Tratamiento cerámico", category: "Cerámico" },
  { service: "Tratamiento acrílico", category: "Acrílico" },
  { service: "Limpieza de interior", category: "Interior" },
  { service: "Lavado de motor y chasis", category: "Motor y Chasis" },
];

const CATEGORIAS: GalleryCategory[] = [
  "Lavado",
  "Abrillantado",
  "Cerámico",
  "Acrílico",
  "Interior",
  "Motor y Chasis",
];

function toCategory(value: string): GalleryCategory {
  return (CATEGORIAS as string[]).includes(value)
    ? (value as GalleryCategory)
    : "Lavado";
}

interface TrabajoRow {
  id: string;
  servicio: string;
  categoria: string;
  vehiculo: string;
  visible: boolean;
  en_inicio: boolean;
  orden: number;
  fotos: FotoRow[];
}

interface FotoRow {
  id: string;
  etiqueta: string;
  antes_url: string | null;
  despues_url: string;
  orden: number;
}

function rowToWork(row: TrabajoRow): GalleryWork {
  return {
    id: row.id,
    service: row.servicio,
    category: toCategory(row.categoria),
    home: row.en_inicio,
    angles: [...row.fotos]
      .sort((a, b) => a.orden - b.orden)
      .map((f) => ({
        label: f.etiqueta,
        afterImage: f.despues_url,
        ...(f.antes_url ? { beforeImage: f.antes_url } : {}),
      })),
  };
}

/** Galería completa (solo trabajos visibles y con al menos una foto). */
export async function getGalleryWorks(): Promise<GalleryWork[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return GALLERY_WORKS;

  try {
    const { data, error } = await supabase
      .from("trabajos")
      .select("id, servicio, categoria, vehiculo, visible, en_inicio, orden, fotos (id, etiqueta, antes_url, despues_url, orden)")
      .eq("visible", true)
      .order("orden", { ascending: true });

    if (error || !data) throw error ?? new Error("sin datos");

    const works = (data as unknown as TrabajoRow[])
      .filter((t) => t.fotos.length > 0)
      .map(rowToWork);

    // Si la base está vacía (seed no corrido), mejor mostrar lo estático.
    return works.length > 0 ? works : GALLERY_WORKS;
  } catch {
    return GALLERY_WORKS;
  }
}

/** Categorías presentes para los filtros de /galeria, en orden fijo. */
export function categoriesOf(works: GalleryWork[]): ("Todos" | GalleryCategory)[] {
  const present = new Set(works.map((w) => w.category));
  return ["Todos", ...CATEGORIAS.filter((c) => present.has(c))];
}
