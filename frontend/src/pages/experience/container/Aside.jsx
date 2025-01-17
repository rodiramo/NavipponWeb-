import React, { useState } from 'react';
import * as TbIcons from 'react-icons/tb';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as LiaIcons from 'react-icons/lia';
import * as GiIcons from 'react-icons/gi';
import * as BsIcons from 'react-icons/bs';
import * as VscIcons from 'react-icons/vsc';
import * as LuIcons from 'react-icons/lu';
import * as PiIcons from 'react-icons/pi';
import { Disclosure } from '@headlessui/react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';


const categoriesEnum = [
  { icon: <FaIcons.FaHotel className="text-[#FF4A5A]" />, title: "Hoteles" },
  { icon: <FaIcons.FaLandmark className="text-[#FF4A5A]" />, title: "Atractivos" },
  { icon: <FaIcons.FaUtensils className="text-[#FF4A5A]" />, title: "Restaurantes" }
];

const regions = {
  Hokkaido: ["Hokkaido"],
  Tohoku: ["Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima"],
  Kanto: ["Tokio", "Kanagawa", "Chiba", "Saitama", "Ibaraki", "Tochigi", "Gunma"],
  Chubu: ["Aichi", "Shizuoka", "Gifu", "Nagano", "Niigata", "Toyama", "Ishikawa", "Fukui"],
  Kansai: ["Osaka", "Kyoto", "Hyogo", "Nara", "Wakayama", "Shiga", "Mie"],
  Chugoku: ["Hiroshima", "Okayama", "Shimane", "Tottori", "Yamaguchi"],
  Shikoku: ["Ehime", "Kagawa", "Kochi", "Tokushima"],
  Kyushu: ["Fukuoka", "Nagasaki", "Kumamoto", "Oita", "Miyazaki", "Kagoshima", "Saga"],
};

const generalTags = {
  season: [
    { icon: <FaIcons.FaLeaf className="text-[#FF4A5A]" />, title: "Primavera" },
    { icon: <FaIcons.FaSun className="text-[#FF4A5A]" />, title: "Verano" },
    { icon: <FaIcons.FaTree className="text-[#FF4A5A]" />, title: "Otoño" },
    { icon: <FaIcons.FaSnowflake className="text-[#FF4A5A]" />, title: "Invierno" },
    { icon: <MdIcons.MdAllInclusive className="text-[#FF4A5A]" />, title: "Todo el año" }
  ],
  budget: [
    { icon: <TbIcons.TbCoin className="text-[#FF4A5A]" />, title: "Gratis" },
    { icon: <TbIcons.TbCoin className="text-[#FF4A5A]" />, title: "Económico" },
    { icon: <TbIcons.TbCoin className="text-[#FF4A5A]" />, title: "Moderado" },
    { icon: <TbIcons.TbCoin className="text-[#FF4A5A]" />, title: "Lujo" }
  ],
  rating: [1, 2, 3, 4, 5],
  location: [
    { icon: <FaIcons.FaTrain className="text-[#FF4A5A]" />, title: 'Cerca de estaciones de tren o metro' },
    { icon: <FaIcons.FaPlane className="text-[#FF4A5A]" />, title: 'Cerca de aeropuertos' },
    { icon: <FaIcons.FaMapMarkerAlt className="text-[#FF4A5A]" />, title: 'Cerca de áreas de puntos de interés' }
  ]
};

const hotelTags = {
  accommodations: [
    { icon: <FaIcons.FaHotel className="text-[#FF4A5A]" />, title: "Hoteles de lujo" },
    { icon: <MdIcons.MdOutlineSpa className="text-[#FF4A5A]" />, title: "Ryokan (tradicional)" },
    { icon: <FaIcons.FaCapsules className="text-[#FF4A5A]" />, title: "Hoteles cápsula" },
    { icon: <FaIcons.FaBuilding className="text-[#FF4A5A]" />, title: "Hoteles de negocios" },
    { icon: <FaIcons.FaHome className="text-[#FF4A5A]" />, title: "Apartamentos" },
    { icon: <GiIcons.GiBed className="text-[#FF4A5A]" />, title: "Hostales" }
  ],
  hotelServices: [
    { icon: <FaIcons.FaWifi className="text-[#FF4A5A]" />, title: "Wi-Fi gratis" },
    { icon: <MdIcons.MdFreeBreakfast className="text-[#FF4A5A]" />, title: "Desayuno incluido" },
    { icon: <FaIcons.FaParking className="text-[#FF4A5A]" />, title: "Aparcamiento gratuito" },
    { icon: <MdIcons.MdAirportShuttle className="text-[#FF4A5A]" />, title: "Transporte al aeropuerto" },
    { icon: <FaIcons.FaSwimmer className="text-[#FF4A5A]" />, title: "Piscina" },
    { icon: <FaIcons.FaDumbbell className="text-[#FF4A5A]" />, title: "Gimnasio" },
    { icon: <FaIcons.FaUtensils className="text-[#FF4A5A]" />, title: "Restaurante en el hotel" },
    { icon: <FaIcons.FaWheelchair className="text-[#FF4A5A]" />, title: "Accesible" },
    { icon: <FaIcons.FaDog className="text-[#FF4A5A]" />, title: "Admite mascotas" }
  ],
  typeTrip: [
    { icon: <FaIcons.FaChild className="text-[#FF4A5A]" />, title: "Familiar" },
    { icon: <FaIcons.FaHeart className="text-[#FF4A5A]" />, title: "Luna de miel" },
    { icon: <FaIcons.FaBriefcase className="text-[#FF4A5A]" />, title: "De negocios" },
    { icon: <FaIcons.FaHiking className="text-[#FF4A5A]" />, title: "Amigable para mochileros" },
    { icon: <FaIcons.FaMountain className="text-[#FF4A5A]" />, title: "Para aventureros" }
  ]
};

const attractionTags = [
  { icon: <MdIcons.MdOutlineForest className="text-[#FF4A5A]" />, title: 'Naturaleza' },
  { icon: <MdIcons.MdOutlineBeachAccess className="text-[#FF4A5A]" />, title: 'Playa' },
  { icon: <TbIcons.TbBuildingMonument className="text-[#FF4A5A]" />, title: 'Monumento' },
  { icon: <MdIcons.MdOutlineRamenDining className="text-[#FF4A5A]" />, title: 'Gastronomía' },
  { icon: <LiaIcons.LiaCocktailSolid className="text-[#FF4A5A]" />, title: 'Noche' },
  { icon: <GiIcons.GiGreekTemple className="text-[#FF4A5A]" />, title: 'Museo' },
  { icon: <MdIcons.MdOutlineCoffee className="text-[#FF4A5A]" />, title: 'Cafés' },
  { icon: <MdIcons.MdOutlineShoppingBag className="text-[#FF4A5A]" />, title: 'Shopping' },
  { icon: <FaIcons.FaRegStar className="text-[#FF4A5A]" />, title: 'Ocio' },
  { icon: <GiIcons.GiPartyPopper className="text-[#FF4A5A]" />, title: 'Festival' },
  { icon: <BsIcons.BsRobot className="text-[#FF4A5A]" />, title: 'Tecnología' },
  { icon: <LiaIcons.LiaGamepadSolid className="text-[#FF4A5A]" />, title: 'Juegos' },
  { icon: <VscIcons.VscOctoface className="text-[#FF4A5A]" />, title: 'Anime' },
  { icon: <LuIcons.LuFerrisWheel className="text-[#FF4A5A]" />, title: 'Parques temáticos' },
  { icon: <GiIcons.GiSamuraiHelmet className="text-[#FF4A5A]" />, title: 'Samurai' },
  { icon: <MdIcons.MdOutlineTempleBuddhist className="text-[#FF4A5A]" />, title: 'Templo Budista' },
  { icon: <PiIcons.PiBirdBold className="text-[#FF4A5A]" />, title: 'Reserva de Aves' },
  { icon: <MdIcons.MdOutlineCastle className="text-[#FF4A5A]" />, title: 'Castillos' },
  { icon: <PiIcons.PiCross className="text-[#FF4A5A]" />, title: 'Templo Cristiano' },
  { icon: <TbIcons.TbTorii className="text-[#FF4A5A]" />, title: 'Templo Sintoísta' },
  { icon: <MdIcons.MdOutlineTempleHindu className="text-[#FF4A5A]" />, title: 'Templo Hindú' },
  { icon: <MdIcons.MdOutlineHotTub className="text-[#FF4A5A]" />, title: 'Aguas Termales' },
  { icon: <GiIcons.GiGrapes className="text-[#FF4A5A]" />, title: 'Viñedos' }
];

const restaurantTags = {
  restaurantTypes: [
    { icon: <MdIcons.MdOutlineFoodBank className="text-[#FF4A5A]" />, title: "Restaurantes tradicionales" },
    { icon: <MdIcons.MdOutlineFoodBank className="text-[#FF4A5A]" />, title: "Cadenas de comida rápida" },
    { icon: <MdIcons.MdOutlineFoodBank className="text-[#FF4A5A]" />, title: "Cafeterías y cafés" },
    { icon: <MdIcons.MdOutlineFoodBank className="text-[#FF4A5A]" />, title: "Restaurantes de alta cocina" },
    { icon: <MdIcons.MdOutlineFoodBank className="text-[#FF4A5A]" />, title: "Food trucks" },
    { icon: <MdIcons.MdOutlineFoodBank className="text-[#FF4A5A]" />, title: "Ramen" },
    { icon: <MdIcons.MdOutlineFoodBank className="text-[#FF4A5A]" />, title: "Sushi" }
  ],
  cuisines: [
    { icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />, title: "Cocina japonesa tradicional" },
    { icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />, title: "Internacional" },
    { icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />, title: "Fusión" },
    { icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />, title: "Cocina vegetariana/vegana" },
    { icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />, title: "Cocina sin gluten" },
    { icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />, title: "Cocina halal" },
    { icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />, title: "Cocina kosher" },
    { icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />, title: "Rápida" },
    { icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />, title: "Cocina de autor" },
    { icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />, title: "Con espectáculo" },
    { icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />, title: "Familiar" },
    { icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />, title: "Romántica" },
    { icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />, title: "Negocios" },
    { icon: <PiIcons.PiBowlFoodBold className="text-[#FF4A5A]" />, title: "Ocasiones especiales" }
  ],
  restaurantServices: [
    { icon: <FaIcons.FaWifi className="text-[#FF4A5A]" />, title: "Wi-Fi gratis" },
    { icon: <FaIcons.FaUtensils className="text-[#FF4A5A]" />, title: "Menú en inglés" },
    { icon: <FaIcons.FaUtensils className="text-[#FF4A5A]" />, title: "Reservas en línea" },
    { icon: <FaIcons.FaUtensils className="text-[#FF4A5A]" />, title: "Entregas a domicilio" },
    { icon: <FaIcons.FaUtensils className="text-[#FF4A5A]" />, title: "Terraza o comedor al aire libre" },
    { icon: <FaIcons.FaUtensils className="text-[#FF4A5A]" />, title: "Opciones de comida para llevar" },
    { icon: <FaIcons.FaDog className="text-[#FF4A5A]" />, title: "Admite mascotas" },
    { icon: <FaIcons.FaLeaf className="text-[#FF4A5A]" />, title: "Ingredientes orgánicos" },
    { icon: <FaIcons.FaFish className="text-[#FF4A5A]" />, title: "Mariscos frescos" },
    { icon: <FaIcons.FaChild className="text-[#FF4A5A]" />, title: "Menús infantiles" }
  ]
};

const Aside = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    region: "",
    tags: []
  });

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const handleTagChange = (tag) => {
    const newTags = selectedFilters.tags.includes(tag)
      ? selectedFilters.tags.filter((t) => t !== tag)
      : [...selectedFilters.tags, tag];
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      tags: newTags
    }));
  };

  const applyFilters = () => {
    onFilterChange(selectedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: "",
      region: "",
      tags: []
    };
    setSelectedFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <aside className="p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4 p-4 border rounded-lg border-[#0A0330] shadow-sm">
        <h4 className="font-semibold">Categoría</h4>
        <select
          value={selectedFilters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecciona una categoría</option>
          {categoriesEnum.map((category) => (
            <option key={category.title} value={category.title}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4 p-4 border rounded-lg border-[#0A0330] shadow-sm">
        <h4 className="font-semibold">Región</h4>
        <select
          value={selectedFilters.region}
          onChange={(e) => handleFilterChange("region", e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecciona una región</option>
          {Object.keys(regions).map((region) => (
            <optgroup key={region} label={region}>
              {regions[region].map((prefecture) => (
                <option key={prefecture} value={prefecture}>
                  {prefecture}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between mb-3 w-full px-4 py-2 text-sm font-medium text-left text-[#0A0330] bg-[#D7EDFC] rounded-lg hover:bg-[#96C6D9] focus:outline-none focus-visible:ring focus-visible:ring-[#0A0330] focus-visible:ring-opacity-75">
              <span>Filtros Generales</span>
              {open ? (
                <FaChevronUp className="w-5 h-5 text-[#0A0330]" />
              ) : (
                <FaChevronDown className="w-5 h-5 text-[#0A0330]" />
              )}
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              <h5 className="font-semibold mt-3 mb-1">Época del año</h5>
              {generalTags.season.map((tag) => (
                <label key={tag.title} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag.title)}
                    onChange={() => handleTagChange(tag.title)}
                    className="mr-2"
                  />
                  <span className="ml-2">{tag.title}</span>
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
                  <span className="ml-2">{tag.title}</span>
                </label>
              ))}
              <h5 className="font-semibold mt-3 mb-1">Valoración</h5>
              {generalTags.rating.map((rating) => (
                <label key={rating} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(`${rating} estrellas`)}
                    onChange={() => handleTagChange(`${rating} estrellas`)}
                    className="mr-2"
                  />
                  <div className="flex text-[#FF4A5A]">
                    {Array.from({ length: rating }, (_, index) => (
                      <FaIcons.FaStar key={index} />
                    ))}
                  </div>
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
                  <span className="ml-2">{tag.title}</span>
                </label>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between mb-3 w-full px-4 py-2 text-sm font-medium text-left text-[#0A0330] bg-[#D7EDFC] rounded-lg hover:bg-[#96C6D9] focus:outline-none focus-visible:ring focus-visible:ring-[#0A0330] focus-visible:ring-opacity-75">
              <span>Filtros de Atractivos</span>
              {open ? (
                <FaChevronUp className="w-5 h-5 text-[#0A0330]" />
              ) : (
                <FaChevronDown className="w-5 h-5 text-[#0A0330]" />
              )}
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              {attractionTags.map((tag) => (
                <label key={tag.title} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag.title)}
                    onChange={() => handleTagChange(tag.title)}
                    className="mr-2"
                  />
                  <span className="ml-2">{tag.title}</span>
                </label>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between mb-3 w-full px-4 py-2 text-sm font-medium text-left text-[#0A0330] bg-[#D7EDFC] rounded-lg hover:bg-[#96C6D9] focus:outline-none focus-visible:ring focus-visible:ring-[#0A0330] focus-visible:ring-opacity-75">
              <span>Filtros de Hoteles</span>
              {open ? (
                <FaChevronUp className="w-5 h-5 text-[#0A0330]" />
              ) : (
                <FaChevronDown className="w-5 h-5 text-[#0A0330]" />
              )}
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              <h5 className="font-semibold mt-3 mb-1">Acomodación</h5>
              {hotelTags.accommodations.map((tag) => (
                <label key={tag.title} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag.title)}
                    onChange={() => handleTagChange(tag.title)}
                    className="mr-2"
                  />
                  <span className="ml-2">{tag.title}</span>
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
                  <span className="ml-2">{tag.title}</span>
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
                  <span className="ml-2">{tag.title}</span>
                </label>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between mb-3 w-full px-4 py-2 text-sm font-medium text-left text-[#0A0330] bg-[#D7EDFC] rounded-lg hover:bg-[#96C6D9] focus:outline-none focus-visible:ring focus-visible:ring-[#0A0330] focus-visible:ring-opacity-75">
              <span>Filtros de Restaurantes</span>
              {open ? (
                <FaChevronUp className="w-5 h-5 text-[#0A0330]" />
              ) : (
                <FaChevronDown className="w-5 h-5 text-[#0A0330]" />
              )}
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              <h5 className="font-semibold mt-3 mb-1">Tipos de restaurantes</h5>
              {restaurantTags.restaurantTypes.map((tag) => (
                <label key={tag.title} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag.title)}
                    onChange={() => handleTagChange(tag.title)}
                    className="mr-2"
                  />
                  <span className="ml-2">{tag.title}</span>
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
                  <span className="ml-2">{tag.title}</span>
                </label>
              ))}
              <h5 className="font-semibold mt-3 mb-1">Servicio de Restaurante</h5>
              {restaurantTags.restaurantServices.map((tag) => (
                <label key={tag.title} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.tags.includes(tag.title)}
                    onChange={() => handleTagChange(tag.title)}
                    className="mr-2"
                  />
                  <span className="ml-2">{tag.title}</span>
                </label>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <div className="flex justify-between mt-4">
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Aplicar Filtros
        </button>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
        >
          Borrar Filtros
        </button>
      </div>
    </aside>
  );
};

export default Aside;