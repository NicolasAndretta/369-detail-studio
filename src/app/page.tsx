import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/sections/hero";
import { OrderStatusSection } from "@/sections/order-status";
import { ServicesSection } from "@/sections/services";
import { GallerySection } from "@/sections/gallery";
import { NuestroEspacioSection } from "@/sections/nuestro-espacio";
import { SHOW_NUESTRO_ESPACIO, SHOW_ORDER_STATUS } from "@/config/features";
import { ContactSection } from "@/sections/contact";
import { Footer } from "@/components/layout/footer";
import { WhatsAppSticky } from "@/components/ui/whatsapp-sticky";
import { ReelsSection } from "@/sections/reels";
import { getGalleryWorks } from "@/lib/galeria";
import { getVideos } from "@/lib/videos";

// La galería viene de la base (panel /admin); si no está configurada,
// cae a los datos estáticos. Se consulta en cada visita para que los
// cambios del panel se vean al instante (sin copias viejas de
// servidor/CDN/navegador).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // En paralelo: los trabajos y los reels no dependen entre sí.
  // `getVideos(true)` trae SOLO los marcados para la portada desde /admin.
  const [works, videos] = await Promise.all([getGalleryWorks(), getVideos(true)]);
  const homeWorks = works.filter((w) => w.home);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        {SHOW_ORDER_STATUS && <OrderStatusSection />}
        <ServicesSection />
        <GallerySection works={homeWorks} />
        {/* Si no hay ninguno marcado para el inicio, la sección no se dibuja. */}
        <ReelsSection videos={videos} />
        {SHOW_NUESTRO_ESPACIO && <NuestroEspacioSection />}
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppSticky />
    </>
  );
}
