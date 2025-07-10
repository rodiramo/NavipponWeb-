import React from "react";
import { Chip, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Soup,
  Truck,
  Coffee,
  Crown,
  Wine,
  Users,
  Bell,
  Building2,
  Camera,
  Fish,
  Beef,
  Flame,
  CookingPot,
  Wheat,
  Utensils,
  Globe,
  UtensilsCrossed,
  Pizza,
  Milk,
  Salad,
  Shield,
  Heart,
  Baby,
  Wifi,
  Calendar,
  ShoppingBag,
  Leaf,
  Music,
  CreditCard,
  Clock,
  Briefcase,
  Sparkles,
  Mic,
  Dog,
} from "lucide-react";

// Icon size constant for consistency
const ICON_SIZE = 20;

// EXPANDED: Complete restaurant types with icons
const restaurantTypes = [
  {
    icon: <Soup size={ICON_SIZE} />,
    label: "Restaurantes tradicionales japoneses",
  },
  { icon: <Truck size={ICON_SIZE} />, label: "Cadenas de comida rápida" },
  { icon: <Coffee size={ICON_SIZE} />, label: "Cafeterías y cafés" },
  { icon: <Crown size={ICON_SIZE} />, label: "Restaurantes de alta cocina" },
  { icon: <Truck size={ICON_SIZE} />, label: "Food trucks" },
  { icon: <Wine size={ICON_SIZE} />, label: "Izakaya (tabernas)" },
  { icon: <Users size={ICON_SIZE} />, label: "Restaurantes familiares" },
  {
    icon: <Bell size={ICON_SIZE} />,
    label: "Kaiseki (alta cocina tradicional)",
  },
  {
    icon: <Building2 size={ICON_SIZE} />,
    label: "Restaurantes en rascacielos",
  },
  { icon: <Camera size={ICON_SIZE} />, label: "Restaurantes con vista" },
];

// EXPANDED: Complete cuisines with specific icons
const cuisines = [
  // Japanese Traditional
  { icon: <Fish size={ICON_SIZE} />, label: "Sushi y sashimi" },
  { icon: <Soup size={ICON_SIZE} />, label: "Ramen" },
  { icon: <Fish size={ICON_SIZE} />, label: "Tempura" },
  { icon: <Beef size={ICON_SIZE} />, label: "Yakitori" },
  { icon: <Flame size={ICON_SIZE} />, label: "Yakiniku (barbacoa)" },
  { icon: <CookingPot size={ICON_SIZE} />, label: "Shabu-shabu/Sukiyaki" },
  { icon: <Wheat size={ICON_SIZE} />, label: "Udon y soba" },
  { icon: <Soup size={ICON_SIZE} />, label: "Donburi (platos sobre arroz)" },
  { icon: <Utensils size={ICON_SIZE} />, label: "Kaiseki" },
  { icon: <Soup size={ICON_SIZE} />, label: "Bento boxes" },

  // International
  { icon: <Globe size={ICON_SIZE} />, label: "Internacional" },
  {
    icon: <UtensilsCrossed size={ICON_SIZE} />,
    label: "Fusión japonesa-occidental",
  },
  { icon: <Pizza size={ICON_SIZE} />, label: "Cocina italiana" },
  { icon: <Milk size={ICON_SIZE} />, label: "Cocina francesa" },
  { icon: <Wheat size={ICON_SIZE} />, label: "Cocina china" },
  { icon: <Soup size={ICON_SIZE} />, label: "Cocina coreana" },
  { icon: <Soup size={ICON_SIZE} />, label: "Cocina tailandesa" },
  { icon: <Soup size={ICON_SIZE} />, label: "Cocina india" },

  // Special Diets
  { icon: <Salad size={ICON_SIZE} />, label: "Vegetariana/Vegana" },
  { icon: <Wheat size={ICON_SIZE} />, label: "Sin gluten" },
  { icon: <Shield size={ICON_SIZE} />, label: "Halal" },
  { icon: <Shield size={ICON_SIZE} />, label: "Kosher" },
  { icon: <Heart size={ICON_SIZE} />, label: "Comida saludable" },
  { icon: <Baby size={ICON_SIZE} />, label: "Apto para niños" },
];

// EXPANDED: Complete restaurant services with icons
const restaurantServices = [
  { icon: <Wifi size={ICON_SIZE} />, label: "Wi-Fi gratis" },
  { icon: <Globe size={ICON_SIZE} />, label: "Menú en inglés" },
  { icon: <Calendar size={ICON_SIZE} />, label: "Reservas en línea" },
  { icon: <Truck size={ICON_SIZE} />, label: "Entrega a domicilio" },
  { icon: <ShoppingBag size={ICON_SIZE} />, label: "Para llevar" },
  { icon: <Flame size={ICON_SIZE} />, label: "Terraza exterior" },
  { icon: <Dog size={ICON_SIZE} />, label: "Admite mascotas" },
  { icon: <Leaf size={ICON_SIZE} />, label: "Ingredientes orgánicos" },
  { icon: <Fish size={ICON_SIZE} />, label: "Mariscos frescos diarios" },
  { icon: <Baby size={ICON_SIZE} />, label: "Menús infantiles" },
  { icon: <Wine size={ICON_SIZE} />, label: "Servicio de sommelier" },
  { icon: <Music size={ICON_SIZE} />, label: "Música en vivo" },
  {
    icon: <CreditCard size={ICON_SIZE} />,
    label: "Acepta tarjetas extranjeras",
  },
  { icon: <Clock size={ICON_SIZE} />, label: "Abierto 24 horas" },
  { icon: <Users size={ICON_SIZE} />, label: "Ideal para grupos" },
  { icon: <Heart size={ICON_SIZE} />, label: "Ambiente romántico" },
  { icon: <Briefcase size={ICON_SIZE} />, label: "Reuniones de negocios" },
  { icon: <Sparkles size={ICON_SIZE} />, label: "Celebraciones especiales" },
  { icon: <Camera size={ICON_SIZE} />, label: "Instagram-worthy" },
  { icon: <Mic size={ICON_SIZE} />, label: "Karaoke disponible" },
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
        Tipos de restaurantes ({restaurantTypes.length} opciones)
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {restaurantTypes.map(({ icon, label }) => (
          <Chip
            key={label}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {icon} {label}
              </Box>
            }
            onClick={() => handleTagClick("restaurantTypes", label)}
            variant={
              selectedRestaurantTags.restaurantTypes.includes(label)
                ? "filled"
                : "outlined"
            }
            sx={{
              backgroundColor: selectedRestaurantTags.restaurantTypes.includes(
                label
              )
                ? theme.palette.success.medium // ✅ Green for restaurant types
                : theme.palette.success.lightest,
              color: selectedRestaurantTags.restaurantTypes.includes(label)
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
        Cocinas ({cuisines.length} opciones)
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {cuisines.map(({ icon, label }) => (
          <Chip
            key={label}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {icon} {label}
              </Box>
            }
            onClick={() => handleTagClick("cuisines", label)}
            variant={
              selectedRestaurantTags.cuisines.includes(label)
                ? "filled"
                : "outlined"
            }
            sx={{
              backgroundColor: selectedRestaurantTags.cuisines.includes(label)
                ? theme.palette.warning.light // ✅ Yellow for cuisines
                : theme.palette.warning.lightest,
              color: selectedRestaurantTags.cuisines.includes(label)
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
        Servicios ({restaurantServices.length} opciones)
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
