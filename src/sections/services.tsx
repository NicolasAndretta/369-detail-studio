"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

// ─── Easing helper (typed for Framer Motion 12) ───────────────────────────────

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Service {
  id: string;
  title: string;
  description: string;
  tag: string;
  icon: React.ReactNode;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconPolish = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
  </svg>
);

const IconCeramic = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const IconInterior = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M7 8V6a5 5 0 0 1 10 0v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </svg>
);

const IconWash = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <path d="M9 9h.01M15 9h.01" />
    <path d="M7 6c1-1 2-1.5 3-1.5S12 5 13 6" />
  </svg>
);

const IconRestore = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const IconProtect = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES: Service[] = [
  {
    id: "pulido",
    title: "Pulido y corrección de pintura",
    description:
      "Eliminamos marcas de instalación, remolinos y defectos superficiales. Recuperamos la profundidad y el brillo original de la pintura mediante procesos de corrección en múltiples etapas.",
    tag: "Corrección",
    icon: <IconPolish />,
  },
  {
    id: "ceramico",
    title: "Tratamientos cerámicos",
    description:
      "Aplicación de recubrimientos cerámicos de alta durabilidad. Protegen la pintura contra agentes externos, UV y contaminantes, manteniendo el vehículo con aspecto recién salido de taller.",
    tag: "Protección",
    icon: <IconCeramic />,
  },
  {
    id: "interior",
    title: "Detailing interior",
    description:
      "Limpieza y acondicionamiento profundo de habitáculo. Tapizados, paneles, tablero y cristales tratados con productos específicos para cada superficie.",
    tag: "Interior",
    icon: <IconInterior />,
  },
  {
    id: "lavado",
    title: "Lavado técnico",
    description:
      "Procedimiento de lavado seguro mediante técnica de dos baldes. Sin tela, sin riesgo de rayaduras. Descontaminación férrica y química incluida.",
    tag: "Mantenimiento",
    icon: <IconWash />,
  },
  {
    id: "restauracion",
    title: "Restauración estética",
    description:
      "Evaluación completa y tratamiento integral del estado estético del vehículo. Desde la pintura al interior, recuperamos el aspecto en cada rincón.",
    tag: "Restauración",
    icon: <IconRestore />,
  },
  {
    id: "proteccion",
    title: "Protección exterior",
    description:
      "Films de protección de pintura (PPF) y selladores de alta resistencia. Barrera física contra piedras, insectos y contaminación de la vía.",
    tag: "Exterior",
    icon: <IconProtect />,
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_OUT },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ServiceCardProps {
  service: Service;
  index: number;
}

function ServiceCard({ service }: ServiceCardProps) {
  return (
    <motion.article
      className="service-card"
      variants={cardVariants}
      whileHover="hover"
      aria-label={service.title}
    >
      <div className="service-card__top">
        <div className="service-card__icon" aria-hidden="true">
          {service.icon}
        </div>
        <span className="service-card__tag">{service.tag}</span>
      </div>

      <div className="service-card__body">
        <h3 className="service-card__title">{service.title}</h3>
        <p className="service-card__description">{service.description}</p>
      </div>

      <div className="service-card__footer" aria-hidden="true">
        <div className="service-card__line" />
        <span className="service-card__arrow">→</span>
      </div>
    </motion.article>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="servicios"
      ref={sectionRef}
      className="services section-spacing"
      aria-label="Servicios de detailing"
    >
      {/* Background accent */}
      <div className="services__bg" aria-hidden="true" />

      <div className="container">
        <motion.div
          className="services__header"
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="services__eyebrow-wrap" variants={headingVariants}>
            <span className="services__eyebrow-dot" aria-hidden="true" />
            <span className="services__eyebrow">Servicios</span>
          </motion.div>

          <motion.h2 className="services__heading" variants={headingVariants}>
            Lo que hacemos,
            <br />
            <span className="services__heading-accent">con precisión</span>
          </motion.h2>

          <motion.p className="services__subheading" variants={headingVariants}>
            Cada vehículo recibe un tratamiento específico según su estado y necesidades.
            Sin atajos, sin productos genéricos.
          </motion.p>
        </motion.div>

        <motion.div
          className="services__grid"
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
