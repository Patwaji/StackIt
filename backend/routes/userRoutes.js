import express from "express";
import {
  signup,
  login,
  verifyOTP,
  getUserDetails,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.get("/me", authMiddleware, getUserDetails);

export default router;
