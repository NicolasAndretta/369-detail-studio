"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, type Variants } from "framer-motion";
import type { GalleryWork } from "@/data/gallery-data";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toAvif = (src: string) => src.replace(/\.webp$/, ".avif");

function Picture({
  src,
  alt,
  className,
  onError,
}: {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}) {
  return (
    <picture>
      <source srcSet={toAvif(src)} type="image/avif" />
      <source srcSet={src} type="image/webp" />
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
        onError={onError}
      />
    </picture>
  );
}

// ─── Gallery card (multi-ángulo) ───────────────────────────────────────────────

export function GalleryCard({ work }: { work: GalleryWork }) {
  const [angleIdx, setAngleIdx] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  const [imgError, setImgError] = useState(false);

  const angle = work.angles[angleIdx];
  const hasBefore = !!angle.beforeImage && !imgError;
  const multi = work.angles.length > 1;

  const goAngle = (dir: number) => {
    const len = work.angles.length;
    setAngleIdx((i) => (i + dir + len) % len);
    setShowAfter(false);
    setImgError(false);
  };

  const toggle = () => {
    if (hasBefore) setShowAfter((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowRight" && multi) {
      e.preventDefault();
      goAngle(1);
    } else if (e.key === "ArrowLeft" && multi) {
      e.preventDefault();
      goAngle(-1);
    }
  };

  return (
    <motion.div
      className="gallery-card"
      variants={cardReveal}
      whileHover={{ y: -4 }}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="group"
      aria-roledescription="Trabajo de galería"
      aria-label={`${work.service}. Ángulo: ${angle.label}.${
        hasBefore
          ? ` Mostrando ${showAfter ? "Después" : "Antes"}. Tocá para alternar.`
          : ""
      }`}
    >
      {/* Visuals — crossfade antes/después; al cambiar de ángulo se actualiza el src */}
      <div className="gallery-card__visuals">
        {hasBefore && (
          <Picture
            src={angle.beforeImage!}
            alt={`${work.service} — ${angle.label} — Antes`}
            className={`gallery-card__img ${!showAfter ? "gallery-card__img--active" : ""}`}
            onError={() => setImgError(true)}
          />
        )}
        <Picture
          src={angle.afterImage}
          alt={`${work.service} — ${angle.label}${hasBefore ? " — Después" : ""}`}
          className={`gallery-card__img ${
            showAfter || !hasBefore ? "gallery-card__img--active" : ""
          }`}
          onError={() => setImgError(true)}
        />
      </div>

      {/* Badge antes/después (solo si hay par) */}
      {hasBefore && (
        <div
          className={`gallery-card__compare-badge ${
            showAfter ? "gallery-card__compare-badge--after" : "gallery-card__compare-badge--before"
          }`}
          aria-hidden="true"
        >
          {showAfter ? "DESPUÉS" : "ANTES"}
        </div>
      )}

      {/* Tag categoría (arriba izquierda) */}
      <div className="gallery-card__tag">
        <span>{work.category}</span>
      </div>

      {/* Navegación de ángulos — flechas laterales */}
      {multi && (
        <>
          <button
            type="button"
            className="gallery-card__arrow gallery-card__arrow--prev"
            onClick={(e) => {
              e.stopPropagation();
              goAngle(-1);
            }}
            aria-label="Ángulo anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className="gallery-card__arrow gallery-card__arrow--next"
            onClick={(e) => {
              e.stopPropagation();
              goAngle(1);
            }}
            aria-label="Ángulo siguiente"
          >
            ›
          </button>
        </>
      )}

      {/* Overlay info */}
      <div className="gallery-card__overlay" aria-hidden="true">
        <div className="gallery-card__overlay-content">
          <p className="gallery-card__label">{work.service}</p>

          <div className="gallery-card__meta">
            <span className="gallery-card__angle">{angle.label}</span>
            {multi && (
              <>
                <span className="gallery-card__meta-sep">·</span>
                <span className="gallery-card__counter">
                  {angleIdx + 1}/{work.angles.length}
                </span>
              </>
            )}
            {hasBefore && (
              <>
                <span className="gallery-card__meta-sep">·</span>
                <span className="gallery-card__compare-action">
                  {showAfter ? "Ver antes" : "Ver después"}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────

export function GallerySection({ works }: { works: GalleryWork[] }) {
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
          <motion.div className="section-eyebrow-wrap" variants={fadeUp}>
            <span className="section-eyebrow-dot" aria-hidden="true" />
            <span className="section-eyebrow">Resultados</span>
          </motion.div>

          <motion.h2 className="section-heading" variants={fadeUp}>
            El trabajo
            <br />
            <span className="section-heading-accent">habla solo</span>
          </motion.h2>

          <motion.p className="section-description" variants={fadeUp}>
            Un trabajo por cada servicio. Tocá una imagen para ver la
            transformación y usá las flechas para recorrer los ángulos.
          </motion.p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="gallery__grid"
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {works.map((work) => (
            <GalleryCard key={work.id} work={work} />
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
          <span className="gallery__notice-dot" aria-hidden="true" />

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
