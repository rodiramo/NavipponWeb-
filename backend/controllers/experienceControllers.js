import upload from "../middleware/uploadPictureMiddleware.js";
import Experience from "../models/Experience.js";
import Review from "../models/Review.js";
import { fileRemover } from "../utils/fileRemover.js";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "cloudinary";

const createExperience = async (req, res, next) => {
  try {
    console.log("📥 Incoming Request Body:", req.body);
    console.log("📸 Uploaded File:", req.file);

    if (!req.file) {
      console.warn(
        "⚠️ No file uploaded! Ensure FormData contains 'experiencePicture'."
      );
    }

    if (
      !req.body.title ||
      !req.body.caption ||
      !req.body.body ||
      !req.body.categories ||
      !req.body.region
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: title, caption, body, categories, region",
      });
    }

    // ✅ Parse JSON fields
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
      map,
      address,
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

    // ✅ Extract Coordinates from Google Maps URL
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

    const location = extractCoordinates(map);

    // ✅ Handle Image Upload
    let photo = "default-placeholder.jpg";
    if (req.file) {
      photo = req.file.filename;
    }

    // ✅ Create Experience
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
      map,
      address,
      location, // ✅ Add extracted location
    });

    const createdExperience = await newExperience.save();
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

        const updatedExperience = await experience.save();
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
          fileRemover(experience.photo);
          experience.photo = req.file.filename;
          handleUpdateExperienceData(req.body.document);
        } else {
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

    fileRemover(experience.photo);

    await Review.deleteMany({ experience: experience._id });

    return res.json({
      message: "Experiencia eliminada con éxito",
    });
  } catch (error) {
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
            select: ["avatar", "name"],
          },
          {
            path: "replies",
            match: {
              check: true,
            },
            populate: [
              {
                path: "user",
                select: ["avatar", "name"],
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

export {
  createExperience,
  updateExperience,
  deleteExperience,
  getExperience,
  getAllExperiences,
  getExperienceById,
};
