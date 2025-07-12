import Reply from "../models/reply.js";

export const postReply = async (req, res) => {
  try {
    const { questionId, text } = req.body;
    const userId = req.userId;

    const newReply = new Reply({
      questionId,
      userId,
      text,
    });

    await newReply.save();

    res.status(201).json({
      message: "Reply posted successfully",
      replyId: newReply._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const upvoteReply = async (req, res) => {
  try {
    const replyId = req.params.id;
    const userId = req.userId;

    const reply = await Reply.findById(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const downvoteIndex = reply.downvotes.indexOf(userId);
    if (downvoteIndex > -1) {
      reply.downvotes.splice(downvoteIndex, 1);
    }

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

export const downvoteReply = async (req, res) => {
  try {
    const replyId = req.params.id;
    const userId = req.userId;

    const reply = await Reply.findById(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const upvoteIndex = reply.upvotes.indexOf(userId);
    if (upvoteIndex > -1) {
      reply.upvotes.splice(upvoteIndex, 1);
    }

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
