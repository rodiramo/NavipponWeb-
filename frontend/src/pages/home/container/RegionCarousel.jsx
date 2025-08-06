import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "@mui/material";
import "../../../css/Regions.css";
import { CircleArrowLeft, CircleArrowRight, MapPin } from "lucide-react";

const regions = [
  {
    name: "Hokkaido",
    image: "/assets/Hokkaido.jpg",
    description: "Conocido por sus paisajes nevados y festivales de invierno.",
    highlights: ["Sapporo", "Hakodate", "Niseko"],
    experienceCount: 24,
  },
  {
    name: "Tohoku",
    image: "/assets/Tohoku.jpg",
    description: "Famoso por sus montañas, onsens y cultura samurái.",
    highlights: ["Sendai", "Aomori", "Yamagata"],
    experienceCount: 18,
  },
  {
    name: "Kanto",
    image: "/assets/Kanto.jpg",
    description:
      "Hogar de Tokio, una metrópolis llena de tecnología y cultura.",
    highlights: ["Tokyo", "Yokohama", "Kamakura"],
    experienceCount: 45,
  },
  {
    name: "Chubu",
    image: "/assets/Chubu.jpg",
    description:
      "Con el majestuoso Monte Fuji y encantadoras ciudades históricas.",
    highlights: ["Monte Fuji", "Nagoya", "Takayama"],
    experienceCount: 32,
  },
  {
    name: "Kansai",
    image: "/assets/Kansai.jpg",
    description:
      "Conocido por Kioto, Osaka y Nara, ricas en historia y gastronomía.",
    highlights: ["Kyoto", "Osaka", "Nara"],
    experienceCount: 38,
  },
  {
    name: "Chugoku",
    image: "/assets/Chugoku.jpg",
    description: "Famoso por el Santuario de Itsukushima y Hiroshima.",
    highlights: ["Hiroshima", "Miyajima", "Okayama"],
    experienceCount: 15,
  },
  {
    name: "Shikoku",
    image: "/assets/Shikoku.jpg",
    description:
      "Un destino espiritual con la famosa peregrinación de 88 templos.",
    highlights: ["Matsuyama", "Tokushima", "Kochi"],
    experienceCount: 12,
  },
  {
    name: "Kyushu",
    image: "/assets/Kyushu.jpg",
    description: "Con volcanes activos, aguas termales y una cultura vibrante.",
    highlights: ["Fukuoka", "Kagoshima", "Beppu"],
    experienceCount: 21,
  },
];

const CustomPrevArrow = (props) => {
  const theme = useTheme();
  return (
    <div
      {...props}
      className="slick-prev group"
      style={{
        left: window.innerWidth < 640 ? "-12px" : "-50px",
        zIndex: 10,
        cursor: "pointer",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white shadow-lg transition-all duration-300">
        <CircleArrowLeft
          size={window.innerWidth < 640 ? 20 : 24}
          style={{ color: theme.palette.primary.main }}
          className="transition-transform duration-300"
        />
      </div>
    </div>
  );
};

const CustomNextArrow = (props) => {
  const theme = useTheme();
  return (
    <div
      {...props}
      className="slick-next group"
      style={{
        right: window.innerWidth < 640 ? "2px" : "-20px",
        zIndex: 10,
        cursor: "pointer",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white shadow-lg transition-all duration-300">
        <CircleArrowRight
          size={window.innerWidth < 640 ? 20 : 24}
          style={{ color: theme.palette.primary.main }}
          className="transition-transform duration-300"
        />
      </div>
    </div>
  );
};

const RegionCarousel = ({ experienceCounts = {} }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleRegionClick = (region) => {
    navigate(`/region/${region}`);
  };

  // Merge experience counts from props with default data
  const regionsWithCounts = regions.map((region) => ({
    ...region,
    experienceCount: experienceCounts[region.name] || region.experienceCount,
  }));

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    swipeToSlide: true,
    touchMove: true,
    centerMode: false,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3, slidesToScroll: 2, dots: true },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          arrows: false, // Hide arrows on tablet for better touch experience
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false, // Hide arrows on mobile for better touch experience
        },
      },
    ],
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-gradient-to-br">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 30%, ${theme.palette.primary.main}08 0%, transparent 50%), 
                           radial-gradient(circle at 70% 70%, ${theme.palette.secondary.main}08 0%, transparent 50%)`,
        }}
      ></div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 mb-6 bg-white/10">
            <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">8 Regiones únicas</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r bg-clip-text">
              Explora Japón por{" "}
            </span>
            <span
              className="bg-clip-text"
              style={{
                color: theme.palette.primary.main,
              }}
            >
              región
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed text-gray-600">
            Cada región de Japón tiene su propio encanto y tradiciones únicas
            esperándote
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative region-carousel-container">
          <style jsx>{`
            .region-carousel-container .slick-dots {
              bottom: -50px !important;
              display: flex !important;
              justify-content: center;
              gap: 8px;
              list-style: none;
              padding: 0;
              margin: 0;
            }
            .region-carousel-container .slick-dots li {
              width: auto !important;
              height: auto !important;
              margin: 0 !important;
            }
            .region-carousel-container .slick-dots li button {
              width: 12px !important;
              height: 12px !important;
              border-radius: 50% !important;
              background: ${theme.palette.primary.main}40 !important;
              border: none !important;
              font-size: 0 !important;
              transition: all 0.3s ease !important;
              padding: 0 !important;
              text-indent: -9999px !important;
              overflow: hidden !important;
            }
            .region-carousel-container .slick-dots li button:before {
              display: none !important;
              content: none !important;
            }
            .region-carousel-container .slick-dots li button:hover {
              background: ${theme.palette.primary.main}60 !important;
              transform: scale(1.2) !important;
            }
            .region-carousel-container .slick-dots li.slick-active button {
              background: ${theme.palette.primary.main} !important;
              transform: scale(1.3) !important;
            }
            .region-carousel-container .slick-track {
              display: flex;
              align-items: center;
            }
          `}</style>

          <Slider {...settings}>
            {regionsWithCounts.map((region, index) => (
              <div key={index} className="px-2 sm:px-3">
                <div
                  className="group relative overflow-hidden cursor-pointer transition-all duration-500 bg-white  "
                  onClick={() => handleRegionClick(region.name)}
                  style={{
                    height: "450px",
                    borderRadius: "24px",
                  }}
                >
                  {/* Experience Count Badge */}
                  <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} color={theme.palette.primary.main} />
                      <span className="text-sm font-semibold text-gray-700">
                        {region.experienceCount} experiencias
                      </span>
                    </div>
                  </div>

                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 lg:group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${region.image})`,
                      borderRadius: "24px",
                    }}
                  >
                    {/* Gradient Overlay - Always visible on mobile, hover on desktop */}
                    <div
                      className="absolute inset-0 transition-all duration-500 lg:opacity-60 lg:group-hover:opacity-80"
                      style={{
                        borderRadius: "24px",
                        background:
                          "linear-gradient(to top, rgba(14, 4, 32, 0.88) 100%, rgba(6, 4, 26, 0.57) 100%, rgba(7, 3, 24, 0.55) 100%)",
                      }}
                    ></div>
                  </div>

                  {/* Content Container */}
                  <div className="relative h-full p-6 text-white flex flex-col justify-end">
                    {/* Region Name - Always visible */}
                    <div className="mb-4">
                      <h3 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
                        {region.name}
                      </h3>
                    </div>

                    {/* Content - Visible on mobile, hover on desktop */}
                    <div className="space-y-4 opacity-100 transform translate-y-0 lg:opacity-0 lg:transform lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500">
                      {/* Description */}
                      <p className="text-white/95 text-sm sm:text-base leading-relaxed">
                        {region.description}
                      </p>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {region.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>

                      {/* Explore Button */}
                      <div className="flex items-center gap-3 text-white font-semibold transition-all duration-300 lg:group-hover:gap-4">
                        <span className="text-sm sm:text-base">
                          Explorar región
                        </span>
                        <div
                          className="w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 lg:group-hover:rotate-12"
                          style={{
                            backgroundColor: `${theme.palette.primary.main}80`,
                          }}
                        >
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
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Mobile-friendly instruction */}
        <div className="text-center mt-12 lg:hidden">
          <p className="text-sm text-gray-500">
            Desliza para ver más regiones • Toca para explorar
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegionCarousel;
