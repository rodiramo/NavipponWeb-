import Review from "../models/Review.js";
import Experience from "../models/Experience.js";

const createReview = async (req, res, next) => {
  try {
    const { rating, title, desc, slug } = req.body;

    // Validate title
    if (!title || typeof title !== "string") {
      return res.status(400).json({
        message: "Title is required and must be a string for new reviews.",
      });
    }

    // Validate rating
    if (typeof rating !== "number") {
      return res.status(400).json({
        message: "Rating is required and must be a number for new reviews.",
      });
    }

    // Validate description
    if (!desc || typeof desc !== "string") {
      return res.status(400).json({
        message: "Description is required and must be a string.",
      });
    }

    // Find experience by slug
    const experience = await Experience.findOne({ slug });

    if (!experience) {
      return res.status(404).json({ message: "Experiencia no encontrada" });
    }

    // Ensure `reviews` is an array
    if (!Array.isArray(experience.reviews)) {
      experience.reviews = [];
    }

    // Create new review
    const newReview = new Review({
      user: req.user._id,
      rating,
      title,
      desc,
      experience: experience._id,
    });

    const savedReview = await newReview.save();

    // Push review to experience
    experience.reviews.push(savedReview._id);
    await experience.save();

    return res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error creating review:", error.message);
    next(error);
  }
};

import mongoose from "mongoose";

const updateReview = async (req, res, next) => {
  try {
    const { desc, rating, title } = req.body;
    const { reviewId } = req.params;

    // ✅ Check if `reviewId` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    // ✅ Only update fields that exist in the request body
    if (desc !== undefined) review.desc = desc;
    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title;

    const updatedReview = await review.save();
    return res.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    // Delete only the requested review
    await Review.findByIdAndDelete(req.params.reviewId);

    return res.json({ message: "El comentario ha sido eliminado" });
  } catch (error) {
    next(error);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};
    if (filter) {
      where.desc = { $regex: filter, $options: "i" };
    }
    let query = Review.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await Review.find(where).countDocuments();
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
          path: "parent",
          populate: [
            {
              path: "user",
              select: ["avatar", "name"],
            },
          ],
        },
        {
          path: "replyOnUser",
          select: ["avatar", "name"],
        },
        {
          path: "experience",
          select: ["slug", "title"],
        },
      ])
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export { createReview, updateReview, deleteReview, getAllReviews };
