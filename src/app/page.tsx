import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/sections/hero";
import { ServicesSection } from "@/sections/services";
import { GallerySection } from "@/sections/gallery";
import { ContactSection } from "@/sections/contact";
import { Footer } from "@/components/layout/footer";
import { WhatsAppSticky } from "@/components/ui/whatsapp-sticky";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppSticky />
    </>
  );
}