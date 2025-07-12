import express from "express";
import {
  signup,
  login,
  verifyOTP,
  getUserDetails,
  sendOTP,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/send-otp", sendOTP);
router.get("/me", authMiddleware, getUserDetails);

export default router;
