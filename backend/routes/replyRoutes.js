const express = require("express");
const router = express.Router();
const replyController = require("../controllers/replyController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, replyController.postReply);
router.post("/:id/upvote", authMiddleware, replyController.upvoteReply);
router.post("/:id/downvote", authMiddleware, replyController.downvoteReply);

module.exports = router;
