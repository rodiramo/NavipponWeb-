import React from "react";
import {
  FaHotel,
  FaCapsules,
  FaBuilding,
  FaHome,
  FaWifi,
  FaParking,
  FaSwimmer,
  FaDumbbell,
  FaUtensils,
  FaWheelchair,
  FaDog,
  FaHeart,
  FaBriefcase,
  FaHiking,
  FaMountain,
} from "react-icons/fa";
import { GiBed } from "react-icons/gi";
import {
  MdOutlineSpa,
  MdFreeBreakfast,
  MdAirportShuttle,
} from "react-icons/md";
import { Chip, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Data for hotel tags
const accommodation = [
  { icon: <FaHotel />, label: "Hoteles de lujo" },
  { icon: <MdOutlineSpa />, label: "Ryokan (tradicional)" },
  { icon: <FaCapsules />, label: "Hoteles cápsula" },
  { icon: <FaBuilding />, label: "Hoteles de negocios" },
  { icon: <FaHome />, label: "Apartamentos" },
  { icon: <GiBed />, label: "Hostales" },
];

const hotelServices = [
  { icon: <FaWifi />, label: "Wi-Fi gratis" },
  { icon: <MdFreeBreakfast />, label: "Desayuno incluido" },
  { icon: <FaParking />, label: "Aparcamiento gratuito" },
  { icon: <MdAirportShuttle />, label: "Transporte al aeropuerto" },
  { icon: <FaSwimmer />, label: "Piscina" },
  { icon: <FaDumbbell />, label: "Gimnasio" },
  { icon: <FaUtensils />, label: "Restaurante en el hotel" },
  { icon: <FaWheelchair />, label: "Accesible" },
  { icon: <FaDog />, label: "Admite mascotas" },
];

const typeTrip = [
  { icon: <FaHeart />, label: "Luna de miel" },
  { icon: <FaBriefcase />, label: "De negocios" },
  { icon: <FaHiking />, label: "Amigable para mochileros" },
  { icon: <FaMountain />, label: "Para aventureros" },
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
        Tipos de alojamiento
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
        Servicios del hotel
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
        Tipo de viaje
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
