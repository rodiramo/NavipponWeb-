// src/components/Footer.jsx
import React from "react";
import { images } from "../constants";
import { IoHomeOutline, IoMailOutline, IoLogoWhatsapp } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { SlSocialYoutube } from "react-icons/sl";
import { FaXTwitter } from "react-icons/fa6";
import { PiTiktokLogoBold } from "react-icons/pi";
import { BookOpen, MessageCircle, FileQuestion } from "lucide-react";
import { useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Footer = ({ onShowGuide }) => {
  const theme = useTheme();

  /* ---------- shared styles ---------- */
  const unifiedLinkStyle = {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "15px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    transition: "all .3s cubic-bezier(.4,0,.2,1)",
    cursor: "pointer",
    padding: "4px 0",
  };

  const socialIconStyle = {
    transition: "all .3s cubic-bezier(.4,0,.2,1)",
    cursor: "pointer",
    borderRadius: "12px",
    padding: "12px",
    backgroundColor: "rgba(255,255,255,.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,.1)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  /* ---------- helpers ---------- */
  const handleLinkHover = (e, isEnter) => {
    e.currentTarget.style.color = isEnter
      ? theme.palette.primary.main
      : "rgba(255, 255, 255, 0.8)";
    e.currentTarget.style.transform = isEnter
      ? "translateX(8px)"
      : "translateX(0)";
  };

  const handleSocialHover = (e, isEnter) => {
    const el = e.currentTarget;
    if (isEnter) {
      el.style.backgroundColor = theme.palette.primary.main;
      el.style.transform = "translateY(-4px) scale(1.05)";
      el.style.boxShadow = `0 8px 25px ${theme.palette.primary.main}4D`;
      el.style.borderColor = theme.palette.primary.main;
    } else {
      el.style.backgroundColor = "rgba(255,255,255,.05)";
      el.style.transform = "translateY(0) scale(1)";
      el.style.boxShadow = "0 4px 15px rgba(0,0,0,.1)";
      el.style.borderColor = "rgba(255,255,255,.1)";
    }
  };

  /* ---------- unified link ---------- */
  const FooterLink = ({ to, href, external, children, onClick }) =>
    href || external ? (
      <a
        href={href || to}
        target="_blank"
        rel="noopener noreferrer"
        {...linkProps(children, onClick)}
      />
    ) : (
      <RouterLink to={to} {...linkProps(children, onClick)} />
    );

  const linkProps = (children, onClick) => ({
    style: unifiedLinkStyle,
    onClick,
    onMouseEnter: (e) => handleLinkHover(e, true),
    onMouseLeave: (e) => handleLinkHover(e, false),
    children,
  });

  /* ---------- render ---------- */
  return (
    <div
      className="py-16 px-6 relative overflow-hidden"
      style={{
        borderRadius: "3rem 3rem 0 0",
        marginTop: "auto",
        background:
          "linear-gradient(135deg, rgb(10 23 51) 0%, rgb(15 30 65) 50%, rgb(8 20 45) 100%)",
        color: "white",
      }}
    >
      {/* decorative radial dots */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${theme.palette.primary.main} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${theme.palette.primary.main} 0%, transparent 50%), radial-gradient(circle at 40% 80%, ${theme.palette.primary.main} 0%, transparent 50%)`,
        }}
      />
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-12 lg:gap-8">
          {/* logo & blurb */}
          <div className="flex flex-col items-center lg:items-start space-y-6">
            <img
              src={images.Company}
              alt="Navippon"
              className="h-24 transition-transform duration-300 hover:scale-105"
              style={{ filter: "drop-shadow(0 4px 15px rgba(0,0,0,.2))" }}
            />
            <p className="text-sm text-gray-300 text-center lg:text-left max-w-xs leading-relaxed">
              Descubre experiencias únicas y conecta con el mundo a través de
              nuestros servicios excepcionales.
            </p>
          </div>

          {/* site map */}
          <div className="space-y-6">
            <h5 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Mapa del sitio
            </h5>
            <nav className="space-y-4">
              <FooterLink to="/">Inicio</FooterLink>
              <FooterLink to="/experience">Explora</FooterLink>
              <FooterLink to="/about">Nosotros</FooterLink>
              <FooterLink to="/contact">Contáctanos</FooterLink>
            </nav>
          </div>

          {/* contact */}
          <div className="space-y-6">
            <h5 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Contacto
            </h5>
            <div className="space-y-4">
              <FooterLink
                href="https://maps.google.com/?q=Av.+La+Paz+1536"
                external
              >
                <IoHomeOutline className="text-lg" />
                Av. La Paz 1536
              </FooterLink>
              <FooterLink href="mailto:infonavippon@gmail.com" external>
                <IoMailOutline className="text-lg" />
                infonavippon@gmail.com
              </FooterLink>
              <FooterLink href="tel:+34-1234-4567" external>
                <IoLogoWhatsapp className="text-lg" />
                +34‑1234‑4567
              </FooterLink>
            </div>
          </div>

          {/* help center */}
          <div className="space-y-6">
            <h5 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Centro de Ayuda
            </h5>
            <nav className="space-y-4">
              <FooterLink
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  onShowGuide?.();
                }}
              >
                <BookOpen size={16} />
                Guía de Inicio
              </FooterLink>
              <FooterLink to="/faq">
                <FileQuestion size={16} />
                Preguntas Frecuentes
              </FooterLink>
              <FooterLink href="mailto:infonavippon@gmail.com" external>
                <MessageCircle size={16} />
                Contactar Soporte
              </FooterLink>
            </nav>
          </div>

          {/* socials */}
          <div className="space-y-6">
            <h5 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Síguenos
            </h5>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {[
                { Icon: FaInstagram, href: "https://instagram.com/navippon" },
                { Icon: FaXTwitter, href: "https://twitter.com/navippon" },
                {
                  Icon: PiTiktokLogoBold,
                  href: "https://tiktok.com/@navippon",
                },
                {
                  Icon: SlSocialYoutube,
                  href: "https://youtube.com/@navippon",
                },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={Icon.displayName}
                  style={{
                    ...socialIconStyle,
                    boxShadow: "0 4px 15px rgba(0,0,0,.1)",
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={(e) => handleSocialHover(e, true)}
                  onMouseLeave={(e) => handleSocialHover(e, false)}
                >
                  <Icon className="text-xl text-white" />
                </a>
              ))}
            </div>

            {/* extra legal links */}
            <div className="pt-4 space-y-3 border-t border-gray-700/30">
              <FooterLink to="/privacy">Política de Privacidad</FooterLink>
              <FooterLink to="/terms">Términos de Uso</FooterLink>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-16 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 Navippon. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <FooterLink to="/sitemap">Mapa del Sitio</FooterLink>
              <FooterLink to="/accessibility">Accesibilidad</FooterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
