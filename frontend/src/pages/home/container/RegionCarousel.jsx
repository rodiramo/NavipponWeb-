import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../../../css/Regions.css";
import HokkaidoImage from "../../../assets/Hokkaido.jpg";
import TohokuImage from "../../../assets/Tohoku.jpg";
import KantoImage from "../../../assets/Kanto.jpg";
import ChubuImage from "../../../assets/Chubu.jpg";
import KansaiImage from "../../../assets/Kansai.jpg";
import ChugokuImage from "../../../assets/Chugoku.jpg";
import ShikokuImage from "../../../assets/Shikoku.jpg";
import KyushuImage from "../../../assets/Kyushu.jpg";

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

const RegionCarousel = () => {
  const navigate = useNavigate();

  const handleRegionClick = (region) => {
    navigate(`/experience?category=&region=${region}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <div className="region-carousel my-12 px-6">
      <h2 className="text-left mb-6 text-3xl font-bold">
        Explora Japón por Región
      </h2>
      <Slider {...settings}>
        {regions.map((region, index) => (
          <div
            key={index}
            className="card-wrap"
            onClick={() => handleRegionClick(region.name)}
          >
            <div className="card-tipos relative">
              {/* Region Image */}
              <img
                src={region.image}
                alt={region.name}
                className="card__image"
              />

              {/* Hover Effect */}
              <div className="card__overlay">
                <div className="card__header">
                  <h3 className="card__title">{region.name}</h3>
                </div>
                <p className="card__description">{region.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RegionCarousel;
