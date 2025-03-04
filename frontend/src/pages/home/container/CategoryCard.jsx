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
      bgImage: "/assets/hotel.png",
    },
    {
      icon: <MdIcons.MdOutlineRamenDining />,
      title: "Restaurantes",
      url: "/experience?category=Restaurantes&region=",
      text: "Descubre la increíble gastronomía japonesa: prueba el sushi en Tokio, el ramen en Fukuoka y el okonomiyaki en Osaka. Una experiencia culinaria inigualable te espera.",
      bgImage: "/assets/restaurant.png",
    },
    {
      icon: <TbIcons.TbTorii />,
      title: "Atracciones",
      url: "/experience?category=Atractivos&region=",
      text: "Explora templos históricos en Kioto, la modernidad de Tokio o la belleza natural del Monte Fuji. Japón tiene algo para cada viajero, desde cultura hasta aventuras al aire libre.",
      bgImage: "/assets/atractivo.png",
    },
  ];

  const handleCategoryClick = (url) => {
    navigate(url);
  };

  return (
    <div className="category-carousel my-12 px-6">
      <h2
        className="text-center mb-8 text-3xl font-bold"
        style={{ color: theme.palette.text.primary }}
      >
        Explora lo mejor de Japón
      </h2>

      <div
        className="flex flex-col md:flex-row justify-around  w-full "
        style={{ alignContent: "center", alignItems: "center", gap: "2rem" }}
      >
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 border-2"
            onClick={() => handleCategoryClick(category.url)}
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "350px",
              width: "100%",
              gap: 15,
              maxWidth: "450px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              borderColor: theme.palette.primary.main,
              transition: "border-color 0.3s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = theme.palette.secondary.dark)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = theme.palette.primary.main)
            }
          >
            {" "}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                justifyContent: "center",
                alignItems: "start",
                padding: "30px",
                height: "100%",
                width: "100%",
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
              <p className="text-sm max-w-[90%] opacity-90">{category.text}</p>
            </div>
            {/* Overlay Blur Effect */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-opacity-40 opacity-0 transition-opacity duration-300 hover:opacity-100 backdrop-blur-md"
              style={{
                backgroundColor: theme.palette.primary.light,
                backdropFilter: "blur(8px)", // Apply blur to background
                WebkitBackdropFilter: "blur(8px)", // Safari support
              }}
            >
              {" "}
              <span className="text-lg font-bold">Ver más</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
