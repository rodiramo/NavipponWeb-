import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import HokkaidoImage from '../../../assets/Hokkaido.jpg';
import TohokuImage from '../../../assets/Tohoku.jpg';
import KantoImage from '../../../assets/Kanto.jpg';
import ChubuImage from '../../../assets/Chubu.jpg';
import KansaiImage from '../../../assets/Kansai.jpg';
import ChugokuImage from '../../../assets/Chugoku.jpg';
import ShikokuImage from '../../../assets/Shikoku.jpg';
import KyushuImage from '../../../assets/Kyushu.jpg';

const regions = [
  { name: "Hokkaido", image: HokkaidoImage },
  { name: "Tohoku", image: TohokuImage },
  { name: "Kanto", image: KantoImage },
  { name: "Chubu", image: ChubuImage },
  { name: "Kansai", image: KansaiImage },
  { name: "Chugoku", image: ChugokuImage },
  { name: "Shikoku", image: ShikokuImage },
  { name: "Kyushu", image: KyushuImage }
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
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  };

  return (
    <div className="region-carousel my-12 p-6">
      <h2 className="text-left mb-4 text-2xl">Explora por región</h2>
      <Slider {...settings}>
        {regions.map((region, index) => (
          <div key={index} className="p-4" onClick={() => handleRegionClick(region.name)}>
            <div className="flex flex-col items-center text-center cursor-pointer">
              <div className="image-container mb-4 bg-white shadow-lg rounded-full overflow-hidden" style={{ width: '150px', height: '150px' }}>
                <img src={region.image} alt={region.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[#8F9BB3]">{region.name}</span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RegionCarousel;