import express from "express";
import {
  postQuestion,
  upvoteQuestion,
  downvoteQuestion,
} from "../controllers/questionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, postQuestion);
router.post("/:id/upvote", authMiddleware, upvoteQuestion);
router.post("/:id/downvote", authMiddleware, downvoteQuestion);

export default router;
