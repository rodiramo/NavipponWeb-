import express from "express";
import {
  forgotPassword,
  resetPassword,
  verifyResetToken,
  // ... your existing auth controllers
} from "../controllers/authController.js";

const router = express.Router();

// Your existing routes...
// router.post('/login', login);
// router.post('/register', register);

// NEW PASSWORD RESET ROUTES
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password", resetPassword);

export default router;
