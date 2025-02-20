import { Schema, model } from "mongoose";

const categoriesEnum = ["Hoteles", "Atractivos", "Restaurantes"];
const regions = {
  Hokkaido: ["Hokkaido"],
  Tohoku: ["Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima"],
  Kanto: [
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
    "Miyazaki",
    "Kagoshima",
    "Saga",
  ],
};

const generalTags = {
  season: ["Primavera", "Verano", "Otoño", "Invierno", "Todo el año"],
  budget: ["Gratis", "Económico", "Moderado", "Lujo"],
  rating: [1, 2, 3, 4, 5],
  location: [
    "Cerca de estaciones de tren o metro",
    "Cerca de aeropuertos",
    "Cerca de áreas de puntos de interés",
  ],
};

const hotelTags = {
  accommodation: [
    "Hoteles de lujo",
    "Ryokan (tradicional)",
    "Hoteles cápsula",
    "Hoteles de negocios",
    "Apartamentos",
    "Hostales",
  ],
  hotelServices: [
    "Wi-Fi gratis",
    "Desayuno incluido",
    "Aparcamiento gratuito",
    "Transporte al aeropuerto",
    "Piscina",
    "Gimnasio",
    "Restaurante en el hotel",
    "Accesible",
    "Admite mascotas",
  ],
  typeTrip: [
    "Familiar",
    "Luna de miel",
    "De negocios",
    "Amigable para mochileros",
    "Para aventureros",
  ],
};

const attractionTags = [
  "Naturaleza",
  "Playa",
  "Monumento",
  "Gastronomía",
  "Noche",
  "Museo",
  "Cafés",
  "Shopping",
  "Ocio",
  "Festival",
  "Tecnología",
  "Juegos",
  "Anime",
  "Parques temáticos",
  "Samurai",
  "Templo Budista",
  "Reserva de Aves",
  "Castillos",
  "Templo Cristiano",
  "Templo Sintoísta",
  "Templo Hindú",
  "Aguas Termales",
  "Viñedos",
];

const restaurantTags = {
  restaurantTypes: [
    "Restaurantes tradicionales",
    "Cadenas de comida rápida",
    "Cafeterías y cafés",
    "Restaurantes de alta cocina",
    "Food trucks",
    "Ramen",
    "Sushi",
  ],
  cuisines: [
    "Cocina japonesa tradicional",
    "Internacional",
    "Fusión",
    "Cocina vegetariana-vegana",
    "Cocina sin gluten",
    "Cocina halal",
    "Cocina kosher",
    "Rápida",
    "Cocina de autor",
    "Con espectáculo",
    "Familiar",
    "Romántica",
    "Negocios",
    "Ocasiones especiales",
  ],
  restaurantServices: [
    "Wi-Fi gratis",
    "Menú en inglés",
    "Reservas en línea",
    "Entregas a domicilio",
    "Terraza o comedor al aire libre",
    "Opciones de comida para llevar",
    "Admite mascotas",
    "Ingredientes orgánicos",
    "Mariscos frescos",
    "Menús infantiles",
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
    price: { type: Number, required: true },
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
