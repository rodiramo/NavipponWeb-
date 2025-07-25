import express from "express";
import upload from "../middleware/uploadPictureMiddleware.js";
import {
  registerUser,
  loginUser,
  userProfile,
  getUserFriends,
  updateProfile,
  getUserPosts,
  getUserTrips,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getUserFavorites,
  updateProfilePicture,
  updateCoverImg,
  addItemToChecklist,
  getAllUsers,
  fixExistingUsers,
  deleteUser,
  userProfileById,
  toggleFriend,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  getUserCount,
} from "../controllers/userControllers.js";
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/count", authGuard, getUserCount);

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
router.post("/fix-existing-users", authGuard, adminGuard, fixExistingUsers);
router.post("/checklist", authGuard, adminGuard, addItemToChecklist);

router.get("/", authGuard, getAllUsers);
router.delete("/:userId", authGuard, adminGuard, deleteUser);
router.get("/:userId/friends", authGuard, getUserFriends);

router.get("/profile/:userId", authGuard, userProfileById);
router.post("/toggleFriend/:userId", authGuard, toggleFriend);

router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password", resetPassword);
router.get("/:userId/posts", authGuard, getUserPosts);

// Get user's trips
router.get("/:userId/trips", authGuard, getUserTrips);

// Get user's favorites
router.get("/:userId/favorites", authGuard, getUserFavorites);

// Send friend request
router.post("/send-friend-request/:userId", authGuard, sendFriendRequest);

// Accept friend request
router.post(
  "/accept-friend-request/:requestId",
  authGuard,
  acceptFriendRequest
);

// Get friend requests
router.get("/friend-requests", authGuard, getFriendRequests);

export default router;
