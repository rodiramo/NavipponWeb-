import React from "react";
import {
  MdOutlineForest,
  MdOutlineBeachAccess,
  MdOutlineRamenDining,
  MdOutlineCoffee,
  MdOutlineShoppingBag,
  MdOutlineTempleBuddhist,
  MdOutlineTempleHindu,
  MdOutlineHotTub,
  MdOutlineCastle,
} from "react-icons/md";
import { TbBuildingMonument, TbTorii } from "react-icons/tb";
import { LiaCocktailSolid, LiaGamepadSolid } from "react-icons/lia";
import {
  GiGreekTemple,
  GiPartyPopper,
  GiSamuraiHelmet,
  GiGrapes,
} from "react-icons/gi";
import { FaRegStar } from "react-icons/fa";
import { BsRobot } from "react-icons/bs";
import { VscOctoface } from "react-icons/vsc";
import { LuFerrisWheel } from "react-icons/lu";
import { PiBirdBold, PiCross } from "react-icons/pi";
import { Chip, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Define attraction tags **OUTSIDE** the component
const attractionTags = [
  { icon: <MdOutlineForest />, title: "Naturaleza" },
  { icon: <MdOutlineBeachAccess />, title: "Playa" },
  { icon: <TbBuildingMonument />, title: "Monumento" },
  { icon: <MdOutlineRamenDining />, title: "Gastronomía" },
  { icon: <LiaCocktailSolid />, title: "Noche" },
  { icon: <GiGreekTemple />, title: "Museo" },
  { icon: <MdOutlineCoffee />, title: "Cafés" },
  { icon: <MdOutlineShoppingBag />, title: "Shopping" },
  { icon: <FaRegStar />, title: "Ocio" },
  { icon: <GiPartyPopper />, title: "Festival" },
  { icon: <BsRobot />, title: "Tecnología" },
  { icon: <LiaGamepadSolid />, title: "Juegos" },
  { icon: <VscOctoface />, title: "Anime" },
  { icon: <LuFerrisWheel />, title: "Parques temáticos" },
  { icon: <GiSamuraiHelmet />, title: "Samurai" },
  { icon: <MdOutlineTempleBuddhist />, title: "Templo Budista" },
  { icon: <PiBirdBold />, title: "Reserva de Aves" },
  { icon: <MdOutlineCastle />, title: "Castillos" },
  { icon: <PiCross />, title: "Templo Cristiano" },
  { icon: <TbTorii />, title: "Templo Sintoísta" },
  { icon: <MdOutlineTempleHindu />, title: "Templo Hindú" },
  { icon: <MdOutlineHotTub />, title: "Aguas Termales" },
  { icon: <GiGrapes />, title: "Viñedos" },
];

const AttractionTags = ({
  selectedAttractionTags,
  setSelectedAttractionTags,
}) => {
  const theme = useTheme();

  const handleTagClick = (tagTitle) => {
    setSelectedAttractionTags(
      (prevTags) =>
        prevTags.includes(tagTitle)
          ? prevTags.filter((tag) => tag !== tagTitle) // Deselect if already selected
          : [...prevTags, tagTitle] // Select otherwise
    );
  };

  return (
    <Box className="mb-5 mt-2">
      <Typography
        sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
      >
        Etiquetas de Atractivos
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: "8px" }}>
        {attractionTags.map(({ title, icon }) => (
          <Chip
            key={title}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {icon} {title}
              </Box>
            }
            onClick={() => handleTagClick(title)}
            variant={
              selectedAttractionTags.includes(title) ? "filled" : "outlined"
            }
            sx={{
              backgroundColor: selectedAttractionTags.includes(title)
                ? theme.palette.secondary.main
                : theme.palette.secondary.bg,
              color: selectedAttractionTags.includes(title)
                ? "white"
                : theme.palette.text.primary,
              border: `1.5px solid ${theme.palette.secondary.light}`,
              borderRadius: "16px",
              padding: "8px",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: theme.palette.secondary.light,
                color: "black",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AttractionTags;
