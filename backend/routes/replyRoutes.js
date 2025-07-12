import express from "express";
import {
  postReply,
  upvoteReply,
  downvoteReply,
} from "../controllers/replyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, postReply);
router.post("/:id/upvote", authMiddleware, upvoteReply);
router.post("/:id/downvote", authMiddleware, downvoteReply);

export default router;
