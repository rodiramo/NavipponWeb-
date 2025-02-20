import React from "react";
import {
  FaWifi,
  FaUtensils,
  FaDog,
  FaLeaf,
  FaFish,
  FaChild,
} from "react-icons/fa";

const restaurantTypes = [
  "Restaurantes tradicionales",
  "Cadenas de comida rápida",
  "Cafeterías y cafés",
  "Restaurantes de alta cocina",
  "Food trucks",
  "Ramen",
  "Sushi",
];

const cuisines = [
  "Cocina japonesa tradicional",
  "Internacional",
  "Fusión",
  "Cocina vegetariana/vegana",
  "Cocina sin gluten",
  "Cocina halal",
  "Cocina kosher",
  "Rápida",
  "Cocina de autor",
  "Con espectáculo",
  "Familiar",
  "Romántica",
  "Negocios",
  "Ocasiones especiales",
];

const restaurantServices = [
  { icon: <FaWifi />, label: "Wi-Fi gratis" },
  { icon: <FaUtensils />, label: "Menú en inglés" },
  { icon: <FaUtensils />, label: "Reservas en línea" },
  { icon: <FaUtensils />, label: "Entregas a domicilio" },
  { icon: <FaUtensils />, label: "Terraza o comedor al aire libre" },
  { icon: <FaUtensils />, label: "Opciones de comida para llevar" },
  { icon: <FaDog />, label: "Admite mascotas" },
  { icon: <FaLeaf />, label: "Ingredientes orgánicos" },
  { icon: <FaFish />, label: "Mariscos frescos" },
  { icon: <FaChild />, label: "Menús infantiles" },
];

const RestaurantTags = ({
  selectedRestaurantTags,
  setSelectedRestaurantTags,
}) => {
  const handleTagChange = (tagType, tagLabel) => {
    setSelectedRestaurantTags((prevTags) => {
      const newTags = { ...prevTags };
      if (!newTags[tagType]) {
        newTags[tagType] = [];
      }
      if (newTags[tagType].includes(tagLabel)) {
        newTags[tagType] = newTags[tagType].filter((tag) => tag !== tagLabel);
      } else {
        newTags[tagType].push(tagLabel);
      }
      return newTags;
    });
  };

  return (
    <div className="mb-5 mt-2">
      {/* Restaurant Types */}
      <label className="d-label">
        <span className="d-label-text">Tipos de Restaurantes</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {restaurantTypes.map((type) => (
          <label
            key={type}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedRestaurantTags.restaurantTypes.includes(type)}
              onChange={() => handleTagChange("restaurantTypes", type)}
              className="form-checkbox h-4 w-4 text-primary"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>

      {/* Cuisines */}
      <label className="d-label mt-4">
        <span className="d-label-text">Cocinas</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cuisines.map((cuisine) => (
          <label
            key={cuisine}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedRestaurantTags.cuisines.includes(cuisine)}
              onChange={() => handleTagChange("cuisines", cuisine)}
              className="form-checkbox h-4 w-4 text-primary"
            />
            <span>{cuisine}</span>
          </label>
        ))}
      </div>

      {/* Restaurant Services */}
      <label className="d-label mt-4">
        <span className="d-label-text">Servicios</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {restaurantServices.map(({ icon, label }) => (
          <label
            key={label}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedRestaurantTags.restaurantServices.includes(
                label
              )}
              onChange={() => handleTagChange("restaurantServices", label)}
              className="form-checkbox h-4 w-4 text-primary"
            />
            <span className="flex items-center">
              {icon}
              <span className="ml-2">{label}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RestaurantTags;
