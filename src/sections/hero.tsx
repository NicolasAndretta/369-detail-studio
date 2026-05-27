"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type Variants,
} from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────

const WHATSAPP_URL =
  "https://wa.me/5491100000000?text=Hola%2C%20quiero%20solicitar%20un%20turno%20en%20369%20Detail.";

const METRICS = [
  { value: "Pulidos", label: "Corrección de pintura" },
  { value: "Cerámicos", label: "Protección exterior" },
  { value: "Detailing", label: "Tratamientos completos" },
] as const;

// ─── Easing helper (typed for Framer Motion 12) ───────────────────────────────

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const lineReveal: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: EASE_OUT, delay: 0.6 },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroBackground() {
  return (
    <div className="hero__bg" aria-hidden="true">
      <div className="hero__bg-base" />
      <div className="hero__bg-light hero__bg-light--top" />
      <div className="hero__bg-light hero__bg-light--bottom" />
      <div className="hero__bg-noise" />
      <motion.div
        className="hero__scanline"
        variants={lineReveal}
        initial="hidden"
        animate="visible"
      />
    </div>
  );
}

function MetricCard({
  value,
  label,
}: {
  value: string;
  label: string;
  index: number;
}) {
  return (
    <motion.div
      className="hero__metric"
      variants={fadeUp}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <span className="hero__metric-value">{value}</span>
      <span className="hero__metric-label">{label}</span>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const lightY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="hero"
      aria-label="Sección principal — 369 Detail"
    >
      <HeroBackground />

      <motion.div
        className="hero__parallax"
        style={{ y: lightY }}
        aria-hidden="true"
      />

      <div className="hero__content container">
        <motion.div
          className="hero__body"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Eyebrow */}
          <motion.div className="hero__eyebrow-wrap" variants={fadeIn}>
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            <span className="hero__eyebrow">369 DETAIL</span>
            <span className="hero__eyebrow-dot" aria-hidden="true" />
          </motion.div>

          {/* Heading */}
          <motion.h1 className="hero__heading" variants={fadeUp}>
            Cuidado automotriz
            <br />
            <span className="hero__heading-accent">de precisión</span>
          </motion.h1>

          {/* Separator */}
          <motion.div className="hero__separator" variants={lineReveal} />

          {/* Description */}
          <motion.p className="hero__description" variants={fadeUp}>
            Estética vehicular profesional en Lugano.
            <br className="hero__br-desktop" />
            Corrección de pintura, tratamientos cerámicos
            <br className="hero__br-desktop" />
            y detailing especializado.
          </motion.p>

          {/* CTAs */}
          <motion.div className="hero__actions" variants={fadeUp}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
              aria-label="Solicitar turno por WhatsApp"
              id="hero-cta-whatsapp"
            >
              <span className="btn__icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.524 5.842L0 24l6.338-1.503A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.814 9.814 0 01-5.007-1.374l-.359-.214-3.72.882.937-3.617-.234-.372A9.817 9.817 0 012.182 12C2.182 6.574 6.574 2.182 12 2.182S21.818 6.574 21.818 12 17.426 21.818 12 21.818z" />
                </svg>
              </span>
              Solicitar turno
            </a>

            <Link
              href="#resultados"
              className="btn btn--ghost"
              id="hero-cta-resultados"
            >
              Ver resultados
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
          </motion.div>

          {/* Metrics */}
          <motion.div className="hero__metrics" variants={containerVariants}>
            {METRICS.map((m, i) => (
              <MetricCard key={m.label} {...m} index={i} />
            ))}
          </motion.div>
        </motion.div>

        {/* Vertical side label */}
        <motion.div
          className="hero__side-label"
          variants={fadeIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 1 }}
          aria-hidden="true"
        >
          <span>Lugano · Buenos Aires</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll-indicator"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        aria-hidden="true"
      >
        <motion.div
          className="hero__scroll-dot"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
