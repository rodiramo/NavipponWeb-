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
      bgImage: "/assets/hotels.jpg",
    },
    {
      icon: <MdIcons.MdOutlineRamenDining />,
      title: "Restaurantes",
      url: "/experience?category=Restaurantes&region=",
      text: "Descubre la increíble gastronomía japonesa: prueba el sushi en Tokio, el ramen en Fukuoka y el okonomiyaki en Osaka. Una experiencia culinaria inigualable te espera.",
      bgImage: "/assets/restaurants.jpg",
    },
    {
      icon: <TbIcons.TbTorii />,
      title: "Atracciones",
      url: "/experience?category=Atractivos&region=",
      text: "Explora templos históricos en Kioto, la modernidad de Tokio o la belleza natural del Monte Fuji. Japón tiene algo para cada viajero, desde cultura hasta aventuras al aire libre.",
      bgImage: "/assets/activities.jpg",
    },
  ];

  const handleCategoryClick = (url) => {
    navigate(url);
  };

  return (
    <div className="category-carousel my-12 px-6">
      <h2
        className="text-left mb-8 text-3xl font-bold"
        style={{ color: theme.palette.text.primary }}
      >
        Explora lo mejor de Japón
      </h2>

      <div className="flex flex-col md:flex-row justify-center w-full gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => handleCategoryClick(category.url)}
            style={{
              backgroundImage: `url(${category.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "300px",
              width: "100%",
              maxWidth: "450px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Overlay Blur Effect */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-300"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.36)",
                backdropFilter: "blur(4px)",
                padding: "2rem",
                color: "white",
                border: "2px solid transparent",
              }}
            >
              {/* Icon */}
              <div className="mb-4">
                {React.cloneElement(category.icon, {
                  color: theme.palette.primary.main,
                  size: "3.5em",
                })}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-semibold mb-2">{category.title}</h3>

              {/* Description */}
              <p
                className="text-sm max-w-[90%] opacity-90"
                style={{
                  color: "white",
                }}
              >
                {category.text}
              </p>
            </div>

            {/* Border appears only on hover */}
            <div className="absolute inset-0 border-2 border-transparent transition-all duration-300 hover:border-white"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
