import React from "react";
import { useNavigate } from "react-router-dom";
import * as MdIcons from "react-icons/md";
import * as TbIcons from "react-icons/tb";
import { useTheme } from "@mui/material/styles";

const CategoryCard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const categories = [
    {
      icon: <MdIcons.MdOutlineHotel />,
      title: "Hoteles",
      url: "/experience?category=Hoteles&region=",
      text: "Desde lujosos ryokanes con baños termales hasta hoteles cápsula futuristas, Japón ofrece una variedad única de alojamientos que combinan comodidad y tradición.",
      bgImage: "/assets/hotel.jpg",
    },
    {
      icon: <MdIcons.MdOutlineRamenDining />,
      title: "Restaurantes",
      url: "/experience?category=Restaurantes&region=",
      text: "Descubre la increíble gastronomía japonesa: prueba el sushi en Tokio, el ramen en Fukuoka y el okonomiyaki en Osaka. Una experiencia culinaria inigualable te espera.",
      bgImage: "/assets/restaurant.jpg",
    },
    {
      icon: <TbIcons.TbTorii />,
      title: "Atracciones",
      url: "/experience?category=Atractivos&region=",
      text: "Explora templos históricos en Kioto, la modernidad de Tokio o la belleza natural del Monte Fuji. Japón tiene algo para cada viajero, desde cultura hasta aventuras al aire libre.",
      bgImage: "/assets/experience.jpg",
    },
  ];

  const handleCategoryClick = (url) => {
    navigate(url);
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-gradient-to-br">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.palette.primary.main}15 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, ${theme.palette.secondary.main}15 0%, transparent 50%)`,
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br"></div>
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.palette.primary.main}15 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, ${theme.palette.secondary.main}15 0%, transparent 50%)`,
        }}
      ></div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full  backdrop-blur-sm border border-white/20 shadow-sm mb-6">
            <span className="w-2 h-2 bg-gradient-to-r from-pink-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium ">Descubre Japón</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r mb-4">
            Explora lo mejor de
            <span
              style={{ color: theme.palette.primary.main }}
              className="block bg-gradient-to-r  bg-clip-text text-transparent"
            >
              Japón
            </span>
          </h2>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Sumérgete en una experiencia única donde la tradición milenaria se
            encuentra con la innovación moderna
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:-translate-y-2 bg-white/10 backdrop-blur-xl border shadow-xl hover:shadow-2xl"
              onClick={() => handleCategoryClick(category.url)}
              style={{
                height: "420px",
                borderColor: theme.palette.primary.main,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.primary.light}05)`,
              }}
            >
              {/* Background Image with Enhanced Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${category.bgImage})`,
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-black/60 to-black/80 transition-opacity duration-500 group-hover:opacity-75`}
                ></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6 sm:p-8 text-white">
                {/* Top Section */}
                <div>
                  {/* Icon Container */}
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                    {React.cloneElement(category.icon, {
                      color: "white",
                      size: window.innerWidth < 640 ? "2rem" : "2.5rem",
                    })}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
                    {category.title}
                  </h3>
                </div>

                {/* Description */}
                <div>
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                    {category.text}
                  </p>

                  {/* CTA Button */}
                  <div className="flex items-center gap-2 text-white font-semibold transition-all duration-300 group-hover:gap-4">
                    <span className="text-base sm:text-lg">Explorar</span>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:rotate-12">
                      <svg
                        className="w-4 h-4"
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
                  </div>
                </div>
              </div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>

              {/* Bottom Accent Line */}
              <div
                className="absolute bottom-0 left-0 h-1 transition-all duration-500 group-hover:h-2"
                style={{
                  backgroundColor: theme.palette.secondary.main,
                  width: "0%",
                }}
                onMouseEnter={(e) => (e.target.style.width = "100%")}
                onMouseLeave={(e) => (e.target.style.width = "0%")}
              ></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: theme.palette.primary.main,
            }}
          >
            <span>Ver todas las experiencias</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCard;
