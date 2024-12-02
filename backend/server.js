import express from "express";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";
import cors from "cors";
import {
  errorResponserHandler,
  invalidPathHandler,
} from "./middleware/errorHandler";

// Routes
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import experienceRoutes from "./routes/experienceRoutes";
import userExperienceRoutes from "./routes/userExperienceRoutes";
import userPostRoutes from "./routes/userPostRoutes";
import commentRoutes from "./routes/commentRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import postCategoriesRoutes from "./routes/postCategoriesRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";  
import itineraryRoutes from "./routes/itineraryRoutes";
import dayRoutes from "./routes/dayRoutes";  

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/user-experiences", userExperienceRoutes); 
app.use("/api/user-posts", userPostRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/post-categories", postCategoriesRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/itineraries", itineraryRoutes);  
app.use("/api/days", dayRoutes); 

// Carpeta para guardar las imágenes
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(invalidPathHandler);
app.use(errorResponserHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`El servidor está corriendo en puerto ${PORT}`));