// services/TagMappingService.js - Updated with YOUR actual schema values

export class TagMappingService {
  constructor() {
    // These are YOUR actual enum values from the schema
    this.validTags = {
      attractionTags: [
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
      ],

      generalTags: {
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
      },

      restaurantTags: {
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
      },

      hotelTags: {
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
      },
    };

    // Updated mappings to match your schema values
    this.mappings = {
      // Google Places types to YOUR attraction tags
      attractionMappings: {
        amusement_park: "Parques temáticos",
        aquarium: "Acuarios y vida marina",
        art_gallery: "Museos de arte",
        casino: "Bares y pubs",
        church: "Templos budistas",
        hindu_temple: "Templos sintoístas",
        museum: "Museo",
        night_club: "Clubes nocturnos",
        park: "Bosques y naturaleza",
        place_of_worship: "Templos sintoístas",
        shopping_mall: "Centros comerciales",
        stadium: "Eventos especiales",
        tourist_attraction: "Monumentos históricos",
        zoo: "Parques de monos",
        cemetery: "Monumentos históricos",
        library: "Sitios literarios",
        university: "Sitios literarios",
        // Spanish terms
        ocio: "Karaoke",
        entretenimiento: "Parques temáticos",
        cultura: "Cultura samurai",
        museo: "Museo",
        templo: "Templos budistas",
        parque: "Bosques y naturaleza",
        compras: "Centros comerciales",
        naturaleza: "Bosques y naturaleza",
      },

      // Budget mappings to YOUR schema values
      budgetMappings: {
        económico: "Económico (¥0-3,000)",
        barato: "Económico (¥0-3,000)",
        gratis: "Gratis",
        free: "Gratis",
        caro: "Premium (¥10,000-30,000)",
        expensive: "Premium (¥10,000-30,000)",
        medio: "Moderado (¥3,000-10,000)",
        moderado: "Moderado (¥3,000-10,000)",
        moderate: "Moderado (¥3,000-10,000)",
        lujo: "Lujo (¥30,000+)",
        luxury: "Lujo (¥30,000+)",
        premium: "Premium (¥10,000-30,000)",
      },

      // Location mappings to YOUR schema values
      locationMappings: {
        "cerca de áreas de puntos de interés": "Centro de la ciudad",
        centro: "Centro de la ciudad",
        "centro de la ciudad": "Centro de la ciudad",
        downtown: "Centro de la ciudad",
        "near station": "Cerca de estaciones JR",
        "cerca del transporte": "Cerca de metro",
        "zona comercial": "Distritos comerciales",
        "shopping area": "Distritos comerciales",
        historic: "Monumentos históricos",
        histórico: "Monumentos históricos",
        moderno: "Centro de la ciudad",
        modern: "Centro de la ciudad",
        residential: "Centro de la ciudad",
        residencial: "Centro de la ciudad",
        coast: "Zona costera",
        beach: "Zona costera",
        nature: "Parques y naturaleza",
        airport: "Cerca de aeropuertos",
      },

      // Restaurant cuisine mappings to YOUR schema values
      cuisineMappings: {
        japanese: "Sushi y sashimi",
        sushi: "Sushi y sashimi",
        ramen: "Ramen",
        italian: "Cocina italiana",
        french: "Cocina francesa",
        chinese: "Cocina china",
        korean: "Cocina coreana",
        international: "Internacional",
        yakitori: "Yakitori",
        tempura: "Tempura",
        teppanyaki: "Yakiniku (barbacoa)",
        thai: "Cocina tailandesa",
        indian: "Cocina india",
      },

      // Hotel accommodation mappings to YOUR schema values
      accommodationMappings: {
        hotel: "Hoteles de lujo occidentales",
        ryokan: "Ryokan tradicionales",
        hostel: "Hostales para mochileros",
        apartment: "Apartamentos/Airbnb",
        guesthouse: "Alojamiento rural (Minshuku)",
        resort: "Resorts con onsen",
        business_hotel: "Hoteles de negocios",
        capsule_hotel: "Hoteles cápsula",
      },
    };
  }

  // Map attraction tags using your schema values
  mapAttractionTags(rawTags) {
    if (!Array.isArray(rawTags)) return [];

    return rawTags
      .map((tag) => {
        const normalizedTag = tag.toLowerCase();
        return this.mappings.attractionMappings[normalizedTag] || null;
      })
      .filter((tag) => tag && this.validTags.attractionTags.includes(tag))
      .slice(0, 3); // Limit to 3 tags
  }

  // Map general tags using your schema values
  mapGeneralTags(rawGeneralTags) {
    const result = {
      season: [],
      budget: [],
      rating: [],
      location: [],
    };

    // Map budget
    if (rawGeneralTags.budget) {
      const budgetTags = Array.isArray(rawGeneralTags.budget)
        ? rawGeneralTags.budget
        : [rawGeneralTags.budget];
      result.budget = budgetTags
        .map((tag) => {
          const normalizedTag = tag.toLowerCase();
          return this.mappings.budgetMappings[normalizedTag] || null;
        })
        .filter((tag) => tag && this.validTags.generalTags.budget.includes(tag))
        .slice(0, 1); // Usually just one budget level
    }

    // Map location
    if (rawGeneralTags.location) {
      const locationTags = Array.isArray(rawGeneralTags.location)
        ? rawGeneralTags.location
        : [rawGeneralTags.location];
      result.location = locationTags
        .map((tag) => {
          const normalizedTag = tag.toLowerCase();
          return this.mappings.locationMappings[normalizedTag] || null;
        })
        .filter(
          (tag) => tag && this.validTags.generalTags.location.includes(tag)
        )
        .slice(0, 2);
    }

    // Default season
    result.season =
      rawGeneralTags.season && Array.isArray(rawGeneralTags.season)
        ? rawGeneralTags.season.filter((s) =>
            this.validTags.generalTags.season.includes(s)
          )
        : ["Todo el año"];

    return result;
  }

  // Map restaurant tags using your schema values
  mapRestaurantTags(rawRestaurantTags) {
    const result = {
      restaurantTypes: [],
      cuisines: [],
      restaurantServices: [],
    };

    // Map cuisines
    if (rawRestaurantTags.cuisines) {
      const cuisines = Array.isArray(rawRestaurantTags.cuisines)
        ? rawRestaurantTags.cuisines
        : [rawRestaurantTags.cuisines];
      result.cuisines = cuisines
        .map((tag) => {
          const normalizedTag = tag.toLowerCase();
          return this.mappings.cuisineMappings[normalizedTag] || null;
        })
        .filter(
          (tag) => tag && this.validTags.restaurantTags.cuisines.includes(tag)
        )
        .slice(0, 3);
    }

    // Default restaurant type
    result.restaurantTypes = ["Restaurantes tradicionales japoneses"];

    return result;
  }

  // Map hotel tags using your schema values
  mapHotelTags(rawHotelTags) {
    const result = {
      accommodation: [],
      hotelServices: [],
      typeTrip: [],
    };

    // Map accommodation type
    if (rawHotelTags.accommodation) {
      const accommodations = Array.isArray(rawHotelTags.accommodation)
        ? rawHotelTags.accommodation
        : [rawHotelTags.accommodation];
      result.accommodation = accommodations
        .map((tag) => {
          const normalizedTag = tag.toLowerCase();
          return this.mappings.accommodationMappings[normalizedTag] || null;
        })
        .filter(
          (tag) => tag && this.validTags.hotelTags.accommodation.includes(tag)
        )
        .slice(0, 2);
    }

    // Default if no valid accommodation found
    if (result.accommodation.length === 0) {
      result.accommodation = ["Hoteles de lujo occidentales"];
    }

    return result;
  }

  // Auto-detect and map tags based on Google Places data using YOUR schema values
  autoMapFromGooglePlace(place, category) {
    const mappedTags = {
      attractionTags: [],
      generalTags: {
        season: ["Todo el año"],
        budget: [],
        rating: [],
        location: [],
      },
      restaurantTags: {
        restaurantTypes: [],
        cuisines: [],
        restaurantServices: [],
      },
      hotelTags: { accommodation: [], hotelServices: [], typeTrip: [] },
    };

    // Map based on Google Places types
    if (place.types && Array.isArray(place.types)) {
      if (category === "Atractivos") {
        mappedTags.attractionTags = this.mapAttractionTags(place.types);
        // Default if no mapping found
        if (mappedTags.attractionTags.length === 0) {
          mappedTags.attractionTags = ["Monumentos históricos"];
        }
      } else if (category === "Restaurantes") {
        mappedTags.restaurantTags.cuisines = this.mapRestaurantTags({
          cuisines: place.types,
        }).cuisines;
        mappedTags.restaurantTags.restaurantTypes = [
          "Restaurantes tradicionales japoneses",
        ];
        // Default if no cuisine mapping found
        if (mappedTags.restaurantTags.cuisines.length === 0) {
          mappedTags.restaurantTags.cuisines = ["Sushi y sashimi"];
        }
      } else if (category === "Hoteles") {
        mappedTags.hotelTags.accommodation = this.mapHotelTags({
          accommodation: place.types,
        }).accommodation;
      }
    }

    // Map price level to budget using YOUR schema values
    if (typeof place.price_level !== "undefined") {
      const priceMap = {
        0: "Gratis",
        1: "Económico (¥0-3,000)",
        2: "Moderado (¥3,000-10,000)",
        3: "Premium (¥10,000-30,000)",
        4: "Lujo (¥30,000+)",
      };
      mappedTags.generalTags.budget = [
        priceMap[place.price_level] || "Moderado (¥3,000-10,000)",
      ];
    } else {
      // Default budget
      mappedTags.generalTags.budget = ["Moderado (¥3,000-10,000)"];
    }

    // Default location
    mappedTags.generalTags.location = ["Centro de la ciudad"];

    return mappedTags;
  }

  // Validate all tags before saving
  validateTags(tags) {
    const errors = [];

    // Validate attraction tags
    if (tags.attractionTags) {
      tags.attractionTags.forEach((tag) => {
        if (!this.validTags.attractionTags.includes(tag)) {
          errors.push(`Invalid attraction tag: ${tag}`);
        }
      });
    }

    // Validate general tags
    if (tags.generalTags) {
      ["season", "budget", "rating", "location"].forEach((field) => {
        if (tags.generalTags[field]) {
          tags.generalTags[field].forEach((tag) => {
            if (!this.validTags.generalTags[field].includes(tag)) {
              errors.push(`Invalid general.${field} tag: ${tag}`);
            }
          });
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default TagMappingService;
