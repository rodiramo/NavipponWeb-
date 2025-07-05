import React from "react";
import { images } from "../constants";
import { IoHomeOutline, IoMailOutline, IoLogoWhatsapp } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { SlSocialYoutube } from "react-icons/sl";
import { FaXTwitter } from "react-icons/fa6";
import { useTheme } from "@mui/material";
import { PiTiktokLogoBold } from "react-icons/pi";
import { BookOpen, MessageCircle, FileQuestion } from "lucide-react";

const Footer = ({ onShowGuide = null }) => {
  const theme = useTheme();
  const API_URL = process.env.FRONTEND_API_URL || "http://localhost:3001";

  // Unified link style for all footer links
  const unifiedLinkStyle = {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "15px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    padding: "4px 0",
  };

  const socialIconStyle = {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    borderRadius: "12px",
    padding: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Unified hover handler for all links
  const handleLinkHover = (e, isEntering) => {
    if (isEntering) {
      e.currentTarget.style.color = theme.palette.primary.main;
      e.currentTarget.style.transform = "translateX(8px)";
    } else {
      e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
      e.currentTarget.style.transform = "translateX(0)";
    }
  };

  const handleSocialHover = (e, isEntering) => {
    const icon = e.currentTarget;
    if (isEntering) {
      icon.style.backgroundColor = theme.palette.primary.main;
      icon.style.transform = "translateY(-4px) scale(1.05)";
      icon.style.boxShadow = `0 8px 25px rgba(${theme.palette.primary.main
        .replace("#", "")
        .match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .join(", ")}, 0.3)`;
      icon.style.borderColor = theme.palette.primary.main;
    } else {
      icon.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
      icon.style.transform = "translateY(0) scale(1)";
      icon.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
      icon.style.borderColor = "rgba(255, 255, 255, 0.1)";
    }
  };

  // Unified Link Component
  const FooterLink = ({ href, children, onClick, external = false }) => (
    <a
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={unifiedLinkStyle}
      onMouseEnter={(e) => handleLinkHover(e, true)}
      onMouseLeave={(e) => handleLinkHover(e, false)}
    >
      {children}
    </a>
  );

  return (
    <div
      className="py-16 px-6 relative overflow-hidden"
      style={{
        borderRadius: "3rem 3rem 0rem 0rem",
        marginTop: "auto",
        background:
          "linear-gradient(135deg, rgb(10 23 51) 0%, rgb(15 30 65) 50%, rgb(8 20 45) 100%)",
        color: "white",
        position: "relative",
      }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${theme.palette.primary.main} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${theme.palette.primary.main} 0%, transparent 50%), radial-gradient(circle at 40% 80%, ${theme.palette.primary.main} 0%, transparent 50%)`,
        }}
      />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-12 lg:gap-8">
          {/* Logo Column */}
          <div className="flex flex-col items-center lg:items-start space-y-6">
            <div className="relative group">
              <img
                src={images.Company}
                alt="Logo"
                className="h-24 w-auto transition-transform duration-300 group-hover:scale-105"
                style={{
                  filter: "drop-shadow(0 4px 15px rgba(0, 0, 0, 0.2))",
                }}
              />
            </div>
            <p className="text-sm text-gray-300 text-center lg:text-left leading-relaxed max-w-xs">
              Descubre experiencias únicas y conecta con el mundo a través de
              nuestros servicios excepcionales.
            </p>
          </div>

          {/* Site Map Column */}
          <div className="space-y-6">
            <h5 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Mapa del sitio
            </h5>
            <nav className="space-y-4">
              <FooterLink href="/">Inicio</FooterLink>
              <FooterLink href="/experience">Explora</FooterLink>
              <FooterLink href="/itinerarios">Mis Itinerarios</FooterLink>
              <FooterLink href="/about">Nosotros</FooterLink>
              <FooterLink href="/contact">Contáctanos</FooterLink>
            </nav>
          </div>

          {/* Contact Column - Now with clickable links */}
          <div className="space-y-6">
            <h5 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Contacto
            </h5>
            <div className="space-y-4">
              {/* Address - Opens Google Maps */}
              <FooterLink
                href="https://maps.google.com/?q=Av.+La+Paz+1536"
                external={true}
              >
                <IoHomeOutline className="text-lg" />
                Av. La Paz 1536
              </FooterLink>

              {/* Email - Opens email client */}
              <FooterLink href="mailto:infonavippon@gmail.com">
                <IoMailOutline className="text-lg" />
                infonavippon@gmail.com
              </FooterLink>

              {/* Phone - Opens phone dialer */}
              <FooterLink href="tel:+34-1234-4567">
                <IoLogoWhatsapp className="text-lg" />
                +34-1234-4567
              </FooterLink>
            </div>
          </div>

          {/* Help Center Column */}
          <div className="space-y-6">
            <h5 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Centro de Ayuda
            </h5>
            <nav className="space-y-4">
              <FooterLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (onShowGuide) {
                    onShowGuide();
                  }
                }}
              >
                <BookOpen size={16} />
                Guía de Inicio
              </FooterLink>

              <FooterLink href={`${API_URL}/faq`}>
                <FileQuestion size={16} />
                Preguntas Frecuentes
              </FooterLink>

              <FooterLink href="mailto:infonavippon@gmail.com">
                <MessageCircle size={16} />
                Contactar Soporte
              </FooterLink>
            </nav>
          </div>

          {/* Social Media Column */}
          <div className="space-y-6">
            <h5 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Síguenos
            </h5>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {[
                {
                  Icon: FaInstagram,
                  href: "https://instagram.com/navippon",
                  label: "Instagram",
                },
                {
                  Icon: FaXTwitter,
                  href: "https://twitter.com/navippon",
                  label: "Twitter",
                },
                {
                  Icon: PiTiktokLogoBold,
                  href: "https://tiktok.com/@navippon",
                  label: "TikTok",
                },
                {
                  Icon: SlSocialYoutube,
                  href: "https://youtube.com/@navippon",
                  label: "YouTube",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    ...socialIconStyle,
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => handleSocialHover(e, true)}
                  onMouseLeave={(e) => handleSocialHover(e, false)}
                >
                  <social.Icon className="text-xl text-white" />
                </a>
              ))}
            </div>

            {/* Additional Help Links */}
            <div className="pt-4 space-y-3 border-t border-gray-700/30">
              <FooterLink href={`${API_URL}/privacy`}>
                Política de Privacidad
              </FooterLink>
              <FooterLink href={`${API_URL}/terms`}>Términos de Uso</FooterLink>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-16 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 Navippon. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <FooterLink href={`${API_URL}/sitemap`}>
                Mapa del Sitio
              </FooterLink>
              <FooterLink href={`${API_URL}/accessibility`}>
                Accesibilidad
              </FooterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
