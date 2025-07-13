import express from "express";
import { getAllNotifications } from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/all", authMiddleware, getAllNotifications);

export default router;
