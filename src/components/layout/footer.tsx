import Link from "next/link";
import Image from "next/image";

const INSTAGRAM_URL = "https://instagram.com/369detail";
const WHATSAPP_URL =
  "https://wa.me/5491154748668?text=Hola%2C%20quiero%20solicitar%20un%20turno%20en%20369%20Detail.";

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__bg" aria-hidden="true" />
      
      <div className="footer__inner container">
        {/* Branding & Logo */}
        <div className="footer__brand">
          <Link href="#inicio" className="footer__logo" aria-label="369 Detail inicio">
            <Image
              src="/images/branding/logo-369-detail.jpeg"
              alt="Logo de 369 Detail"
              width={36}
              height={36}
              className="footer__logo-img"
            />
            <span className="footer__logo-text">369 Detail</span>
          </Link>
          <p className="footer__tagline">
            Estética vehicular profesional en Lugano. Cuidado artesanal y corrección de pintura con estándares de alta gama.
          </p>
        </div>

        {/* Links Column */}
        <div className="footer__links-group">
          <h3 className="footer__title">Navegación</h3>
          <ul className="footer__links">
            <li>
              <Link href="#inicio" className="footer__link">Inicio</Link>
            </li>
            <li>
              <Link href="#servicios" className="footer__link">Servicios</Link>
            </li>
            <li>
              <Link href="#resultados" className="footer__link">Resultados</Link>
            </li>
            <li>
              <Link href="#contacto" className="footer__link">Contacto</Link>
            </li>
          </ul>
        </div>

        {/* Social / Contact Column */}
        <div className="footer__links-group">
          <h3 className="footer__title">Contacto</h3>
          <ul className="footer__links">
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link"
              >
                WhatsApp Turnos
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link"
              >
                Instagram
              </a>
            </li>
            <li>
              <span className="footer__info">
                Dr. Horacio Casco 5140, Lugano
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer__bottom container">
        <p className="footer__copyright">
          &copy; {new Date().getFullYear()} 369 Detail. Todos los derechos reservados.
        </p>
        <p className="footer__developer">
          Designed with Precision
        </p>
      </div>
    </footer>
  );
}
