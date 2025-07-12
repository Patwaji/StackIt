const Reply = require("../models/reply");

const postReply = async (req, res) => {
  try {
    const { questionId, text } = req.body;
    const userId = req.userId; // Assuming you have the user ID in the request after authentication

    const newReply = new Reply({
      questionId,
      userId,
      text,
    });

    await newReply.save();

    res
      .status(201)
      .json({ message: "Reply posted successfully", replyId: newReply._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const upvoteReply = async (req, res) => {
  try {
    const replyId = req.params.id;
    const userId = req.userId;

    const reply = await Reply.findById(replyId);

    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    // Remove from downvotes if already downvoted
    const downvoteIndex = reply.downvotes.indexOf(userId);
    if (downvoteIndex > -1) {
      reply.downvotes.splice(downvoteIndex, 1);
    }

    // Add to upvotes if not already upvoted
    const upvoteIndex = reply.upvotes.indexOf(userId);
    if (upvoteIndex === -1) {
      reply.upvotes.push(userId);
    }

    await reply.save();

    res.status(200).json({ message: "Reply upvoted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const downvoteReply = async (req, res) => {
  try {
    const replyId = req.params.id;
    const userId = req.userId;

    const reply = await Reply.findById(replyId);

    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    // Remove from upvotes if already upvoted
    const upvoteIndex = reply.upvotes.indexOf(userId);
    if (upvoteIndex > -1) {
      reply.upvotes.splice(upvoteIndex, 1);
    }

    // Add to downvotes if not already downvoted
    const downvoteIndex = reply.downvotes.indexOf(userId);
    if (downvoteIndex === -1) {
      reply.downvotes.push(userId);
    }

    await reply.save();

    res.status(200).json({ message: "Reply downvoted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  postReply,
  upvoteReply,
  downvoteReply,
};
