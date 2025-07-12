const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, questionController.postQuestion);
router.post("/:id/upvote", authMiddleware, questionController.upvoteQuestion);
router.post(
  "/:id/downvote",
  authMiddleware,
  questionController.downvoteQuestion
);

module.exports = router;
