import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  plainText: {
    type: String,
    required: true,
  },
  htmlContent: {
    type: String,
    required: true,
  },
  formatting: [
    {
      type: {
        type: String,
      },
      text: {
        type: String,
      },
      position: {
        start: {
          type: Number,
        },
        end: {
          type: Number,
        },
      },
    },
  ],
  links: [
    {
      text: { type: String },
      url: { type: String },
      target: { type: String },
      position: {
        start: { type: Number },
        end: { type: Number },
      },
    },
  ],

  alignment: {
    type: String,
  },
  wordCount: {
    type: Number,
  },
  characterCount: {
    type: Number,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  upvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  downvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
