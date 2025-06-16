// controllers/importController.js
import ApiImportService from "../services/ApiImportService.js";
import OpenStreetApi from "../services/OpenStreetApi.js";

export class ImportController {
  constructor() {
    this.googleService = new ApiImportService();
    this.osmService = new OpenStreetApi();
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
      console.log("👤 User:", req.user?._id);

      let places = [];
      let previews = [];

      if (source === "google") {
        // Search Google Places
        places = await this.googleService.searchPlaces(query, prefecture);

        // Transform for preview
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
            previews.push(transformed);

            // Rate limiting for real API calls
            if (!place.place_id.startsWith("mock_")) {
              await this.delay(500);
            }
          } catch (error) {
            console.error("Error transforming Google place:", error);
          }
        }
      } else if (source === "osm") {
        // Search OpenStreetMap
        places = await this.osmService.searchPlaces(query, prefecture);

        // Transform OSM data for preview
        for (const place of places.slice(0, 10)) {
          try {
            const categoryName = this.mapCategoryName(category);
            const transformed = this.osmService.transformToExperience(
              place,
              categoryName,
              req.user?._id
            );
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
          // Check for duplicates - handle both Google and OSM external IDs
          let duplicate = null;
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

          // Also check by title and location
          duplicateQueries.push({
            title: experienceData.title,
            prefecture: experienceData.prefecture,
            categories: experienceData.categories,
          });

          if (duplicateQueries.length > 0) {
            duplicate = await Experience.findOne({ $or: duplicateQueries });
          }

          if (duplicate) {
            console.log(`⚠️ Duplicate found: ${experienceData.title}`);
            results.duplicates++;
            results.details.push({
              title: experienceData.title,
              status: "duplicate",
              existingId: duplicate._id,
            });
            continue;
          }

          // Create new experience
          const experience = new Experience({
            ...experienceData,
            user: userId,
          });

          const savedExperience = await experience.save();
          results.imported++;
          results.details.push({
            title: experienceData.title,
            status: "imported",
            id: savedExperience._id,
          });

          console.log(`✅ Imported: ${experienceData.title}`);
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
        // Search Google Places
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
            experiencesToImport.push(transformed);

            if (!place.place_id.startsWith("mock_")) {
              await this.delay(500);
            }
          } catch (error) {
            console.error("Error in Google quick import transform:", error);
          }
        }
      } else if (source === "osm") {
        // Search OpenStreetMap
        const places = await this.osmService.searchPlaces(query, prefecture);

        for (const place of places.slice(0, limit)) {
          try {
            const transformed = this.osmService.transformToExperience(
              place,
              categoryName,
              userId
            );
            experiencesToImport.push(transformed);
          } catch (error) {
            console.error("Error in OSM quick import transform:", error);
          }
        }
      }

      // Now import them using the helper method
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

  async importExperiencesHelper(experiencesData, userId) {
    const Experience = (await import("../models/Experience.js")).default;

    const results = { imported: 0, duplicates: 0, errors: 0 };

    for (const experienceData of experiencesData) {
      try {
        // Check for duplicates - handle both Google and OSM IDs
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

        // Also check by title and location
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

        // Create and save
        const experience = new Experience({
          ...experienceData,
          user: userId,
        });

        await experience.save();
        results.imported++;
        console.log(
          `✅ Imported: ${experienceData.title} (${
            experienceData.externalIds?.googlePlaceId ? "Google" : "OSM"
          })`
        );
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
