// services/GooglePlacesService.js
class GooglePlacesService {
  constructor() {
    this.apiKey =
      process.env.GOOGLE_PLACES_API_KEY || process.env.REACT_APP_GOOGLE_API_KEY;
    this.baseUrl = "https://maps.googleapis.com/maps/api/place";

    if (!this.apiKey) {
      console.warn(
        "⚠️ Google Places API key not found. Set GOOGLE_PLACES_API_KEY in your .env file"
      );
    }
  }

  async searchPlaces(query, prefecture = "Tokyo") {
    if (!this.apiKey) {
      console.log("🔧 Using mock data - no API key");
      return this.getMockData(query, prefecture);
    }

    try {
      // Translate common search terms to get better results
      const translatedQuery = this.translateSearchQuery(query);
      const searchQuery = `${translatedQuery} ${prefecture} Japan`;
      console.log("🔍 Searching Google Places:", searchQuery);

      const response = await fetch(
        `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(
          searchQuery
        )}&language=es&region=jp&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Google API HTTP error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "OK") {
        console.warn(
          "⚠️ Google Places API warning:",
          data.status,
          data.error_message
        );
        if (data.status === "ZERO_RESULTS") {
          return [];
        }
        // For quota exceeded or other issues, fall back to mock data
        return this.getMockData(query, prefecture);
      }

      console.log(`✅ Found ${data.results.length} places from Google`);
      return data.results;
    } catch (error) {
      console.error("❌ Google Places search error:", error);
      console.log("🔧 Falling back to mock data");
      return this.getMockData(query, prefecture);
    }
  }

  async getPlaceDetails(placeId) {
    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,photos,rating,price_level,types,geometry,editorial_summary&language=es&region=jp&key=${this.apiKey}`
      );

      const data = await response.json();

      if (data.status === "OK") {
        return data.result;
      } else {
        console.warn("⚠️ Place details warning:", data.status);
        return null;
      }
    } catch (error) {
      console.error("❌ Place details error:", error);
      return null;
    }
  }

  translateSearchQuery(query) {
    const translations = {
      hoteles: "hotels",
      hotel: "hotel",
      restaurantes: "restaurants",
      restaurante: "restaurant",
      atractivos: "attractions",
      atracciones: "attractions",
      templos: "temples",
      templo: "temple",
      museos: "museums",
      museo: "museum",
      parques: "parks",
      parque: "park",
      castillos: "castles",
      castillo: "castle",
      jardines: "gardens",
      jardín: "garden",
      mercados: "markets",
      mercado: "market",
      tiendas: "shops",
      tienda: "shop",
      cafeterías: "cafes",
      cafetería: "cafe",
      bares: "bars",
      bar: "bar",
      ryokan: "ryokan",
      onsen: "onsen",
      sushi: "sushi",
      ramen: "ramen",
      izakaya: "izakaya",
    };

    const lowerQuery = query.toLowerCase();
    return translations[lowerQuery] || query;
  }

  getMockData(query, prefecture) {
    console.log("🔧 Generating mock data for:", query, prefecture);

    const mockResults = [
      {
        place_id: `mock_${query}_${prefecture}_${Date.now()}_1`,
        name: `Experiencia de ${query} en ${prefecture}`,
        formatted_address: `Calle Principal 123, ${prefecture}, Japón`,
        rating: 4.2,
        price_level:
          query.includes("templos") || query.includes("attractions") ? 0 : 2, // Free for temples/attractions
        types: ["establishment", "point_of_interest"],
        geometry: {
          location: {
            lat: prefecture === "Tokyo" ? 35.6762 : 35.0116,
            lng: prefecture === "Tokyo" ? 139.6503 : 135.7681,
          },
        },
        photos: [
          {
            photo_reference: "mock_photo_ref",
            height: 400,
            width: 600,
          },
        ],
        editorial_summary: {
          overview: `Una maravillosa experiencia de ${query} ubicada en el corazón de ${prefecture}. Este lugar ofrece una auténtica experiencia japonesa con servicios de alta calidad.`,
        },
      },
      {
        place_id: `mock_${query}_${prefecture}_${Date.now()}_2`,
        name: `Otra experiencia de ${query} en ${prefecture}`,
        formatted_address: `Avenida Secundaria 456, ${prefecture}, Japón`,
        rating: 4.5,
        price_level: 3,
        types: ["establishment", "tourist_attraction"],
        geometry: {
          location: {
            lat: prefecture === "Tokyo" ? 35.6895 : 35.0116,
            lng: prefecture === "Tokyo" ? 139.6917 : 135.7681,
          },
        },
        editorial_summary: {
          overview: `Un lugar excepcional para disfrutar de ${query} en ${prefecture}. Combina tradición japonesa con comodidades modernas.`,
        },
      },
    ];

    return mockResults;
  }

  transformToExperience(placeData, category, userId) {
    const { region, prefecture } = this.detectLocation(
      placeData.formatted_address
    );

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);

    return {
      title: placeData.name,
      caption: this.generateCaption(placeData),
      slug: this.generateSlug(placeData.name, timestamp, randomId),
      user: userId,
      categories: category,
      region: region,
      prefecture: prefecture,
      price: this.mapPrice(placeData.price_level, category),
      photo: this.getPhotoUrl(placeData.photos?.[0]),
      location: {
        type: "Point",
        coordinates: [
          placeData.geometry?.location?.lng || 0,
          placeData.geometry?.location?.lat || 0,
        ],
      },
      phone: placeData.formatted_phone_number || "",
      website: placeData.website || "",
      address: placeData.formatted_address || "",
      schedule: this.formatSchedule(placeData.opening_hours),
      ratings: placeData.rating || 0,
      numReviews: placeData.user_ratings_total || 0,
      approved: true, // Auto-approve imported experiences
      generalTags: {
        season: ["Todo el año"],
        budget: [this.mapBudget(placeData.price_level)],
        rating: [Math.round(placeData.rating || 0)],
        location: ["Cerca de áreas de puntos de interés"],
      },
      // Add category-specific tags
      ...this.getCategoryTags(category),
      // External reference to prevent duplicates
      externalIds: {
        googlePlaceId: placeData.place_id,
      },
    };
  }

  detectLocation(address) {
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
        "Miyazaki",
        "Kagoshima",
        "Saga",
      ],
    };

    for (const [region, prefectures] of Object.entries(regions)) {
      for (const prefecture of prefectures) {
        if (address?.includes(prefecture)) {
          return { region, prefecture };
        }
      }
    }

    return { region: "Kanto", prefecture: "Tokyo" };
  }

  generateCaption(placeData) {
    const parts = [];
    if (placeData.rating) parts.push(`⭐ ${placeData.rating}`);

    // Use budget level instead of numeric price level
    if (placeData.price_level !== undefined) {
      const budget = this.mapBudget(placeData.price_level);
      parts.push(`💰 ${budget}`);
    }

    // Create Spanish description directly
    const spanishDescription = this.createSpanishDescription(placeData);
    parts.push(spanishDescription);

    return parts.join(" • ");
  }

  createSpanishDescription(placeData) {
    const name = placeData.name || "";
    const types = placeData.types || [];
    const originalDescription = placeData.editorial_summary?.overview || "";

    console.log("🔍 Creating Spanish description for:", name, "Types:", types);

    // Detect restaurant types
    if (
      types.includes("restaurant") ||
      types.includes("food") ||
      types.includes("meal_delivery") ||
      types.includes("meal_takeaway")
    ) {
      // Specific cuisine detection
      if (
        name.toLowerCase().includes("sushi") ||
        originalDescription.toLowerCase().includes("sushi")
      ) {
        return "Restaurante especializado en sushi con pescado fresco y preparaciones tradicionales japonesas de alta calidad.";
      }
      if (
        name.toLowerCase().includes("ramen") ||
        originalDescription.toLowerCase().includes("ramen")
      ) {
        return "Local especializado en ramen auténtico con fideos japoneses caseros y caldos preparados tradicionalmente.";
      }
      if (
        name.toLowerCase().includes("izakaya") ||
        originalDescription.toLowerCase().includes("izakaya")
      ) {
        return "Izakaya tradicional japonés con ambiente acogedor, perfecto para disfrutar de comida casera y bebidas locales.";
      }
      if (
        name.toLowerCase().includes("yakitori") ||
        originalDescription.toLowerCase().includes("yakitori")
      ) {
        return "Restaurante de yakitori especializado en brochetas de pollo a la parrilla preparadas con técnicas tradicionales.";
      }
      if (
        name.toLowerCase().includes("tempura") ||
        originalDescription.toLowerCase().includes("tempura")
      ) {
        return "Restaurante especializado en tempura con vegetales y mariscos frescos rebozados y fritos a la perfección.";
      }
      if (
        name.toLowerCase().includes("teppanyaki") ||
        originalDescription.toLowerCase().includes("teppanyaki")
      ) {
        return "Restaurante teppanyaki donde los chefs preparan los alimentos en plancha caliente frente a los comensales.";
      }

      // Style and atmosphere detection
      if (
        originalDescription.includes("multi-course") ||
        originalDescription.includes("thoughtfully plated") ||
        originalDescription.includes("kaiseki")
      ) {
        return "Restaurante de alta cocina japonesa que ofrece menús kaiseki con múltiples platos artísticamente presentados y preparados con técnicas refinadas.";
      }
      if (
        originalDescription.includes("intimate") &&
        originalDescription.includes("minimalist")
      ) {
        return "Restaurante íntimo de estilo minimalista que ofrece una experiencia gastronómica japonesa sofisticada en un ambiente zen y elegante.";
      }
      if (
        originalDescription.includes("traditional") ||
        originalDescription.includes("authentic")
      ) {
        return "Restaurante tradicional japonés que preserva las técnicas culinarias ancestrales, ofreciendo sabores auténticos y experiencias culturales únicas.";
      }
      if (
        originalDescription.includes("casual") ||
        originalDescription.includes("family")
      ) {
        return "Restaurante familiar japonés con ambiente relajado y acogedor, ideal para disfrutar de comida casera tradicional.";
      }
      if (
        originalDescription.includes("upscale") ||
        originalDescription.includes("fine dining")
      ) {
        return "Restaurante de alta gama que combina la excelencia culinaria japonesa con un servicio impecable y ambiente refinado.";
      }

      // Default restaurant description
      return "Restaurante japonés que ofrece deliciosa comida tradicional preparada con ingredientes frescos y técnicas culinarias auténticas.";
    }

    // Detect accommodation types
    if (
      types.includes("lodging") ||
      types.includes("hotel") ||
      types.includes("hostel")
    ) {
      if (name.toLowerCase().includes("ryokan")) {
        return "Ryokan tradicional japonés que ofrece una experiencia auténtica de alojamiento con habitaciones de estilo japonés, futon y servicios tradicionales.";
      }
      if (
        originalDescription.includes("luxury") ||
        originalDescription.includes("premium")
      ) {
        return "Hotel de lujo que combina elegancia moderna con la hospitalidad tradicional japonesa, ofreciendo servicios premium.";
      }
      if (originalDescription.includes("business")) {
        return "Hotel de negocios ubicado estratégicamente, ideal para viajeros profesionales con todas las comodidades modernas.";
      }
      if (types.includes("hostel")) {
        return "Hostal cómodo y económico, perfecto para viajeros jóvenes que buscan una experiencia auténtica en Japón.";
      }
      return "Hotel confortable que ofrece una estancia agradable con excelentes servicios y ubicación conveniente en Japón.";
    }

    // Detect attractions and cultural sites
    if (
      types.includes("tourist_attraction") ||
      types.includes("point_of_interest") ||
      types.includes("place_of_worship")
    ) {
      if (
        types.includes("place_of_worship") ||
        name.includes("Temple") ||
        name.includes("Shrine") ||
        name.includes("寺") ||
        name.includes("神社")
      ) {
        if (
          name.includes("Buddha") ||
          originalDescription.includes("Buddhist")
        ) {
          return "Templo budista tradicional, lugar sagrado de gran importancia espiritual perfecto para la meditación y contemplación.";
        }
        return "Santuario sintoísta tradicional, espacio sagrado que representa la esencia de la espiritualidad japonesa y sus tradiciones ancestrales.";
      }
      if (types.includes("museum") || name.toLowerCase().includes("museum")) {
        return "Museo que exhibe la rica cultura e historia japonesa, ofreciendo una experiencia educativa fascinante sobre las tradiciones del país.";
      }
      if (
        types.includes("park") ||
        name.toLowerCase().includes("park") ||
        name.toLowerCase().includes("garden")
      ) {
        return "Hermoso jardín o parque japonés, espacio tranquilo ideal para pasear, relajarse y disfrutar de la naturaleza y la serenidad.";
      }
      if (
        name.toLowerCase().includes("castle") ||
        originalDescription.includes("castle")
      ) {
        return "Castillo histórico japonés, magnífica estructura que representa la arquitectura feudal y la rica historia samurái del país.";
      }
      if (
        originalDescription.includes("art") ||
        originalDescription.includes("exhibition")
      ) {
        return "Espacio cultural que exhibe arte japonés tradicional y contemporáneo, perfecto para descubrir la creatividad local.";
      }
      return "Atractivo turístico de gran importancia cultural que ofrece una experiencia única para conocer la auténtica tradición japonesa.";
    }

    // Shopping and commercial areas
    if (
      types.includes("shopping_mall") ||
      types.includes("store") ||
      types.includes("department_store")
    ) {
      return "Centro comercial donde puedes encontrar productos tradicionales japoneses, souvenirs únicos y artesanías locales auténticas.";
    }

    // Entertainment and nightlife
    if (types.includes("night_club") || types.includes("bar")) {
      return "Local nocturno donde disfrutar del ambiente japonés con bebidas tradicionales como sake y una experiencia cultural única.";
    }

    // Cafes and casual dining
    if (types.includes("cafe") || types.includes("bakery")) {
      return "Cafetería japonesa que ofrece un ambiente tranquilo para disfrutar de café de calidad y dulces tradicionales japoneses.";
    }

    // Generic description based on location
    const { prefecture } = this.detectLocation(placeData.formatted_address);
    return `Lugar de interés en ${prefecture} que ofrece una experiencia auténtica de la cultura, tradiciones y hospitalidad japonesa.`;
  }

  generateSlug(name, timestamp, randomId) {
    const cleanName = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);

    return `${cleanName}-${timestamp}-${randomId}`;
  }

  getPhotoUrl(photo) {
    if (!photo || !this.apiKey) return "";
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${this.apiKey}`;
  }

  mapPrice(priceLevel, category) {
    const prices = {
      Hoteles: { 0: 0, 1: 4000, 2: 8000, 3: 20000, 4: 45000 }, // 0 = Free (promotions, work exchanges)
      Restaurantes: { 0: 0, 1: 800, 2: 2500, 3: 5000, 4: 12000 }, // 0 = Free samples, events
      Atractivos: { 0: 0, 1: 300, 2: 1200, 3: 2500, 4: 5000 }, // 0 = Free attractions, parks, temples
    };
    return prices[category]?.[priceLevel] !== undefined
      ? prices[category][priceLevel]
      : prices[category][1] || 0;
  }

  mapBudget(priceLevel) {
    const mapping = {
      0: "Gratis",
      1: "Económico",
      2: "Moderado",
      3: "Alto",
      4: "Lujo",
    };
    return mapping[priceLevel] !== undefined ? mapping[priceLevel] : "Moderado";
  }

  formatSchedule(openingHours) {
    return openingHours?.weekday_text?.join("\n") || "";
  }

  getCategoryTags(category) {
    const tags = {};

    switch (category) {
      case "Hoteles":
        tags.hotelTags = {
          accommodation: ["Hoteles de negocios"],
          hotelServices: ["Wi-Fi gratis"],
          typeTrip: ["Familiar"],
        };
        break;
      case "Restaurantes":
        tags.restaurantTags = {
          restaurantTypes: ["Restaurantes tradicionales"],
          cuisines: ["Cocina japonesa tradicional"],
          restaurantServices: ["Menú en inglés"],
        };
        break;
      case "Atractivos":
        tags.attractionTags = ["Ocio"];
        break;
    }

    return tags;
  }
}

export default GooglePlacesService;
