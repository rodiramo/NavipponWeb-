import { useTheme } from "@mui/material";
import "../../../css/Universal.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Highlights = () => {
  const theme = useTheme();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{
        backgroundColor: theme.palette.secondary.light,
      }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, ${theme.palette.primary.main}10 0%, transparent 50%), 
                           radial-gradient(circle at 80% 80%, ${theme.palette.secondary.main}10 0%, transparent 50%)`,
        }}
      ></div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-0 lg:gap-16">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 relative group p-0 m-0">
            <div
              style={{
                margin: isDesktop ? "-10rem" : "2rem",
              }}
              className="relative p-0 m-0"
            >
              <img
                src="/assets/home.jpg"
                alt="templo de kyoto"
                className=" h-[400px] sm:h-[500px] lg:h-[600px] object-cover  duration-700 p-0 m-0"
                style={{
                  width: "80%",
                  borderRadius: isDesktop ? "0rem 200rem 200rem 0rem" : "2rem",
                }}
              />
            </div>

            {/* Decorative Element */}
            <div
              className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 blur-xl"
              style={{ backgroundColor: theme.palette.primary.main }}
            ></div>
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 p-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 shadow-sm">
              <span
                className="w-2 h-2 bg-gradient-to-r rounded-full animate-pulse"
                style={{ background: theme.palette.primary.main }}
              ></span>
              <span className="text-sm font-medium ">
                Tu compañero de viaje ideal
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r bg-clip-text ">
                Haz de tu viaje un gran éxito con{" "}
              </span>
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main})`,
                }}
              >
                Navippon
              </span>
            </h2>

            {/* Description */}
            <p
              className="text-lg sm:text-xl leading-relaxed"
              style={{ color: theme.palette.neutral.dark }}
            >
              Con{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                }}
              >
                Navippon
              </span>
              , cada paso de tu viaje se transforma en una experiencia
              inolvidable. Personaliza tu aventura, descubre lugares únicos y
              crea recuerdos que durarán toda la vida. Deja que
              <span
                style={{
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                }}
              >
                {" "}
                Navippon{" "}
              </span>{" "}
              sea tu guía confiable en el viaje de tus sueños.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Link to="/experience" style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white  "
                  style={{
                    backgroundColor: theme.palette.primary.main,
                  }}
                >
                  <span className="text-lg">Explorar destinos</span>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:rotate-12">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Highlights;
