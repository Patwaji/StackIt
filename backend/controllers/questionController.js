import mongoose from "mongoose";
import Question from "../models/question.js";
import Reply from "../models/reply.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";
import { sendMail } from "../utils/transporter.js";

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
      tags,
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
      tags,
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
    const isNewUpvote = upvoteIndex === -1;

    if (isNewUpvote) {
      question.upvotes.push(userId);

      if (question.userId.toString() !== userId) {
        const [receiver, sender] = await Promise.all([
          User.findById(question.userId),
          User.findById(userId),
        ]);

        if (receiver && sender) {
          const newNotification = await Notification.create({
            text: `Your question was upvoted by ${sender.name}.`,
            type: "upvote",
            user: receiver._id,
            fromUser: userId,
            question: question._id,
          });

          console.log("✅ Notification created:", newNotification);

          try {
            if (receiver.email) {
              await sendMail({
                to: receiver.email,
                subject: "Your question got an upvote! - StackIt",
                templateData: {
                  SUBJECT: "Your question got an upvote!",
                  GREETING: `Hello ${receiver.name},`,
                  MAIN_MESSAGE: `${sender.name} upvoted your question titled "${question.title}".`,
                  HIGHLIGHT_CONTENT: "🔥 Keep engaging with your audience!",
                  SECONDARY_MESSAGE:
                    "You can view your question and see replies on StackIt.",
                },
              });
            }
          } catch (emailErr) {
            console.error("Failed to send upvote email:", emailErr.message);
          }
        }
      }
    }

    await question.save();
    res.status(200).json({ message: "Question upvoted successfully" });
  } catch (error) {
    console.error("Upvote Error:", error);
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
    const isNewDownvote = downvoteIndex === -1;

    if (isNewDownvote) {
      question.downvotes.push(userId);

      if (question.userId.toString() !== userId) {
        const [receiver, sender] = await Promise.all([
          User.findById(question.userId),
          User.findById(userId),
        ]);

        if (receiver && sender) {
          await Notification.create({
            text: `Your question was downvoted by ${sender.name}.`,
            type: "downvote",
            user: receiver._id,
            fromUser: userId,
            question: question._id,
          });

          try {
            if (receiver.email) {
              await sendMail({
                to: receiver.email,
                subject: "Someone downvoted your question - StackIt",
                templateData: {
                  SUBJECT: "Someone downvoted your question - StackIt",
                  GREETING: `Hey ${receiver.name},`,
                  MAIN_MESSAGE: `${sender.name} downvoted your question titled "${question.title}".`,
                  HIGHLIGHT_CONTENT: "👎 Don't worry, keep improving!",
                  SECONDARY_MESSAGE:
                    "You can edit your question or reply to feedback.",
                },
              });
            }
          } catch (emailErr) {
            console.error("Failed to send downvote email:", emailErr.message);
          }
        }
      }
    }

    await question.save();
    res.status(200).json({ message: "Question downvoted successfully" });
  } catch (error) {
    console.error("Downvote Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sort || "newest";
    const search = req.query.search || "";
    const tags = req.query.tags;

    const matchCriteria = {};

    if (search) {
      matchCriteria.$or = [
        { title: { $regex: search, $options: "i" } },
        { plainText: { $regex: search, $options: "i" } },
      ];
    }

    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      matchCriteria.tags = { $in: tagsArray };
    }

    const aggregationPipeline = [
      { $match: matchCriteria },
      {
        $lookup: {
          from: "replies",
          localField: "_id",
          foreignField: "questionId",
          as: "replies",
        },
      },
      {
        $addFields: {
          replyCount: { $size: { $ifNull: ["$replies", []] } },
          upvotesCount: { $size: { $ifNull: ["$upvotes", []] } },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          title: 1,
          plainText: 1,
          htmlContent: 1,
          createdAt: 1,
          upvotes: 1,
          downvotes: 1,
          replyCount: 1,
          upvotesCount: 1,
          tags: 1,
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
          },
        },
      },
    ];

    if (sortBy === "upvotes") {
      aggregationPipeline.push({ $sort: { upvotesCount: -1, createdAt: -1 } });
    } else if (sortBy === "replies") {
      aggregationPipeline.push({ $sort: { replyCount: -1, createdAt: -1 } });
    } else {
      aggregationPipeline.push({ $sort: { createdAt: -1 } });
    }

    aggregationPipeline.push({ $skip: skip }, { $limit: limit });

    const questions = await Question.aggregate(aggregationPipeline);
    const totalCount = await Question.countDocuments(matchCriteria);

    res.status(200).json({
      page,
      total: totalCount,
      pageSize: questions.length,
      questions,
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
