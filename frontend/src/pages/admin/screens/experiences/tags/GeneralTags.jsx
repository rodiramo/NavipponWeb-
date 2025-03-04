import React from "react";
import { FaSnowflake, FaSun, FaLeaf, FaTree } from "react-icons/fa";
import { MdAttachMoney, MdStars, MdLocationOn } from "react-icons/md";
import { Chip, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const generalTags = {
  estacion: [
    { icon: <FaLeaf />, label: "Primavera" },
    { icon: <FaSun />, label: "Verano" },
    { icon: <FaTree />, label: "Otoño" },
    { icon: <FaSnowflake />, label: "Invierno" },
    { icon: <MdStars />, label: "Todo el año" },
  ],
  presupuesto: [
    { icon: <MdAttachMoney />, label: "Gratis" },
    { icon: <MdAttachMoney />, label: "Económico" },
    { icon: <MdAttachMoney />, label: "Moderado" },
    { icon: <MdAttachMoney />, label: "Lujo" },
  ],
  ubicacion: [
    { icon: <MdLocationOn />, label: "Cerca de estaciones de tren o metro" },
    { icon: <MdLocationOn />, label: "Cerca de aeropuertos" },
    { icon: <MdLocationOn />, label: "Cerca de áreas de puntos de interés" },
  ],
};

const GeneralTags = ({ selectedGeneralTags, setSelectedGeneralTags }) => {
  const theme = useTheme();

  const handleChipClick = (tagType, tagValue) => {
    setSelectedGeneralTags((prevTags) => ({
      ...prevTags,
      [tagType]: [tagValue], // ✅ Only one selection per category
    }));
  };

  return (
    <Box className="mb-5 mt-2">
      {Object.keys(generalTags).map((tagType) => (
        <Box key={tagType} sx={{ marginBottom: "1rem" }}>
          <Typography
            sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
          >
            {tagType.charAt(0).toUpperCase() + tagType.slice(1)}
          </Typography>
          <Box
            sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: "8px" }}
          >
            {generalTags[tagType].map(({ label, icon }) => (
              <Chip
                key={label}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {icon} {label}
                  </Box>
                }
                onClick={() => handleChipClick(tagType, label)}
                variant={
                  selectedGeneralTags[tagType]?.includes(label)
                    ? "filled"
                    : "outlined"
                }
                sx={{
                  backgroundColor: selectedGeneralTags[tagType]?.includes(label)
                    ? theme.palette.primary.main
                    : theme.palette.primary.light,
                  color: selectedGeneralTags[tagType]?.includes(label)
                    ? "white"
                    : theme.palette.text.primary,
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
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default GeneralTags;
