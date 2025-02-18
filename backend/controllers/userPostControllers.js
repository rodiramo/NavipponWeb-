import upload from "../middleware/uploadPictureMiddleware.js";
import cloudinary from "../config/cloudinaryConfig.js"; // ✅ Import Cloudinary
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { fileRemover } from "../utils/fileRemover.js";
import { v4 as uuidv4 } from "uuid";

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
      categories = JSON.parse(categories || "[]");
      tags = JSON.parse(tags || "[]");
      body = JSON.parse(body || "{}");
    } catch (error) {
      console.log("❌ JSON Parsing Error:", error.message);
      return res
        .status(400)
        .json({ message: "Invalid JSON format in request" });
    }

    console.log("✅ Parsed Data:", {
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
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      return next(new Error("Post no encontrado"));
    }

    if (post.user.toString() !== req.user._id.toString() && !req.user.admin) {
      return res.status(401).json({ message: "No autorizado" });
    }

    uploadMiddleware(req, res, async function (err) {
      if (err) {
        return next(new Error(`Error al cargar la imagen: ${err.message}`));
      }

      const { title, caption, slug, body, tags, categories } = JSON.parse(
        req.body.document
      );

      post.title = title || post.title;
      post.caption = caption || post.caption;
      post.slug = slug || post.slug;
      post.body = body || post.body;
      post.tags = tags || post.tags;
      post.categories = categories || post.categories;

      if (req.file) {
        if (post.photo) {
          fileRemover(post.photo);
        }
        post.photo = req.file.filename;
      }

      const updatedPost = await post.save();
      return res.json(updatedPost);
    });
  } catch (error) {
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

    fileRemover(post.photo);

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
