import { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getGalleryLastModified } from "@/lib/galeria";

// Se regenera con la misma frecuencia que la galería.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const galeriaActualizada = await getGalleryLastModified();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: galeriaActualizada,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/galeria"),
      lastModified: galeriaActualizada,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
