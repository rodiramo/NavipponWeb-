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
      "Hogar de Tokio, una metrópolis llena de tecnología y cultura.",
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
    description: "Famoso por el Santuario de Itsukushima y Hiroshima.",
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

const CustomPrevArrow = (props) => {
  const theme = useTheme();
  return (
    <div
      {...props}
      className="slick-prev group"
      style={{
        left: window.innerWidth < 640 ? "-10px" : "-50px", // Closer on mobile
        zIndex: 10,
        cursor: "pointer",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-300">
        <CircleArrowLeft
          size={window.innerWidth < 640 ? 20 : 24} // Smaller icon on mobile
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
        right: window.innerWidth < 640 ? "-1px" : "-20px", // Closer on mobile
        zIndex: 10,
        cursor: "pointer",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center  hover:bg-white/30 transition-all duration-300">
        <CircleArrowRight
          size={window.innerWidth < 640 ? 20 : 24} // Smaller icon on mobile
          style={{ color: theme.palette.primary.main }}
          className="transition-transform duration-300"
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
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-gradient-to-br ">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 mb-6">
            <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium ">8 Regiones únicas</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r  bg-clip-text">
              Explora Japón por{" "}
            </span>
            <span
              className="bg-clip-text "
              style={{
                color: theme.palette.primary.main,
              }}
            >
              región
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
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
                  className="group relative overflow-hidden cursor-pointer transition-all  bg-white/10 backdrop-blur-xl border border-white/20"
                  onClick={() => handleRegionClick(region.name)}
                  style={{
                    height: "400px",
                    borderRadius: "30rem 30rem 2rem 2rem",
                  }}
                >
                  {/* Background Image with Blur Effect on Hover */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all group-hover:blur-sm"
                    style={{
                      backgroundImage: `url(${region.image})`,
                      borderRadius: "30rem 30rem 2rem 2rem",
                    }}
                  >
                    <div
                      className="absolute inset-0 transition-all "
                      style={{
                        borderRadius: "30rem 30rem 2rem 2rem",
                        background:
                          "linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(30, 58, 138, 0.7) 50%, transparent 100%)",
                      }}
                    ></div>
                    <div
                      style={{
                        borderRadius: "30rem 30rem 2rem 2rem",
                      }}
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all "
                    ></div>
                  </div>

                  <div className="relative h-full p-6 text-white flex flex-col">
                    <div className="flex-1"></div>

                    <div className="h-20 flex items-end">
                      <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
                        {region.name}
                      </h3>
                    </div>

                    {/* Content area with fixed height */}
                    <div className="h-32 flex flex-col justify-start">
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
                  </div>
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
