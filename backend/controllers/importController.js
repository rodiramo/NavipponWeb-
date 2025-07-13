// controllers/importController.js - Updated version
import ApiImportService from "../services/ApiImportService.js";
import OpenStreetApi from "../services/OpenStreetApi.js";
import TagMappingService from "../services/tagMappingService.js";

export class ImportController {
  constructor() {
    this.googleService = new ApiImportService();
    this.osmService = new OpenStreetApi();
    this.tagMapper = new TagMappingService();
  }

  async searchExternal(req, res) {
    try {
      const { query, source, prefecture, category } = req.query;

      console.log("🔍 Search request:", {
        query,
        source,
        prefecture,
        category,
      });

      let places = [];
      let previews = [];

      if (source === "google") {
        places = await this.googleService.searchPlaces(query, prefecture);

        for (const place of places.slice(0, 10)) {
          try {
            let details = place;
            if (place.place_id && !place.place_id.startsWith("mock_")) {
              const placeDetails = await this.googleService.getPlaceDetails(
                place.place_id
              );
              if (placeDetails) {
                details = { ...place, ...placeDetails };
              }
            }

            const categoryName = this.mapCategoryName(category);
            const transformed = await this.googleService.transformToExperience(
              details,
              categoryName,
              req.user?._id
            );

            // Apply tag mapping to ensure valid enum values
            const mappedTags = this.tagMapper.autoMapFromGooglePlace(
              details,
              categoryName
            );
            transformed.attractionTags = mappedTags.attractionTags;
            transformed.generalTags = mappedTags.generalTags;
            transformed.restaurantTags = mappedTags.restaurantTags;
            transformed.hotelTags = mappedTags.hotelTags;

            // Validate tags
            const validation = this.tagMapper.validateTags(transformed);
            if (!validation.isValid) {
              console.warn(
                `⚠️ Tag validation warnings for ${transformed.title}:`,
                validation.errors
              );
              // Continue with valid tags only
            }

            previews.push(transformed);

            if (!place.place_id.startsWith("mock_")) {
              await this.delay(500);
            }
          } catch (error) {
            console.error("Error transforming Google place:", error);
          }
        }
      } else if (source === "osm") {
        places = await this.osmService.searchPlaces(query, prefecture);

        for (const place of places.slice(0, 10)) {
          try {
            const categoryName = this.mapCategoryName(category);
            const transformed = this.osmService.transformToExperience(
              place,
              categoryName,
              req.user?._id
            );

            // Apply safe defaults for OSM data
            transformed.attractionTags =
              transformed.attractionTags?.slice(0, 3) || [];
            transformed.generalTags = {
              season: ["Todo el año"],
              budget: ["Medio"],
              rating: [],
              location: ["Zona turística"],
            };
            transformed.restaurantTags = {
              restaurantTypes: ["Restaurante tradicional"],
              cuisines: [],
              restaurantServices: [],
            };
            transformed.hotelTags = {
              accommodation: ["Hotel"],
              hotelServices: [],
              typeTrip: [],
            };

            previews.push(transformed);
          } catch (error) {
            console.error("Error transforming OSM place:", error);
          }
        }
      }

      console.log(`✅ Returning ${previews.length} previews from ${source}`);

      res.json({
        success: true,
        results: previews,
        count: previews.length,
        source: source,
      });
    } catch (error) {
      console.error("❌ Search error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async importExperiences(req, res) {
    try {
      const { source, data, category } = req.body;
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({ error: "User ID required" });
      }

      console.log(
        `📦 Import experiences: ${data?.length} items for user ${userId}`
      );

      const Experience = (await import("../models/Experience.js")).default;

      const results = {
        imported: 0,
        duplicates: 0,
        errors: 0,
        details: [],
      };

      for (const experienceData of data || []) {
        try {
          // Clean and validate tags before saving
          const cleanedData = this.cleanExperienceData(
            experienceData,
            category
          );

          // Validate the cleaned data
          const validation = this.tagMapper.validateTags(cleanedData);
          if (!validation.isValid) {
            console.warn(
              `⚠️ Skipping ${cleanedData.title} due to validation errors:`,
              validation.errors
            );
            results.errors++;
            results.details.push({
              title: cleanedData.title,
              status: "error",
              error: `Tag validation failed: ${validation.errors.join(", ")}`,
            });
            continue;
          }

          // Check for duplicates
          let duplicate = null;
          const duplicateQueries = [];

          if (cleanedData.externalIds?.googlePlaceId) {
            duplicateQueries.push({
              "externalIds.googlePlaceId":
                cleanedData.externalIds.googlePlaceId,
            });
          }

          if (cleanedData.externalIds?.osmId) {
            duplicateQueries.push({
              "externalIds.osmId": cleanedData.externalIds.osmId,
            });
          }

          duplicateQueries.push({
            title: cleanedData.title,
            prefecture: cleanedData.prefecture,
            categories: cleanedData.categories,
          });

          if (duplicateQueries.length > 0) {
            duplicate = await Experience.findOne({ $or: duplicateQueries });
          }

          if (duplicate) {
            console.log(`⚠️ Duplicate found: ${cleanedData.title}`);
            results.duplicates++;
            results.details.push({
              title: cleanedData.title,
              status: "duplicate",
              existingId: duplicate._id,
            });
            continue;
          }

          // Create new experience
          const experience = new Experience({
            ...cleanedData,
            user: userId,
          });

          const savedExperience = await experience.save();
          results.imported++;
          results.details.push({
            title: cleanedData.title,
            status: "imported",
            id: savedExperience._id,
          });

          console.log(`✅ Imported: ${cleanedData.title}`);
        } catch (error) {
          console.error(`❌ Error importing ${experienceData.title}:`, error);
          results.errors++;
          results.details.push({
            title: experienceData.title,
            status: "error",
            error: error.message,
          });
        }
      }

      console.log("📊 Import results:", {
        imported: results.imported,
        duplicates: results.duplicates,
        errors: results.errors,
      });

      res.json({
        success: true,
        imported: results.imported,
        duplicates: results.duplicates,
        errors: results.errors,
        message: `Import completed: ${results.imported} imported, ${results.duplicates} duplicates, ${results.errors} errors`,
        details: results.details,
      });
    } catch (error) {
      console.error("❌ Import experiences error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async quickImport(req, res) {
    try {
      const {
        query,
        category,
        prefecture,
        limit = 5,
        source = "google",
      } = req.body;
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({ error: "User ID required" });
      }

      console.log(
        `🚀 Quick import: ${query} in ${prefecture} from ${source} for user ${userId}`
      );

      const categoryName = this.mapCategoryName(category);
      const experiencesToImport = [];

      if (source === "google") {
        const places = await this.googleService.searchPlaces(query, prefecture);

        for (const place of places.slice(0, limit)) {
          try {
            let details = place;
            if (place.place_id && !place.place_id.startsWith("mock_")) {
              const placeDetails = await this.googleService.getPlaceDetails(
                place.place_id
              );
              if (placeDetails) {
                details = { ...place, ...placeDetails };
              }
            }

            const transformed = await this.googleService.transformToExperience(
              details,
              categoryName,
              userId
            );

            // Clean the data before adding to import list
            const cleanedData = this.cleanExperienceData(
              transformed,
              categoryName
            );
            experiencesToImport.push(cleanedData);

            if (!place.place_id.startsWith("mock_")) {
              await this.delay(500);
            }
          } catch (error) {
            console.error("Error in Google quick import transform:", error);
          }
        }
      } else if (source === "osm") {
        const places = await this.osmService.searchPlaces(query, prefecture);

        for (const place of places.slice(0, limit)) {
          try {
            const transformed = this.osmService.transformToExperience(
              place,
              categoryName,
              userId
            );

            const cleanedData = this.cleanExperienceData(
              transformed,
              categoryName
            );
            experiencesToImport.push(cleanedData);
          } catch (error) {
            console.error("Error in OSM quick import transform:", error);
          }
        }
      }

      const importResult = await this.importExperiencesHelper(
        experiencesToImport,
        userId
      );

      res.json({
        success: true,
        imported: importResult.imported,
        duplicates: importResult.duplicates,
        errors: importResult.errors,
        source: source,
        message: `Quick import completed from ${source}: ${importResult.imported} new experiences imported`,
      });
    } catch (error) {
      console.error("❌ Quick import error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Helper method to clean and validate experience data
  cleanExperienceData(experienceData, category) {
    const cleaned = { ...experienceData };

    // Ensure we have the correct category
    cleaned.categories = category;

    // Apply appropriate tag mapping based on category
    if (category === "Atractivos") {
      cleaned.attractionTags = this.tagMapper.mapAttractionTags(
        cleaned.attractionTags || []
      );
      cleaned.restaurantTags = {
        restaurantTypes: [],
        cuisines: [],
        restaurantServices: [],
      };
      cleaned.hotelTags = {
        accommodation: [],
        hotelServices: [],
        typeTrip: [],
      };
    } else if (category === "Restaurantes") {
      cleaned.restaurantTags = this.tagMapper.mapRestaurantTags(
        cleaned.restaurantTags || {}
      );
      cleaned.attractionTags = [];
      cleaned.hotelTags = {
        accommodation: [],
        hotelServices: [],
        typeTrip: [],
      };
    } else if (category === "Hoteles") {
      cleaned.hotelTags = this.tagMapper.mapHotelTags(cleaned.hotelTags || {});
      cleaned.attractionTags = [];
      cleaned.restaurantTags = {
        restaurantTypes: [],
        cuisines: [],
        restaurantServices: [],
      };
    }

    // Clean general tags
    cleaned.generalTags = this.tagMapper.mapGeneralTags(
      cleaned.generalTags || {}
    );

    // Ensure required fields have defaults
    if (!cleaned.price || cleaned.price < 0) {
      cleaned.price = 0;
    }

    if (!cleaned.region) {
      // Map prefecture to region (you might want to create a prefecture-to-region mapping)
      cleaned.region = this.mapPrefectureToRegion(cleaned.prefecture);
    }

    return cleaned;
  }

  // Helper to map prefecture to region
  mapPrefectureToRegion(prefecture) {
    const prefectureToRegion = {
      Tokyo: "Kanto",
      Osaka: "Kansai",
      Kyoto: "Kansai",
      Kanagawa: "Kanto",
      Chiba: "Kanto",
      Saitama: "Kanto",
      Hokkaido: "Hokkaido",
      Fukuoka: "Kyushu",
      Hiroshima: "Chugoku",
      Aichi: "Chubu",
      Miyagi: "Tohoku",
      Nara: "Kansai",
    };
    return prefectureToRegion[prefecture] || "Kanto";
  }

  async importExperiencesHelper(experiencesData, userId) {
    const Experience = (await import("../models/Experience.js")).default;
    const results = { imported: 0, duplicates: 0, errors: 0 };

    for (const experienceData of experiencesData) {
      try {
        // Data should already be cleaned by cleanExperienceData
        const validation = this.tagMapper.validateTags(experienceData);
        if (!validation.isValid) {
          console.warn(
            `⚠️ Skipping ${experienceData.title}:`,
            validation.errors
          );
          results.errors++;
          continue;
        }

        // Check for duplicates
        const duplicateQueries = [];

        if (experienceData.externalIds?.googlePlaceId) {
          duplicateQueries.push({
            "externalIds.googlePlaceId":
              experienceData.externalIds.googlePlaceId,
          });
        }

        if (experienceData.externalIds?.osmId) {
          duplicateQueries.push({
            "externalIds.osmId": experienceData.externalIds.osmId,
          });
        }

        duplicateQueries.push({
          title: experienceData.title,
          prefecture: experienceData.prefecture,
          categories: experienceData.categories,
        });

        const duplicate = await Experience.findOne({
          $or: duplicateQueries,
        });

        if (duplicate) {
          console.log(`⚠️ Duplicate found: ${experienceData.title}`);
          results.duplicates++;
          continue;
        }

        const experience = new Experience({
          ...experienceData,
          user: userId,
        });

        await experience.save();
        results.imported++;
        console.log(`✅ Imported: ${experienceData.title}`);
      } catch (error) {
        console.error("Error importing experience:", error);
        results.errors++;
      }
    }

    return results;
  }

  async getStats(req, res) {
    try {
      const Experience = (await import("../models/Experience.js")).default;

      const total = await Experience.countDocuments();
      const imported = await Experience.countDocuments({
        externalIds: { $exists: true },
      });
      const pending = await Experience.countDocuments({ approved: false });

      const stats = {
        total,
        imported,
        manual: total - imported,
        pending,
      };

      console.log("📊 Stats:", stats);

      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      console.error("❌ Stats error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  mapCategoryName(category) {
    const mapping = {
      hotels: "Hoteles",
      restaurants: "Restaurantes",
      attractions: "Atractivos",
      all: "Atractivos",
    };
    return mapping[category] || "Atractivos";
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
