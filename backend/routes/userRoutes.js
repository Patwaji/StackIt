import express from "express";
import {
  signup,
  login,
  verifyOTP,
  getUserDetails,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.get("/:userId", getUserDetails);

export default router;
