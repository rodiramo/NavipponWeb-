import React, { useState } from "react";
import * as TbIcons from "react-icons/tb";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as LiaIcons from "react-icons/lia";
import * as GiIcons from "react-icons/gi";
import * as BsIcons from "react-icons/bs";
import * as VscIcons from "react-icons/vsc";
import * as LuIcons from "react-icons/lu";
import * as PiIcons from "react-icons/pi";
import { Disclosure } from "@headlessui/react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import {
  MapPin,
  Filter,
  RefreshCw,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
    { icon: <FaIcons.FaLeaf />, title: "Primavera" },
    { icon: <FaIcons.FaSun />, title: "Verano" },
    { icon: <FaIcons.FaTree />, title: "Otoño" },
    { icon: <FaIcons.FaSnowflake />, title: "Invierno" },
    { icon: <MdIcons.MdAllInclusive />, title: "Todo el año" },
  ],
  budget: [
    { icon: <TbIcons.TbCoin />, title: "Gratis" },
    { icon: <TbIcons.TbCoin />, title: "Económico" },
    { icon: <TbIcons.TbCoin />, title: "Moderado" },
    { icon: <TbIcons.TbCoin />, title: "Lujo" },
  ],
  location: [
    { icon: <FaIcons.FaTrain />, title: "Cerca de estaciones de tren o metro" },
    { icon: <FaIcons.FaPlane />, title: "Cerca de aeropuertos" },
    {
      icon: <FaIcons.FaMapMarkerAlt />,
      title: "Cerca de áreas de puntos de interés",
    },
  ],
};

const hotelTags = {
  accommodations: [
    { icon: <FaIcons.FaHotel />, title: "Hoteles de lujo" },
    { icon: <MdIcons.MdOutlineSpa />, title: "Ryokan (tradicional)" },
    { icon: <FaIcons.FaCapsules />, title: "Hoteles cápsula" },
    { icon: <FaIcons.FaBuilding />, title: "Hoteles de negocios" },
    { icon: <FaIcons.FaHome />, title: "Apartamentos" },
    { icon: <GiIcons.GiBed />, title: "Hostales" },
  ],
  hotelServices: [
    { icon: <FaIcons.FaWifi />, title: "Wi-Fi gratis" },
    { icon: <MdIcons.MdFreeBreakfast />, title: "Desayuno incluido" },
    { icon: <FaIcons.FaParking />, title: "Aparcamiento gratuito" },
    { icon: <MdIcons.MdAirportShuttle />, title: "Transporte al aeropuerto" },
    { icon: <FaIcons.FaSwimmer />, title: "Piscina" },
    { icon: <FaIcons.FaDumbbell />, title: "Gimnasio" },
    { icon: <FaIcons.FaUtensils />, title: "Restaurante en el hotel" },
    { icon: <FaIcons.FaWheelchair />, title: "Accesible" },
    { icon: <FaIcons.FaDog />, title: "Admite mascotas" },
  ],
  typeTrip: [
    { icon: <FaIcons.FaChild />, title: "Familiar" },
    { icon: <FaIcons.FaHeart />, title: "Luna de miel" },
    { icon: <FaIcons.FaBriefcase />, title: "De negocios" },
    { icon: <FaIcons.FaHiking />, title: "Amigable para mochileros" },
    { icon: <FaIcons.FaMountain />, title: "Para aventureros" },
  ],
};

const attractionTags = [
  { icon: <MdIcons.MdOutlineForest />, title: "Naturaleza" },
  { icon: <MdIcons.MdOutlineBeachAccess />, title: "Playa" },
  { icon: <TbIcons.TbBuildingMonument />, title: "Monumento" },
  { icon: <MdIcons.MdOutlineRamenDining />, title: "Gastronomía" },
  { icon: <LiaIcons.LiaCocktailSolid />, title: "Noche" },
  { icon: <GiIcons.GiGreekTemple />, title: "Museo" },
  { icon: <MdIcons.MdOutlineCoffee />, title: "Cafés" },
  { icon: <MdIcons.MdOutlineShoppingBag />, title: "Shopping" },
  { icon: <FaIcons.FaRegStar />, title: "Ocio" },
  { icon: <GiIcons.GiPartyPopper />, title: "Festival" },
  { icon: <BsIcons.BsRobot />, title: "Tecnología" },
  { icon: <LiaIcons.LiaGamepadSolid />, title: "Juegos" },
  { icon: <VscIcons.VscOctoface />, title: "Anime" },
  { icon: <LuIcons.LuFerrisWheel />, title: "Parques temáticos" },
  { icon: <GiIcons.GiSamuraiHelmet />, title: "Samurai" },
  { icon: <MdIcons.MdOutlineTempleBuddhist />, title: "Templo Budista" },
  { icon: <PiIcons.PiBirdBold />, title: "Reserva de Aves" },
  { icon: <MdIcons.MdOutlineCastle />, title: "Castillos" },
  { icon: <PiIcons.PiCross />, title: "Templo Cristiano" },
  { icon: <TbIcons.TbTorii />, title: "Templo Sintoísta" },
  { icon: <MdIcons.MdOutlineTempleHindu />, title: "Templo Hindú" },
  { icon: <MdIcons.MdOutlineHotTub />, title: "Aguas Termales" },
  { icon: <GiIcons.GiGrapes />, title: "Viñedos" },
];

const restaurantTags = {
  restaurantTypes: [
    {
      icon: <MdIcons.MdOutlineFoodBank />,
      title: "Restaurantes tradicionales",
    },
    { icon: <MdIcons.MdOutlineFoodBank />, title: "Cadenas de comida rápida" },
    { icon: <MdIcons.MdOutlineFoodBank />, title: "Cafeterías y cafés" },
    {
      icon: <MdIcons.MdOutlineFoodBank />,
      title: "Restaurantes de alta cocina",
    },
    { icon: <MdIcons.MdOutlineFoodBank />, title: "Food trucks" },
    { icon: <MdIcons.MdOutlineFoodBank />, title: "Ramen" },
    { icon: <MdIcons.MdOutlineFoodBank />, title: "Sushi" },
  ],
  cuisines: [
    { icon: <PiIcons.PiBowlFoodBold />, title: "Cocina japonesa tradicional" },
    { icon: <PiIcons.PiBowlFoodBold />, title: "Internacional" },
    { icon: <PiIcons.PiBowlFoodBold />, title: "Fusión" },
    { icon: <PiIcons.PiBowlFoodBold />, title: "Cocina vegetariana/vegana" },
    { icon: <PiIcons.PiBowlFoodBold />, title: "Cocina sin gluten" },
    { icon: <PiIcons.PiBowlFoodBold />, title: "Cocina halal" },
    { icon: <PiIcons.PiBowlFoodBold />, title: "Cocina kosher" },
    { icon: <PiIcons.PiBowlFoodBold />, title: "Rápida" },
    { icon: <PiIcons.PiBowlFoodBold />, title: "Cocina de autor" },
    { icon: <PiIcons.PiBowlFoodBold />, title: "Con espectáculo" },
    { icon: <PiIcons.PiBowlFoodBold />, title: "Familiar" },
    { icon: <PiIcons.PiBowlFoodBold />, title: "Romántica" },
    { icon: <PiIcons.PiBowlFoodBold />, title: "Negocios" },
    { icon: <PiIcons.PiBowlFoodBold />, title: "Ocasiones especiales" },
  ],
  restaurantServices: [
    { icon: <FaIcons.FaWifi />, title: "Wi-Fi gratis" },
    { icon: <FaIcons.FaUtensils />, title: "Menú en inglés" },
    { icon: <FaIcons.FaUtensils />, title: "Reservas en línea" },
    { icon: <FaIcons.FaUtensils />, title: "Entregas a domicilio" },
    { icon: <FaIcons.FaUtensils />, title: "Terraza o comedor al aire libre" },
    { icon: <FaIcons.FaUtensils />, title: "Opciones de comida para llevar" },
    { icon: <FaIcons.FaDog />, title: "Admite mascotas" },
    { icon: <FaIcons.FaLeaf />, title: "Ingredientes orgánicos" },
    { icon: <FaIcons.FaFish />, title: "Mariscos frescos" },
    { icon: <FaIcons.FaChild />, title: "Menús infantiles" },
  ],
};

const Aside = ({ onFilterChange, selectedFilter }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
            color: theme.palette.primary.main,
            "&.Mui-checked": {
              color: theme.palette.primary.main,
            },
            "&:hover": {
              backgroundColor: `${theme.palette.primary.main}10`,
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
          backgroundColor: `${theme.palette.primary.main}05`,
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
          startIcon={<Check size={18} />}
          onClick={applyFilters}
          fullWidth
          sx={{
            backgroundColor: theme.palette.secondary.medium,
            color: "white",
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
          startIcon={<RefreshCw size={18} />}
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
