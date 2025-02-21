import React from "react";
import { Chip, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  FaWifi,
  FaUtensils,
  FaDog,
  FaLeaf,
  FaFish,
  FaChild,
} from "react-icons/fa";

// Define restaurant types with color theme
const restaurantTypes = [
  "Restaurantes tradicionales",
  "Cadenas de comida rápida",
  "Cafeterías y cafés",
  "Restaurantes de alta cocina",
  "Food trucks",
  "Ramen",
  "Sushi",
];

// Define cuisines
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

// Define services with icons
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
  const theme = useTheme();

  const handleTagClick = (tagType, tagValue) => {
    setSelectedRestaurantTags((prevTags) => ({
      ...prevTags,
      [tagType]: prevTags[tagType].includes(tagValue)
        ? prevTags[tagType].filter((tag) => tag !== tagValue) // Deselect
        : [...prevTags[tagType], tagValue], // Select
    }));
  };

  return (
    <Box className="mb-5 mt-2">
      {/* Restaurant Types */}
      <Typography
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.primary,
          marginBottom: "8px",
        }}
      >
        Tipos de Restaurantes
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {restaurantTypes.map((type) => (
          <Chip
            key={type}
            label={type}
            onClick={() => handleTagClick("restaurantTypes", type)}
            variant={
              selectedRestaurantTags.restaurantTypes.includes(type)
                ? "filled"
                : "outlined"
            }
            sx={{
              backgroundColor: selectedRestaurantTags.restaurantTypes.includes(
                type
              )
                ? theme.palette.success.medium // ✅ Green for restaurant types
                : theme.palette.success.lightest,
              color: selectedRestaurantTags.restaurantTypes.includes(type)
                ? "black"
                : theme.palette.text.primary,
              border: `1.5px solid ${theme.palette.success.light}`,
              borderRadius: "16px",
              padding: "8px",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: theme.palette.success.light,
                color: "black",
              },
            }}
          />
        ))}
      </Box>

      {/* Cuisines */}
      <Typography
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.primary,
          marginTop: "16px",
          marginBottom: "8px",
        }}
      >
        Cocinas
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {cuisines.map((cuisine) => (
          <Chip
            key={cuisine}
            label={cuisine}
            onClick={() => handleTagClick("cuisines", cuisine)}
            variant={
              selectedRestaurantTags.cuisines.includes(cuisine)
                ? "filled"
                : "outlined"
            }
            sx={{
              backgroundColor: selectedRestaurantTags.cuisines.includes(cuisine)
                ? theme.palette.warning.light // ✅ Yellow for cuisines
                : theme.palette.warning.lightest,
              color: selectedRestaurantTags.cuisines.includes(cuisine)
                ? "black"
                : theme.palette.text.primary,
              border: `1.5px solid ${theme.palette.warning.light}`,
              borderRadius: "16px",
              padding: "8px",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: theme.palette.warning.light,
                color: "black",
              },
            }}
          />
        ))}
      </Box>

      {/* Restaurant Services */}
      <Typography
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.primary,
          marginTop: "16px",
          marginBottom: "8px",
        }}
      >
        Servicios
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {restaurantServices.map(({ icon, label }) => (
          <Chip
            key={label}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {icon} {label}
              </Box>
            }
            onClick={() => handleTagClick("restaurantServices", label)}
            variant={
              selectedRestaurantTags.restaurantServices.includes(label)
                ? "filled"
                : "outlined"
            }
            sx={{
              backgroundColor:
                selectedRestaurantTags.restaurantServices.includes(label)
                  ? theme.palette.info.main // ✅ Blue for services
                  : theme.palette.secondary.lightBlue,
              color: selectedRestaurantTags.restaurantServices.includes(label)
                ? "white"
                : theme.palette.text.primary,
              border: `1.5px solid ${theme.palette.info.light}`,
              borderRadius: "16px",
              padding: "8px",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: theme.palette.info.light,
                color: "white",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default RestaurantTags;
