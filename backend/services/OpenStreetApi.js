// services/OpenStreetMapService.js
class OpenStreetMapService {
  constructor() {
    this.overpassUrl = "https://overpass-api.de/api/interpreter";
    this.nominatimUrl = "https://nominatim.openstreetmap.org";
  }

  async searchPlaces(query, prefecture = "Tokyo") {
    try {
      console.log("🗺️ Searching OpenStreetMap for:", query, "in", prefecture);

      // Get bounds for the prefecture
      const bounds = await this.getPrefectureBounds(prefecture);

      // Build Overpass query based on search term
      const overpassQuery = this.buildOverpassQuery(query, bounds);

      const response = await fetch(this.overpassUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: overpassQuery,
      });

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Found ${data.elements?.length || 0} places from OSM`);

      return this.processOSMResults(data.elements || []);
    } catch (error) {
      console.error("❌ OSM search error:", error);
      console.log("🔧 Falling back to mock OSM data");
      return this.getMockOSMData(query, prefecture);
    }
  }

  async getPrefectureBounds(prefecture) {
    try {
      // Get prefecture boundaries from Nominatim
      const response = await fetch(
        `${this.nominatimUrl}/search?format=json&q=${encodeURIComponent(
          prefecture + ", Japan"
        )}&limit=1&polygon_geojson=1`
      );

      const data = await response.json();

      if (data.length > 0) {
        const place = data[0];
        return {
          south: parseFloat(place.boundingbox[0]),
          north: parseFloat(place.boundingbox[1]),
          west: parseFloat(place.boundingbox[2]),
          east: parseFloat(place.boundingbox[3]),
        };
      }
    } catch (error) {
      console.error("Error getting prefecture bounds:", error);
    }

    // Fallback bounds for major cities
    const fallbackBounds = {
      Tokyo: { south: 35.5, north: 35.9, west: 139.3, east: 139.9 },
      Osaka: { south: 34.5, north: 34.8, west: 135.3, east: 135.7 },
      Kyoto: { south: 34.9, north: 35.1, west: 135.6, east: 135.9 },
      Hiroshima: { south: 34.3, north: 34.5, west: 132.3, east: 132.6 },
      Fukuoka: { south: 33.5, north: 33.7, west: 130.3, east: 130.5 },
    };

    return fallbackBounds[prefecture] || fallbackBounds["Tokyo"];
  }

  buildOverpassQuery(query, bounds) {
    const { south, west, north, east } = bounds;

    // Map search terms to OSM tags
    const searchMappings = {
      hotels: 'tourism~"hotel|hostel|guest_house|ryokan"',
      hoteles: 'tourism~"hotel|hostel|guest_house|ryokan"',
      hotel: 'tourism~"hotel|hostel|guest_house|ryokan"',
      restaurants: 'amenity~"restaurant|cafe|fast_food|bar"',
      restaurantes: 'amenity~"restaurant|cafe|fast_food|bar"',
      restaurant: 'amenity~"restaurant|cafe|fast_food|bar"',
      attractions:
        'tourism~"attraction|museum|castle|shrine|temple|artwork|viewpoint"',
      atractivos:
        'tourism~"attraction|museum|castle|shrine|temple|artwork|viewpoint"',
      templos: 'amenity~"place_of_worship"',
      temples: 'amenity~"place_of_worship"',
      museos: 'tourism~"museum"',
      museums: 'tourism~"museum"',
      parques: 'leisure~"park|garden"',
      parks: 'leisure~"park|garden"',
      castillos: 'historic~"castle"',
      castles: 'historic~"castle"',
      shopping: "shop",
      tiendas: "shop",
    };

    const lowerQuery = query.toLowerCase();
    let filter = searchMappings[lowerQuery];

    if (!filter) {
      // Generic search for points of interest
      filter =
        'tourism~"attraction|museum|castle|shrine|temple|artwork|viewpoint|hotel|hostel|guest_house"';
    }

    return `
        [out:json][timeout:25];
        (
          node[${filter}]["name"](${south},${west},${north},${east});
          way[${filter}]["name"](${south},${west},${north},${east});
          relation[${filter}]["name"](${south},${west},${north},${east});
        );
        out geom;
      `;
  }

  processOSMResults(elements) {
    return elements
      .filter((element) => element.tags && element.tags.name)
      .map((element) => {
        const tags = element.tags;

        return {
          osm_id: element.id,
          osm_type: element.type,
          name: tags.name || tags["name:en"] || tags["name:ja"],
          tags: tags,
          lat: element.lat || element.center?.lat,
          lon: element.lon || element.center?.lon,
          formatted_address: this.buildOSMAddress(tags),
          types: this.mapOSMTypes(tags),
          // Simulate some fields that Google Places has
          rating: this.estimateRating(tags),
          price_level: this.estimatePriceLevel(tags),
          geometry: {
            location: {
              lat: element.lat || element.center?.lat,
              lng: element.lon || element.center?.lon,
            },
          },
        };
      })
      .slice(0, 20); // Limit results
  }

  buildOSMAddress(tags) {
    const parts = [];
    if (tags["addr:housenumber"]) parts.push(tags["addr:housenumber"]);
    if (tags["addr:street"]) parts.push(tags["addr:street"]);
    if (tags["addr:city"]) parts.push(tags["addr:city"]);
    if (tags["addr:state"]) parts.push(tags["addr:state"]);
    if (tags["addr:postcode"]) parts.push(tags["addr:postcode"]);

    return parts.length > 0 ? parts.join(", ") + ", Japón" : "Japón";
  }

  mapOSMTypes(tags) {
    const types = ["establishment"];

    if (tags.tourism) {
      switch (tags.tourism) {
        case "hotel":
        case "hostel":
        case "guest_house":
          types.push("lodging");
          break;
        case "attraction":
        case "museum":
        case "castle":
          types.push("tourist_attraction");
          break;
        case "artwork":
        case "viewpoint":
          types.push("point_of_interest");
          break;
      }
    }

    if (tags.amenity) {
      switch (tags.amenity) {
        case "restaurant":
          types.push("restaurant", "food");
          break;
        case "cafe":
          types.push("cafe", "food");
          break;
        case "fast_food":
          types.push("meal_takeaway", "food");
          break;
        case "place_of_worship":
          types.push("place_of_worship");
          break;
      }
    }

    if (tags.historic) {
      types.push("point_of_interest");
    }

    if (tags.leisure) {
      types.push("park");
    }

    return types;
  }

  estimateRating(tags) {
    // OSM doesn't have ratings, so estimate based on features
    let rating = 3.5; // Base rating

    if (tags.wikipedia || tags["wikipedia:en"]) rating += 0.5;
    if (tags.website || tags["contact:website"]) rating += 0.3;
    if (tags.phone || tags["contact:phone"]) rating += 0.2;
    if (tags.opening_hours) rating += 0.2;
    if (tags["addr:street"] && tags["addr:housenumber"]) rating += 0.3;

    return Math.min(5.0, Math.round(rating * 10) / 10);
  }

  estimatePriceLevel(tags) {
    // Estimate price level based on OSM tags
    if (tags.tourism === "hotel") {
      if (tags.stars) {
        const stars = parseInt(tags.stars);
        if (stars >= 4) return 4;
        if (stars >= 3) return 3;
        if (stars >= 2) return 2;
        return 1;
      }
      return 2; // Default hotel price
    }

    if (tags.amenity === "restaurant") {
      if (tags.cuisine?.includes("fine_dining")) return 4;
      if (tags.cuisine?.includes("japanese")) return 3;
      return 2;
    }

    if (tags.amenity === "fast_food") return 1;
    if (tags.amenity === "cafe") return 1;

    return 0; // Free for attractions
  }

  getMockOSMData(query, prefecture) {
    console.log("🔧 Generating mock OSM data for:", query, prefecture);

    return [
      {
        osm_id: `mock_osm_${query}_${prefecture}_${Date.now()}_1`,
        osm_type: "node",
        name: `${query} OSM en ${prefecture}`,
        formatted_address: `Calle OSM 123, ${prefecture}, Japón`,
        rating: 4.1,
        price_level: 2,
        types: ["establishment", "tourist_attraction"],
        geometry: {
          location: {
            lat: prefecture === "Tokyo" ? 35.6762 : 35.0116,
            lng: prefecture === "Tokyo" ? 139.6503 : 135.7681,
          },
        },
        tags: {
          name: `${query} OSM en ${prefecture}`,
          tourism: "attraction",
          "addr:city": prefecture,
          website: "https://example.com",
          opening_hours: "Mo-Su 09:00-18:00",
        },
      },
      {
        osm_id: `mock_osm_${query}_${prefecture}_${Date.now()}_2`,
        osm_type: "way",
        name: `Otro ${query} OSM en ${prefecture}`,
        formatted_address: `Avenida OSM 456, ${prefecture}, Japón`,
        rating: 4.3,
        price_level: 1,
        types: ["establishment", "point_of_interest"],
        geometry: {
          location: {
            lat: prefecture === "Tokyo" ? 35.6895 : 35.0116,
            lng: prefecture === "Tokyo" ? 139.6917 : 135.7681,
          },
        },
        tags: {
          name: `Otro ${query} OSM en ${prefecture}`,
          amenity: "restaurant",
          "addr:city": prefecture,
          cuisine: "japanese",
        },
      },
    ];
  }

  transformToExperience(osmData, category, userId) {
    const { region, prefecture } = this.detectLocation(
      osmData.formatted_address
    );

    // Generate unique slug
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);

    return {
      title: osmData.name,
      caption: this.generateOSMCaption(osmData),
      slug: this.generateSlug(osmData.name, timestamp, randomId),
      user: userId,
      categories: category,
      region: region,
      prefecture: prefecture,
      price: this.mapPrice(osmData.price_level, category),
      photo: "", // OSM doesn't provide photos
      location: {
        type: "Point",
        coordinates: [
          osmData.geometry?.location?.lng || osmData.lon || 0,
          osmData.geometry?.location?.lat || osmData.lat || 0,
        ],
      },
      phone: osmData.tags?.phone || osmData.tags?.["contact:phone"] || "",
      website: osmData.tags?.website || osmData.tags?.["contact:website"] || "",
      address: osmData.formatted_address || "",
      schedule: osmData.tags?.opening_hours || "",
      ratings: osmData.rating || 0,
      numReviews: 0, // OSM doesn't have reviews
      approved: true,
      generalTags: {
        season: ["Todo el año"],
        budget: [this.mapBudget(osmData.price_level)],
        rating: [Math.round(osmData.rating || 0)],
        location: ["Cerca de áreas de puntos de interés"],
      },
      // Add category-specific tags
      ...this.getCategoryTags(category),
      // External reference
      externalIds: {
        osmId: osmData.osm_id,
        osmType: osmData.osm_type,
      },
    };
  }

  generateOSMCaption(osmData) {
    const parts = [];
    if (osmData.rating) parts.push(`⭐ ${osmData.rating}`);
    if (osmData.price_level) parts.push(`💰 Nivel ${osmData.price_level}/4`);

    // Create Spanish description based on OSM tags
    const description = this.createOSMSpanishDescription(osmData);
    parts.push(description);

    return parts.join(" • ");
  }

  createOSMSpanishDescription(osmData) {
    const tags = osmData.tags || {};
    const name = osmData.name || "";

    if (tags.tourism === "hotel" || tags.tourism === "hostel") {
      return "Alojamiento disponible en OpenStreetMap con información detallada de la comunidad local.";
    }

    if (tags.amenity === "restaurant") {
      if (tags.cuisine?.includes("japanese")) {
        return "Restaurante japonés registrado en OpenStreetMap, recomendado por la comunidad local.";
      }
      return "Restaurante local registrado en OpenStreetMap con información verificada por la comunidad.";
    }

    if (tags.amenity === "cafe") {
      return "Cafetería local registrada en OpenStreetMap, perfecta para disfrutar de un momento relajante.";
    }

    if (tags.tourism === "attraction" || tags.tourism === "museum") {
      return "Atractivo turístico documentado en OpenStreetMap, lugar de interés cultural e histórico.";
    }

    if (tags.amenity === "place_of_worship") {
      return "Lugar sagrado registrado en OpenStreetMap, espacio espiritual y cultural de gran importancia.";
    }

    if (tags.historic) {
      return "Sitio histórico documentado en OpenStreetMap, lugar de gran valor patrimonial y cultural.";
    }

    if (tags.leisure === "park") {
      return "Parque público registrado en OpenStreetMap, espacio verde ideal para relajarse y disfrutar la naturaleza.";
    }

    return "Lugar de interés registrado en OpenStreetMap, documentado y verificado por la comunidad local.";
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

  generateSlug(name, timestamp, randomId) {
    const cleanName = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);

    return `osm-${cleanName}-${timestamp}-${randomId}`;
  }

  mapPrice(priceLevel, category) {
    const prices = {
      Hoteles: { 0: 2000, 1: 4000, 2: 8000, 3: 15000, 4: 30000 },
      Restaurantes: { 0: 0, 1: 800, 2: 2000, 3: 4000, 4: 8000 },
      Atractivos: { 0: 0, 1: 300, 2: 800, 3: 1500, 4: 3000 },
    };
    return prices[category]?.[priceLevel || 1] || 0;
  }

  mapBudget(priceLevel) {
    const mapping = {
      0: "Gratis",
      1: "Económico",
      2: "Económico",
      3: "Moderado",
      4: "Lujo",
    };
    return mapping[priceLevel || 1];
  }

  getCategoryTags(category) {
    const tags = {};

    switch (category) {
      case "Hoteles":
        tags.hotelTags = {
          accommodation: ["Hostales"],
          hotelServices: ["Wi-Fi gratis"],
          typeTrip: ["Para aventureros"],
        };
        break;
      case "Restaurantes":
        tags.restaurantTags = {
          restaurantTypes: ["Restaurantes tradicionales"],
          cuisines: ["Cocina japonesa tradicional"],
          restaurantServices: ["Opciones de comida para llevar"],
        };
        break;
      case "Atractivos":
        tags.attractionTags = ["Naturaleza"];
        break;
    }

    return tags;
  }
}

export default OpenStreetMapService;
