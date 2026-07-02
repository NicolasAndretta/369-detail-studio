"use client";

import { useMemo, useRef } from "react";
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
  "https://wa.me/5491154748668?text=Hola%2C%20quiero%20solicitar%20un%20turno%20en%20369%20Detail.";

const METRICS = [
  {
    value: "Pulidos",
    label: "Corrección de pintura",
  },
  {
    value: "Cerámicos",
    label: "Protección exterior",
  },
  {
    value: "Detailing",
    label: "Tratamientos completos",
  },
] as const;

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
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASE_OUT,
    },
  },
};

const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const lineReveal: Variants = {
  hidden: {
    scaleX: 0,
  },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: EASE_OUT,
      delay: 0.6,
    },
  },
};

// ─── Components ───────────────────────────────────────────────────────────────

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

interface MetricCardProps {
  value: string;
  label: string;
}

function MetricCard({ value, label }: MetricCardProps) {
  return (
    <motion.div
      className="hero__metric"
      variants={fadeUp}
      whileHover={{
        y: -2,
        transition: {
          duration: 0.2,
        },
      }}
    >
      <span className="hero__metric-value">{value}</span>
      <span className="hero__metric-label">{label}</span>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-80px",
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const lightY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "30%"]
  );

  const metrics = useMemo(
    () =>
      METRICS.map((metric) => (
        <MetricCard
          key={metric.label}
          value={metric.value}
          label={metric.label}
        />
      )),
    []
  );

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
          <motion.div
            className="hero__eyebrow-wrap"
            variants={fadeIn}
          >
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            <span className="hero__eyebrow">369 DETAIL</span>
            <span className="hero__eyebrow-dot" aria-hidden="true" />
          </motion.div>

          <motion.h1
            className="hero__heading"
            variants={fadeUp}
          >
            Cuidado automotriz
            <br />

            <span className="hero__heading-accent">
              de precisión
            </span>
          </motion.h1>

          <motion.div
            className="hero__separator"
            variants={lineReveal}
          />

          <motion.p
            className="hero__description"
            variants={fadeUp}
          >
            Estética vehicular profesional en Lugano.
            <br className="hero__br-desktop" />
            Corrección de pintura, tratamientos cerámicos
            <br className="hero__br-desktop" />
            y detailing especializado.
          </motion.p>

          <motion.div
            className="hero__actions"
            variants={fadeUp}
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
              aria-label="Solicitar turno por WhatsApp"
            >
              Solicitar turno
            </a>

            <Link
              href="#resultados"
              className="btn btn--ghost"
            >
              Ver resultados
              <span
                className="btn__arrow"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </motion.div>

          <motion.div
            className="hero__metrics"
            variants={containerVariants}
          >
            {metrics}
          </motion.div>
        </motion.div>

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

      <motion.div
        className="hero__scroll-indicator"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1.6,
          duration: 0.6,
        }}
        aria-hidden="true"
      >
        <motion.div
          className="hero__scroll-dot"
          animate={{ y: [0, 6, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </section>
  );
}