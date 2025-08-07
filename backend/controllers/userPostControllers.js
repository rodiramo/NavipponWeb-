import upload from "../middleware/uploadPictureMiddleware.js";
import cloudinary from "../config/cloudinaryConfig.js"; // ✅ Import Cloudinary
import Post from "../models/Post.js";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import { fileRemover } from "../utils/fileRemover.js";
import { v4 as uuidv4 } from "uuid";
const getCloudinaryPath = (cloudinaryResult) => {
  // Extract filename from public_id (e.g., "uploads/f1xdmifbvz3wuqyd7dsh" -> "f1xdmifbvz3wuqyd7dsh")
  const filename = cloudinaryResult.public_id.split("/").pop();
  return `uploads/${filename}`;
};

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
        photo = getCloudinaryPath(result);
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

        post.photo = getCloudinaryPath(result);
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
    console.log("=== getUserPosts API called ===");
    console.log("Query params:", req.query);
    console.log("User ID:", req.user._id);

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

    console.log("=== Pagination calculations ===");
    console.log("Filter:", filter);
    console.log("Page:", page);
    console.log("Page size:", pageSize);
    console.log("Total posts:", total);
    console.log("Total pages:", pages);
    console.log("Skip:", skip);

    // 🚨 FIX: Set headers as strings (not JSON.stringify)
    // The frontend expects these as regular strings, not JSON strings
    res.setHeader("x-filter", filter || "");
    res.setHeader("x-totalcount", total.toString());
    res.setHeader("x-currentpage", page.toString());
    res.setHeader("x-pagesize", pageSize.toString());
    res.setHeader("x-totalpagecount", pages.toString());

    // Alternative: You can also use res.header() but without JSON.stringify
    // res.header({
    //   "x-filter": filter || "",
    //   "x-totalcount": total.toString(),
    //   "x-currentpage": page.toString(),
    //   "x-pagesize": pageSize.toString(),
    //   "x-totalpagecount": pages.toString(),
    // });

    console.log("=== Headers being set ===");
    console.log("x-totalcount:", total.toString());
    console.log("x-totalpagecount:", pages.toString());

    if (page > pages) {
      console.log(
        "⚠️ Requested page exceeds total pages, returning empty array"
      );
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

    console.log("✅ Returning", result.length, "posts");
    return res.json(result);
  } catch (error) {
    console.error("❌ Error in getUserPosts:", error);
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

/**
 * @desc    Toggle save/unsave a post
 * @route   POST /api/posts/:postId/save
 * @access  Private
 */
const toggleSavePost = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post no encontrado",
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Check if post is currently saved
    const isCurrentlySaved = user.savedPosts.includes(postId);

    if (isCurrentlySaved) {
      // Remove from saved posts
      user.savedPosts = user.savedPosts.filter(
        (savedPostId) => savedPostId.toString() !== postId.toString()
      );
    } else {
      // Add to saved posts
      user.savedPosts.push(postId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isCurrentlySaved
        ? "Post removido de guardados"
        : "Post guardado exitosamente",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        savedPosts: user.savedPosts,
        savedPostsCount: user.savedPosts.length,
      },
      action: isCurrentlySaved ? "unsaved" : "saved",
    });
  } catch (error) {
    console.error("Error in toggleSavePost:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

/**
 * @desc    Get user's saved posts with pagination
 * @route   GET /api/users/saved-posts
 * @access  Private
 */
const getSavedPosts = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get user with saved posts count
    const user = await User.findById(userId).select("savedPosts");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const totalCount = user.savedPosts.length;
    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated saved posts
    const savedPostIds = user.savedPosts.slice(skip, skip + limit);

    const savedPosts = await Post.find({
      _id: { $in: savedPostIds },
    })
      .populate("user", "name avatar verified")
      .populate("categories", "title")
      .sort({ createdAt: -1 })
      .select(
        "title slug caption photo createdAt updatedAt user tags categories approved"
      );

    // Maintain the order from user.savedPosts
    const orderedPosts = savedPostIds
      .map((id) =>
        savedPosts.find((post) => post._id.toString() === id.toString())
      )
      .filter(Boolean);

    res.status(200).json({
      success: true,
      posts: orderedPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
      message: "Posts guardados obtenidos exitosamente",
    });
  } catch (error) {
    console.error("Error in getSavedPosts:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

/**
 * @desc    Remove multiple saved posts
 * @route   DELETE /api/users/saved-posts
 * @access  Private
 */
const removeSavedPosts = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { postIds } = req.body;

    // Validate input
    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Se requiere un array de IDs de posts",
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Count posts before removal
    const initialCount = user.savedPosts.length;

    // Remove specified posts
    user.savedPosts = user.savedPosts.filter(
      (savedPostId) => !postIds.includes(savedPostId.toString())
    );

    const finalCount = user.savedPosts.length;
    const removedCount = initialCount - finalCount;

    await user.save();

    res.status(200).json({
      success: true,
      message: `${removedCount} posts removidos de guardados`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        savedPosts: user.savedPosts,
        savedPostsCount: user.savedPosts.length,
      },
      removedCount,
    });
  } catch (error) {
    console.error("Error in removeSavedPosts:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

/**
 * @desc    Check if a post is saved by user
 * @route   GET /api/posts/:postId/saved
 * @access  Private
 */
const checkIfPostSaved = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post no encontrado",
      });
    }

    // Get user
    const user = await User.findById(userId).select("savedPosts");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const isSaved = user.savedPosts.includes(postId);

    res.status(200).json({
      success: true,
      isSaved,
      postId,
      message: isSaved ? "Post está guardado" : "Post no está guardado",
    });
  } catch (error) {
    console.error("Error in checkIfPostSaved:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

/**
 * @desc    Get saved posts count for user
 * @route   GET /api/users/saved-posts/count
 * @access  Private
 */
const getSavedPostsCount = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("savedPosts");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      count: user.savedPosts.length,
      message: "Contador de posts guardados obtenido exitosamente",
    });
  } catch (error) {
    console.error("Error in getSavedPostsCount:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

/**
 * @desc    Clear all saved posts for user
 * @route   DELETE /api/users/saved-posts/clear
 * @access  Private
 */
const clearAllSavedPosts = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const clearedCount = user.savedPosts.length;
    user.savedPosts = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: `Todos los posts guardados han sido removidos (${clearedCount} posts)`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        savedPosts: [],
        savedPostsCount: 0,
      },
      clearedCount,
    });
  } catch (error) {
    console.error("Error in clearAllSavedPosts:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

export {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getUserPosts,
  toggleSavePost,
  getSavedPosts,
  removeSavedPosts,
  checkIfPostSaved,
  getSavedPostsCount,
  clearAllSavedPosts,
};
