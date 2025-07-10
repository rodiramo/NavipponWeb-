import React from "react";
import { Chip, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Building,
  Sparkles,
  Bed,
  Building2,
  Home,
  Backpack,
  Mountain,
  Church,
  Crown,
  Trees,
  Tent,
  Waves,
  Plane,
  Wifi,
  Coffee,
  Car,
  Dumbbell,
  Utensils,
  Accessibility,
  Dog,
  Globe,
  Clock,
  Briefcase,
  Baby,
  Heart,
  Users,
  User,
  GraduationCap,
  Camera,
} from "lucide-react";

// Icon size constant for consistency
const ICON_SIZE = 16;

// EXPANDED: Complete accommodation types
const accommodation = [
  {
    icon: <Building size={ICON_SIZE} />,
    label: "Hoteles de lujo occidentales",
  },
  { icon: <Sparkles size={ICON_SIZE} />, label: "Ryokan tradicionales" },
  { icon: <Bed size={ICON_SIZE} />, label: "Hoteles cápsula" },
  { icon: <Building2 size={ICON_SIZE} />, label: "Hoteles de negocios" },
  { icon: <Home size={ICON_SIZE} />, label: "Apartamentos/Airbnb" },
  { icon: <Backpack size={ICON_SIZE} />, label: "Hostales para mochileros" },
  {
    icon: <Mountain size={ICON_SIZE} />,
    label: "Alojamiento rural (Minshuku)",
  },
  { icon: <Church size={ICON_SIZE} />, label: "Estancia en templos (Shukubo)" },
  { icon: <Crown size={ICON_SIZE} />, label: "Hoteles boutique" },
  { icon: <Trees size={ICON_SIZE} />, label: "Cabañas en la naturaleza" },
  { icon: <Tent size={ICON_SIZE} />, label: "Glamping y camping de lujo" },
  { icon: <Waves size={ICON_SIZE} />, label: "Resorts con onsen" },
  { icon: <Waves size={ICON_SIZE} />, label: "Resorts de playa" },
  {
    icon: <Mountain size={ICON_SIZE} />,
    label: "Alojamiento en estaciones de esquí",
  },
];

// EXPANDED: Complete hotel services
const hotelServices = [
  { icon: <Wifi size={ICON_SIZE} />, label: "Wi-Fi gratis" },
  { icon: <Coffee size={ICON_SIZE} />, label: "Desayuno incluido" },
  { icon: <Car size={ICON_SIZE} />, label: "Aparcamiento gratuito" },
  { icon: <Plane size={ICON_SIZE} />, label: "Transporte al aeropuerto" },
  { icon: <Waves size={ICON_SIZE} />, label: "Piscina" },
  { icon: <Dumbbell size={ICON_SIZE} />, label: "Gimnasio" },
  { icon: <Utensils size={ICON_SIZE} />, label: "Restaurante en el hotel" },
  { icon: <Waves size={ICON_SIZE} />, label: "Onsen/Aguas termales" },
  { icon: <Accessibility size={ICON_SIZE} />, label: "Accesible" },
  { icon: <Dog size={ICON_SIZE} />, label: "Admite mascotas" },
  { icon: <Globe size={ICON_SIZE} />, label: "Personal que habla inglés" },
  { icon: <Clock size={ICON_SIZE} />, label: "Check-in 24h" },
  { icon: <Briefcase size={ICON_SIZE} />, label: "Centro de negocios" },
  { icon: <Baby size={ICON_SIZE} />, label: "Servicios para familias" },
  { icon: <Sparkles size={ICON_SIZE} />, label: "Servicio de limpieza diario" },
];

// EXPANDED: Complete trip types
const typeTrip = [
  { icon: <Baby size={ICON_SIZE} />, label: "Viajes familiares" },
  { icon: <Heart size={ICON_SIZE} />, label: "Luna de miel/Romántico" },
  { icon: <Briefcase size={ICON_SIZE} />, label: "Viajes de negocios" },
  { icon: <Backpack size={ICON_SIZE} />, label: "Mochileros/Presupuesto bajo" },
  { icon: <Mountain size={ICON_SIZE} />, label: "Aventureros/Deportes" },
  { icon: <Users size={ICON_SIZE} />, label: "Grupos grandes" },
  { icon: <User size={ICON_SIZE} />, label: "Viajeros solitarios" },
  { icon: <GraduationCap size={ICON_SIZE} />, label: "Viajes educativos" },
  { icon: <Users size={ICON_SIZE} />, label: "Viajeros mayores" },
  { icon: <Crown size={ICON_SIZE} />, label: "Experiencias de lujo" },
  { icon: <Camera size={ICON_SIZE} />, label: "Fotografía/Turismo cultural" },
  { icon: <Sparkles size={ICON_SIZE} />, label: "Celebraciones especiales" },
];

const HotelTags = ({ selectedHotelTags, setSelectedHotelTags }) => {
  const theme = useTheme();

  const handleChipClick = (tagType, tagLabel) => {
    setSelectedHotelTags((prevTags) => ({
      ...prevTags,
      [tagType]: prevTags[tagType].includes(tagLabel)
        ? prevTags[tagType].filter((tag) => tag !== tagLabel)
        : [...prevTags[tagType], tagLabel],
    }));
  };

  return (
    <Box className="mb-5 mt-2">
      {/* Accommodation Type */}
      <Typography
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.primary,
          marginBottom: "8px",
        }}
      >
        Tipos de alojamiento ({accommodation.length} opciones)
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {accommodation.map(({ icon, label }) => (
          <Chip
            key={label}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {icon} {label}
              </Box>
            }
            onClick={() => handleChipClick("accommodation", label)}
            variant={
              selectedHotelTags.accommodation.includes(label)
                ? "filled"
                : "outlined"
            }
            sx={{
              backgroundColor: selectedHotelTags.accommodation.includes(label)
                ? theme.palette.success.medium // ✅ Green for accommodation
                : theme.palette.success.lightest,
              color: selectedHotelTags.accommodation.includes(label)
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

      {/* Hotel Services */}
      <Typography
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.primary,
          marginTop: "16px",
          marginBottom: "8px",
        }}
      >
        Servicios del hotel ({hotelServices.length} opciones)
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {hotelServices.map(({ icon, label }) => (
          <Chip
            key={label}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {icon} {label}
              </Box>
            }
            onClick={() => handleChipClick("hotelServices", label)}
            variant={
              selectedHotelTags.hotelServices.includes(label)
                ? "filled"
                : "outlined"
            }
            sx={{
              backgroundColor: selectedHotelTags.hotelServices.includes(label)
                ? theme.palette.warning.light // ✅ Yellow for hotel services
                : theme.palette.warning.lightest,
              color: selectedHotelTags.hotelServices.includes(label)
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

      {/* Type of Trip */}
      <Typography
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.primary,
          marginTop: "16px",
          marginBottom: "8px",
        }}
      >
        Tipo de viaje ({typeTrip.length} opciones)
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {typeTrip.map(({ icon, label }) => (
          <Chip
            key={label}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {icon} {label}
              </Box>
            }
            onClick={() => handleChipClick("typeTrip", label)}
            variant={
              selectedHotelTags.typeTrip.includes(label) ? "filled" : "outlined"
            }
            sx={{
              backgroundColor: selectedHotelTags.typeTrip.includes(label)
                ? theme.palette.info.main // ✅ Blue for type of trip
                : theme.palette.secondary.lightBlue,
              color: selectedHotelTags.typeTrip.includes(label)
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

export default HotelTags;
