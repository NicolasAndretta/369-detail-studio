"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

// SWITCH de publicación → `SHOW_NUESTRO_ESPACIO` en `@/config/features`
// (debe vivir en un módulo server-safe, no acá que es "use client").

const SPACE_IMAGES = [
  {
    src: "/images/gallery/local-1.webp",
    alt: "Estación de pulido con herramientas y boinas en 369 Detail",
    caption: "Estación de pulido",
  },
  {
    src: "/images/gallery/local-2.webp",
    alt: "Barra de atención y productos profesionales en 369 Detail",
    caption: "Barra y productos profesionales",
  },
];

const toAvif = (src: string) => src.replace(/\.webp$/, ".avif");

const sectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export function NuestroEspacioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="espacio"
      ref={sectionRef}
      className="espacio section-spacing"
      aria-label="Nuestro espacio"
    >
      <div className="espacio__bg" aria-hidden="true" />

      <div className="container">
        <motion.div
          className="section-header"
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="section-eyebrow-wrap" variants={fadeUp}>
            <span className="section-eyebrow-dot" aria-hidden="true" />
            <span className="section-eyebrow">El taller</span>
          </motion.div>

          <motion.h2 className="section-heading" variants={fadeUp}>
            Nuestro
            <br />
            <span className="section-heading-accent">espacio</span>
          </motion.h2>

          <motion.p className="section-description" variants={fadeUp}>
            Un taller real, montado con herramientas y productos profesionales.
            Acá cada vehículo recibe el trabajo que se ve en los resultados.
          </motion.p>
        </motion.div>

        <motion.div
          className="espacio__grid"
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {SPACE_IMAGES.map((img) => (
            <motion.figure key={img.src} className="espacio__item" variants={fadeUp}>
              <picture>
                <source srcSet={toAvif(img.src)} type="image/avif" />
                <source srcSet={img.src} type="image/webp" />
                <img
                  src={img.src}
                  alt={img.alt}
                  className="espacio__img"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <figcaption className="espacio__caption">{img.caption}</figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
