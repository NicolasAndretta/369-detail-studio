"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const WHATSAPP_URL =
  "https://wa.me/5491154748668?text=Hola%2C%20quiero%20solicitar%20un%20turno%20en%20369%20Detail.";

const INSTAGRAM_URL = "https://www.instagram.com/369detail/";

// ─── Animation variants ───────────────────────────────────────────────────────

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_OUT },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.524 5.842L0 24l6.338-1.503A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.814 9.814 0 01-5.007-1.374l-.359-.214-3.72.882.937-3.617-.234-.372A9.817 9.817 0 012.182 12C2.182 6.574 6.574 2.182 12 2.182S21.818 6.574 21.818 12 17.426 21.818 12 21.818z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ─── Main component ───────────────────────────────────────────────────────────

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="contact section-spacing"
      aria-label="Contacto y solicitud de turno"
    >
      {/* Background */}
      <div className="contact__bg" aria-hidden="true">
        <div className="contact__bg-light" />
        <div className="contact__bg-line" />
      </div>

      <div className="container">
        <motion.div
          className="contact__inner"
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* LEFT */}
          <div className="contact__copy">
            <motion.div className="contact__eyebrow-wrap" variants={fadeUp}>
              <span className="contact__eyebrow-dot" aria-hidden="true" />
              <span className="contact__eyebrow">Contacto</span>
            </motion.div>

            <motion.h2 className="contact__heading" variants={fadeUp}>
              ¿Tu vehículo
              <br />
              <span className="contact__heading-accent">necesita atención?</span>
            </motion.h2>

            <motion.p className="contact__description" variants={fadeUp}>
              Escribinos por WhatsApp para consultar disponibilidad,
              presupuesto o cualquier duda sobre el estado de tu vehículo.
              Respondemos a la brevedad.
            </motion.p>

            <motion.address className="contact__address" variants={fadeUp}>
              <LocationIcon />
              <span>Dr. Horacio Casco 5140, Lugano — Buenos Aires</span>
            </motion.address>
          </div>

          {/* RIGHT */}
          <motion.div className="contact__actions" variants={fadeIn}>
            
            {/* WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__cta contact__cta--whatsapp"
              aria-label="Solicitar turno por WhatsApp"
            >
              <span className="contact__cta-icon">
                <WhatsAppIcon />
              </span>

              <div className="contact__cta-text">
                <span className="contact__cta-label">Solicitar turno</span>
                <span className="contact__cta-sub">Respondemos por WhatsApp</span>
              </div>

              <span className="contact__cta-arrow" aria-hidden="true">→</span>
            </a>

            {/* Instagram */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__cta contact__cta--instagram"
              aria-label="Seguir en Instagram"
            >
              <span className="contact__cta-icon">
                <InstagramIcon />
              </span>

              <div className="contact__cta-text">
                <span className="contact__cta-label">@369detail</span>
                <span className="contact__cta-sub">Seguinos en Instagram</span>
              </div>

              <span className="contact__cta-arrow" aria-hidden="true">→</span>
            </a>

            {/* Info */}
            <div className="contact__info-card">
              <div className="contact__info-row">
                <span className="contact__info-key">Horario</span>
                <span className="contact__info-value">Lunes a sábado, 9:00 – 18:00</span>
              </div>

              <div className="contact__info-divider" />

              <div className="contact__info-row">
                <span className="contact__info-key">Modalidad</span>
                <span className="contact__info-value">Por turno programado</span>
              </div>

              <div className="contact__info-divider" />

              <div className="contact__info-row">
                <span className="contact__info-key">Zona</span>
                <span className="contact__info-value">Lugano, Buenos Aires</span>
              </div>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}