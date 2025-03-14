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
import { useTheme, Button } from "@mui/material";

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
    { icon: <FaIcons.FaLeaf className="text-[#FF4A5A]" />, title: "Primavera" },
    { icon: <FaIcons.FaSun className="text-[#FF4A5A]" />, title: "Verano" },
    { icon: <FaIcons.FaTree className="text-[#FF4A5A]" />, title: "Otoño" },
    {
      icon: <FaIcons.FaSnowflake className="text-[#FF4A5A]" />,
      title: "Invierno",
    },
    {
      icon: <MdIcons.MdAllInclusive className="text-[#FF4A5A]" />,
      title: "Todo el año",
    },
  ],
  budget: [
    { icon: <TbIcons.TbCoin className="text-[#FF4A5A]" />, title: "Gratis" },
    { icon: <TbIcons.TbCoin className="text-[#FF4A5A]" />, title: "Económico" },
    { icon: <TbIcons.TbCoin className="text-[#FF4A5A]" />, title: "Moderado" },
    { icon: <TbIcons.TbCoin className="text-[#FF4A5A]" />, title: "Lujo" },
  ],

  location: [
    {
      icon: <FaIcons.FaTrain className="text-[#FF4A5A]" />,
      title: "Cerca de estaciones de tren o metro",
    },
    {
      icon: <FaIcons.FaPlane className="text-[#FF4A5A]" />,
      title: "Cerca de aeropuertos",
    },
    {
      icon: <FaIcons.FaMapMarkerAlt className="text-[#FF4A5A]" />,
      title: "Cerca de áreas de puntos de interés",
    },
  ],
};

const hotelTags = {
  accommodations: [
    {
      icon: <FaIcons.FaHotel className="text-[#FF4A5A]" />,
      title: "Hoteles de lujo",
    },
    {
      icon: <MdIcons.MdOutlineSpa className="text-[#FF4A5A]" />,
      title: "Ryokan (tradicional)",
    },
    {
      icon: <FaIcons.FaCapsules className="text-[#FF4A5A]" />,
      title: "Hoteles cápsula",
    },
    {
      icon: <FaIcons.FaBuilding className="text-[#FF4A5A]" />,
      title: "Hoteles de negocios",
    },
    {
      icon: <FaIcons.FaHome className="text-[#FF4A5A]" />,
      title: "Apartamentos",
    },
    { icon: <GiIcons.GiBed className="text-[#FF4A5A]" />, title: "Hostales" },
  ],
  hotelServices: [
    {
      icon: <FaIcons.FaWifi className="text-[#FF4A5A]" />,
      title: "Wi-Fi gratis",
    },
    {
      icon: <MdIcons.MdFreeBreakfast className="text-[#FF4A5A]" />,
      title: "Desayuno incluido",
    },
    {
      icon: <FaIcons.FaParking className="text-[#FF4A5A]" />,
      title: "Aparcamiento gratuito",
    },
    {
      icon: <MdIcons.MdAirportShuttle className="text-[#FF4A5A]" />,
      title: "Transporte al aeropuerto",
    },
    {
      icon: <FaIcons.FaSwimmer className="text-[#FF4A5A]" />,
      title: "Piscina",
    },
    {
      icon: <FaIcons.FaDumbbell className="text-[#FF4A5A]" />,
      title: "Gimnasio",
    },
    {
      icon: <FaIcons.FaUtensils className="text-[#FF4A5A]" />,
      title: "Restaurante en el hotel",
    },
    {
      icon: <FaIcons.FaWheelchair className="text-[#FF4A5A]" />,
      title: "Accesible",
    },
    {
      icon: <FaIcons.FaDog className="text-[#FF4A5A]" />,
      title: "Admite mascotas",
    },
  ],
  typeTrip: [
    { icon: <FaIcons.FaChild className="text-[#FF4A5A]" />, title: "Familiar" },
    {
      icon: <FaIcons.FaHeart className="text-[#FF4A5A]" />,
      title: "Luna de miel",
    },
    {
      icon: <FaIcons.FaBriefcase className="text-[#FF4A5A]" />,
      title: "De negocios",
    },
    {
      icon: <FaIcons.FaHiking className="text-[#FF4A5A]" />,
      title: "Amigable para mochileros",
    },
    {
      icon: <FaIcons.FaMountain className="text-[#FF4A5A]" />,
      title: "Para aventureros",
    },
  ],
};

const attractionTags = [
  {
    icon: <MdIcons.MdOutlineForest className="text-[#FF4A5A]" />,
    title: "Naturaleza",
  },
  {
    icon: <MdIcons.MdOutlineBeachAccess className="text-[#FF4A5A]" />,
    title: "Playa",
  },
  {
    icon: <TbIcons.TbBuildingMonument className="text-[#FF4A5A]" />,
    title: "Monumento",
  },
  {
    icon: <MdIcons.MdOutlineRamenDining className="text-[#FF4A5A]" />,
    title: "Gastronomía",
  },
  {
    icon: <LiaIcons.LiaCocktailSolid className="text-[#FF4A5A]" />,
    title: "Noche",
  },
  {
    icon: <GiIcons.GiGreekTemple className="text-[#FF4A5A]" />,
    title: "Museo",
  },
  {
    icon: <MdIcons.MdOutlineCoffee className="text-[#FF4A5A]" />,
    title: "Cafés",
  },
  {
    icon: <MdIcons.MdOutlineShoppingBag className="text-[#FF4A5A]" />,
    title: "Shopping",
  },
  { icon: <FaIcons.FaRegStar className="text-[#FF4A5A]" />, title: "Ocio" },
  {
    icon: <GiIcons.GiPartyPopper className="text-[#FF4A5A]" />,
    title: "Festival",
  },
  { icon: <BsIcons.BsRobot className="text-[#FF4A5A]" />, title: "Tecnología" },
  {
    icon: <LiaIcons.LiaGamepadSolid className="text-[#FF4A5A]" />,
    title: "Juegos",
  },
  { icon: <VscIcons.VscOctoface className="text-[#FF4A5A]" />, title: "Anime" },
  {
    icon: <LuIcons.LuFerrisWheel className="text-[#FF4A5A]" />,
    title: "Parques temáticos",
  },
  {
    icon: <GiIcons.GiSamuraiHelmet className="text-[#FF4A5A]" />,
    title: "Samurai",
  },
  {
    icon: <MdIcons.MdOutlineTempleBuddhist className="text-[#FF4A5A]" />,
    title: "Templo Budista",
  },
  {
    icon: <PiIcons.PiBirdBold className="text-[#FF4A5A]" />,
    title: "Reserva de Aves",
  },
  {
    icon: <MdIcons.MdOutlineCastle className="text-[#FF4A5A]" />,
    title: "Castillos",
  },
  {
    icon: <PiIcons.PiCross className="text-[#FF4A5A]" />,
    title: "Templo Cristiano",
  },
  {
    icon: <TbIcons.TbTorii className="text-[#FF4A5A]" />,
    title: "Templo Sintoísta",
  },
  {
    icon: <MdIcons.MdOutlineTempleHindu className="text-[#FF4A5A]" />,
    title: "Templo Hindú",
  },
  {
    icon: <MdIcons.MdOutlineHotTub className="text-[#FF4A5A]" />,
    title: "Aguas Termales",
  },
  { icon: <GiIcons.GiGrapes className="text-[#FF4A5A]" />, title: "Viñedos" },
];

const restaurantTags = {
  restaurantTypes: [
    {
      icon: <MdIcons.MdOutlineFoodBank className="text-[#FF4A5A]" />,
      title: "Restaurantes tradicionales",
    },
    {
      icon: <MdIcons.MdOutlineFoodBank className="text-[#FF4A5A]" />,
      title: "Cadenas de comida rápida",
    },
    {
      icon: <MdIcons.MdOutlineFoodBank className="text-[#FF4A5A]" />,
      title: "Cafeterías y cafés",
    },
    {
      icon: <MdIcons.MdOutlineFoodBank className="text-[#FF4A5A]" />,
      title: "Restaurantes de alta cocina",
    },
    {
      icon: <MdIcons.MdOutlineFoodBank className="text-[#FF4A5A]" />,
      title: "Food trucks",
    },
    {
      icon: <MdIcons.MdOutlineFoodBank className="text-[#FF4A5A]" />,
      title: "Ramen",
    },
    {
      icon: <MdIcons.MdOutlineFoodBank className="text-[#FF4A5A]" />,
      title: "Sushi",
    },
  ],
  cuisines: [
    {
      icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />,
      title: "Cocina japonesa tradicional",
    },
    {
      icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />,
      title: "Internacional",
    },
    {
      icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />,
      title: "Fusión",
    },
    {
      icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />,
      title: "Cocina vegetariana/vegana",
    },
    {
      icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />,
      title: "Cocina sin gluten",
    },
    {
      icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />,
      title: "Cocina halal",
    },
    {
      icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />,
      title: "Cocina kosher",
    },
    {
      icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />,
      title: "Rápida",
    },
    {
      icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />,
      title: "Cocina de autor",
    },
    {
      icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />,
      title: "Con espectáculo",
    },
    {
      icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />,
      title: "Familiar",
    },
    {
      icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />,
      title: "Romántica",
    },
    {
      icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />,
      title: "Negocios",
    },
    {
      icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />,
      title: "Ocasiones especiales",
    },
  ],
  restaurantServices: [
    {
      icon: <FaIcons.FaWifi className="text-[#FF4A5A]" />,
      title: "Wi-Fi gratis",
    },
    {
      icon: <FaIcons.FaUtensils className="text-[#FF4A5A]" />,
      title: "Menú en inglés",
    },
    {
      icon: <FaIcons.FaUtensils className="text-[#FF4A5A]" />,
      title: "Reservas en línea",
    },
    {
      icon: <FaIcons.FaUtensils className="text-[#FF4A5A]" />,
      title: "Entregas a domicilio",
    },
    {
      icon: <FaIcons.FaUtensils className="text-[#FF4A5A]" />,
      title: "Terraza o comedor al aire libre",
    },
    {
      icon: <FaIcons.FaUtensils className="text-[#FF4A5A]" />,
      title: "Opciones de comida para llevar",
    },
    {
      icon: <FaIcons.FaDog className="text-[#FF4A5A]" />,
      title: "Admite mascotas",
    },
    {
      icon: <FaIcons.FaLeaf className="text-[#FF4A5A]" />,
      title: "Ingredientes orgánicos",
    },
    {
      icon: <FaIcons.FaFish className="text-[#FF4A5A]" />,
      title: "Mariscos frescos",
    },
    {
      icon: <FaIcons.FaChild className="text-[#FF4A5A]" />,
      title: "Menús infantiles",
    },
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

    // ✅ Automatically switch to "resultados" tab when filtering
    onFilterChange(formattedFilters, "resultados");
  };

  const clearFilters = () => {
    const clearedFilters = {
      region: "",
      tags: [],
    };
    setSelectedFilters(clearedFilters);
    console.log("Clearing filters:", clearedFilters);

    // ✅ Reset to "Todo" when clearing filters and remove URL params
    onFilterChange({}, "todo", true);
  };

  return (
    <aside className="px-4 rounded-lg">
      {/* Region Filter */}
      <div
        className="mb-4 p-4 rounded-lg"
        style={{ background: theme.palette.primary.light }}
      >
        <h4
          className="font-semibold"
          style={{ color: theme.palette.text.primary }}
        >
          Región
        </h4>
        <select
          value={selectedFilters.region}
          onChange={(e) => handleFilterChange("region", e.target.value)}
          className="w-full p-2 rounded-lg outline-none focus:ring-2"
          style={{
            border: `1px solid ${theme.palette.primary.main}`,
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          <option value="">Selecciona una región</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* General Filters */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className="flex justify-between w-full p-4 py-2 text-sm font-medium text-left rounded-lg hover:bg-opacity-80 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75"
              style={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.text.primary,
                marginBottom: "1rem",
              }}
            >
              <span>Filtros Generales</span>
              {open ? (
                <FaChevronUp className="w-5 h-5" />
              ) : (
                <FaChevronDown className="w-5 h-5" />
              )}
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
              <h5 className="font-semibold mt-3 mb-1">Época del Año</h5>
              {generalTags.season.map((tag) => (
                <label key={tag.title} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag.title)}
                    onChange={() => handleTagChange(tag.title)}
                    className="mr-2"
                  />
                  <span className="flex items-center ml-2">
                    {tag.icon} <span className="ml-2">{tag.title}</span>
                  </span>
                </label>
              ))}
              <h5 className="font-semibold mt-3 mb-1">Presupuesto</h5>
              {generalTags.budget.map((tag) => (
                <label key={tag.title} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag.title)}
                    onChange={() => handleTagChange(tag.title)}
                    className="mr-2"
                  />
                  <span className="flex items-center ml-2">
                    {tag.icon} <span className="ml-2">{tag.title}</span>
                  </span>
                </label>
              ))}
              <h5 className="font-semibold mt-3 mb-1">Localización</h5>
              {generalTags.location.map((tag) => (
                <label key={tag.title} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag.title)}
                    onChange={() => handleTagChange(tag.title)}
                    className="mr-2"
                  />
                  <span className="flex items-center ml-2">
                    {tag.icon} <span className="ml-2">{tag.title}</span>
                  </span>
                </label>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Attraction Filters */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left rounded-lg hover:bg-opacity-80 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75"
              style={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.text.primary,
                marginBottom: "1rem",
              }}
            >
              <span>Filtros de Atractivos</span>
              {open ? (
                <FaChevronUp className="w-5 h-5" />
              ) : (
                <FaChevronDown className="w-5 h-5" />
              )}
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
              {attractionTags.map((tag) => (
                <label key={tag.title} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag.title)}
                    onChange={() => handleTagChange(tag.title)}
                    className="mr-2"
                  />
                  <span className="flex items-center ml-2">
                    {tag.icon} <span className="ml-2">{tag.title}</span>
                  </span>
                </label>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Hotel Filters */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left rounded-lg hover:bg-opacity-80 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75"
              style={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.text.primary,
                marginBottom: "1rem",
              }}
            >
              <span>Filtros de Hoteles</span>
              {open ? (
                <FaChevronUp className="w-5 h-5" />
              ) : (
                <FaChevronDown className="w-5 h-5" />
              )}
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
              <h5 className="font-semibold mt-3 mb-1">Acomodación</h5>
              {hotelTags.accommodations.map((tag) => (
                <label key={tag.title} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag.title)}
                    onChange={() => handleTagChange(tag.title)}
                    className="mr-2"
                  />
                  <span className="flex items-center ml-2">
                    {tag.icon} <span className="ml-2">{tag.title}</span>
                  </span>
                </label>
              ))}
              <h5 className="font-semibold mt-3 mb-1">Servicios de hotel</h5>
              {hotelTags.hotelServices.map((tag) => (
                <label key={tag.title} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag.title)}
                    onChange={() => handleTagChange(tag.title)}
                    className="mr-2"
                  />
                  <span className="flex items-center ml-2">
                    {tag.icon} <span className="ml-2">{tag.title}</span>
                  </span>
                </label>
              ))}
              <h5 className="font-semibold mt-3 mb-1">Tipo de Viaje</h5>
              {hotelTags.typeTrip.map((tag) => (
                <label key={tag.title} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag.title)}
                    onChange={() => handleTagChange(tag.title)}
                    className="mr-2"
                  />
                  <span className="flex items-center ml-2">
                    {tag.icon} <span className="ml-2">{tag.title}</span>
                  </span>
                </label>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Restaurant Filters */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left rounded-lg hover:bg-opacity-80 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75"
              style={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.text.primary,
              }}
            >
              <span>Filtros de Restaurantes</span>
              {open ? (
                <FaChevronUp className="w-5 h-5" />
              ) : (
                <FaChevronDown className="w-5 h-5" />
              )}
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
              <h5 className="font-semibold mt-3 mb-1">Tipos de restaurantes</h5>
              {restaurantTags.restaurantTypes.map((tag) => (
                <label key={tag.title} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag.title)}
                    onChange={() => handleTagChange(tag.title)}
                    className="mr-2"
                  />
                  <span className="flex items-center ml-2">
                    {tag.icon} <span className="ml-2">{tag.title}</span>
                  </span>
                </label>
              ))}
              <h5 className="font-semibold mt-3 mb-1">Tipo de cocina</h5>
              {restaurantTags.cuisines.map((tag) => (
                <label key={tag.title} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag.title)}
                    onChange={() => handleTagChange(tag.title)}
                    className="mr-2"
                  />
                  <span className="flex items-center ml-2">
                    {tag.icon} <span className="ml-2">{tag.title}</span>
                  </span>
                </label>
              ))}
              <h5 className="font-semibold mt-3 mb-1">
                Servicio de Restaurante
              </h5>
              {restaurantTags.restaurantServices.map((tag) => (
                <label key={tag.title} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag.title)}
                    onChange={() => handleTagChange(tag.title)}
                    className="mr-2"
                  />
                  <span className="flex items-center ml-2">
                    {tag.icon} <span className="ml-2">{tag.title}</span>
                  </span>
                </label>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          onClick={clearFilters}
          className="px-4 py-2 font-semibold rounded-lg transition-all duration-300"
          style={{
            borderRadius: "30rem",
            textTransform: "none",
            padding: "0.5rem",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = theme.palette.primary.light;
            e.target.style.color = theme.palette.secondary.dark;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = theme.palette.primary.main;
          }}
        >
          Borrar Filtros
        </Button>{" "}
        <Button
          onClick={applyFilters}
          className=" text-white transition-all duration-300"
          style={{
            backgroundColor: theme.palette.secondary.medium,
            color: theme.palette.primary.white,
            textTransform: "none",
            borderRadius: "30rem",
            padding: "0.5rem",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = theme.palette.secondary.dark)
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = theme.palette.secondary.medium)
          }
        >
          Aplicar Filtros
        </Button>
      </div>
    </aside>
  );
};

export default Aside;
