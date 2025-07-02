import upload from "../middleware/uploadPictureMiddleware.js";
import cloudinary from "../config/cloudinaryConfig.js"; // ✅ Import Cloudinary
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { fileRemover } from "../utils/fileRemover.js";
import { v4 as uuidv4 } from "uuid";

// ✅ Robust function to handle deeply nested JSON strings
const safeParseArray = (value, fieldName = "field") => {
  console.log(`🔍 Parsing ${fieldName}:`, typeof value, value);

  // If already an array, return it
  if (Array.isArray(value)) {
    // But check if elements are strings that need parsing
    const parsed = value
      .map((item) => {
        if (typeof item === "string") {
          try {
            // Try to parse the string
            const parsed = JSON.parse(item);
            return Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            return item;
          }
        }
        return item;
      })
      .flat()
      .filter((item) => item != null && item !== "");

    console.log(`✅ ${fieldName} parsed as array:`, parsed);
    return parsed;
  }

  // If it's a string, try to parse it
  if (typeof value === "string") {
    if (value === "" || value === "[]") {
      return [];
    }

    try {
      let parsed = JSON.parse(value);

      // Keep parsing until we get a clean array
      while (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      if (Array.isArray(parsed)) {
        const cleaned = parsed
          .flat()
          .filter((item) => item != null && item !== "");
        console.log(`✅ ${fieldName} parsed from string:`, cleaned);
        return cleaned;
      }

      return [parsed].filter((item) => item != null && item !== "");
    } catch (error) {
      console.log(`❌ Failed to parse ${fieldName}:`, error.message);
      return [];
    }
  }

  // If it's something else, try to convert to array
  if (value != null) {
    return [value];
  }

  return [];
};

const createPost = async (req, res, next) => {
  try {
    console.log("📸 Received File:", req.file);
    console.log("📥 Received Data:", req.body);

    // ✅ Debug which fields are missing
    const requiredFields = ["title", "caption", "slug", "body"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      console.log("❌ Missing Fields:", missingFields);
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // ✅ Convert JSON string fields into proper objects
    let { title, caption, slug, body, tags, categories } = req.body;

    try {
      // ✅ Use robust parsing function
      categories = safeParseArray(categories, "categories");
      tags = safeParseArray(tags, "tags");

      // Handle body separately as it's an object, not array
      if (typeof body === "string") {
        body = JSON.parse(body);
      }
    } catch (error) {
      console.log("❌ JSON Parsing Error:", error.message);
      return res
        .status(400)
        .json({ message: "Invalid JSON format in request" });
    }

    console.log("✅ Final Parsed Data:", {
      title,
      caption,
      slug,
      body,
      tags,
      categories,
    });

    // ✅ Handle Image Upload
    let photo = "uploads/default-placeholder.jpg"; // 👈 Default image
    if (req.file) {
      console.log("📸 Uploading Image to Cloudinary:", req.file.path);
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "uploads",
        });
        photo = result.secure_url; // ✅ Use Cloudinary URL
      } catch (uploadError) {
        console.error("❌ Cloudinary Upload Error:", uploadError.message);
      }
    } else {
      console.warn("⚠️ No image uploaded, using default placeholder.");
    }

    // ✅ Create the post
    const newPost = new Post({
      title,
      caption,
      slug: slug || uuidv4(),
      body,
      tags,
      categories,
      photo,
      user: req.user._id,
      approved: false,
    });

    const createdPost = await newPost.save();
    return res.status(201).json(createdPost);
  } catch (error) {
    console.error("❌ Error in createPost:", error);
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    console.log("🔄 Updating Post - Slug:", req.params.slug);
    console.log("📸 Received File:", req.file);
    console.log("📥 Received Data:", req.body);

    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      return next(new Error("Post no encontrado"));
    }

    // Check authorization
    if (post.user.toString() !== req.user._id.toString() && !req.user.admin) {
      return res.status(401).json({ message: "No autorizado" });
    }

    // ✅ Parse the document data (similar to createPost)
    let updateData;
    try {
      // Handle both direct form data and JSON document format
      if (req.body.document) {
        updateData = JSON.parse(req.body.document);
      } else {
        updateData = req.body;
      }
    } catch (error) {
      console.log("❌ JSON Parsing Error:", error.message);
      return res
        .status(400)
        .json({ message: "Invalid JSON format in request" });
    }

    let { title, caption, slug, body, tags, categories } = updateData;

    // ✅ Use the same robust parsing as createPost
    try {
      categories = safeParseArray(categories, "categories");
      tags = safeParseArray(tags, "tags");

      // Handle body separately as it's an object, not array
      if (typeof body === "string") {
        body = JSON.parse(body);
      }

      console.log("✅ Final Update Data:", {
        title,
        caption,
        slug,
        body,
        tags,
        categories,
      });
    } catch (parseError) {
      console.log("❌ Data Parsing Error:", parseError.message);
      return res.status(400).json({ message: "Error parsing update data" });
    }

    console.log("✅ Parsed Update Data:", {
      title,
      caption,
      slug,
      body,
      tags,
      categories,
    });

    // ✅ Update post fields
    post.title = title || post.title;
    post.caption = caption || post.caption;
    post.slug = slug || post.slug;
    post.body = body || post.body;
    post.tags = tags || post.tags;
    post.categories = categories || post.categories;

    // ✅ Handle Image Upload (consistent with createPost)
    if (req.file) {
      console.log("📸 Uploading New Image to Cloudinary:", req.file.path);
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "uploads",
        });

        // Remove old image if it exists and isn't the default
        if (post.photo && post.photo !== "uploads/default-placeholder.jpg") {
          // If using Cloudinary, extract public_id and delete
          if (post.photo.includes("cloudinary.com")) {
            const publicId = post.photo
              .split("/")
              .slice(-2)
              .join("/")
              .split(".")[0];
            try {
              await cloudinary.uploader.destroy(publicId);
              console.log("🗑️ Old Cloudinary image deleted:", publicId);
            } catch (deleteError) {
              console.warn(
                "⚠️ Failed to delete old Cloudinary image:",
                deleteError.message
              );
            }
          } else {
            // If using local storage
            fileRemover(post.photo);
          }
        }

        post.photo = result.secure_url; // ✅ Use new Cloudinary URL
        console.log("✅ New image uploaded:", result.secure_url);
      } catch (uploadError) {
        console.error("❌ Cloudinary Upload Error:", uploadError.message);
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    // ✅ Save the updated post
    const updatedPost = await post.save();
    console.log("✅ Post updated successfully:", updatedPost.slug);

    return res.json(updatedPost);
  } catch (error) {
    console.error("❌ Error in updatePost:", error);
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });

    if (!post) {
      const error = new Error("Post no encontrado");
      return next(error);
    }

    if (post.user.toString() !== req.user._id.toString() && !req.user.admin) {
      res.status(401);
      throw new Error("No autorizado");
    }

    // ✅ Handle image deletion (both Cloudinary and local)
    if (post.photo && post.photo !== "uploads/default-placeholder.jpg") {
      if (post.photo.includes("cloudinary.com")) {
        // Delete from Cloudinary
        const publicId = post.photo
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log("🗑️ Cloudinary image deleted:", publicId);
        } catch (deleteError) {
          console.warn(
            "⚠️ Failed to delete Cloudinary image:",
            deleteError.message
          );
        }
      } else {
        // Delete local file
        fileRemover(post.photo);
      }
    }

    await Comment.deleteMany({ post: post._id });

    return res.json({
      message: "Post eliminado con éxito",
    });
  } catch (error) {
    next(error);
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = { user: req.user._id };
    if (filter) {
      where.title = { $regex: filter, $options: "i" };
    }
    let query = Post.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await Post.find(where).countDocuments();
    const pages = Math.ceil(total / pageSize);

    res.header({
      "x-filter": filter,
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
        {
          path: "categories",
          select: ["title"],
        },
      ])
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate([
      {
        path: "user",
        select: ["avatar", "name"],
      },
      {
        path: "categories",
        select: ["title"],
      },
      {
        path: "comments",
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

    if (!post) {
      const error = new Error("Post no encontrado");
      return next(error);
    }

    return res.json(post);
  } catch (error) {
    next(error);
  }
};

export { createPost, updatePost, deletePost, getPost, getUserPosts };
