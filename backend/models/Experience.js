import { Schema, model } from "mongoose";

const categoriesEnum = ["Hoteles", "Atractivos", "Restaurantes"];
const regions = {
  Hokkaido: ["Hokkaido"],
  Tohoku: ["Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima"],
  Kanto: [
    "Tokyo",
    "Tokio",
    "Kanagawa",
    "Chiba",
    "Saitama",
    "Ibaraki",
    "Tochigi",
    "Gunma",
  ],
  Chubu: [
    "Aichi",
    "Shizuoka",
    "Gifu",
    "Nagano",
    "Niigata",
    "Toyama",
    "Ishikawa",
    "Fukui",
  ],
  Kansai: ["Osaka", "Kyoto", "Hyogo", "Nara", "Wakayama", "Shiga", "Mie"],
  Chugoku: ["Hiroshima", "Okayama", "Shimane", "Tottori", "Yamaguchi"],
  Shikoku: ["Ehime", "Kagawa", "Kochi", "Tokushima"],
  Kyushu: [
    "Fukuoka",
    "Nagasaki",
    "Kumamoto",
    "Oita",
    "Okinawa",
    "Miyazaki",
    "Kagoshima",
    "Saga",
  ],
};

// UPDATED: Expanded general tags
const generalTags = {
  season: [
    "Primavera (Sakura)",
    "Verano (Festivales)",
    "Otoño (Koyo)",
    "Invierno (Nieve)",
    "Todo el año",
  ],
  budget: [
    "Gratis",
    "Económico (¥0-3,000)",
    "Moderado (¥3,000-10,000)",
    "Premium (¥10,000-30,000)",
    "Lujo (¥30,000+)",
  ],
  rating: [1, 2, 3, 4, 5],
  location: [
    "Cerca de estaciones JR",
    "Cerca de metro",
    "Cerca de aeropuertos",
    "Centro de la ciudad",
    "Distritos comerciales",
    "Áreas rurales/montañosas",
    "Zona costera",
    "Parques y naturaleza",
  ],
};

// UPDATED: Expanded hotel tags
const hotelTags = {
  accommodation: [
    "Hoteles de lujo occidentales",
    "Ryokan tradicionales",
    "Hoteles cápsula",
    "Hoteles de negocios",
    "Apartamentos/Airbnb",
    "Hostales para mochileros",
    "Alojamiento rural (Minshuku)",
    "Estancia en templos (Shukubo)",
    "Hoteles boutique",
    "Cabañas en la naturaleza",
    "Glamping y camping de lujo",
    "Resorts con onsen",
    "Resorts de playa",
    "Alojamiento en estaciones de esquí",
  ],
  hotelServices: [
    "Wi-Fi gratis",
    "Desayuno incluido",
    "Aparcamiento gratuito",
    "Transporte al aeropuerto",
    "Piscina",
    "Gimnasio",
    "Restaurante en el hotel",
    "Onsen/Aguas termales",
    "Accesible",
    "Admite mascotas",
    "Personal que habla inglés",
    "Check-in 24h",
    "Centro de negocios",
    "Servicios para familias",
    "Servicio de limpieza diario",
  ],
  typeTrip: [
    "Viajes familiares",
    "Luna de miel/Romántico",
    "Viajes de negocios",
    "Mochileros/Presupuesto bajo",
    "Aventureros/Deportes",
    "Grupos grandes",
    "Viajeros solitarios",
    "Viajes educativos",
    "Viajeros mayores",
    "Experiencias de lujo",
    "Fotografía/Turismo cultural",
    "Celebraciones especiales",
  ],
};

// UPDATED: Massively expanded attraction tags
const attractionTags = [
  // Nature & Outdoor Activities
  "Bosques y naturaleza",
  "Parques nacionales",
  "Montañas y senderismo",
  "Escalada en roca",
  "Ciclismo y rutas en bici",
  "Trekking y mochileo",
  "Camping y glamping",
  "Observación de aves",
  "Fotografía de naturaleza",
  "Parapente y deportes aéreos",
  "Zip-lining y tirolinas",

  // Water & Beach Activities
  "Playas",
  "Ríos y lagos",
  "Surf y bodyboard",
  "Natación",
  "Kayak y canoa",
  "Paseos en barco",
  "Vela y navegación",
  "Pesca deportiva",
  "Jet ski y motos acuáticas",
  "Cascadas y saltos de agua",
  "Buceo y snorkel",
  "Aguas termales (Onsen)",

  // Wildlife & Adventure
  "Parques de monos",
  "Acuarios y vida marina",
  "Safaris fotográficos",
  "Observación de ballenas",
  "Caminatas nocturnas",

  // Seasonal Nature & Activities
  "Jardines de sakura",
  "Jardines botánicos",
  "Observación de hojas otoñales (Koyo)",
  "Esquí y snowboard",
  "Festivales de nieve",
  "Festivales de verano (Matsuri)",
  "Patinaje sobre hielo",
  "Escalada en hielo",

  // Culture & History
  "Monumentos históricos",
  "Castillos",
  "Templos sintoístas",
  "Templos budistas",
  "Museos de arte",
  "Museo",
  "Museos de ciencia",
  "Cultura samurai",
  "Sitios literarios",

  // Modern Culture & Entertainment
  "Anime y manga",
  "Tiendas de manga",
  "Figuras y coleccionables",
  "Arcades y videojuegos",
  "Karaoke",
  "Tecnología y robots",
  "Estudios de foto/cosplay",

  // Nightlife & Entertainment
  "Bares y pubs",
  "Clubes nocturnos",
  "Bares temáticos",
  "Música en vivo",
  "Jazz bars",

  // Shopping
  "Centros comerciales",
  "Tiendas de segunda mano",
  "Moda y ropa",
  "Electrónicos",
  "Relojes y joyería",
  "Souvenirs únicos",
  "Librerías especializadas",

  // Food & Drink
  "Gastronomía local",
  "Cafés temáticos",
  "Street food",
  "Mercados de pescado",
  "Viñedos y sake",

  // Family & Special Interests
  "Parques temáticos",
  "Apto para niños",
  "Festivales estacionales",
  "Eventos especiales",
  "Experiencias únicas",
];

// UPDATED: Expanded restaurant tags
const restaurantTags = {
  restaurantTypes: [
    "Restaurantes tradicionales japoneses",
    "Cadenas de comida rápida",
    "Cafeterías y cafés",
    "Restaurantes de alta cocina",
    "Food trucks",
    "Izakaya (tabernas)",
    "Restaurantes familiares",
    "Kaiseki (alta cocina tradicional)",
    "Restaurantes en rascacielos",
    "Restaurantes con vista",
  ],
  cuisines: [
    // Japanese Traditional
    "Sushi y sashimi",
    "Ramen",
    "Tempura",
    "Yakitori",
    "Yakiniku (barbacoa)",
    "Shabu-shabu/Sukiyaki",
    "Udon y soba",
    "Donburi (platos sobre arroz)",
    "Kaiseki",
    "Bento boxes",

    // International
    "Internacional",
    "Fusión japonesa-occidental",
    "Cocina italiana",
    "Cocina francesa",
    "Cocina china",
    "Cocina coreana",
    "Cocina tailandesa",
    "Cocina india",

    // Special Diets
    "Vegetariana",
    "Vegana",
    "Sin gluten",
    "Halal",
    "Kosher",
    "Comida saludable",
    "Apto para niños",
  ],
  restaurantServices: [
    "Wi-Fi gratis",
    "Menú en inglés",
    "Reservas en línea",
    "Entrega a domicilio",
    "Para llevar",
    "Terraza exterior",
    "Admite mascotas",
    "Ingredientes orgánicos",
    "Mariscos frescos diarios",
    "Menús infantiles",
    "Servicio de sommelier",
    "Música en vivo",
    "Acepta tarjetas extranjeras",
    "Abierto 24 horas",
    "Ideal para grupos",
    "Ambiente romántico",
    "Reuniones de negocios",
    "Celebraciones especiales",
    "Instagram-worthy",
    "Karaoke disponible",
  ],
};

const ExperienceSchema = new Schema(
  {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    body: { type: Object, required: false },
    photo: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    categories: {
      type: String,
      enum: categoriesEnum,
      required: true,
    },
    region: { type: String, enum: Object.keys(regions) },
    prefecture: {
      type: String,
      validate: {
        validator: function (value) {
          return regions[this.region] && regions[this.region].includes(value);
        },
        message:
          "La prefectura seleccionada no es válida para la región elegida.",
      },
    },
    price: { type: Number, required: false, default: "A consultar" },
    approved: { type: Boolean, default: false },
    generalTags: {
      season: [{ type: String, enum: generalTags.season }],
      budget: [{ type: String, enum: generalTags.budget }],
      rating: [{ type: Number, enum: generalTags.rating }],
      location: [{ type: String, enum: generalTags.location }],
    },

    ratings: {
      type: Number,
      default: 0,
    },
    numReviews: { type: Number, default: 0 },
    hotelTags: {
      accommodation: [{ type: String, enum: hotelTags.accommodation }],
      hotelServices: [{ type: String, enum: hotelTags.hotelServices }],
      typeTrip: [{ type: String, enum: hotelTags.typeTrip }],
    },
    attractionTags: [{ type: String, enum: attractionTags }],
    restaurantTags: {
      restaurantTypes: [{ type: String, enum: restaurantTags.restaurantTypes }],
      cuisines: [{ type: String, enum: restaurantTags.cuisines }],
      restaurantServices: [
        { type: String, enum: restaurantTags.restaurantServices },
      ],
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
      },
    },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    website: { type: String, required: false },
    schedule: { type: String, required: false },
    map: { type: String, required: false },
    address: { type: String, required: false },
    externalIds: {
      googlePlaceId: { type: String },
      osmId: { type: String },
      osmType: { type: String },
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

ExperienceSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "experience",
});

const Experience = model("Experience", ExperienceSchema);
export default Experience;
