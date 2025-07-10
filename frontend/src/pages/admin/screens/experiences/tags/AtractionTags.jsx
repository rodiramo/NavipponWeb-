import {
  MdOutlineForest,
  MdOutlineBeachAccess,
  MdOutlineRamenDining,
  MdOutlineCoffee,
  MdOutlineShoppingBag,
  MdOutlineTempleBuddhist,
  MdOutlineHotTub,
  MdOutlineCastle,
  MdOutlineDownhillSkiing,
  MdOutlineDirectionsBike,
  MdOutlinePhotoCamera,
  MdLocalBar,
  MdNightlife,
  MdAutoStories,
  MdPhoneAndroid,
  MdCheckroom,
  MdOutlineStore,
  MdOutlineIceSkating,
  MdOutlineBook,
} from "react-icons/md";
import { CgCardHearts } from "react-icons/cg";

import {
  TbBuildingMonument,
  TbTorii,
  TbMountain,
  TbTrekking,
  TbTent,
  TbKayak,
  TbParachute,
  TbSailboat,
  TbBrandSurfshark,
  TbSpeedboat,
  TbFish,
  TbActivity,
} from "react-icons/tb";
import { LiaCocktailSolid, LiaSwimmerSolid } from "react-icons/lia";
import { GiGreekTemple, GiWaterfall, GiBookshelf } from "react-icons/gi";
import { FaRegStar } from "react-icons/fa";
import { BsRobot, BsSnow } from "react-icons/bs";
import { LuFerrisWheel, LuWaves, LuTrees } from "react-icons/lu";
import { PiBinocularsBold } from "react-icons/pi";
import { RiSunLine } from "react-icons/ri";
import { FiWatch } from "react-icons/fi";
import {
  Chip,
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  MoonStar,
  LibraryBig,
  Grape,
  CableCar,
  Fish,
  Baby,
  Guitar,
  Sword,
  Camera,
  Flower,
  Banana,
  Ship,
  Store,
  Gift,
  Origami,
  Bot,
  MicVocal,
  BookOpenText,
  PartyPopper,
  Gamepad2,
  FishSymbol,
  Leaf,
  Mountain,
} from "lucide-react";

// Icon size constant to ensure consistency
const ICON_SIZE = 20;

// Complete attraction tags organized by category
const attractionTags = [
  // Nature & Outdoor Activities
  { icon: <MdOutlineForest size={ICON_SIZE} />, title: "Bosques y naturaleza" },
  { icon: <LuTrees size={ICON_SIZE} />, title: "Parques nacionales" },
  { icon: <TbMountain size={ICON_SIZE} />, title: "Montañas y senderismo" },
  { icon: <TbMountain size={ICON_SIZE} />, title: "Escalada en roca" },
  {
    icon: <MdOutlineDirectionsBike size={ICON_SIZE} />,
    title: "Ciclismo y rutas en bici",
  },
  { icon: <TbTrekking size={ICON_SIZE} />, title: "Trekking y mochileo" },
  { icon: <TbTent size={ICON_SIZE} />, title: "Camping y glamping" },
  { icon: <PiBinocularsBold size={ICON_SIZE} />, title: "Observación de aves" },
  {
    icon: <MdOutlinePhotoCamera size={ICON_SIZE} />,
    title: "Fotografía de naturaleza",
  },
  {
    icon: <TbParachute size={ICON_SIZE} />,
    title: "Parapente y deportes aéreos",
  },
  { icon: <CableCar size={ICON_SIZE} />, title: "Zip-lining y tirolinas" },

  // Water & Beach Activities
  { icon: <MdOutlineBeachAccess size={ICON_SIZE} />, title: "Playas" },
  { icon: <LuWaves size={ICON_SIZE} />, title: "Ríos y lagos" },
  { icon: <TbBrandSurfshark size={ICON_SIZE} />, title: "Surf y bodyboard" },
  { icon: <LiaSwimmerSolid size={ICON_SIZE} />, title: "Natación" },
  { icon: <TbKayak size={ICON_SIZE} />, title: "Kayak y canoa" },
  { icon: <Ship size={ICON_SIZE} />, title: "Paseos en barco" },
  { icon: <TbSailboat size={ICON_SIZE} />, title: "Vela y navegación" },
  { icon: <TbFish size={ICON_SIZE} />, title: "Pesca deportiva" },
  {
    icon: <TbSpeedboat size={ICON_SIZE} />,
    title: "Jet ski y motos acuáticas",
  },
  {
    icon: <GiWaterfall size={ICON_SIZE} />,
    title: "Cascadas y saltos de agua",
  },
  { icon: <TbActivity size={ICON_SIZE} />, title: "Buceo y snorkel" },
  {
    icon: <MdOutlineHotTub size={ICON_SIZE} />,
    title: "Aguas termales (Onsen)",
  },

  // Wildlife & Adventure
  { icon: <Banana size={ICON_SIZE} />, title: "Parques de monos" },
  { icon: <TbFish size={ICON_SIZE} />, title: "Acuarios y vida marina" },
  { icon: <Camera size={ICON_SIZE} />, title: "Safaris fotográficos" },
  { icon: <Fish size={ICON_SIZE} />, title: "Observación de ballenas" },
  { icon: <MoonStar size={ICON_SIZE} />, title: "Caminatas nocturnas" },

  // Seasonal Nature & Activities
  { icon: <Flower size={ICON_SIZE} />, title: "Jardines de sakura" },
  { icon: <Flower size={ICON_SIZE} />, title: "Jardines botánicos" },
  {
    icon: <Leaf size={ICON_SIZE} />,
    title: "Observación de hojas otoñales (Koyo)",
  },
  {
    icon: <MdOutlineDownhillSkiing size={ICON_SIZE} />,
    title: "Esquí y snowboard",
  },
  { icon: <BsSnow size={ICON_SIZE} />, title: "Festivales de nieve" },
  {
    icon: <RiSunLine size={ICON_SIZE} />,
    title: "Festivales de verano (Matsuri)",
  },
  {
    icon: <MdOutlineIceSkating size={ICON_SIZE} />,
    title: "Patinaje sobre hielo",
  },
  { icon: <Mountain size={ICON_SIZE} />, title: "Escalada en hielo" },

  // Culture & History
  {
    icon: <TbBuildingMonument size={ICON_SIZE} />,
    title: "Monumentos históricos",
  },
  { icon: <MdOutlineCastle size={ICON_SIZE} />, title: "Castillos" },
  { icon: <TbTorii size={ICON_SIZE} />, title: "Templos sintoístas" },
  {
    icon: <MdOutlineTempleBuddhist size={ICON_SIZE} />,
    title: "Templos budistas",
  },
  { icon: <GiGreekTemple size={ICON_SIZE} />, title: "Museos de arte" },
  { icon: <BsRobot size={ICON_SIZE} />, title: "Museos de ciencia" },
  { icon: <Sword size={ICON_SIZE} />, title: "Cultura samurai" },
  { icon: <MdOutlineBook size={ICON_SIZE} />, title: "Sitios literarios" },

  // Modern Culture & Entertainment
  { icon: <Origami size={ICON_SIZE} />, title: "Anime y manga" },
  { icon: <BookOpenText size={ICON_SIZE} />, title: "Tiendas de manga" },
  {
    icon: <CgCardHearts size={ICON_SIZE} />,
    title: "Figuras y coleccionables",
  },
  { icon: <Gamepad2 size={ICON_SIZE} />, title: "Arcades y videojuegos" },
  { icon: <MicVocal size={ICON_SIZE} />, title: "Karaoke" },
  { icon: <Bot size={ICON_SIZE} />, title: "Tecnología y robots" },
  { icon: <Camera size={ICON_SIZE} />, title: "Estudios de foto/cosplay" },

  // Nightlife & Entertainment
  { icon: <MdLocalBar size={ICON_SIZE} />, title: "Bares y pubs" },
  { icon: <MdNightlife size={ICON_SIZE} />, title: "Clubes nocturnos" },
  { icon: <LiaCocktailSolid size={ICON_SIZE} />, title: "Bares temáticos" },
  { icon: <MicVocal size={ICON_SIZE} />, title: "Música en vivo" },
  { icon: <Guitar size={ICON_SIZE} />, title: "Jazz bars" },

  // Shopping
  { icon: <Store size={ICON_SIZE} />, title: "Centros comerciales" },
  {
    icon: <MdOutlineStore size={ICON_SIZE} />,
    title: "Tiendas de segunda mano",
  },
  { icon: <MdCheckroom size={ICON_SIZE} />, title: "Moda y ropa" },
  { icon: <MdPhoneAndroid size={ICON_SIZE} />, title: "Electrónicos" },
  { icon: <FiWatch size={ICON_SIZE} />, title: "Relojes y joyería" },
  { icon: <Gift size={ICON_SIZE} />, title: "Souvenirs únicos" },
  { icon: <LibraryBig size={ICON_SIZE} />, title: "Librerías especializadas" },

  // Food & Drink
  {
    icon: <MdOutlineRamenDining size={ICON_SIZE} />,
    title: "Gastronomía local",
  },
  { icon: <MdOutlineCoffee size={ICON_SIZE} />, title: "Cafés temáticos" },
  { icon: <FishSymbol size={ICON_SIZE} />, title: "Mercados de pescado" },
  { icon: <Grape size={ICON_SIZE} />, title: "Viñedos y sake" },

  // Family & Special Interests
  { icon: <LuFerrisWheel size={ICON_SIZE} />, title: "Parques temáticos" },
  { icon: <Baby size={ICON_SIZE} />, title: "Apto para niños" },
  { icon: <PartyPopper size={ICON_SIZE} />, title: "Festivales estacionales" },
  { icon: <PartyPopper size={ICON_SIZE} />, title: "Eventos especiales" },
  { icon: <FaRegStar size={ICON_SIZE} />, title: "Experiencias únicas" },
];

const AttractionTags = ({
  selectedAttractionTags,
  setSelectedAttractionTags,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const handleTagClick = (tagTitle) => {
    setSelectedAttractionTags(
      (prevTags) =>
        prevTags.includes(tagTitle)
          ? prevTags.filter((tag) => tag !== tagTitle) // Deselect if already selected
          : [...prevTags, tagTitle] // Select otherwise
    );
  };

  // Filter tags based on search term
  const filteredTags = attractionTags.filter((tag) =>
    tag.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="mb-5 mt-2">
      <Typography
        sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
      >
        Etiquetas de atractivos ({filteredTags.length} de{" "}
        {attractionTags.length} opciones)
      </Typography>

      {/* Search Input */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar categorías..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={20} color={theme.palette.text.secondary} />
            </InputAdornment>
          ),
        }}
        sx={{
          marginTop: "8px",
          marginBottom: "12px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: theme.palette.background.paper,
            "& fieldset": {
              borderColor: theme.palette.divider,
            },
            "&:hover fieldset": {
              borderColor: theme.palette.secondary.light,
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.secondary.main,
            },
          },
        }}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {filteredTags.map(({ title, icon }) => (
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

      {/* Show message when no results found */}
      {filteredTags.length === 0 && (
        <Typography
          sx={{
            textAlign: "center",
            color: theme.palette.text.secondary,
            fontStyle: "italic",
            marginTop: "16px",
          }}
        >
          No se encontraron categorías que coincidan con "{searchTerm}"
        </Typography>
      )}
    </Box>
  );
};

export default AttractionTags;
