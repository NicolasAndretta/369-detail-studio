import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/sections/hero";
import { OrderStatusSection } from "@/sections/order-status";
import { ServicesSection } from "@/sections/services";
import { GallerySection } from "@/sections/gallery";
import { NuestroEspacioSection } from "@/sections/nuestro-espacio";
import { SHOW_NUESTRO_ESPACIO } from "@/config/features";
import { ContactSection } from "@/sections/contact";
import { Footer } from "@/components/layout/footer";
import { WhatsAppSticky } from "@/components/ui/whatsapp-sticky";
import { getGalleryWorks } from "@/lib/galeria";

// La galería viene de la base (panel /admin); si no está configurada,
// cae a los datos estáticos. Se refresca al guardar desde el panel.
export const revalidate = 60;

export default async function HomePage() {
  const works = await getGalleryWorks();
  const homeWorks = works.filter((w) => w.home);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <OrderStatusSection />
        <ServicesSection />
        <GallerySection works={homeWorks} />
        {SHOW_NUESTRO_ESPACIO && <NuestroEspacioSection />}
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppSticky />
    </>
  );
}
