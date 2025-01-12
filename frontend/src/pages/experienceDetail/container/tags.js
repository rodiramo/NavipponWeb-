import * as TbIcons from 'react-icons/tb';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as LiaIcons from 'react-icons/lia';
import * as GiIcons from 'react-icons/gi';
import * as BsIcons from 'react-icons/bs';
import * as VscIcons from 'react-icons/vsc';
import * as LuIcons from 'react-icons/lu';
import * as PiIcons from 'react-icons/pi';

export const generalTags = {
  budget: [
    { icon: <TbIcons.TbCoin />, title: "Gratis" },
    { icon: <TbIcons.TbCoin />, title: "Económico" },
    { icon: <TbIcons.TbCoin />, title: "Moderado" },
    { icon: <TbIcons.TbCoin />, title: "Lujo" }
  ],
  location: [
    { icon: <FaIcons.FaTrain />, title: 'Cerca de estaciones de tren o metro' },
    { icon: <FaIcons.FaPlane />, title: 'Cerca de aeropuertos' },
    { icon: <FaIcons.FaMapMarkerAlt />, title: 'Cerca de áreas de puntos de interés' }
  ]
};

export const attractionTags = [
  { icon: <MdIcons.MdOutlineForest />, title: 'Naturaleza' },
  { icon: <MdIcons.MdOutlineBeachAccess />, title: 'Playa' },
  { icon: <TbIcons.TbBuildingMonument />, title: 'Monumento' },
  { icon: <MdIcons.MdOutlineRamenDining />, title: 'Gastronomía' },
  { icon: <LiaIcons.LiaCocktailSolid />, title: 'Noche' },
  { icon: <GiIcons.GiGreekTemple />, title: 'Museo' },
  { icon: <MdIcons.MdOutlineCoffee />, title: 'Cafés' },
  { icon: <MdIcons.MdOutlineShoppingBag />, title: 'Shopping' },
  { icon: <FaIcons.FaRegStar />, title: 'Ocio' },
  { icon: <GiIcons.GiPartyPopper />, title: 'Festival' },
  { icon: <BsIcons.BsRobot />, title: 'Tecnología' },
  { icon: <LiaIcons.LiaGamepadSolid />, title: 'Juegos' },
  { icon: <VscIcons.VscOctoface />, title: 'Anime' },
  { icon: <LuIcons.LuFerrisWheel />, title: 'Parques temáticos' },
  { icon: <GiIcons.GiSamuraiHelmet />, title: 'Samurai' },
  { icon: <MdIcons.MdOutlineTempleBuddhist />, title: 'Templo Budista' },
  { icon: <PiIcons.PiBirdBold />, title: 'Reserva de Aves' },
  { icon: <MdIcons.MdOutlineCastle />, title: 'Castillos' },
  { icon: <PiIcons.PiCross />, title: 'Templo Cristiano' },
  { icon: <TbIcons.TbTorii />, title: 'Templo Sintoísta' },
  { icon: <MdIcons.MdOutlineTempleHindu />, title: 'Templo Hindú' },
  { icon: <MdIcons.MdOutlineHotTub />, title: 'Aguas Termales' },
  { icon: <GiIcons.GiGrapes />, title: 'Viñedos' }
];

export const hotelTags = {
  accommodations: [
    { icon: <FaIcons.FaHotel />, title: "Hoteles de lujo" },
    { icon: <MdIcons.MdOutlineSpa />, title: "Ryokan (tradicional)" },
    { icon: <FaIcons.FaCapsules />, title: "Hoteles cápsula" },
    { icon: <FaIcons.FaBuilding />, title: "Hoteles de negocios" },
    { icon: <FaIcons.FaHome />, title: "Apartamentos" },
    { icon: <GiIcons.GiBed />, title: "Hostales" }
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
    { icon: <FaIcons.FaDog />, title: "Admite mascotas" }
  ],
  typeTrip: [
    { icon: <FaIcons.FaChild />, title: "Familiar" },
    { icon: <FaIcons.FaHeart />, title: "Luna de miel" },
    { icon: <FaIcons.FaBriefcase />, title: "De negocios" },
    { icon: <FaIcons.FaHiking />, title: "Amigable para mochileros" },
    { icon: <FaIcons.FaMountain />, title: "Para aventureros" }
  ]
};

export const restaurantTags = {
  restaurantTypes: [
    { icon: <MdIcons.MdOutlineFoodBank />, title: "Restaurantes tradicionales" },
    { icon: <MdIcons.MdOutlineFoodBank />, title: "Cadenas de comida rápida" },
    { icon: <MdIcons.MdOutlineFoodBank />, title: "Cafeterías y cafés" },
    { icon: <MdIcons.MdOutlineFoodBank />, title: "Restaurantes de alta cocina" },
    { icon: <MdIcons.MdOutlineFoodBank />, title: "Food trucks" },
    { icon: <MdIcons.MdOutlineFoodBank />, title: "Ramen" },
    { icon: <MdIcons.MdOutlineFoodBank />, title: "Sushi" }
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
    { icon: <PiIcons.PiBowlFoodBold />, title: "Ocasiones especiales" }
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
    { icon: <FaIcons.FaChild />, title: "Menús infantiles" }
  ]
};