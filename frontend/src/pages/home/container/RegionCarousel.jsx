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
  },
  {
    name: "Tohoku",
    image: TohokuImage,
    description: "Famoso por sus montañas, onsens y cultura samurái.",
  },
  {
    name: "Kanto",
    image: KantoImage,
    description:
      "Hogar de Tokio, una metrópolis vibrante llena de tecnología y cultura.",
  },
  {
    name: "Chubu",
    image: ChubuImage,
    description:
      "Con el majestuoso Monte Fuji y encantadoras ciudades históricas.",
  },
  {
    name: "Kansai",
    image: KansaiImage,
    description:
      "Conocido por Kioto, Osaka y Nara, ricas en historia y gastronomía.",
  },
  {
    name: "Chugoku",
    image: ChugokuImage,
    description:
      "Famoso por el Santuario de Itsukushima y la ciudad de Hiroshima.",
  },
  {
    name: "Shikoku",
    image: ShikokuImage,
    description:
      "Un destino espiritual con la famosa peregrinación de 88 templos.",
  },
  {
    name: "Kyushu",
    image: KyushuImage,
    description: "Con volcanes activos, aguas termales y una cultura vibrante.",
  },
];

// Custom Arrow Components
const CustomPrevArrow = (props) => (
  <div
    {...props}
    className="slick-prev"
    style={{
      left: "0px",
      zIndex: 10,
      marginBotton: "2rem",
      fontSize: "1rem",
      cursor: "pointer",
      color: "#04102bc2",
      position: "absolute",
    }}
  >
    <CircleArrowLeft size={34} />
  </div>
);

const CustomNextArrow = (props) => (
  <div
    {...props}
    className="slick-next"
    style={{
      right: "20px",
      zIndex: 10,
      fontSize: "60px",
      cursor: "pointer",
      color: "black",
      position: "absolute",
    }}
  >
    <CircleArrowRight size={34} />
  </div>
);

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
    slidesToShow: 5,
    slidesToScroll: 2,
    autoplay: true, // Enables auto-scrolling
    autoplaySpeed: 3000, // Changes slide every 3 seconds
    arrows: true,
    swipeToSlide: true,
    touchMove: true,
    centerMode: true,
    centerPadding: "20px",
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
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
    <div style={{ padding: "2rem 0rem" }}>
      <h2
        className="text-left mb-4 text-2xl md:text-3xl font-bold"
        style={{ marginLeft: "13rem", marginBottom: "3rem" }}
      >
        Explora Japón por Región
      </h2>
      <Slider {...settings}>
        {regions.map((region, index) => (
          <div
            key={index}
            className="px-2"
            onClick={() => handleRegionClick(region.name)}
          >
            <div
              className="relative overflow-hidden "
              style={{ borderRadius: "100rem" }}
            >
              {/* Region Image */}
              <img
                src={region.image}
                alt={region.name}
                className="w-full h-48 md:h-56 object-cover"
              />

              {/* Always Visible Region Name */}
              <div
                style={{
                  backgroundColor: "rgba(5, 4, 30, 0.75)",
                }}
                className="absolute bottom-0 w-full text-white text-center py-2"
              >
                <h3 className="text-lg font-bold">{region.name}</h3>
              </div>

              {/* Hover Effect for Description */}
              <div
                style={{
                  backgroundColor: "rgba(5, 4, 30, 0.6)",
                }}
                className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm text-center px-4"
              >
                <p className="text-white text-sm">{region.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RegionCarousel;
