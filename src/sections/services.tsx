"use client";

import React, { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Service {
  id: string;
  title: string;
  description: string;
  tag: string;
  icon: React.ReactNode;
}

const IconWash = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6l3 13h12l3-13H3z" />
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v5M14 11v5" />
  </svg>
);

const IconShine = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const IconInterior = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M7 8V6a5 5 0 0 1 10 0v2" />
    <path d="M12 12v4M10 14h4" />
  </svg>
);

const IconAcrylic = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M8 11l2 2 4-5" />
  </svg>
);

const IconCeramic = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const IconEngine = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="10" rx="2" />
    <path d="M6 7V5M10 7V5M14 7V5M18 7V5" />
    <path d="M6 17v2M18 17v2" />
    <path d="M9 12h6" />
  </svg>
);

const SERVICES: Service[] = [
  {
    id: "lavado",
    title: "Lavado detallado",
    description:
      "Lavado completo con técnica de dos baldes, sin riesgo de rayaduras. Incluye descontaminación férrica y química, limpieza de umbrales, ruedas y pasos de rueda.",
    tag: "Lavado",
    icon: <IconWash />,
  },
  {
    id: "abrillantado",
    title: "Abrillantado",
    description:
      "Realzamos el brillo natural de la pintura mediante productos específicos. Ideal para mantener el vehículo con un acabado vivo entre tratamientos más profundos.",
    tag: "Estética",
    icon: <IconShine />,
  },
  {
    id: "interior",
    title: "Limpieza de interior",
    description:
      "Limpieza y acondicionamiento profundo de habitáculo. Tapizados, paneles, tablero, cristales y butacas tratados con productos específicos para cada superficie.",
    tag: "Interior",
    icon: <IconInterior />,
  },
  {
    id: "acrilico",
    title: "Tratamiento acrílico",
    description:
      "Protección acrílica de alta adherencia con duración aproximada de 6 meses. Aporta brillo, hidrofobicidad y protección contra agentes externos a un precio accesible.",
    tag: "Protección",
    icon: <IconAcrylic />,
  },
  {
    id: "ceramico",
    title: "Tratamiento cerámico",
    description:
      "Recubrimiento cerámico de larga duración, 1 año en adelante. Máxima protección contra UV, contaminantes y agentes químicos, con efecto hidrofóbico superior.",
    tag: "Cerámico",
    icon: <IconCeramic />,
  },
  {
    id: "motor-chasis",
    title: "Lavado de motor y chasis",
    description:
      "Limpieza profunda del compartimiento del motor y chasis con productos desengrasantes específicos. Mejora la presentación del vehículo y facilita la detección de pérdidas.",
    tag: "Mecánica",
    icon: <IconEngine />,
  },
];

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

interface ServiceCardProps {
  service: Service;
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
      <div className="services__bg" aria-hidden="true" />

      <div className="container">
        <motion.div
          className="section-header"
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="section-eyebrow-wrap" variants={headingVariants}>
            <span className="section-eyebrow-dot" aria-hidden="true" />
            <span className="section-eyebrow">Servicios</span>
          </motion.div>

          <motion.h2 className="section-heading" variants={headingVariants}>
            Lo que hacemos,
            <br />
            <span className="section-heading-accent">con precisión</span>
          </motion.h2>

          <motion.p className="section-description" variants={headingVariants}>
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
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}