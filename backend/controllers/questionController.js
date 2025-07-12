import mongoose from "mongoose";
import Question from "../models/question.js";
import Reply from "../models/reply.js";

export const postQuestion = async (req, res) => {
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

    const userId = req.user.userId;

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

    res.status(201).json({
      message: "Question posted successfully",
      questionId: newQuestion._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const upvoteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.user.userId;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const downvoteIndex = question.downvotes.indexOf(userId);
    if (downvoteIndex > -1) {
      question.downvotes.splice(downvoteIndex, 1);
    }

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

export const downvoteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.user.userId;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const upvoteIndex = question.upvotes.indexOf(userId);
    if (upvoteIndex > -1) {
      question.upvotes.splice(upvoteIndex, 1);
    }

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

export const getAllQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "recent";
    const skip = (page - 1) * limit;

    let sortOption = {};
    if (sortBy === "upvotes") {
      sortOption = { upvotes: -1 };
    } else if (sortBy === "replies") {
    } else {
      sortOption = { createdAt: -1 };
    }

    let questions = await Question.find()
      .populate("userId", "name email")
      .lean();

    const questionIds = questions.map((q) => q._id);
    const replies = await Reply.aggregate([
      { $match: { questionId: { $in: questionIds } } },
      { $group: { _id: "$questionId", count: { $sum: 1 } } },
    ]);

    const replyMap = {};
    replies.forEach((r) => {
      replyMap[r._id.toString()] = r.count;
    });

    questions = questions.map((q) => ({
      ...q,
      replyCount: replyMap[q._id.toString()] || 0,
      upvotesCount: q.upvotes.length,
    }));

    if (sortBy === "replies") {
      questions.sort((a, b) => b.replyCount - a.replyCount);
    } else if (sortBy === "upvotes") {
      questions.sort((a, b) => b.upvotesCount - a.upvotesCount);
    }

    const paginatedQuestions = questions.slice(skip, skip + limit);

    res.status(200).json({
      page,
      total: questions.length,
      pageSize: paginatedQuestions.length,
      questions: paginatedQuestions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid question ID" });
    }

    const question = await Question.findById(id)
      .populate("userId", "name email")
      .lean();

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const replies = await Reply.find({ questionId: id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      question,
      replies,
    });
  } catch (error) {
    console.error("Error fetching question by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
