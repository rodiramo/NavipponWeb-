import express from "express";
import upload from "../middleware/uploadPictureMiddleware.js";
import {
  registerUser,
  loginUser,
  userProfile,
  getUserFriends,
  updateProfile,
  updateProfilePicture,
  updateCoverImg,
  getAllUsers,
  deleteUser,
  userProfileById,
  toggleFriend, // ✅ New function
} from "../controllers/userControllers.js";
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authGuard, userProfile);
router.put("/updateProfile/:userId", authGuard, updateProfile);
router.put(
  "/updateProfilePicture",
  authGuard,
  upload.single("profilePicture"),
  updateProfilePicture
);
router.put(
  "/updateCoverImg",
  authGuard,
  upload.single("coverImg"),
  updateCoverImg
);
router.get("/", authGuard, getAllUsers);
router.delete("/:userId", authGuard, adminGuard, deleteUser);
router.get("/:userId/friends", authGuard, getUserFriends);

router.get("/profile/:userId", authGuard, userProfileById);
// ✅ Friend Request Routes
router.post("/toggleFriend/:userId", authGuard, toggleFriend); // Add/remove friend

export default router;
