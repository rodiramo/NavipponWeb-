import mongoose from "mongoose";
import Review from "../models/Review.js";
import Experience from "../models/Experience.js";

const updateExperienceRating = async (experienceId) => {
  console.log(`Updating rating for experience: ${experienceId}`);

  const reviews = await Review.find({ experience: experienceId });

  if (reviews.length === 0) {
    console.log("No reviews found, resetting rating.");
    await Experience.findByIdAndUpdate(experienceId, {
      ratings: 0,
      numReviews: 0,
    });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  console.log(
    `Total Rating: ${totalRating}, Review Count: ${reviews.length}, New Avg: ${averageRating}`
  );

  await Experience.findByIdAndUpdate(experienceId, {
    ratings: averageRating.toFixed(1), // Store as 1 decimal place
    numReviews: reviews.length,
  });
};

const createReview = async (req, res, next) => {
  try {
    const { rating, title, desc, slug } = req.body;
    const experience = await Experience.findOne({ slug });

    if (!experience) {
      return res.status(404).json({ message: "Experiencia no encontrada" });
    }

    const newReview = new Review({
      user: req.user._id,
      rating,
      title,
      desc,
      experience: experience._id,
    });

    const savedReview = await newReview.save();

    // ✅ Update Experience Rating
    await updateExperienceRating(experience._id);

    return res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error creating review:", error.message);
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { desc, rating, title, check } = req.body;
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    if (desc !== undefined) review.desc = desc;
    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title;
    // Update the check field if provided:
    if (typeof check !== "undefined") {
      review.check = check;
    }

    const updatedReview = await review.save();

    // Update the related Experience rating if needed
    await updateExperienceRating(review.experience);

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

    const experienceId = review.experience; // Save Experience ID before deleting

    await Review.findByIdAndDelete(req.params.reviewId);

    // ⭐ Update Experience Rating
    await updateExperienceRating(experienceId);

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

const getReviewCount = async (req, res) => {
  try {
    const count = await Review.countDocuments();
    console.log("Count of reviews:", count);
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error en getReviewCount:", error);
    res.status(500).json({ error: "Error al obtener el contador de reviews" });
  }
};

export {
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  getReviewCount,
};
