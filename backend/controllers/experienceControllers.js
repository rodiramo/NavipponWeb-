import upload from "../middleware/uploadPictureMiddleware.js";
import Experience from "../models/Experience.js";
import Review from "../models/Review.js";
import { fileRemover } from "../utils/fileRemover.js";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "cloudinary";
import Favorite from "../models/Favorite.js";
import Itinerary from "../models/Itinerary.js";

const createExperience = async (req, res, next) => {
  try {
    console.log("📥 Incoming Request Body:", req.body);
    console.log("📸 Uploaded File:", req.file);

    if (
      !req.body.title ||
      !req.body.caption ||
      !req.body.body ||
      !req.body.categories ||
      !req.body.region
    ) {
      return res.status(400).json({
        message:
          "Faltan campos obligatorios: título, subtítulo, cuerpo, categorías, región",
      });
    }

    let {
      title,
      caption,
      body,
      categories,
      generalTags,
      hotelTags,
      attractionTags,
      restaurantTags,
      region,
      prefecture,
      price,
      phone,
      email,
      website,
      schedule,
      map, // no longer used, can be ignored if not needed
      address,
      location, // This should be a JSON string now
      defaultImageUrl, // For default images
      useDefaultImage, // Flag to indicate using default image
    } = req.body;

    try {
      body = JSON.parse(body || "{}");
      categories = JSON.parse(categories || "[]");
      generalTags = JSON.parse(generalTags || "{}");
      hotelTags = JSON.parse(hotelTags || "{}");
      attractionTags = JSON.parse(attractionTags || "[]");
      restaurantTags = JSON.parse(restaurantTags || "{}");
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Invalid JSON format in request" });
    }

    // Parse location from the incoming request, if provided
    let locationField = null;
    if (location) {
      try {
        locationField = JSON.parse(location);
      } catch (error) {
        console.error("Error parsing location:", error);
      }
    }

    // Handle Image Upload - Enhanced to support default images
    let photo = null;

    if (req.file) {
      // User uploaded a custom image
      photo = req.file.filename;
      console.log("✅ Using uploaded image:", photo);
    } else if (useDefaultImage === "true" && defaultImageUrl) {
      // User chose to use default image
      photo = defaultImageUrl;
      console.log("✅ Using default image URL:", photo);
    } else {
      // Fallback to a placeholder
      photo = "default-placeholder.jpg";
      console.log("⚠️ Using fallback placeholder image");
    }

    const newExperience = new Experience({
      title,
      caption,
      slug: uuidv4(),
      body,
      photo,
      user: req.user._id,
      approved: false,
      categories,
      generalTags,
      hotelTags,
      attractionTags,
      restaurantTags,
      region,
      prefecture,
      price: price || 0,
      phone,
      email,
      website,
      schedule,
      map, // if still provided, or you can remove it
      address,
      location: locationField, // location from Autocomplete
    });

    const createdExperience = await newExperience.save();
    console.log("✅ Experience created successfully:", createdExperience._id);
    return res.status(201).json(createdExperience);
  } catch (error) {
    console.error("❌ Error in createExperience:", error);
    next(error);
  }
};

const updateExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findOne({ slug: req.params.slug });

    if (!experience) {
      return res.status(404).json({ message: "Experiencia no encontrada" });
    }

    const uploadSingle = upload.single("experiencePicture");

    const extractCoordinates = (mapUrl) => {
      const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      const match = mapUrl?.match(regex);
      return match
        ? {
            type: "Point",
            coordinates: [parseFloat(match[2]), parseFloat(match[1])],
          }
        : null;
    };

    const handleUpdateExperienceData = async (data) => {
      if (!data) {
        console.error("❌ No data received in the request body");
        return res
          .status(400)
          .json({ message: "Datos de actualización no proporcionados" });
      }

      try {
        const parsedData = JSON.parse(data);
        console.log("📥 Parsed Data:", parsedData);

        experience.title = parsedData.title || experience.title;
        experience.caption = parsedData.caption || experience.caption;
        experience.slug = parsedData.slug || experience.slug;
        experience.body = parsedData.body || experience.body;
        experience.generalTags =
          parsedData.generalTags || experience.generalTags;
        experience.hotelTags = parsedData.hotelTags || experience.hotelTags;
        experience.attractionTags =
          parsedData.attractionTags || experience.attractionTags;
        experience.restaurantTags =
          parsedData.restaurantTags || experience.restaurantTags;
        experience.categories = parsedData.categories || experience.categories;
        experience.approved =
          parsedData.approved !== undefined
            ? parsedData.approved
            : experience.approved;
        experience.region = parsedData.region || experience.region;
        experience.prefecture = parsedData.prefecture || experience.prefecture;
        experience.price =
          parsedData.price !== undefined ? parsedData.price : experience.price;
        experience.phone = parsedData.phone || experience.phone;
        experience.email = parsedData.email || experience.email;
        experience.website = parsedData.website || experience.website;
        experience.schedule = parsedData.schedule || experience.schedule;
        experience.map = parsedData.map || experience.map;
        experience.address = parsedData.address || experience.address;

        // Handle default image for updates
        if (parsedData.useDefaultImage === true && parsedData.defaultImageUrl) {
          console.log(
            "✅ Updating to use default image:",
            parsedData.defaultImageUrl
          );
          // Remove old uploaded file if it exists and is not a URL
          if (experience.photo && !experience.photo.startsWith("http")) {
            fileRemover(experience.photo);
          }
          experience.photo = parsedData.defaultImageUrl;
        }

        const updatedExperience = await experience.save();
        console.log(
          "✅ Experience updated successfully:",
          updatedExperience._id
        );
        return res.json(updatedExperience);
      } catch (error) {
        console.error("❌ JSON Parsing Error:", error.message);
        return res
          .status(400)
          .json({ message: "Formato JSON inválido en la solicitud" });
      }
    };

    uploadSingle(req, res, async function (err) {
      if (err) {
        return next(
          new Error("Se produjo un error desconocido al cargar " + err.message)
        );
      } else {
        if (req.file) {
          // User uploaded a new custom image
          console.log("✅ New file uploaded:", req.file.filename);
          fileRemover(experience.photo);
          experience.photo = req.file.filename;
          handleUpdateExperienceData(req.body.document);
        } else {
          // No new file uploaded, just update other data
          handleUpdateExperienceData(req.body.document);
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findOneAndDelete({
      slug: req.params.slug,
    });

    if (!experience) {
      const error = new Error("Experiencia no encontrada");
      return next(error);
    }

    console.log(
      `🗑️ Deleting experience: ${experience.title} (ID: ${experience._id})`
    );

    // Remove the photo file
    fileRemover(experience.photo);

    // Delete all reviews for this experience
    await Review.deleteMany({ experience: experience._id });
    console.log("✅ Reviews deleted");

    // Find all favorites that reference this experience
    const favoritesToDelete = await Favorite.find({
      experienceId: experience._id,
    });
    const favoriteIds = favoritesToDelete.map((fav) => fav._id);

    console.log(
      `📋 Found ${favoritesToDelete.length} favorites to delete:`,
      favoriteIds
    );

    // Remove these favorites from all itinerary boards
    if (favoriteIds.length > 0) {
      // Find all itineraries that contain these favorites in any board
      const itinerariesWithFavorites = await Itinerary.find({
        "boards.favorites": { $in: favoriteIds },
      });

      console.log(
        `🗺️ Found ${itinerariesWithFavorites.length} itineraries containing these favorites`
      );

      // Update each itinerary to remove the favorites from all boards
      for (const itinerary of itinerariesWithFavorites) {
        let itineraryUpdated = false;

        itinerary.boards.forEach((board, boardIndex) => {
          const originalLength = board.favorites.length;

          // Filter out the favorites that need to be deleted
          board.favorites = board.favorites.filter(
            (favId) =>
              !favoriteIds.some(
                (delId) => delId.toString() === favId.toString()
              )
          );

          if (board.favorites.length !== originalLength) {
            itineraryUpdated = true;
            console.log(
              `  📅 Removed ${
                originalLength - board.favorites.length
              } favorites from board ${boardIndex + 1} (${
                board.date || "No date"
              })`
            );
          }
        });

        // Save the itinerary if it was updated
        if (itineraryUpdated) {
          await itinerary.save();
          console.log(`  ✅ Updated itinerary: ${itinerary.name}`);
        }
      }
    }

    // Delete all favorites that reference this experience
    const deletedFavoritesCount = await Favorite.deleteMany({
      experienceId: experience._id,
    });
    console.log(`✅ Deleted ${deletedFavoritesCount.deletedCount} favorites`);

    console.log("🎉 Experience deletion completed successfully");

    return res.json({
      message: "Experiencia eliminada con éxito",
      deletedFavorites: deletedFavoritesCount.deletedCount,
      updatedItineraries:
        favoriteIds.length > 0
          ? "Itinerarios actualizados"
          : "No hay itinerarios afectados",
    });
  } catch (error) {
    console.error("❌ Error in deleteExperience:", error);
    next(error);
  }
};

const getExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findOne({
      slug: req.params.slug,
    }).populate([
      {
        path: "user",
        select: ["avatar", "name"],
      },
      {
        path: "reviews",
        match: {
          check: true,
          parent: null,
        },
        populate: [
          {
            path: "user",
            select: ["avatar", "name", "verified"],
          },
          {
            path: "replies",
            match: {
              check: true,
            },
            populate: [
              {
                path: "user",
                select: ["avatar", "name", "verified"],
              },
            ],
          },
        ],
      },
    ]);

    if (!experience) {
      const error = new Error("Experiencia no encontrada");
      return next(error);
    }

    return res.json(experience);
  } catch (error) {
    next(error);
  }
};

const getAllExperiences = async (req, res, next) => {
  try {
    const { searchKeyword, category, region, tags, sortBy } = req.query;
    let where = {};

    if (searchKeyword) {
      const regex = new RegExp(searchKeyword, "i");
      where.$or = [
        { title: regex },
        { caption: regex },
        { "generalTags.season": regex },
        { "generalTags.budget": regex },
        { "generalTags.location": regex },
        { "hotelTags.accommodation": regex },
        { "hotelTags.hotelServices": regex },
        { "hotelTags.typeTrip": regex },
        { attractionTags: regex },
        { "restaurantTags.restaurantTypes": regex },
        { "restaurantTags.cuisines": regex },
        { "restaurantTags.restaurantServices": regex },
      ];
    }

    if (category) {
      where.categories = category;
    }
    if (region) {
      where.region = region;
    }
    if (tags && typeof tags === "string") {
      const tagsArray = tags.split(",");
      where.$or = tagsArray.map((tag) => ({
        $or: [
          { "generalTags.season": tag },
          { "generalTags.budget": tag },
          { "generalTags.location": tag },
          { "hotelTags.accommodation": tag },
          { "hotelTags.hotelServices": tag },
          { "hotelTags.typeTrip": tag },
          { attractionTags: tag },
          { "restaurantTags.restaurantTypes": tag },
          { "restaurantTags.cuisines": tag },
          { "restaurantTags.restaurantServices": tag },
        ],
      }));
    }

    console.log("Received query parameters:", req.query);
    console.log(
      "Filters applied to MongoDB query:",
      JSON.stringify(where, null, 2)
    );

    let query = Experience.find(where);

    // ✅ Sorting Logic
    if (sortBy) {
      if (sortBy === "favorites") {
        query = query.sort({ favoritesCount: -1 }); // Most Favorited
      } else if (sortBy === "budgetHigh") {
        query = query.sort({ budget: -1 }); // Most Expensive
      } else if (sortBy === "budgetLow") {
        query = query.sort({ budget: 1 }); // Least Expensive
      } else if (sortBy === "ratings") {
        query = query.sort({ rating: -1 }); // Highest Rated
      }
    } else {
      query = query.sort({ updatedAt: "desc" }); // Default sorting by most recent
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await Experience.find(where).countDocuments();
    const pages = Math.ceil(total / pageSize);

    res.header({
      "x-filter": searchKeyword,
      "x-totalcount": JSON.stringify(total),
      "x-currentpage": JSON.stringify(page),
      "x-pagesize": JSON.stringify(pageSize),
      "x-totalpagecount": JSON.stringify(pages),
    });

    if (page > pages) {
      return res.json([]);
    }

    const result = await query
      .skip(skip)
      .limit(pageSize)
      .populate([
        {
          path: "user",
          select: ["avatar", "name", "verified"],
        },
      ]);

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ error: "Experiencia no encontrada" });
    }
    res.json(experience);
  } catch (error) {
    res.status(400).json({ error: "ID inválido o solicitud mal formada" });
  }
};

const getExperienceCount = async (req, res) => {
  try {
    const count = await Experience.countDocuments();
    console.log("Count of experiences:", count);
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error en getExperienceCount:", error);
    res
      .status(500)
      .json({ error: "Error al obtener el contador de experiencias" });
  }
};

const getTopExperiences = async (req, res) => {
  try {
    const topExperiences = await Experience.find()
      .sort({ favoritesCount: -1 })
      .limit(3)
      .select("title favoritesCount");
    console.log("Top experiences:", topExperiences);
    res.status(200).json(topExperiences);
  } catch (error) {
    console.error("Error en getTopExperiences:", error);
    res
      .status(500)
      .json({ error: "Error al obtener las experiencias más populares" });
  }
};

export const getAllExperiencesForModal = async (req, res, next) => {
  try {
    const { searchKeyword, category, region } = req.query;
    let where = {};

    // Apply basic filters if provided
    if (searchKeyword) {
      const regex = new RegExp(searchKeyword, "i");
      where.$or = [
        { title: regex },
        { caption: regex },
        { prefecture: regex },
        { categories: regex },
      ];
    }

    if (category && category !== "All") {
      where.categories = category;
    }

    if (region) {
      where.region = region;
    }

    console.log("🔍 Fetching ALL experiences for modal with filters:", where);

    // Get ALL experiences without pagination (for modal use)
    const result = await Experience.find(where)
      .sort({ updatedAt: "desc" })
      .select("title categories prefecture price photo ratings description") // Only select needed fields
      .populate([
        {
          path: "user",
          select: ["avatar", "name", "verified"],
        },
      ]);

    console.log(
      "✅ Modal: Found experiences by category:",
      result.reduce((acc, exp) => {
        acc[exp.categories] = (acc[exp.categories] || 0) + 1;
        return acc;
      }, {})
    );

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export {
  createExperience,
  updateExperience,
  deleteExperience,
  getExperience,
  getAllExperiences,
  getExperienceById,
  getExperienceCount,
  getTopExperiences,
};
