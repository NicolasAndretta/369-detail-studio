import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/sections/hero";
import { ServicesSection } from "@/sections/services";
import { GallerySection } from "@/sections/gallery";
import { ContactSection } from "@/sections/contact";

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
    </>
  );
}