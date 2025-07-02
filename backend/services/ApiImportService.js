import cloudinary from "../config/cloudinaryConfig.js";

class ApiImportService {
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
        price_level: 2,
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

  async transformToExperience(placeData, category, userId) {
    const { region, prefecture } = this.detectLocation(
      placeData.formatted_address
    );

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);

    // Handle photo upload with better fallback
    let photoPath = "";
    if (placeData.photos?.[0]) {
      // Check if Cloudinary is properly configured
      const config = cloudinary.config();
      if (
        config.cloud_name &&
        config.api_key &&
        config.api_secret &&
        !config.cloud_name.includes("MISSING") &&
        !config.api_key.includes("MISSING") &&
        !config.api_secret.includes("MISSING")
      ) {
        try {
          console.log("🔄 Attempting Cloudinary upload...");
          photoPath = await this.uploadGooglePhotoToCloudinary(
            placeData.photos[0],
            `experience_${timestamp}_${randomId}`
          );
          console.log("✅ Cloudinary upload successful:", photoPath);
        } catch (error) {
          console.warn(
            "⚠️ Cloudinary upload failed, using Google URL:",
            error.message
          );
          // Fallback to Google URL with full URL format
          photoPath = this.getGooglePhotoUrl(placeData.photos[0]);
        }
      } else {
        console.log("🔧 Cloudinary not configured, using Google URL");
        photoPath = this.getGooglePhotoUrl(placeData.photos[0]);
      }
    }

    // Ensure we always have a valid budget value
    const budgetValue = this.mapBudget(placeData.price_level);

    return {
      title: placeData.name,
      caption: this.generateCaption(placeData),
      slug: this.generateSlug(placeData.name, timestamp, randomId),
      user: userId,
      categories: category,
      region: region,
      prefecture: prefecture,
      price: this.mapPrice(placeData.price_level, category),
      photo: photoPath, // This will be either Cloudinary path or Google URL
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
      approved: true,
      generalTags: {
        season: ["Todo el año"],
        budget: [budgetValue || "Económico"], // Extra safety check
        rating: [Math.round(placeData.rating || 0)],
        location: ["Cerca de áreas de puntos de interés"],
      },
      ...this.getCategoryTags(category),
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
  async uploadGooglePhotoToCloudinary(photo, filename) {
    try {
      const googlePhotoUrl = this.getGooglePhotoUrl(photo);
      console.log("🔍 Uploading to Cloudinary via SDK...");

      const result = await cloudinary.uploader.upload(googlePhotoUrl, {
        public_id: filename,
        folder: "experiences",
        resource_type: "image",
      });

      console.log("✅ Cloudinary upload success:", result.public_id);
      return `${result.public_id}.${result.format}`;
    } catch (error) {
      console.error("❌ Error uploading to Cloudinary:", error);
      throw error;
    }
  }

  generateCaption(placeData) {
    const parts = [];

    // Use budget level instead of numeric price level
    if (placeData.price_level !== undefined) {
      const budget = this.mapBudget(placeData.price_level);
      parts.push(`presupuesto:  ${budget}`);
    }

    if (placeData.editorial_summary?.overview) {
      parts.push(
        placeData.editorial_summary.overview.substring(0, 100) + "..."
      );
    }
    return parts.join(" • ") || "Experiencia importada desde Google Places";
  }

  generateSlug(name, timestamp, randomId) {
    const cleanName = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);

    return `${cleanName}-${timestamp}-${randomId}`;
  }

  getGooglePhotoUrl(photo) {
    if (!photo || !this.apiKey) return "";
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${this.apiKey}`;
  }

  getPhotoUrl(photo) {
    return this.getGooglePhotoUrl(photo);
  }

  mapPrice(priceLevel, category) {
    const prices = {
      Hoteles: { 0: 3000, 1: 6000, 2: 12000, 3: 25000, 4: 50000 },
      Restaurantes: { 0: 0, 1: 1000, 2: 3000, 3: 6000, 4: 12000 },
      Atractivos: { 0: 0, 1: 500, 2: 1500, 3: 3000, 4: 6000 },
    };
    return prices[category]?.[priceLevel || 2] || 0;
  }

  mapBudget(priceLevel) {
    const mapping = {
      0: "Gratis",
      1: "Económico",
      2: "Económico",
      3: "Moderado",
      4: "Lujo",
    };
    return mapping[priceLevel || 2];
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

export default ApiImportService;
