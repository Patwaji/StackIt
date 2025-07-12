import express from "express";
import {
  postQuestion,
  upvoteQuestion,
  downvoteQuestion,
  getAllQuestions,
  getQuestionById,
} from "../controllers/questionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/new-question", authMiddleware, postQuestion);
router.get("/all", getAllQuestions);
router.get("/:id", getQuestionById);
router.post("/:id/upvote", authMiddleware, upvoteQuestion);
router.post("/:id/downvote", authMiddleware, downvoteQuestion);

export default router;
