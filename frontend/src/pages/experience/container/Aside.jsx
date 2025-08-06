import React, { useState } from "react";
import {
  Leaf,
  Sun,
  Flower2,
  Snowflake,
  Cat,
  Dog,
  Trees,
  Wifi,
  Dumbbell,
  Baby,
  Backpack,
  Accessibility,
  Truck,
  ShoppingBag,
  Utensils,
  Infinity,
  Beef,
  CircleCheck,
  RotateCcw,
  Bed,
  CookingPot,
  Store,
  Blocks,
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
  PartyPopper,
  MapPinHouse,
  FerrisWheel,
  Grape,
  Globe,
  Pizza,
  Fish,
  Heart,
  TrainFront,
  Building,
  Building2,
  Home,
  Crown,
  Wine,
  Users,
  User,
  Bell,
  Camera,
  Sparkles,
  Soup,
  Flame,
  Wheat,
  UtensilsCrossed,
  Milk,
  Salad,
  Shield,
  Car,
  Clock,
  Music,
  CreditCard,
  GraduationCap,
  Mic,
  Calendar,
  Bird,
  Tent,
  Briefcase,
  Mountain,
  Filter,
  ChevronDown,
  MapPin,
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
} from "@mui/material";

const ICON_SIZE = 18;

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

const getTagCount = (tagKey, tagTitle, tagCounts) => {
  // Try different variations of the tag
  return (
    tagCounts[tagKey] ||
    tagCounts[tagTitle] ||
    tagCounts[tagTitle.toLowerCase()] ||
    tagCounts[tagKey?.toLowerCase()] ||
    tagCounts[tagTitle.replace(/\s+/g, "_")] ||
    tagCounts[tagTitle.replace(/\s+/g, "")] ||
    0
  );
};

// Base tag definitions - you can map these to your actual data keys
const createGeneralTags = (tagCounts) => ({
  season: [
    {
      icon: <Flower2 size={ICON_SIZE} />,
      title: "Primavera",
      key: "spring",
      count: getTagCount("spring", "Primavera", tagCounts),
    },
    {
      icon: <Sun size={ICON_SIZE} />,
      title: "Verano",
      key: "summer",
      count: getTagCount("summer", "Verano", tagCounts),
    },
    {
      icon: <Leaf size={ICON_SIZE} />,
      title: "Otoño",
      key: "autumn",
      count: getTagCount("autumn", "Otoño", tagCounts),
    },
    {
      icon: <Snowflake size={ICON_SIZE} />,
      title: "Invierno",
      key: "winter",
      count: getTagCount("winter", "Invierno", tagCounts),
    },
    {
      icon: <Infinity size={ICON_SIZE} />,
      title: "Todo el año",
      key: "year_round",
      count: getTagCount("year_round", "Todo el año", tagCounts),
    },
  ],
  budget: [
    {
      icon: <HandHelping size={ICON_SIZE} />,
      title: "Gratis",
      key: "free",
      count: getTagCount("free", "Gratis", tagCounts),
    },
    {
      icon: <PiggyBank size={ICON_SIZE} />,
      title: "Económico",
      key: "budget",
      count: getTagCount("budget", "Económico", tagCounts),
    },
    {
      icon: <CircleDollarSign size={ICON_SIZE} />,
      title: "Moderado",
      key: "moderate",
      count: getTagCount("moderate", "Moderado", tagCounts),
    },
    {
      icon: <Coins size={ICON_SIZE} />,
      title: "Lujo",
      key: "luxury",
      count: getTagCount("luxury", "Lujo", tagCounts),
    },
  ],
  location: [
    {
      icon: <TrainFront size={ICON_SIZE} />,
      title: "Cerca de estaciones de tren o metro",
      key: "near_station",
      count: getTagCount("near_station", "Cerca de estaciones", tagCounts),
    },
    {
      icon: <Plane size={ICON_SIZE} />,
      title: "Cerca de aeropuertos",
      key: "near_airport",
      count: getTagCount("near_airport", "Cerca de aeropuertos", tagCounts),
    },
    {
      icon: <MapPinHouse size={ICON_SIZE} />,
      title: "Cerca de áreas de puntos de interés",
      key: "near_poi",
      count: getTagCount("near_poi", "Cerca de POI", tagCounts),
    },
  ],
});

const createHotelTags = (tagCounts) => ({
  accommodations: [
    {
      icon: <Building size={ICON_SIZE} />,
      title: "Hoteles de lujo occidentales",
      key: "luxury_hotel",
      count: getTagCount("luxury_hotel", "Hoteles de lujo", tagCounts),
    },
    {
      icon: <Sparkles size={ICON_SIZE} />,
      title: "Ryokan tradicionales",
      key: "ryokan",
      count: getTagCount("ryokan", "Ryokan", tagCounts),
    },
    {
      icon: <Bed size={ICON_SIZE} />,
      title: "Hoteles cápsula",
      key: "capsule_hotel",
      count: getTagCount("capsule_hotel", "Hoteles cápsula", tagCounts),
    },
    {
      icon: <Building2 size={ICON_SIZE} />,
      title: "Hoteles de negocios",
      key: "business_hotel",
      count: getTagCount("business_hotel", "Hoteles de negocios", tagCounts),
    },
    {
      icon: <Home size={ICON_SIZE} />,
      title: "Apartamentos/Airbnb",
      key: "apartment",
      count: getTagCount("apartment", "Apartamentos", tagCounts),
    },
    {
      icon: <Backpack size={ICON_SIZE} />,
      title: "Hostales para mochileros",
      key: "hostel",
      count: getTagCount("hostel", "Hostales", tagCounts),
    },
    {
      icon: <Mountain size={ICON_SIZE} />,
      title: "Alojamiento rural (Minshuku)",
      key: "minshuku",
      count: getTagCount("minshuku", "Minshuku", tagCounts),
    },
    {
      icon: <Church size={ICON_SIZE} />,
      title: "Estancia en templos (Shukubo)",
      key: "temple_stay",
      count: getTagCount("temple_stay", "Shukubo", tagCounts),
    },
    {
      icon: <Crown size={ICON_SIZE} />,
      title: "Hoteles boutique",
      key: "boutique_hotel",
      count: getTagCount("boutique_hotel", "Boutique", tagCounts),
    },
    {
      icon: <Trees size={ICON_SIZE} />,
      title: "Cabañas en la naturaleza",
      key: "nature_cabin",
      count: getTagCount("nature_cabin", "Cabañas", tagCounts),
    },
    {
      icon: <Tent size={ICON_SIZE} />,
      title: "Glamping y camping de lujo",
      key: "glamping",
      count: getTagCount("glamping", "Glamping", tagCounts),
    },
    {
      icon: <Waves size={ICON_SIZE} />,
      title: "Resorts con onsen",
      key: "onsen_resort",
      count: getTagCount("onsen_resort", "Onsen resort", tagCounts),
    },
    {
      icon: <Waves size={ICON_SIZE} />,
      title: "Resorts de playa",
      key: "beach_resort",
      count: getTagCount("beach_resort", "Resort playa", tagCounts),
    },
    {
      icon: <Mountain size={ICON_SIZE} />,
      title: "Alojamiento en estaciones de esquí",
      key: "ski_lodge",
      count: getTagCount("ski_lodge", "Estación esquí", tagCounts),
    },
  ],
  hotelServices: [
    {
      icon: <Wifi size={ICON_SIZE} />,
      title: "Wi-Fi gratis",
      key: "free_wifi",
      count: getTagCount("free_wifi", "Wi-Fi gratis", tagCounts),
    },
    {
      icon: <Coffee size={ICON_SIZE} />,
      title: "Desayuno incluido",
      key: "breakfast",
      count: getTagCount("breakfast", "Desayuno", tagCounts),
    },
    {
      icon: <Car size={ICON_SIZE} />,
      title: "Aparcamiento gratuito",
      key: "free_parking",
      count: getTagCount("free_parking", "Aparcamiento", tagCounts),
    },
    {
      icon: <Plane size={ICON_SIZE} />,
      title: "Transporte al aeropuerto",
      key: "airport_shuttle",
      count: getTagCount("airport_shuttle", "Transporte aeropuerto", tagCounts),
    },
    {
      icon: <Waves size={ICON_SIZE} />,
      title: "Piscina",
      key: "pool",
      count: getTagCount("pool", "Piscina", tagCounts),
    },
    {
      icon: <Dumbbell size={ICON_SIZE} />,
      title: "Gimnasio",
      key: "gym",
      count: getTagCount("gym", "Gimnasio", tagCounts),
    },
    {
      icon: <Utensils size={ICON_SIZE} />,
      title: "Restaurante en el hotel",
      key: "restaurant",
      count: getTagCount("restaurant", "Restaurante", tagCounts),
    },
    {
      icon: <Waves size={ICON_SIZE} />,
      title: "Onsen/Aguas termales",
      key: "onsen",
      count: getTagCount("onsen", "Aguas termales", tagCounts),
    },
    {
      icon: <Accessibility size={ICON_SIZE} />,
      title: "Accesible",
      key: "accessible",
      count: getTagCount("accessible", "Accesible", tagCounts),
    },
    {
      icon: <Dog size={ICON_SIZE} />,
      title: "Admite mascotas",
      key: "pet_friendly",
      count: getTagCount("pet_friendly", "Mascotas", tagCounts),
    },
    {
      icon: <Globe size={ICON_SIZE} />,
      title: "Personal que habla inglés",
      key: "english_staff",
      count: getTagCount("english_staff", "Inglés", tagCounts),
    },
    {
      icon: <Clock size={ICON_SIZE} />,
      title: "Check-in 24h",
      key: "24h_checkin",
      count: getTagCount("24h_checkin", "24 horas", tagCounts),
    },
    {
      icon: <Briefcase size={ICON_SIZE} />,
      title: "Centro de negocios",
      key: "business_center",
      count: getTagCount("business_center", "Centro negocios", tagCounts),
    },
    {
      icon: <Baby size={ICON_SIZE} />,
      title: "Servicios para familias",
      key: "family_services",
      count: getTagCount("family_services", "Familiar", tagCounts),
    },
    {
      icon: <Sparkles size={ICON_SIZE} />,
      title: "Servicio de limpieza diario",
      key: "daily_cleaning",
      count: getTagCount("daily_cleaning", "Limpieza", tagCounts),
    },
  ],
  typeTrip: [
    {
      icon: <Baby size={ICON_SIZE} />,
      title: "Viajes familiares",
      key: "family",
      count: getTagCount("family", "Familiar", tagCounts),
    },
    {
      icon: <Heart size={ICON_SIZE} />,
      title: "Luna de miel/Romántico",
      key: "romantic",
      count: getTagCount("romantic", "Romántico", tagCounts),
    },
    {
      icon: <Briefcase size={ICON_SIZE} />,
      title: "Viajes de negocios",
      key: "business",
      count: getTagCount("business", "Negocios", tagCounts),
    },
    {
      icon: <Backpack size={ICON_SIZE} />,
      title: "Mochileros/Presupuesto bajo",
      key: "backpacker",
      count: getTagCount("backpacker", "Mochilero", tagCounts),
    },
    {
      icon: <Mountain size={ICON_SIZE} />,
      title: "Aventureros/Deportes",
      key: "adventure",
      count: getTagCount("adventure", "Aventura", tagCounts),
    },
    {
      icon: <Users size={ICON_SIZE} />,
      title: "Grupos grandes",
      key: "group",
      count: getTagCount("group", "Grupo", tagCounts),
    },
    {
      icon: <User size={ICON_SIZE} />,
      title: "Viajeros solitarios",
      key: "solo",
      count: getTagCount("solo", "Solitario", tagCounts),
    },
    {
      icon: <GraduationCap size={ICON_SIZE} />,
      title: "Viajes educativos",
      key: "educational",
      count: getTagCount("educational", "Educativo", tagCounts),
    },
    {
      icon: <Users size={ICON_SIZE} />,
      title: "Viajeros mayores",
      key: "senior",
      count: getTagCount("senior", "Mayor", tagCounts),
    },
    {
      icon: <Crown size={ICON_SIZE} />,
      title: "Experiencias de lujo",
      key: "luxury_experience",
      count: getTagCount("luxury_experience", "Lujo", tagCounts),
    },
    {
      icon: <Camera size={ICON_SIZE} />,
      title: "Fotografía/Turismo cultural",
      key: "cultural",
      count: getTagCount("cultural", "Cultural", tagCounts),
    },
    {
      icon: <Sparkles size={ICON_SIZE} />,
      title: "Celebraciones especiales",
      key: "celebration",
      count: getTagCount("celebration", "Celebración", tagCounts),
    },
  ],
});

const createAttractionTags = (tagCounts) => [
  {
    icon: <Trees size={ICON_SIZE} />,
    title: "Naturaleza",
    key: "nature",
    count: getTagCount("nature", "Naturaleza", tagCounts),
  },
  {
    icon: <Waves size={ICON_SIZE} />,
    title: "Playa",
    key: "beach",
    count: getTagCount("beach", "Playa", tagCounts),
  },
  {
    icon: <Building2 size={ICON_SIZE} />,
    title: "Monumento",
    key: "monument",
    count: getTagCount("monument", "Monumento", tagCounts),
  },
  {
    icon: <CookingPot size={ICON_SIZE} />,
    title: "Gastronomía",
    key: "gastronomy",
    count: getTagCount("gastronomy", "Gastronomía", tagCounts),
  },
  {
    icon: <Martini size={ICON_SIZE} />,
    title: "Noche",
    key: "nightlife",
    count: getTagCount("nightlife", "Noche", tagCounts),
  },
  {
    icon: <Amphora size={ICON_SIZE} />,
    title: "Museo",
    key: "museum",
    count: getTagCount("museum", "Museo", tagCounts),
  },
  {
    icon: <Coffee size={ICON_SIZE} />,
    title: "Cafés",
    key: "cafe",
    count: getTagCount("cafe", "Café", tagCounts),
  },
  {
    icon: <Store size={ICON_SIZE} />,
    title: "Shopping",
    key: "shopping",
    count: getTagCount("shopping", "Shopping", tagCounts),
  },
  {
    icon: <Blocks size={ICON_SIZE} />,
    title: "Ocio",
    key: "entertainment",
    count: getTagCount("entertainment", "Ocio", tagCounts),
  },
  {
    icon: <PartyPopper size={ICON_SIZE} />,
    title: "Festival",
    key: "festival",
    count: getTagCount("festival", "Festival", tagCounts),
  },
  {
    icon: <Bot size={ICON_SIZE} />,
    title: "Tecnología",
    key: "technology",
    count: getTagCount("technology", "Tecnología", tagCounts),
  },
  {
    icon: <Gamepad2 size={ICON_SIZE} />,
    title: "Juegos",
    key: "gaming",
    count: getTagCount("gaming", "Juegos", tagCounts),
  },
  {
    icon: <Cat size={ICON_SIZE} />,
    title: "Anime",
    key: "anime",
    count: getTagCount("anime", "Anime", tagCounts),
  },
  {
    icon: <FerrisWheel size={ICON_SIZE} />,
    title: "Parques temáticos",
    key: "theme_park",
    count: getTagCount("theme_park", "Parque temático", tagCounts),
  },
  {
    icon: <Church size={ICON_SIZE} />,
    title: "Templo Budista",
    key: "buddhist_temple",
    count: getTagCount("buddhist_temple", "Templo Budista", tagCounts),
  },
  {
    icon: <Bird size={ICON_SIZE} />,
    title: "Reserva de Aves",
    key: "bird_sanctuary",
    count: getTagCount("bird_sanctuary", "Reserva aves", tagCounts),
  },
  {
    icon: <Castle size={ICON_SIZE} />,
    title: "Castillos",
    key: "castle",
    count: getTagCount("castle", "Castillo", tagCounts),
  },
  {
    icon: <Church size={ICON_SIZE} />,
    title: "Templo Cristiano",
    key: "christian_temple",
    count: getTagCount("christian_temple", "Templo Cristiano", tagCounts),
  },
  {
    icon: <Church size={ICON_SIZE} />,
    title: "Templo Sintoísta",
    key: "shinto_shrine",
    count: getTagCount("shinto_shrine", "Templo Sintoísta", tagCounts),
  },
  {
    icon: <Church size={ICON_SIZE} />,
    title: "Templo Hindú",
    key: "hindu_temple",
    count: getTagCount("hindu_temple", "Templo Hindú", tagCounts),
  },
  {
    icon: <Waves size={ICON_SIZE} />,
    title: "Aguas Termales",
    key: "hot_springs",
    count: getTagCount("hot_springs", "Aguas Termales", tagCounts),
  },
  {
    icon: <Grape size={ICON_SIZE} />,
    title: "Viñedos",
    key: "vineyard",
    count: getTagCount("vineyard", "Viñedo", tagCounts),
  },
];

const createRestaurantTags = (tagCounts) => ({
  restaurantTypes: [
    {
      icon: <Soup size={ICON_SIZE} />,
      title: "Restaurantes tradicionales japoneses",
      key: "traditional_japanese",
      count: getTagCount(
        "traditional_japanese",
        "Tradicional japonés",
        tagCounts
      ),
    },
    {
      icon: <Truck size={ICON_SIZE} />,
      title: "Cadenas de comida rápida",
      key: "fast_food",
      count: getTagCount("fast_food", "Comida rápida", tagCounts),
    },
    {
      icon: <Coffee size={ICON_SIZE} />,
      title: "Cafeterías y cafés",
      key: "cafe_restaurant",
      count: getTagCount("cafe_restaurant", "Cafetería", tagCounts),
    },
    {
      icon: <Crown size={ICON_SIZE} />,
      title: "Restaurantes de alta cocina",
      key: "fine_dining",
      count: getTagCount("fine_dining", "Alta cocina", tagCounts),
    },
    {
      icon: <Truck size={ICON_SIZE} />,
      title: "Food trucks",
      key: "food_truck",
      count: getTagCount("food_truck", "Food truck", tagCounts),
    },
    {
      icon: <Wine size={ICON_SIZE} />,
      title: "Izakaya (tabernas)",
      key: "izakaya",
      count: getTagCount("izakaya", "Izakaya", tagCounts),
    },
    {
      icon: <Users size={ICON_SIZE} />,
      title: "Restaurantes familiares",
      key: "family_restaurant",
      count: getTagCount("family_restaurant", "Familiar", tagCounts),
    },
    {
      icon: <Bell size={ICON_SIZE} />,
      title: "Kaiseki (alta cocina tradicional)",
      key: "kaiseki",
      count: getTagCount("kaiseki", "Kaiseki", tagCounts),
    },
    {
      icon: <Building2 size={ICON_SIZE} />,
      title: "Restaurantes en rascacielos",
      key: "skyscraper_restaurant",
      count: getTagCount("skyscraper_restaurant", "Rascacielos", tagCounts),
    },
    {
      icon: <Camera size={ICON_SIZE} />,
      title: "Restaurantes con vista",
      key: "view_restaurant",
      count: getTagCount("view_restaurant", "Con vista", tagCounts),
    },
  ],
  cuisines: [
    // Japanese Traditional
    {
      icon: <Fish size={ICON_SIZE} />,
      title: "Sushi y sashimi",
      key: "sushi",
      count: getTagCount("sushi", "Sushi", tagCounts),
    },
    {
      icon: <Soup size={ICON_SIZE} />,
      title: "Ramen",
      key: "ramen",
      count: getTagCount("ramen", "Ramen", tagCounts),
    },
    {
      icon: <Fish size={ICON_SIZE} />,
      title: "Tempura",
      key: "tempura",
      count: getTagCount("tempura", "Tempura", tagCounts),
    },
    {
      icon: <Beef size={ICON_SIZE} />,
      title: "Yakitori",
      key: "yakitori",
      count: getTagCount("yakitori", "Yakitori", tagCounts),
    },
    {
      icon: <Flame size={ICON_SIZE} />,
      title: "Yakiniku (barbacoa)",
      key: "yakiniku",
      count: getTagCount("yakiniku", "Yakiniku", tagCounts),
    },
    {
      icon: <CookingPot size={ICON_SIZE} />,
      title: "Shabu-shabu/Sukiyaki",
      key: "hotpot",
      count: getTagCount("hotpot", "Shabu-shabu", tagCounts),
    },
    {
      icon: <Wheat size={ICON_SIZE} />,
      title: "Udon y soba",
      key: "noodles",
      count: getTagCount("noodles", "Udon", tagCounts),
    },
    {
      icon: <Soup size={ICON_SIZE} />,
      title: "Donburi (platos sobre arroz)",
      key: "donburi",
      count: getTagCount("donburi", "Donburi", tagCounts),
    },
    {
      icon: <Utensils size={ICON_SIZE} />,
      title: "Kaiseki",
      key: "kaiseki_cuisine",
      count: getTagCount("kaiseki_cuisine", "Kaiseki", tagCounts),
    },
    {
      icon: <Soup size={ICON_SIZE} />,
      title: "Bento boxes",
      key: "bento",
      count: getTagCount("bento", "Bento", tagCounts),
    },
    // International
    {
      icon: <Globe size={ICON_SIZE} />,
      title: "Internacional",
      key: "international",
      count: getTagCount("international", "Internacional", tagCounts),
    },
    {
      icon: <UtensilsCrossed size={ICON_SIZE} />,
      title: "Fusión japonesa-occidental",
      key: "fusion",
      count: getTagCount("fusion", "Fusión", tagCounts),
    },
    {
      icon: <Pizza size={ICON_SIZE} />,
      title: "Cocina italiana",
      key: "italian",
      count: getTagCount("italian", "Italiana", tagCounts),
    },
    {
      icon: <Milk size={ICON_SIZE} />,
      title: "Cocina francesa",
      key: "french",
      count: getTagCount("french", "Francesa", tagCounts),
    },
    {
      icon: <Wheat size={ICON_SIZE} />,
      title: "Cocina china",
      key: "chinese",
      count: getTagCount("chinese", "China", tagCounts),
    },
    {
      icon: <Soup size={ICON_SIZE} />,
      title: "Cocina coreana",
      key: "korean",
      count: getTagCount("korean", "Coreana", tagCounts),
    },
    {
      icon: <Soup size={ICON_SIZE} />,
      title: "Cocina tailandesa",
      key: "thai",
      count: getTagCount("thai", "Tailandesa", tagCounts),
    },
    {
      icon: <Soup size={ICON_SIZE} />,
      title: "Cocina india",
      key: "indian",
      count: getTagCount("indian", "India", tagCounts),
    },
    // Special Diets
    {
      icon: <Salad size={ICON_SIZE} />,
      title: "Vegetariana/Vegana",
      key: "vegetarian",
      count: getTagCount("vegetarian", "Vegetariana", tagCounts),
    },
    {
      icon: <Wheat size={ICON_SIZE} />,
      title: "Sin gluten",
      key: "gluten_free",
      count: getTagCount("gluten_free", "Sin gluten", tagCounts),
    },
    {
      icon: <Shield size={ICON_SIZE} />,
      title: "Halal",
      key: "halal",
      count: getTagCount("halal", "Halal", tagCounts),
    },
    {
      icon: <Shield size={ICON_SIZE} />,
      title: "Kosher",
      key: "kosher",
      count: getTagCount("kosher", "Kosher", tagCounts),
    },
    {
      icon: <Heart size={ICON_SIZE} />,
      title: "Comida saludable",
      key: "healthy",
      count: getTagCount("healthy", "Saludable", tagCounts),
    },
    {
      icon: <Baby size={ICON_SIZE} />,
      title: "Apto para niños",
      key: "kid_friendly",
      count: getTagCount("kid_friendly", "Niños", tagCounts),
    },
  ],
  restaurantServices: [
    {
      icon: <Wifi size={ICON_SIZE} />,
      title: "Wi-Fi gratis",
      key: "wifi",
      count: getTagCount("wifi", "Wi-Fi", tagCounts),
    },
    {
      icon: <Globe size={ICON_SIZE} />,
      title: "Menú en inglés",
      key: "english_menu",
      count: getTagCount("english_menu", "Menú inglés", tagCounts),
    },
    {
      icon: <Calendar size={ICON_SIZE} />,
      title: "Reservas en línea",
      key: "online_booking",
      count: getTagCount("online_booking", "Reservas", tagCounts),
    },
    {
      icon: <Truck size={ICON_SIZE} />,
      title: "Entrega a domicilio",
      key: "delivery",
      count: getTagCount("delivery", "Entrega", tagCounts),
    },
    {
      icon: <ShoppingBag size={ICON_SIZE} />,
      title: "Para llevar",
      key: "takeout",
      count: getTagCount("takeout", "Para llevar", tagCounts),
    },
    {
      icon: <Flame size={ICON_SIZE} />,
      title: "Terraza exterior",
      key: "outdoor_seating",
      count: getTagCount("outdoor_seating", "Terraza", tagCounts),
    },
    {
      icon: <Dog size={ICON_SIZE} />,
      title: "Admite mascotas",
      key: "pet_friendly_restaurant",
      count: getTagCount("pet_friendly_restaurant", "Mascotas", tagCounts),
    },
    {
      icon: <Leaf size={ICON_SIZE} />,
      title: "Ingredientes orgánicos",
      key: "organic",
      count: getTagCount("organic", "Orgánico", tagCounts),
    },
    {
      icon: <Fish size={ICON_SIZE} />,
      title: "Mariscos frescos diarios",
      key: "fresh_seafood",
      count: getTagCount("fresh_seafood", "Mariscos frescos", tagCounts),
    },
    {
      icon: <Baby size={ICON_SIZE} />,
      title: "Menús infantiles",
      key: "kids_menu",
      count: getTagCount("kids_menu", "Menú infantil", tagCounts),
    },
    {
      icon: <Wine size={ICON_SIZE} />,
      title: "Servicio de sommelier",
      key: "sommelier",
      count: getTagCount("sommelier", "Sommelier", tagCounts),
    },
    {
      icon: <Music size={ICON_SIZE} />,
      title: "Música en vivo",
      key: "live_music",
      count: getTagCount("live_music", "Música vivo", tagCounts),
    },
    {
      icon: <CreditCard size={ICON_SIZE} />,
      title: "Acepta tarjetas extranjeras",
      key: "foreign_cards",
      count: getTagCount("foreign_cards", "Tarjetas extranjeras", tagCounts),
    },
    {
      icon: <Clock size={ICON_SIZE} />,
      title: "Abierto 24 horas",
      key: "24h_open",
      count: getTagCount("24h_open", "24 horas", tagCounts),
    },
    {
      icon: <Users size={ICON_SIZE} />,
      title: "Ideal para grupos",
      key: "group_friendly",
      count: getTagCount("group_friendly", "Para grupos", tagCounts),
    },
    {
      icon: <Heart size={ICON_SIZE} />,
      title: "Ambiente romántico",
      key: "romantic_atmosphere",
      count: getTagCount("romantic_atmosphere", "Romántico", tagCounts),
    },
    {
      icon: <Briefcase size={ICON_SIZE} />,
      title: "Reuniones de negocios",
      key: "business_meetings",
      count: getTagCount("business_meetings", "Reuniones", tagCounts),
    },
    {
      icon: <Sparkles size={ICON_SIZE} />,
      title: "Celebraciones especiales",
      key: "special_events",
      count: getTagCount("special_events", "Celebraciones", tagCounts),
    },
    {
      icon: <Camera size={ICON_SIZE} />,
      title: "Instagram-worthy",
      key: "instagram",
      count: getTagCount("instagram", "Instagram", tagCounts),
    },
    {
      icon: <Mic size={ICON_SIZE} />,
      title: "Karaoke disponible",
      key: "karaoke",
      count: getTagCount("karaoke", "Karaoke", tagCounts),
    },
  ],
});

const Aside = ({
  onFilterChange,
  selectedFilter,
  tagCounts = {}, // Add tagCounts prop
  isLoading = false, // Add loading prop
  totalExperiences = 0, // Add total count prop
}) => {
  const theme = useTheme();
  const [selectedFilters, setSelectedFilters] = useState({
    region: "",
    tags: [],
  });

  // Create tag objects with counts
  const generalTags = createGeneralTags(tagCounts);
  const hotelTags = createHotelTags(tagCounts);
  const attractionTags = createAttractionTags(tagCounts);
  const restaurantTags = createRestaurantTags(tagCounts);

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
          disabled={isLoading || tag.count === 0}
          sx={{
            marginRight: 1,
            color: theme.palette.primary.main,
            "&.Mui-checked": {
              color: theme.palette.primary.main,
            },
            "&:hover": {
              backgroundColor: `${theme.palette.primary.light}`,
            },
            "&.Mui-disabled": {
              color: theme.palette.text.disabled,
            },
          }}
        />
      }
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: 1,
            opacity: tag.count === 0 ? 0.5 : 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
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
          <Typography
            variant="caption"
            sx={{
              color:
                tag.count === 0
                  ? theme.palette.text.disabled
                  : theme.palette.text.secondary,
              fontSize: "0.75rem",
              fontWeight: 500,
              backgroundColor:
                tag.count === 0
                  ? theme.palette.secondary.main
                  : theme.palette.secondary.light,
              padding: "2px 6px",
              borderRadius: "8px",
              minWidth: "24px",
              textAlign: "center",
            }}
          >
            {isLoading ? "..." : tag.count?.toLocaleString() || "0"}
          </Typography>
        </Box>
      }
      sx={{
        width: "100%",
        margin: 0,
        padding: "4px 0",
        "&:hover": {
          backgroundColor:
            tag.count > 0 ? `${theme.palette.primary.light}` : "transparent",
          borderRadius: 1,
        },
        transition: "background-color 0.2s ease-in-out",
      }}
    />
  );

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Cargando filtros...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", md: "320px" },
        backgroundColor: theme.palette.background.default,
        borderRadius: 2,
        p: 3,
        height: "fit-content",
        border: `1px solid ${theme.palette.neutral?.light || theme.palette.grey[200]}`,
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
        {totalExperiences > 0 && (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.75rem",
              backgroundColor: theme.palette.secondary.light,
              padding: "2px 6px",
              borderRadius: "8px",
            }}
          >
            {totalExperiences.toLocaleString()}
          </Typography>
        )}
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
          borderRadius: 4,
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
              disabled={isLoading}
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
                  {region}{" "}
                  {tagCounts[region]
                    ? `(${tagCounts[region].toLocaleString()})`
                    : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Filter Sections */}
      <Box sx={{ "& .MuiAccordion-root": { mb: 1 } }}>
        {/* General Filters */}
        <Accordion
          elevation={0}
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          <AccordionSummary
            expandIcon={
              <ChevronDown sx={{ color: theme.palette.text.primary }} />
            }
          >
            <Typography
              variant="subtitle1"
              sx={{ color: theme.palette.text.primary }}
            >
              Filtros generales
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, color: theme.palette.primary.main }}
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
              sx={{ mt: 2, mb: 1, color: theme.palette.primary.main }}
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
              sx={{ mt: 2, mb: 1, color: theme.palette.primary.main }}
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
        <Accordion
          elevation={0}
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          <AccordionSummary
            expandIcon={
              <ChevronDown sx={{ color: theme.palette.text.primary }} />
            }
          >
            <Typography
              variant="subtitle1"
              sx={{ color: theme.palette.text.primary }}
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
        <Accordion
          elevation={0}
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          <AccordionSummary
            expandIcon={
              <ChevronDown sx={{ color: theme.palette.text.primary }} />
            }
          >
            <Typography
              variant="subtitle1"
              sx={{ color: theme.palette.text.primary }}
            >
              Filtros de hoteles
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, color: theme.palette.primary.main }}
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
              sx={{ mt: 2, mb: 1, color: theme.palette.primary.main }}
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
              sx={{ mt: 2, mb: 1, color: theme.palette.primary.main }}
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
        <Accordion
          elevation={0}
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          <AccordionSummary
            expandIcon={
              <ChevronDown sx={{ color: theme.palette.text.primary }} />
            }
          >
            <Typography
              variant="subtitle1"
              sx={{ color: theme.palette.text.primary }}
            >
              Filtros de restaurantes
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, color: theme.palette.primary.main }}
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
              sx={{ mt: 2, mb: 1, color: theme.palette.primary.main }}
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
              sx={{ mt: 2, mb: 1, color: theme.palette.primary.main }}
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
      <Box sx={{ display: "flex", gap: 2, mt: 4, flexDirection: "column" }}>
        <Button
          variant="contained"
          startIcon={<CircleCheck size={24} />}
          onClick={applyFilters}
          disabled={isLoading}
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
          Aplicar filtros
        </Button>
        <Button
          variant="outlined"
          startIcon={<RotateCcw size={24} />}
          onClick={clearFilters}
          disabled={isLoading}
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
          Borrar filtros
        </Button>
      </Box>
    </Box>
  );
};

export default Aside;
