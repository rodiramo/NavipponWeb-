import {
  Train,
  Plane,
  MapPin,
  Coins,
  Trees,
  Landmark,
  Utensils,
  Martini,
  Amphora,
  Coffee,
  ShoppingBag,
  Star,
  PartyPopper,
  Bot,
  Octagon,
  Sailboat,
  FerrisWheel,
  Shield,
  Castle,
  Church,
  Grape,
  Hotel,
  Building,
  WavesLadder,
  Home,
  Accessibility,
  Bed,
  Wifi,
  ParkingCircle,
  Bus,
  Dumbbell,
  Dog,
  Baby,
  Heart,
  Briefcase,
  Mountain,
  Soup,
  Fish,
  Leaf,
  ShoppingCart,
  FastForward,
  EggFried,
  ChefHat,
  Music,
  Mic,
  Guitar,
  Camera,
  Book,
  Gift,
  Sparkles,
  Sun,
  Cherry,
  Snowflake,
  Waves,
  Car,
  Bike,
  MapPin as LocationPin,
  Calendar,
  Clock,
  Users,
  Crown,
  Target,
  Compass,
  Globe,
  Store,
  ShoppingBasket,
  CreditCard,
  Eye,
  Anchor,
  Tent,
  Binoculars,
  TreePine,
} from "lucide-react";
import { FaSwimmingPool } from "react-icons/fa";
import BedroomChildOutlinedIcon from "@mui/icons-material/BedroomChildOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import HotTubOutlinedIcon from "@mui/icons-material/HotTubOutlined";
import TempleBuddhistOutlinedIcon from "@mui/icons-material/TempleBuddhistOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import KaraokeIcon from "@mui/icons-material/Mic";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import NightlifeIcon from "@mui/icons-material/Nightlife";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CollectionsIcon from "@mui/icons-material/Collections";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import WatchIcon from "@mui/icons-material/Watch";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import SnowboardingIcon from "@mui/icons-material/Snowboarding";
import SurfingIcon from "@mui/icons-material/Surfing";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import ElderyIcon from "@mui/icons-material/Elderly";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import CoupleIcon from "@mui/icons-material/Favorite";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import CelebrationIcon from "@mui/icons-material/Celebration";

export const generalTags = {
  budget: [
    { icon: <Coins />, title: "Gratis" },
    { icon: <Coins />, title: "Económico (¥0-3,000)" },
    { icon: <Coins />, title: "Moderado (¥3,000-10,000)" },
    { icon: <Coins />, title: "Premium (¥10,000-30,000)" },
    { icon: <Crown />, title: "Lujo (¥30,000+)" },
  ],
  location: [
    { icon: <Train />, title: "Cerca de estaciones JR" },
    { icon: <Train />, title: "Cerca de metro" },
    { icon: <Plane />, title: "Cerca de aeropuertos" },
    { icon: <MapPin />, title: "Centro de la ciudad" },
    { icon: <LocationPin />, title: "Distritos comerciales" },
    { icon: <Mountain />, title: "Áreas rurales/montañosas" },
    { icon: <BeachAccessOutlinedIcon />, title: "Zona costera" },
    { icon: <Trees />, title: "Parques y naturaleza" },
  ],
  season: [
    { icon: <Cherry />, title: "Primavera (Sakura)" },
    { icon: <Sun />, title: "Verano (Festivales)" },
    { icon: <Leaf />, title: "Otoño (Koyo)" },
    { icon: <Snowflake />, title: "Invierno (Nieve)" },
    { icon: <Calendar />, title: "Todo el año" },
  ],
};

export const attractionTags = [
  // Nature & Outdoor Activities
  { icon: <Trees size={16} />, title: "Bosques y naturaleza" },
  { icon: <Mountain size={16} />, title: "Montañas y senderismo" },
  { icon: <Compass size={16} />, title: "Escalada en roca" },
  { icon: <Bike size={16} />, title: "Ciclismo y rutas en bici" },
  { icon: <Camera size={16} />, title: "Fotografía de naturaleza" },
  { icon: <Eye size={16} />, title: "Observación de aves" },
  { icon: <Home size={16} />, title: "Camping y glamping" },

  // Water & Beach Activities
  { icon: <BeachAccessOutlinedIcon size={16} />, title: "Playas" },
  { icon: <Waves size={16} />, title: "Ríos y lagos" },
  { icon: <SurfingIcon size={16} />, title: "Surf y bodyboard" },
  { icon: <FaSwimmingPool size={16} />, title: "Natación" },
  { icon: <Car size={16} />, title: "Kayak y canoa" },
  { icon: <Sailboat size={16} />, title: "Paseos en barco" },
  { icon: <Fish size={16} />, title: "Pesca deportiva" },
  { icon: <Anchor size={16} />, title: "Deportes acuáticos" },
  { icon: <Waves size={16} />, title: "Cascadas" },
  { icon: <HotTubOutlinedIcon size={16} />, title: "Aguas termales (Onsen)" },

  // Wildlife & Adventure
  { icon: <Dog size={16} />, title: "Parques de monos" },
  { icon: <Fish size={16} />, title: "Acuarios y vida marina" },
  { icon: <Target size={16} />, title: "Safaris fotográficos" },
  { icon: <Binoculars size={16} />, title: "Observación de ballenas" },
  { icon: <TreePine size={16} />, title: "Caminatas nocturnas" },

  // Seasonal Nature & Activities
  { icon: <Cherry size={16} />, title: "Jardines de sakura" },
  { icon: <LocalFloristIcon size={16} />, title: "Jardines botánicos" },
  { icon: <Leaf size={16} />, title: "Observación de hojas otoñales (Koyo)" },
  { icon: <SnowboardingIcon size={16} />, title: "Esquí y snowboard" },
  { icon: <Snowflake size={16} />, title: "Festivales de nieve" },
  { icon: <Sun size={16} />, title: "Festivales de verano (Matsuri)" },
  { icon: <TreePine size={16} />, title: "Patinaje sobre hielo" },
  { icon: <Mountain size={16} />, title: "Escalada en hielo" },

  // Culture & History
  { icon: <Landmark size={16} />, title: "Monumentos históricos" },
  { icon: <Castle size={16} />, title: "Castillos" },
  {
    icon: <TempleBuddhistOutlinedIcon size={16} />,
    title: "Templos sintoístas",
  },
  { icon: <Church size={16} />, title: "Templos budistas" },
  { icon: <Amphora size={16} />, title: "Museos de arte" },
  { icon: <Bot size={16} />, title: "Museos de ciencia" },
  { icon: <Shield size={16} />, title: "Cultura samurai" },
  { icon: <Book size={16} />, title: "Sitios literarios" },

  // Modern Culture & Entertainment
  { icon: <Octagon size={16} />, title: "Anime y manga" },
  { icon: <AutoStoriesIcon size={16} />, title: "Tiendas de manga" },
  { icon: <CollectionsIcon size={16} />, title: "Figuras y coleccionables" },
  { icon: <VideogameAssetIcon size={16} />, title: "Arcades y videojuegos" },
  { icon: <KaraokeIcon size={16} />, title: "Karaoke" },
  { icon: <Bot size={16} />, title: "Tecnología y robots" },
  { icon: <Camera size={16} />, title: "Estudios de foto/cosplay" },

  // Nightlife & Entertainment
  { icon: <LocalBarIcon size={16} />, title: "Bares y pubs" },
  { icon: <NightlifeIcon size={16} />, title: "Clubes nocturnos" },
  { icon: <Martini size={16} />, title: "Bares temáticos" },
  { icon: <Music size={16} />, title: "Música en vivo" },
  { icon: <Guitar size={16} />, title: "Jazz bars" },
  { icon: <Mic size={16} />, title: "Karaoke boxes" },

  // Shopping
  { icon: <ShoppingBag size={16} />, title: "Centros comerciales" },
  { icon: <Store size={16} />, title: "Tiendas de segunda mano" },
  { icon: <CheckroomIcon size={16} />, title: "Moda y ropa" },
  { icon: <PhoneAndroidIcon size={16} />, title: "Electrónicos" },
  { icon: <WatchIcon size={16} />, title: "Relojes y joyería" },
  { icon: <Gift size={16} />, title: "Souvenirs únicos" },
  { icon: <Book size={16} />, title: "Librerías especializadas" },

  // Food & Drink
  { icon: <Utensils size={16} />, title: "Gastronomía local" },
  { icon: <Coffee size={16} />, title: "Cafés temáticos" },
  { icon: <Soup size={16} />, title: "Street food" },
  { icon: <Fish size={16} />, title: "Mercados de pescado" },
  { icon: <Grape size={16} />, title: "Viñedos y sake" },

  // Family & Special Interests
  { icon: <FerrisWheel size={16} />, title: "Parques temáticos" },
  { icon: <ChildFriendlyIcon size={16} />, title: "Apto para niños" },
  { icon: <PartyPopper size={16} />, title: "Festivales estacionales" },
  { icon: <CelebrationIcon size={16} />, title: "Eventos especiales" },
  { icon: <Star size={16} />, title: "Experiencias únicas" },
];

export const hotelTags = {
  accommodations: [
    { icon: <Hotel />, title: "Hoteles de lujo occidentales" },
    { icon: <SpaOutlinedIcon />, title: "Ryokan tradicionales" },
    { icon: <BedroomChildOutlinedIcon />, title: "Hoteles cápsula" },
    { icon: <Building />, title: "Hoteles de negocios" },
    { icon: <Home />, title: "Apartamentos/Airbnb" },
    { icon: <Bed />, title: "Hostales para mochileros" },
    { icon: <Mountain />, title: "Alojamiento rural (Minshuku)" },
    {
      icon: <TempleBuddhistOutlinedIcon />,
      title: "Estancia en templos (Shukubo)",
    },
    { icon: <Crown />, title: "Hoteles boutique" },
    { icon: <Trees />, title: "Cabañas en la naturaleza" },
    { icon: <Tent />, title: "Glamping y camping de lujo" },
    { icon: <HotTubOutlinedIcon />, title: "Resorts con onsen" },
    { icon: <BeachAccessOutlinedIcon />, title: "Resorts de playa" },
    { icon: <SnowboardingIcon />, title: "Alojamiento en estaciones de esquí" },
  ],
  hotelServices: [
    { icon: <Wifi />, title: "Wi-Fi gratis" },
    { icon: <EggFried />, title: "Desayuno incluido" },
    { icon: <ParkingCircle />, title: "Aparcamiento gratuito" },
    { icon: <Bus />, title: "Transporte al aeropuerto" },
    { icon: <WavesLadder />, title: "Piscina" },
    { icon: <Dumbbell />, title: "Gimnasio" },
    { icon: <Utensils />, title: "Restaurante en el hotel" },
    { icon: <HotTubOutlinedIcon />, title: "Onsen/Aguas termales" },
    { icon: <Accessibility />, title: "Accesible" },
    { icon: <Dog />, title: "Admite mascotas" },
    { icon: <Globe />, title: "Personal que habla inglés" },
    { icon: <Clock />, title: "Check-in 24h" },
    { icon: <Briefcase />, title: "Centro de negocios" },
    { icon: <Baby />, title: "Servicios para familias" },
    { icon: <Sparkles />, title: "Servicio de limpieza diario" },
  ],
  typeTrip: [
    { icon: <ChildFriendlyIcon />, title: "Viajes familiares" },
    { icon: <CoupleIcon />, title: "Luna de miel/Romántico" },
    { icon: <WorkIcon />, title: "Viajes de negocios" },
    { icon: <ShoppingCart />, title: "Mochileros/Presupuesto bajo" },
    { icon: <Mountain />, title: "Aventureros/Deportes" },
    { icon: <GroupIcon />, title: "Grupos grandes" },
    { icon: <PersonIcon />, title: "Viajeros solitarios" },
    { icon: <SchoolIcon />, title: "Viajes educativos" },
    { icon: <ElderyIcon />, title: "Viajeros mayores" },
    { icon: <Crown />, title: "Experiencias de lujo" },
    { icon: <Camera />, title: "Fotografía/Turismo cultural" },
    { icon: <PartyPopper />, title: "Celebraciones especiales" },
  ],
};

export const restaurantTags = {
  restaurantTypes: [
    { icon: <Soup />, title: "Restaurantes tradicionales japoneses" },
    { icon: <FastForward />, title: "Cadenas de comida rápida" },
    { icon: <Coffee />, title: "Cafeterías y cafés" },
    { icon: <ChefHat />, title: "Restaurantes de alta cocina" },
    { icon: <ShoppingBag />, title: "Food trucks" },
    { icon: <LocalBarIcon />, title: "Izakaya (tabernas)" },
    { icon: <Utensils />, title: "Restaurantes familiares" },
    { icon: <Crown />, title: "Kaiseki (alta cocina tradicional)" },
    { icon: <Building />, title: "Restaurantes en rascacielos" },
    { icon: <BeachAccessOutlinedIcon />, title: "Restaurantes con vista" },
  ],
  cuisines: [
    // Japanese Traditional
    { icon: <Soup />, title: "Sushi y sashimi" },
    { icon: <Soup />, title: "Ramen" },
    { icon: <Soup />, title: "Tempura" },
    { icon: <Soup />, title: "Yakitori" },
    { icon: <Soup />, title: "Yakiniku (barbacoa)" },
    { icon: <Soup />, title: "Shabu-shabu/Sukiyaki" },
    { icon: <Soup />, title: "Udon y soba" },
    { icon: <Soup />, title: "Donburi (platos sobre arroz)" },
    { icon: <Soup />, title: "Kaiseki" },
    { icon: <Soup />, title: "Bento boxes" },

    // International
    { icon: <Globe />, title: "Internacional" },
    { icon: <Soup />, title: "Fusión japonesa-occidental" },
    { icon: <Soup />, title: "Cocina italiana" },
    { icon: <Soup />, title: "Cocina francesa" },
    { icon: <Soup />, title: "Cocina china" },
    { icon: <Soup />, title: "Cocina coreana" },
    { icon: <Soup />, title: "Cocina tailandesa" },
    { icon: <Soup />, title: "Cocina india" },

    // Special Diets
    { icon: <Leaf />, title: "Vegetariana/Vegana" },
    { icon: <Leaf />, title: "Sin gluten" },
    { icon: <Soup />, title: "Halal" },
    { icon: <Soup />, title: "Kosher" },
    { icon: <Heart />, title: "Comida saludable" },
    { icon: <Baby />, title: "Apto para niños" },
  ],
  restaurantServices: [
    { icon: <Wifi />, title: "Wi-Fi gratis" },
    { icon: <Globe />, title: "Menú en inglés" },
    { icon: <Calendar />, title: "Reservas en línea" },
    { icon: <Car />, title: "Entrega a domicilio" },
    { icon: <ShoppingBasket />, title: "Para llevar" },
    { icon: <Trees />, title: "Terraza exterior" },
    { icon: <Dog />, title: "Admite mascotas" },
    { icon: <Leaf />, title: "Ingredientes orgánicos" },
    { icon: <Fish />, title: "Mariscos frescos diarios" },
    { icon: <Baby />, title: "Menús infantiles" },
    { icon: <Crown />, title: "Servicio de sommelier" },
    { icon: <Music />, title: "Música en vivo" },
    { icon: <CreditCard />, title: "Acepta tarjetas extranjeras" },
    { icon: <Clock />, title: "Abierto 24 horas" },
    { icon: <Users />, title: "Ideal para grupos" },
    { icon: <CoupleIcon />, title: "Ambiente romántico" },
    { icon: <Briefcase />, title: "Reuniones de negocios" },
    { icon: <PartyPopper />, title: "Celebraciones especiales" },
    { icon: <Camera />, title: "Instagram-worthy" },
    { icon: <KaraokeIcon />, title: "Karaoke disponible" },
  ],
};
