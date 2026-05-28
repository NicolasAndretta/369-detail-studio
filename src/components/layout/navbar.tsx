"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Resultados", href: "#resultados" },
  { label: "Contacto", href: "#contacto" },
] as const;

const WHATSAPP_URL =
  "https://wa.me/5491100000000?text=Hola%2C%20quiero%20solicitar%20un%20turno%20en%20369%20Detail.";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
  const onScroll = () => {
    const currentScroll = window.scrollY;

    setScrolled(currentScroll > 24);
  };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      <motion.header
        className={`navbar ${
          scrolled ? "navbar--scrolled" : ""
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        role="banner"
      >
        <div className="navbar__inner container">
          {/* Logo */}
          <Link
            href="#inicio"
            className="navbar__logo"
            aria-label="369 Detail inicio"
            onClick={closeMenu}
          >
            <Image
              src="/images/branding/logo-369-detail.jpeg"
              alt="Logo de 369 Detail"
              width={44}
              height={44}
              className="navbar__logo-img"
              priority
            />

            <span className="navbar__logo-text">
              369 Detail
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="navbar__nav"
            aria-label="Navegación principal"
          >
            <ul className="navbar__links">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="navbar__link"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop CTA */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__cta"
            aria-label="Solicitar turno por WhatsApp"
          >
            Solicitar turno
          </a>

          {/* Mobile button */}
          <button
            className="navbar__hamburger"
            onClick={() =>
              setMenuOpen((prev) => !prev)
            }
            aria-label={
              menuOpen ? "Cerrar menú" : "Abrir menú"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
          >
            <nav>
              <ul className="mobile-menu__links">
                {NAV_LINKS.map(
                  ({ label, href }, index) => (
                    <motion.li
                      key={href}
                      initial={{
                        opacity: 0,
                        x: -12,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                    >
                      <Link
                        href={href}
                        className="mobile-menu__link"
                        onClick={closeMenu}
                      >
                        {label}
                      </Link>
                    </motion.li>
                  )
                )}
              </ul>

              <motion.div
                className="mobile-menu__cta-wrap"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.25,
                }}
              >
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="navbar__cta navbar__cta--full"
                  onClick={closeMenu}
                >
                  Solicitar turno
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}