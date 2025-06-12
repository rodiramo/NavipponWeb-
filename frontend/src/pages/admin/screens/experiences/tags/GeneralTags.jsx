import React from "react";
import { FaSnowflake, FaSun, FaLeaf, FaTree } from "react-icons/fa";
import { MdAttachMoney, MdStars, MdLocationOn } from "react-icons/md";
import { Chip, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Updated to match backend expectations
const generalTags = {
  season: [
    { icon: <FaLeaf />, label: "Primavera" },
    { icon: <FaSun />, label: "Verano" },
    { icon: <FaTree />, label: "Otoño" },
    { icon: <FaSnowflake />, label: "Invierno" },
    { icon: <MdStars />, label: "Todo el año" },
  ],
  budget: [
    { icon: <MdAttachMoney />, label: "Gratis" },
    { icon: <MdAttachMoney />, label: "Económico" },
    { icon: <MdAttachMoney />, label: "Moderado" },
    { icon: <MdAttachMoney />, label: "Lujo" },
  ],
  location: [
    { icon: <MdLocationOn />, label: "Cerca de estaciones de tren o metro" },
    { icon: <MdLocationOn />, label: "Cerca de aeropuertos" },
    { icon: <MdLocationOn />, label: "Cerca de áreas de puntos de interés" },
  ],
};

// Updated display names for Spanish UI
const tagDisplayNames = {
  season: "Estación",
  budget: "Presupuesto",
  location: "Ubicación",
};

const GeneralTags = ({ selectedGeneralTags, setSelectedGeneralTags }) => {
  const theme = useTheme();

  const handleChipClick = (tagType, tagValue) => {
    console.log(`Selecting ${tagType}: ${tagValue}`); // Debug log

    setSelectedGeneralTags((prevTags) => ({
      ...prevTags,
      [tagType]: tagValue, // ✅ Single value instead of array
    }));
  };

  console.log("Current selectedGeneralTags:", selectedGeneralTags); // Debug log

  return (
    <Box className="mb-5 mt-2">
      {Object.keys(generalTags).map((tagType) => (
        <Box key={tagType} sx={{ marginBottom: "1rem" }}>
          <Typography
            sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
          >
            {tagDisplayNames[tagType]}
          </Typography>
          <Box
            sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: "8px" }}
          >
            {generalTags[tagType].map(({ label, icon }) => {
              const isSelected = selectedGeneralTags[tagType] === label;

              return (
                <Chip
                  key={label}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {icon} {label}
                    </Box>
                  }
                  onClick={() => handleChipClick(tagType, label)}
                  variant={isSelected ? "filled" : "outlined"}
                  sx={{
                    backgroundColor: isSelected
                      ? theme.palette.primary.main
                      : theme.palette.primary.light,
                    color: isSelected ? "white" : theme.palette.text.primary,
                    border: `1.5px solid ${theme.palette.primary.main}`,
                    borderRadius: "16px",
                    padding: "8px",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.light,
                      color: theme.palette.secondary.dark,
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default GeneralTags;
