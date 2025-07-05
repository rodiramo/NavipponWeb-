import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary"; // Added missing import
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
import emailRoutes from "./routes/emailRoutes.js";
import importRoutes from "./routes/importRoutes.js";

dotenv.config();
connectDB();
const app = express();

// 🔥 CRITICAL: CORS MUST BE CONFIGURED BEFORE ALL OTHER MIDDLEWARE
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3001",
      "http://localhost:5001",
      "http://localhost:3000",
      "https://navippon.netlify.app/",
      "https://navippon.netlify.app",
    ];

    // Allow any netlify.app subdomain (for preview deployments)
    const isNetlifyDomain = origin.endsWith(".netlify.app");

    if (allowedOrigins.includes(origin) || isNetlifyDomain) {
      console.log(`✅ CORS allowed for origin: ${origin}`);
      return callback(null, true);
    }

    console.log(`❌ CORS blocked for origin: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  exposedHeaders: [
    "x-totalcount",
    "x-totalpagecount",
    "x-currentpage",
    "x-pagesize",
    "x-filter",
  ],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

// Apply CORS FIRST
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Debug middleware to track requests
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${
      req.headers.origin
    }`
  );
  next();
});

// Basic health check route
app.get("/", (req, res) => {
  res.json({
    message: "Server is running...",
    timestamp: new Date().toISOString(),
    cors: "enabled",
  });
});

// API Routes
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
app.use("/api/email", emailRoutes);
app.use("/api/import", importRoutes);

// 📌 Upload Image Route
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ imageUrl: req.file.path });
});

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

// Google Places API routes
app.get("/api/places", async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50&key=${GOOGLE_API_KEY}&language=es&region=jp`
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
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,price_level,address_components,editorial_summary&key=${GOOGLE_API_KEY}&language=es&region=jp`
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
  const { imageUrl } = req.body;

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
    console.error("Cloudinary delete error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

// 🔥 CUSTOM ERROR HANDLERS WITH CORS SUPPORT
// Handle 404 errors with CORS headers
app.use("*", (req, res) => {
  // Ensure CORS headers are present for 404 responses
  const origin = req.headers.origin;
  if (
    origin &&
    (origin.endsWith(".netlify.app") ||
      [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://navippon.netlify.app",
      ].includes(origin))
  ) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Global error handler with CORS support
app.use((err, req, res, next) => {
  // Ensure CORS headers are present even in error responses
  const origin = req.headers.origin;
  if (
    origin &&
    (origin.endsWith(".netlify.app") ||
      [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://navippon.netlify.app",
      ].includes(origin))
  ) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  console.error("Global error handler:", err.message);
  console.error("Stack trace:", err.stack);

  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV === "development";
  const errorMessage = isDevelopment ? err.message : "Internal Server Error";

  res.status(err.status || 500).json({
    error: errorMessage,
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✅ CORS enabled for netlify.app domains`);
  console.log(`📝 Logging requests enabled`);
});

// Handle process termination
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  process.exit(0);
});
