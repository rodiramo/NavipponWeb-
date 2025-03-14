import express from "express";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import cors from "cors";
import {
  errorResponserHandler,
  invalidPathHandler,
} from "./middleware/errorHandler.js";
import upload from "./middleware/uploadPictureMiddleware.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userExperienceRoutes from "./routes/userExperienceRoutes.js";
import userPostRoutes from "./routes/userPostRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import postCategoriesRoutes from "./routes/postCategoriesRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import emailwebRoutes from "./routes/emailwebRoutes.js";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/user-experiences", userExperienceRoutes);
app.use("/api/user-posts", userPostRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/post-categories", postCategoriesRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/emailweb", emailwebRoutes);

// 📌 Upload Image Route
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ imageUrl: req.file.path }); // Return Cloudinary URL
});

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

// Endpoint to perform a nearby search using latitude and longitude

app.get("/api/places", async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50&key=${GOOGLE_API_KEY}&language=es`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching places:", error.message);
    res.status(500).json({ error: "Error fetching places" });
  }
});

app.get("/api/place-details", async (req, res) => {
  const { placeId } = req.query;
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,price_level,address_components&key=${GOOGLE_API_KEY}&language=es`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching place details:", error.message);
    res.status(500).json({ error: "Error fetching place details" });
  }
});
// 📌 Remove Image Route
app.delete("/remove", async (req, res) => {
  const { imageUrl } = req.body; // Cloudinary Image URL

  if (!imageUrl) {
    return res.status(400).json({ error: "No image URL provided" });
  }

  try {
    // Extract the public ID from Cloudinary URL
    const publicId = imageUrl.split("/").pop().split(".")[0];

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(`uploads/${publicId}`);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete image" });
  }
});

app.use(invalidPathHandler);
app.use(errorResponserHandler);
const PORT = process.env.PORT || 5001;

app.listen(PORT, () =>
  console.log(`El servidor está corriendo en puerto ${PORT}`)
);
