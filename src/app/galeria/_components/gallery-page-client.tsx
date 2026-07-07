"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppSticky } from "@/components/ui/whatsapp-sticky";
import { GalleryCard } from "@/sections/gallery";
import { ReelsSection } from "@/sections/reels";
import type { GalleryFilter, GalleryWork } from "@/data/gallery-data";

export function GalleryPageClient({
  works,
  categories,
}: {
  works: GalleryWork[];
  categories: GalleryFilter[];
}) {
  const [activeCategory, setActiveCategory] = useState<GalleryFilter>("Todos");

  const filtered =
    activeCategory === "Todos"
      ? works
      : works.filter((w) => w.category === activeCategory);

  return (
    <>
      <Navbar />

      <main className="gallery-page">
        <div className="gallery__bg" aria-hidden="true" />

        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow-wrap">
              <span className="section-eyebrow-dot" aria-hidden="true" />
              <span className="section-eyebrow">Trabajos</span>
            </div>
            <h1 className="section-heading">
              Galería
              <br />
              <span className="section-heading-accent">Completa</span>
            </h1>
            <p className="section-description">
              Explorá los resultados reales de cada vehículo tratado en nuestro estudio.
              Tocá una tarjeta para ver el Antes y Después, y navegá los ángulos de cada trabajo.
            </p>
          </div>

          <div className="gallery-filters" role="group" aria-label="Filtrar por categoría">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`gallery-filter__btn ${activeCategory === cat ? "gallery-filter__btn--active" : ""}`}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="gallery__grid">
            {filtered.length > 0 ? (
              filtered.map((work) => (
                <GalleryCard key={work.id} work={work} />
              ))
            ) : (
              <p className="gallery-filters__empty">
                No hay trabajos en esta categoría todavía.
              </p>
            )}
          </div>

          <div className="gallery__actions" style={{ marginTop: "var(--space-2xl)" }}>
            <Link href="/" className="btn btn--ghost">
              Volver al inicio
              <span
                className="btn__arrow"
                style={{ transform: "rotate(180deg)", display: "inline-block", marginLeft: "4px" }}
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </div>
        </div>

        <ReelsSection />
      </main>

      <Footer />
      <WhatsAppSticky />
    </>
  );
}
