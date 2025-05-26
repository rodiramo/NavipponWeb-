import { images } from "../constants";
import { IoHomeOutline, IoMailOutline, IoLogoWhatsapp } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { SlSocialYoutube } from "react-icons/sl";
import { FaXTwitter } from "react-icons/fa6";
import { useTheme } from "@mui/material";
import { PiTiktokLogoBold } from "react-icons/pi";

const Footer = () => {
  const theme = useTheme();

  const linkStyle = {
    position: "relative",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    textDecoration: "none",
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

  const handleLinkHover = (e, isEntering) => {
    if (isEntering) {
      e.target.style.color = theme.palette.primary.main;
      e.target.style.transform = "translateX(8px)";
    } else {
      e.target.style.color = "rgba(255, 255, 255, 0.8)";
      e.target.style.transform = "translateX(0)";
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
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
              {[
                { href: "/", label: "Inicio" },
                { href: "/experience", label: "Explora" },
                { href: "/about", label: "Nosotros" },
                { href: "/contact", label: "Contáctanos" },
              ].map((link, index) => (
                <div key={index} className="block">
                  <a
                    href={link.href}
                    style={{
                      ...linkStyle,
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => handleLinkHover(e, true)}
                    onMouseLeave={(e) => handleLinkHover(e, false)}
                  >
                    {link.label}
                  </a>
                </div>
              ))}
            </nav>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h5 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Contacto
            </h5>
            <div className="space-y-4">
              {[
                { Icon: IoHomeOutline, text: "Av. La Paz 1536" },
                { Icon: IoMailOutline, text: "infonavippon@navippon.com" },
                { Icon: IoLogoWhatsapp, text: "+34-1234-4567" },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-4 group">
                  <div
                    className="p-2 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <item.Icon
                      className="text-lg"
                      style={{ color: theme.palette.primary.main }}
                    />
                  </div>
                  <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors duration-300">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Column */}
          <div className="space-y-6">
            <h5 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Síguenos
            </h5>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {[
                { Icon: FaInstagram, href: "/" },
                { Icon: FaXTwitter, href: "/" },
                { Icon: PiTiktokLogoBold, href: "/" },
                { Icon: SlSocialYoutube, href: "/" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
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

            {/* Newsletter Signup */}
            <div className="pt-4">
              <p className="text-sm text-gray-400 mb-3">
                Mantente al día con nuestras novedades
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 px-4 py-2 rounded-lg text-sm border-0 outline-none"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                />
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    border: "none",
                  }}
                >
                  Suscribir
                </button>
              </div>
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
              <a
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Política de Privacidad
              </a>
              <a
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                Términos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
