import upload from "../middleware/uploadPictureMiddleware.js";
import Comment from "../models/Comment.js";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../config/cloudinaryConfig.js";
import Post from "../models/Post.js";
import { fileRemover } from "../utils/fileRemover.js";

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    upload.single("postPicture")(req, res, async function (err) {
      if (err) {
        return next(new Error(`Se produjo un error al cargar: ${err.message}`));
      }

      if (req.file) {
        // ✅ Remove old image from Cloudinary if it exists
        if (post.photo) {
          const oldPublicId = post.photo; // Stored as "uploads/1739621073399-activities"
          await cloudinary.uploader.destroy(oldPublicId);
        }

        // ✅ Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "uploads", // Store images inside 'uploads' folder
        });

        // ✅ Store only the `public_id` instead of full URL
        post.photo = result.public_id;
      }

      // ✅ Update other fields
      const { title, caption, slug, body, tags, categories, approved } =
        req.body;
      post.title = title || post.title;
      post.caption = caption || post.caption;
      post.slug = slug || post.slug;
      post.body = body || post.body;
      post.tags = tags || post.tags;
      post.categories = categories || post.categories;
      post.approved = approved !== undefined ? approved : post.approved;

      const updatedPost = await post.save();
      return res.json(updatedPost);
    });
  } catch (error) {
    next(error);
  }
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
    let photo = ""; // 👈 Default to empty (not the full URL)
    if (req.file) {
      console.log("📸 Uploading Image to Cloudinary:", req.file.path);
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "uploads",
        });
        photo = result.public_id; // ✅ Save only the `public_id`
      } catch (uploadError) {
        console.error("❌ Cloudinary Upload Error:", uploadError.message);
      }
    } else {
      console.warn("⚠️ No image uploaded, saving empty string.");
    }

    // ✅ Create the post
    const newPost = new Post({
      title,
      caption,
      slug: slug || uuidv4(),
      body,
      tags,
      categories,
      photo, // ✅ Saves only the image name, like on update
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

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });

    if (!post) {
      const error = new Error("Post no encontrado");
      return next(error);
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

const getAllPosts = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};
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

const getPostCount = async (req, res) => {
  try {
    const count = await Post.countDocuments();
    console.log("Count of posts:", count);  
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error en getPostCount:", error);
    res.status(500).json({ error: 'Error al obtener el contador de posts' });
  }
};

export { createPost, updatePost, deletePost, getPost, getAllPosts, getPostCount };
