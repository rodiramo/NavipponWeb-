import React, { useState } from "react";
import * as TbIcons from "react-icons/tb";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import { BiSushi } from "react-icons/bi";
import { MdOutlineRamenDining } from "react-icons/md";
import * as PiIcons from "react-icons/pi";
import { TbBeach } from "react-icons/tb";
import { BiCapsule } from "react-icons/bi";

import {
  Leaf,
  Sun,
  Flower2,
  Snowflake,
  Cat,
  Dog,
  Microwave,
  Trees,
  Wifi,
  Sandwich,
  MountainSnow,
  Dumbbell,
  Baby,
  Backpack,
  Accessibility,
  Truck,
  ShoppingBag,
  Utensils,
  CircleParking,
  Infinity,
  Beef,
  EggFried,
  CircleCheck,
  Hotel,
  RotateCcw,
  Bed,
  Eye,
  Earth,
  Ham,
  CookingPot,
  Store,
  Blocks,
  BriefcaseBusiness,
  Coffee,
  Amphora,
  Martini,
  PiggyBank,
  Coins,
  Castle,
  CircleDollarSign,
  HandHelping,
  Gamepad2,
  Plane,
  Church,
  Waves,
  Bot,
  WheatOff,
  PartyPopper,
  MapPinHouse,
  FerrisWheel,
  ChefHat,
  Carrot,
  Vegan,
  Grape,
  BusFront,
  WavesLadder,
  Globe,
  Pizza,
  Fish,
  Heart,
  TrainFront,
  Languages,
} from "lucide-react";
import { MapPin, Filter, ChevronDown } from "lucide-react";
import {
  useTheme,
  Button,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Chip,
  Stack,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { Business } from "@mui/icons-material";

const regions = [
  "Hokkaido",
  "Tohoku",
  "Kanto",
  "Chubu",
  "Kansai",
  "Chugoku",
  "Shikoku",
  "Kyushu",
];

const generalTags = {
  season: [
    { icon: <Flower2 />, title: "Primavera" },
    { icon: <Sun />, title: "Verano" },
    { icon: <Leaf />, title: "Otoño" },
    { icon: <Snowflake />, title: "Invierno" },
    { icon: <Infinity />, title: "Todo el año" },
  ],
  budget: [
    { icon: <HandHelping />, title: "Gratis" },
    { icon: <PiggyBank />, title: "Económico" },
    { icon: <CircleDollarSign />, title: "Moderado" },
    { icon: <Coins />, title: "Lujo" },
  ],
  location: [
    { icon: <TrainFront />, title: "Cerca de estaciones de tren o metro" },
    { icon: <Plane />, title: "Cerca de aeropuertos" },
    {
      icon: <MapPinHouse />,
      title: "Cerca de áreas de puntos de interés",
    },
  ],
};

const hotelTags = {
  accommodations: [
    { icon: <Hotel />, title: "Hoteles de lujo" },
    { icon: <MdIcons.MdOutlineSpa size={24} />, title: "Ryokan (tradicional)" },
    { icon: <BiCapsule size={26} />, title: "Hoteles cápsula" },
    { icon: <BriefcaseBusiness />, title: "Hoteles de negocios" },
    { icon: <Bed />, title: "Hostales" },
  ],
  hotelServices: [
    { icon: <Wifi />, title: "Wi-Fi gratis" },
    { icon: <EggFried />, title: "Desayuno incluido" },
    { icon: <CircleParking />, title: "Aparcamiento gratuito" },
    { icon: <BusFront />, title: "Transporte al aeropuerto" },
    { icon: <WavesLadder />, title: "Piscina" },
    { icon: <Dumbbell />, title: "Gimnasio" },
    { icon: <Utensils />, title: "Restaurante en el hotel" },
    { icon: <Accessibility />, title: "Accesible" },
    { icon: <Dog />, title: "Admite mascotas" },
  ],
  typeTrip: [
    { icon: <Baby />, title: "Familiar" },
    { icon: <Heart />, title: "Luna de miel" },
    { icon: <BriefcaseBusiness />, title: "De negocios" },
    {
      icon: <Backpack />,
      title: "Amigable para mochileros",
    },
    { icon: <MountainSnow />, title: "Para aventureros" },
  ],
};

const attractionTags = [
  { icon: <Trees />, title: "Naturaleza" },
  { icon: <TbBeach size={24} />, title: "Playa" },
  { icon: <TbIcons.TbBuildingMonument size={24} />, title: "Monumento" },
  { icon: <CookingPot />, title: "Gastronomía" },
  { icon: <Martini />, title: "Noche" },
  { icon: <Amphora />, title: "Museo" },
  { icon: <Coffee />, title: "Cafés" },
  { icon: <Store />, title: "Shopping" },
  { icon: <Blocks />, title: "Ocio" },
  { icon: <PartyPopper />, title: "Festival" },
  { icon: <Bot />, title: "Tecnología" },
  { icon: <Gamepad2 />, title: "Juegos" },
  { icon: <Cat />, title: "Anime" },
  { icon: <FerrisWheel />, title: "Parques temáticos" },
  {
    icon: <MdIcons.MdOutlineTempleBuddhist size={24} />,
    title: "Templo Budista",
  },
  { icon: <PiIcons.PiBirdBold size={24} />, title: "Reserva de Aves" },
  { icon: <Castle />, title: "Castillos" },
  { icon: <Church />, title: "Templo Cristiano" },
  { icon: <TbIcons.TbTorii size={24} />, title: "Templo Sintoísta" },
  { icon: <MdIcons.MdOutlineTempleHindu size={24} />, title: "Templo Hindú" },
  { icon: <Waves />, title: "Aguas Termales" },
  { icon: <Grape />, title: "Viñedos" },
];

const restaurantTags = {
  restaurantTypes: [
    {
      icon: <ChefHat />,
      title: "Restaurantes tradicionales",
    },
    { icon: <Pizza />, title: "Cadenas de comida rápida" },
    { icon: <Sandwich />, title: "Cafeterías y cafés" },
    {
      icon: <Beef />,
      title: "Restaurantes de alta cocina",
    },
    { icon: <Microwave />, title: "Food trucks" },
    { icon: <MdOutlineRamenDining size={25} />, title: "Ramen" },
    { icon: <BiSushi size={25} />, title: "Sushi" },
  ],
  cuisines: [
    { icon: <Carrot />, title: "Cocina vegetariana" },
    { icon: <Vegan />, title: "Cocina vegana" },
    { icon: <WheatOff />, title: "Cocina sin gluten" },
    {
      icon: <MdOutlineRamenDining size={25} />,
      title: "Cocina japonesa tradicional",
    },
    { icon: <Eye />, title: "Con espectáculo" },
    { icon: <Earth />, title: "Internacional" },
    { icon: <Ham />, title: "Cocina halal" },
    { icon: <Pizza />, title: "Rápida" },
    { icon: <Baby />, title: "Familiar" },
    { icon: <Heart />, title: "Romántica" },
    { icon: <Business />, title: "Negocios" },
  ],
  restaurantServices: [
    { icon: <Wifi />, title: "Wi-Fi gratis" },
    { icon: <Languages />, title: "Menú en inglés" },
    { icon: <Globe />, title: "Reservas en línea" },
    { icon: <Truck />, title: "Entregas a domicilio" },
    { icon: <FaIcons.FaUtensils />, title: "Comedor al aire libre" },
    { icon: <ShoppingBag />, title: "Comida para llevar" },
    { icon: <Dog />, title: "Admite mascotas" },
    { icon: <Leaf />, title: "Ingredientes orgánicos" },
    { icon: <Fish />, title: "Mariscos frescos" },
    { icon: <Baby />, title: "Menús infantiles" },
  ],
};

const Aside = ({ onFilterChange, selectedFilter }) => {
  const theme = useTheme();
  const [selectedFilters, setSelectedFilters] = useState({
    region: "",
    tags: [],
  });

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const handleTagChange = (tag) => {
    const newTags = selectedFilters.tags.includes(tag)
      ? selectedFilters.tags.filter((t) => t !== tag)
      : [...selectedFilters.tags, tag];
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      tags: newTags,
    }));
  };

  const applyFilters = () => {
    const formattedFilters = {
      ...selectedFilters,
      category: selectedFilter !== "todo" ? selectedFilter : undefined,
      tags: selectedFilters.tags.length > 0 ? selectedFilters.tags : [],
    };

    console.log("Applying filters:", formattedFilters);
    onFilterChange(formattedFilters, "resultados");
  };

  const clearFilters = () => {
    const clearedFilters = {
      region: "",
      tags: [],
    };
    setSelectedFilters(clearedFilters);
    console.log("Clearing filters:", clearedFilters);
    onFilterChange({}, "todo", true);
  };

  const FilterCheckbox = ({ tag, isChecked, onChange }) => (
    <FormControlLabel
      control={
        <Checkbox
          checked={isChecked}
          onChange={onChange}
          sx={{
            marginRight: 1,
            color: theme.palette.primary.main,
            "&.Mui-checked": {
              color: theme.palette.primary.main,
            },
            "&:hover": {
              backgroundColor: `${theme.palette.primary.light}`,
            },
          }}
        />
      }
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "fit-content",
          }}
        >
          <Box
            sx={{
              color: theme.palette.primary.main,
              display: "flex",
              alignItems: "center",
              fontSize: "18px",
            }}
          >
            {tag.icon}
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.primary,
              fontSize: "0.875rem",
            }}
          >
            {tag.title}
          </Typography>
        </Box>
      }
      sx={{
        width: "100%",
        margin: 0,
        padding: "4px 0",
        "&:hover": {
          backgroundColor: `${theme.palette.primary.light}`,
          borderRadius: 1,
        },
        transition: "background-color 0.2s ease-in-out",
      }}
    />
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", md: "320px" },
        backgroundColor: theme.palette.background.default,
        borderRadius: 2,
        p: 3,
        height: "fit-content",
        border: `1px solid ${
          theme.palette.neutral?.light || theme.palette.grey[200]
        }`,
        boxShadow: theme.shadows[2],
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Filter sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.primary.main,

            fontSize: "1.25rem",
          }}
        >
          Filtros
        </Typography>
      </Box>

      {/* Active Filters Display */}
      {selectedFilters.tags.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Filtros activos:
          </Typography>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ flexWrap: "wrap", gap: 0.5 }}
          >
            {selectedFilters.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                onDelete={() => handleTagChange(tag)}
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.main,
                  fontSize: "0.75rem",
                }}
              />
            ))}
            {selectedFilters.tags.length > 3 && (
              <Chip
                label={`+${selectedFilters.tags.length - 3} más`}
                size="small"
                sx={{
                  backgroundColor: theme.palette.secondary.light,
                  color: theme.palette.secondary.main,
                  fontSize: "0.75rem",
                }}
              />
            )}
          </Stack>
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Region Filter */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          backgroundColor: theme.palette.primary.light,
          border: `1px solid ${theme.palette.primary.main}20`,
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <MapPin size={18} style={{ color: theme.palette.primary.main }} />
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              Región
            </Typography>
          </Box>
          <FormControl fullWidth size="small">
            <Select
              value={selectedFilters.region}
              onChange={(e) => handleFilterChange("region", e.target.value)}
              displayEmpty
              sx={{
                backgroundColor: theme.palette.background.default,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.dark,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                },
              }}
            >
              <MenuItem value="">
                <em>Todas</em>
              </MenuItem>
              {regions.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Filter Sections */}
      <Box sx={{ "& .MuiAccordion-root": { mb: 1 } }}>
        {/* General Filters */}
        <Accordion elevation={0}>
          <AccordionSummary
            expandIcon={
              <ChevronDown sx={{ color: theme.palette.text.primary }} />
            }
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              Filtros generales
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: theme.palette.primary.main,
              }}
            >
              Época del año
            </Typography>
            {generalTags.season.map((tag) => (
              <FilterCheckbox
                key={tag.title}
                tag={tag}
                isChecked={selectedFilters.tags.includes(tag.title)}
                onChange={() => handleTagChange(tag.title)}
              />
            ))}

            <Typography
              variant="body2"
              sx={{
                mt: 2,
                mb: 1,
                color: theme.palette.primary.main,
              }}
            >
              Presupuesto
            </Typography>
            {generalTags.budget.map((tag) => (
              <FilterCheckbox
                key={tag.title}
                tag={tag}
                isChecked={selectedFilters.tags.includes(tag.title)}
                onChange={() => handleTagChange(tag.title)}
              />
            ))}

            <Typography
              variant="body2"
              sx={{
                mt: 2,
                mb: 1,
                color: theme.palette.primary.main,
              }}
            >
              Localización
            </Typography>
            {generalTags.location.map((tag) => (
              <FilterCheckbox
                key={tag.title}
                tag={tag}
                isChecked={selectedFilters.tags.includes(tag.title)}
                onChange={() => handleTagChange(tag.title)}
              />
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Attraction Filters */}
        <Accordion elevation={0}>
          <AccordionSummary
            expandIcon={
              <ChevronDown sx={{ color: theme.palette.text.primary }} />
            }
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              Filtros de atractivos
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1 }}>
            {attractionTags.map((tag) => (
              <FilterCheckbox
                key={tag.title}
                tag={tag}
                isChecked={selectedFilters.tags.includes(tag.title)}
                onChange={() => handleTagChange(tag.title)}
              />
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Hotel Filters */}
        <Accordion elevation={0}>
          <AccordionSummary
            expandIcon={
              <ChevronDown sx={{ color: theme.palette.text.primary }} />
            }
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              Filtros de hoteles
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: theme.palette.primary.main,
              }}
            >
              Acomodación
            </Typography>
            {hotelTags.accommodations.map((tag) => (
              <FilterCheckbox
                key={tag.title}
                tag={tag}
                isChecked={selectedFilters.tags.includes(tag.title)}
                onChange={() => handleTagChange(tag.title)}
              />
            ))}

            <Typography
              variant="body2"
              sx={{
                mt: 2,
                mb: 1,
                color: theme.palette.primary.main,
              }}
            >
              Servicios de hotel
            </Typography>
            {hotelTags.hotelServices.map((tag) => (
              <FilterCheckbox
                key={tag.title}
                tag={tag}
                isChecked={selectedFilters.tags.includes(tag.title)}
                onChange={() => handleTagChange(tag.title)}
              />
            ))}

            <Typography
              variant="body2"
              sx={{
                mt: 2,
                mb: 1,
                color: theme.palette.primary.main,
              }}
            >
              Tipo de viaje
            </Typography>
            {hotelTags.typeTrip.map((tag) => (
              <FilterCheckbox
                key={tag.title}
                tag={tag}
                isChecked={selectedFilters.tags.includes(tag.title)}
                onChange={() => handleTagChange(tag.title)}
              />
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Restaurant Filters */}
        <Accordion elevation={0}>
          <AccordionSummary
            expandIcon={
              <ChevronDown sx={{ color: theme.palette.text.primary }} />
            }
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              Filtros de restaurantes
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: theme.palette.primary.main,
              }}
            >
              Tipos de restaurantes
            </Typography>
            {restaurantTags.restaurantTypes.map((tag) => (
              <FilterCheckbox
                key={tag.title}
                tag={tag}
                isChecked={selectedFilters.tags.includes(tag.title)}
                onChange={() => handleTagChange(tag.title)}
              />
            ))}

            <Typography
              variant="body2"
              sx={{
                mt: 2,
                mb: 1,
                color: theme.palette.primary.main,
              }}
            >
              Tipo de cocina
            </Typography>
            {restaurantTags.cuisines.map((tag) => (
              <FilterCheckbox
                key={tag.title}
                tag={tag}
                isChecked={selectedFilters.tags.includes(tag.title)}
                onChange={() => handleTagChange(tag.title)}
              />
            ))}

            <Typography
              variant="body2"
              sx={{
                mt: 2,
                mb: 1,
                color: theme.palette.primary.main,
              }}
            >
              Servicio de restaurante
            </Typography>
            {restaurantTags.restaurantServices.map((tag) => (
              <FilterCheckbox
                key={tag.title}
                tag={tag}
                isChecked={selectedFilters.tags.includes(tag.title)}
                onChange={() => handleTagChange(tag.title)}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 4,
          flexDirection: "column",
        }}
      >
        <Button
          variant="contained"
          startIcon={<CircleCheck size={24} />}
          onClick={applyFilters}
          fullWidth
          sx={{
            backgroundColor: theme.palette.secondary.medium,
            color: theme.palette.primary.white,
            borderRadius: "25px",
            py: 1.5,
            textTransform: "none",

            boxShadow: theme.shadows[3],
            "&:hover": {
              backgroundColor: theme.palette.secondary.dark,
              transform: "translateY(-1px)",
              boxShadow: theme.shadows[6],
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Aplicar Filtros
        </Button>{" "}
        <Button
          variant="outlined"
          startIcon={<RotateCcw size={24} />}
          onClick={clearFilters}
          fullWidth
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            borderRadius: "25px",
            py: 1.5,
            textTransform: "none",

            "&:hover": {
              backgroundColor: theme.palette.primary.light,
              borderColor: theme.palette.primary.dark,
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Borrar Filtros
        </Button>
      </Box>
    </Box>
  );
};

export default Aside;
