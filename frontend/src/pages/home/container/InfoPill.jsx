import React from "react";
import { useTheme } from "@mui/material/styles";

const pastilla1 = "/assets/1.png";
const pastilla2 = "/assets/2.png";
const pastilla3 = "/assets/3.png";

const InfoPill = () => {
  const theme = useTheme();

  const pills = [
    {
      img: pastilla1,
      title: "Filtra según tus preferencias",
      description:
        "Descubre la magia de Japón adaptada a tus gustos. Nuestra app te permite filtrar atractivos turísticos por categorías.",
    },
    {
      img: pastilla2,
      title: "Encuentra lo que buscas",
      description:
        "Encuentra información detallada, imágenes inspiradoras y reseñas de otros viajeros para tomar decisiones informadas.",
    },
    {
      img: pastilla3,
      title: "Arma tu itinerario y planea tu ruta",
      description:
        "Organiza tu propio itinerario personalizado, y crea tus rutas de viaje al seleccionar tus lugares favoritos.",
    },
  ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 ">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center ">
          {/* Title */}

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r mb-4">
            ¿Cómo funciona {""}
            <span
              style={{ color: theme.palette.primary.main }}
              className="bg-gradient-to-r  bg-clip-text text-transparent"
            >
              Navippon
            </span>
            ?
          </h2>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl 0 max-w-2xl mx-auto ">
            <span
              style={{
                fontWeight: "bold",
                color: theme.palette.primary.main,
              }}
            >
              {" "}
              Navippon
            </span>{" "}
            te ayuda a planificar tu viaje de manera intuitiva y personalizada
          </p>
        </div>

        {/* Pills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mt-20">
          {pills.map((pill, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl backdrop-blur-xl border border-white/20 transition-all duration-500 p-8 text-center"
            >
              {/* Step Number */}
              <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gradient-to-r flex items-center justify-center text-white text-sm font-bold">
                {index + 1}
              </div>

              {/* Image Container */}
              <div className="relative mb-8 duration-500">
                <img
                  src={pill.img}
                  alt={pill.title}
                  className="relative w-full h-64 sm:h-72 lg:h-80 object-contain mx-auto transition-transform duration-500 "
                />
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Title */}
                <h4 className="text-xl sm:text-2xl font-bold leading-tight">
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}`,
                    }}
                  >
                    {pill.title}
                  </span>
                </h4>

                {/* Description */}
                <p className="  text-base sm:text-lg leading-relaxed">
                  {pill.description}
                </p>
              </div>

              {/* Bottom Accent */}
              <div
                className="absolute bottom-0 left-0 h-1 w-full transition-all duration-500"
                style={{
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  transform: "scaleX(0)",
                  transformOrigin: "left",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scaleX(1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scaleX(0)";
                }}
              ></div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoPill;
