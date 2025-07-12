const Question = require("../models/question");

const postQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      plainText,
      htmlContent,
      formatting,
      links,
      alignment,
      wordCount,
      characterCount,
    } = req.body;
    const userId = req.userId; // Assuming you have the user ID in the request after authentication

    const newQuestion = new Question({
      title,
      description,
      plainText,
      htmlContent,
      formatting,
      links,
      alignment,
      wordCount,
      characterCount,
      userId,
    });

    await newQuestion.save();

    res
      .status(201)
      .json({
        message: "Question posted successfully",
        questionId: newQuestion._id,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const upvoteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.userId;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Remove from downvotes if already downvoted
    const downvoteIndex = question.downvotes.indexOf(userId);
    if (downvoteIndex > -1) {
      question.downvotes.splice(downvoteIndex, 1);
    }

    // Add to upvotes if not already upvoted
    const upvoteIndex = question.upvotes.indexOf(userId);
    if (upvoteIndex === -1) {
      question.upvotes.push(userId);
    }

    await question.save();

    res.status(200).json({ message: "Question upvoted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const downvoteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.userId;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Remove from upvotes if already upvoted
    const upvoteIndex = question.upvotes.indexOf(userId);
    if (upvoteIndex > -1) {
      question.upvotes.splice(upvoteIndex, 1);
    }

    // Add to downvotes if not already downvoted
    const downvoteIndex = question.downvotes.indexOf(userId);
    if (downvoteIndex === -1) {
      question.downvotes.push(userId);
    }

    await question.save();

    res.status(200).json({ message: "Question downvoted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  postQuestion,
  upvoteQuestion,
  downvoteQuestion,
};
