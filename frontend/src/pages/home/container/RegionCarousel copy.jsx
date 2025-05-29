import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "@mui/material";
import "../../../css/Regions.css";
import HokkaidoImage from "../../../assets/Hokkaido.jpg";
import TohokuImage from "../../../assets/Tohoku.jpg";
import KantoImage from "../../../assets/Kanto.jpg";
import ChubuImage from "../../../assets/Chubu.jpg";
import KansaiImage from "../../../assets/Kansai.jpg";
import ChugokuImage from "../../../assets/Chugoku.jpg";
import ShikokuImage from "../../../assets/Shikoku.jpg";
import KyushuImage from "../../../assets/Kyushu.jpg";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";

const regions = [
  {
    name: "Hokkaido",
    image: HokkaidoImage,
    description: "Conocido por sus paisajes nevados y festivales de invierno.",
    highlights: ["Sapporo", "Hakodate", "Niseko"],
  },
  {
    name: "Tohoku",
    image: TohokuImage,
    description: "Famoso por sus montañas, onsens y cultura samurái.",
    highlights: ["Sendai", "Aomori", "Yamagata"],
  },
  {
    name: "Kanto",
    image: KantoImage,
    description:
      "Hogar de Tokio, una metrópolis vibrante llena de tecnología y cultura.",
    highlights: ["Tokyo", "Yokohama", "Kamakura"],
  },
  {
    name: "Chubu",
    image: ChubuImage,
    description:
      "Con el majestuoso Monte Fuji y encantadoras ciudades históricas.",
    highlights: ["Monte Fuji", "Nagoya", "Takayama"],
  },
  {
    name: "Kansai",
    image: KansaiImage,
    description:
      "Conocido por Kioto, Osaka y Nara, ricas en historia y gastronomía.",
    highlights: ["Kyoto", "Osaka", "Nara"],
  },
  {
    name: "Chugoku",
    image: ChugokuImage,
    description:
      "Famoso por el Santuario de Itsukushima y la ciudad de Hiroshima.",
    highlights: ["Hiroshima", "Miyajima", "Okayama"],
  },
  {
    name: "Shikoku",
    image: ShikokuImage,
    description:
      "Un destino espiritual con la famosa peregrinación de 88 templos.",
    highlights: ["Matsuyama", "Tokushima", "Kochi"],
  },
  {
    name: "Kyushu",
    image: KyushuImage,
    description: "Con volcanes activos, aguas termales y una cultura vibrante.",
    highlights: ["Fukuoka", "Kagoshima", "Beppu"],
  },
];

// Custom Arrow Components
const CustomPrevArrow = (props) => {
  const theme = useTheme();
  return (
    <div
      {...props}
      className="slick-prev group hidden sm:block"
      style={{
        left: "-60px",
        zIndex: 10,
        cursor: "pointer",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg hover:bg-white/30 hover:scale-110 transition-all duration-300">
        <CircleArrowLeft
          size={24}
          style={{ color: theme.palette.primary.main }}
          className="group-hover:scale-110 transition-transform duration-300"
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
      className="slick-next group hidden sm:block"
      style={{
        right: "-60px",
        zIndex: 10,
        cursor: "pointer",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg hover:bg-white/30 hover:scale-110 transition-all duration-300">
        <CircleArrowRight
          size={24}
          style={{ color: theme.palette.primary.main }}
          className="group-hover:scale-110 transition-transform duration-300"
        />
      </div>
    </div>
  );
};

const RegionCarousel = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleRegionClick = (region) => {
    navigate(`/experience?category=&region=${region}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 4000,
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
        settings: { slidesToShow: 2, slidesToScroll: 1, dots: true },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1, dots: true },
      },
    ],
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm mb-6">
            <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              8 Regiones únicas
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Explora Japón por{" "}
            </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
            >
              Región
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
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
            /* Hide default slick dots styling */
            .region-carousel-container .slick-dots li button:before {
              display: none !important;
            }
          `}</style>

          <Slider {...settings}>
            {regions.map((region, index) => (
              <div key={index} className="px-3">
                <div
                  className="group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:-translate-y-2 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl"
                  onClick={() => handleRegionClick(region.name)}
                  style={{ height: "400px" }}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${region.image})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-6 text-white">
                    {/* Region Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                      <span className="text-xs font-medium">
                        Región {index + 1}
                      </span>
                    </div>

                    {/* Region Name */}
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
                      {region.name}
                    </h3>

                    {/* Description - Always visible on mobile, hover on desktop */}
                    <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-4 sm:opacity-0 sm:group-hover:opacity-100 sm:transform sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300">
                      {region.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">
                      {region.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* Explore Button */}
                    <div className="flex items-center gap-2 text-white font-semibold transition-all duration-300 group-hover:gap-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 delay-150">
                      <span className="text-sm sm:text-base">
                        Explorar región
                      </span>
                      <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:rotate-12">
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
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default RegionCarousel;
