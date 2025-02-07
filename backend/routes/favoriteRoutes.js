import express from "express";
const router = express.Router();
import { 
  addFavorite, 
  removeFavorite, 
  getUserFavorites, 
  getFavoritesCount 
} from "../controllers/favoriteControllers.js";
import { authGuard } from "../middleware/authMiddleware.js"; 

router.post("/", authGuard, addFavorite);
router.delete("/", authGuard, removeFavorite);
router.get("/:userId", authGuard, getUserFavorites);
router.get("/count/:experienceId", getFavoritesCount);
router.get("/user/:userId", authGuard, getUserFavorites);

export default router;
