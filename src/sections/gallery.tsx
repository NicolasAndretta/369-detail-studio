"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GallerySlot {
  id: string;
  label: string;
  category: string;
  aspect: "wide" | "square";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const GALLERY_SLOTS: GallerySlot[] = [
  { id: "slot-1", label: "Corrección de pintura", category: "Pulido", aspect: "wide" },
  { id: "slot-2", label: "Tratamiento cerámico", category: "Cerámico", aspect: "square" },
  { id: "slot-3", label: "Detailing interior", category: "Interior", aspect: "square" },
  { id: "slot-4", label: "Restauración estética", category: "Restauración", aspect: "wide" },
  { id: "slot-5", label: "Protección exterior", category: "PPF", aspect: "square" },
  { id: "slot-6", label: "Lavado técnico", category: "Lavado", aspect: "square" },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function GalleryCard({ slot }: { slot: GallerySlot }) {
  return (
    <motion.div
      className={`gallery-card gallery-card--${slot.aspect}`}
      variants={cardReveal}
      whileHover="hover"
      aria-label={slot.label}
    >
      {/* Placeholder visual */}
      <div className="gallery-card__placeholder" aria-hidden="true">
        <div className="gallery-card__placeholder-grid" />
        <div className="gallery-card__placeholder-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="gallery-card__placeholder-text">Próximamente</span>
        </div>
      </div>

      {/* Hover overlay */}
      <motion.div
        className="gallery-card__overlay"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
      >
        <div className="gallery-card__overlay-content">
          <span className="gallery-card__category">{slot.category}</span>
          <p className="gallery-card__label">{slot.label}</p>
          <div className="gallery-card__overlay-line" />
        </div>
      </motion.div>

      {/* Always-visible tag */}
      <div className="gallery-card__tag">
        <span>{slot.category}</span>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="resultados"
      ref={sectionRef}
      className="gallery section-spacing"
      aria-label="Galería de resultados"
    >
      <div className="gallery__bg" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <motion.div
          className="gallery__header"
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="gallery__eyebrow-wrap" variants={fadeUp}>
            <span className="gallery__eyebrow-dot" aria-hidden="true" />
            <span className="gallery__eyebrow">Resultados</span>
          </motion.div>

          <motion.h2 className="gallery__heading" variants={fadeUp}>
            El trabajo
            <br />
            <span className="gallery__heading-accent">habla solo</span>
          </motion.h2>

          <motion.p className="gallery__subheading" variants={fadeUp}>
            Galería en construcción. Próximamente los trabajos reales
            del estudio, documentados con fotografía de detalle.
          </motion.p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="gallery__grid"
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {GALLERY_SLOTS.map((slot) => (
            <GalleryCard key={slot.id} slot={slot} />
          ))}
        </motion.div>

        {/* Bottom notice */}
        <motion.div
          className="gallery__notice"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <span className="gallery__notice-dot" aria-hidden="true" />
          <p>Seguí nuestro trabajo en Instagram{" "}
            <a
              href="https://instagram.com/369detail"
              target="_blank"
              rel="noopener noreferrer"
              className="gallery__notice-link"
              aria-label="Ver 369 Detail en Instagram"
            >
              @369detail
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
