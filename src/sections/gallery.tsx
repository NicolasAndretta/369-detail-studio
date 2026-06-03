"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, type Variants } from "framer-motion";
import { type GallerySlot, GALLERY_SLOTS } from "@/data/gallery-data";

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

export function GalleryCard({ slot }: { slot: GallerySlot }) {
  const [showAfter, setShowAfter] = useState(false);
  const [imgError, setImgError] = useState(false);

  const hasImages = slot.beforeImage && slot.afterImage && !imgError;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setShowAfter((prev) => !prev);
    }
  };

  const handleImgError = () => {
    setImgError(true);
  };

  return (
    <motion.div
      className={`gallery-card gallery-card--${slot.aspect}`}
      variants={cardReveal}
      whileHover={{ y: -4 }}
      onClick={() => setShowAfter((prev) => !prev)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${slot.label}. Categoría ${slot.category}. Presioná para alternar antes y después. Mostrando: ${
        showAfter ? "Después" : "Antes"
      }`}
    >
      {/* Visual content: image crossfade OR simulated placeholder */}
      {hasImages ? (
        <div className="gallery-card__visuals">
          <img
            src={slot.beforeImage}
            alt={`${slot.label} - Antes`}
            className={`gallery-card__img gallery-card__img--before ${
              !showAfter ? "gallery-card__img--active" : ""
            }`}
            onError={handleImgError}
          />
          <img
            src={slot.afterImage}
            alt={`${slot.label} - Después`}
            className={`gallery-card__img gallery-card__img--after ${
              showAfter ? "gallery-card__img--active" : ""
            }`}
            onError={handleImgError}
          />
        </div>
      ) : (
        <div
          className={`gallery-card__placeholder ${
            showAfter
              ? "gallery-card__placeholder--after"
              : "gallery-card__placeholder--before"
          }`}
          aria-hidden="true"
        >
          <div className="gallery-card__placeholder-grid" />

          {/* Light sweep indicator for polished/after state */}
          {showAfter && <div className="gallery-card__placeholder-sweep" />}

          <div className="gallery-card__placeholder-center">
            {showAfter ? (
              <>
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent-primary)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="gallery-card__placeholder-icon gallery-card__placeholder-icon--glow"
                >
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
                <span className="gallery-card__placeholder-text gallery-card__placeholder-text--after">
                  Acabado Espejo
                </span>
                <span className="gallery-card__placeholder-subtext">
                  Tratamiento Finalizado
                </span>
              </>
            ) : (
              <>
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="gallery-card__placeholder-icon"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
                <span className="gallery-card__placeholder-text">
                  Estado Original
                </span>
                <span className="gallery-card__placeholder-subtext">
                  Superficie sin acondicionar
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Dynamic comparison badge */}
      <div
        className={`gallery-card__compare-badge ${
          showAfter
            ? "gallery-card__compare-badge--after"
            : "gallery-card__compare-badge--before"
        }`}
        aria-hidden="true"
      >
        {showAfter ? "DESPUÉS" : "ANTES"}
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
          <span className="gallery-card__category">
            {slot.category}
          </span>

          <p className="gallery-card__label">
            {slot.label}
          </p>

          <div className="gallery-card__overlay-line" />
          
          <span className="gallery-card__compare-action">
            {showAfter ? "Click para ver antes" : "Click para ver después"}
          </span>
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

  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-80px",
  });

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
          className="section-header"
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="section-eyebrow-wrap"
            variants={fadeUp}
          >
            <span
              className="section-eyebrow-dot"
              aria-hidden="true"
            />

            <span className="section-eyebrow">
              Resultados
            </span>
          </motion.div>

          <motion.h2
            className="section-heading"
            variants={fadeUp}
          >
            El trabajo
            <br />

            <span className="section-heading-accent">
              habla solo
            </span>
          </motion.h2>

          <motion.p
            className="section-description"
            variants={fadeUp}
          >
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
          {GALLERY_SLOTS.slice(0, 6).map((slot) => (
            <GalleryCard key={slot.id} slot={slot} />
          ))}
        </motion.div>

        {/* Button for full gallery */}
        <motion.div
          className="gallery__actions"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Link href="/galeria" className="btn btn--ghost">
            Ver todos los trabajos
            <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
        </motion.div>

        {/* Bottom notice */}
        <motion.div
          className="gallery__notice"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <span
            className="gallery__notice-dot"
            aria-hidden="true"
          />

          <p>
            Seguí nuestro trabajo en Instagram{" "}

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