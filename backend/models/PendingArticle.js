const mongoose = require("mongoose");

const pendingArticleSchema = new mongoose.Schema(
  {
    // kis user ne submit kiya
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },

    // kis subtopic ke liye content hai
    subtopicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subtopic",
      required: true
    },

    // article title
    title: {
      type: String,
      required: true,
      trim: true
    },

    // ReactQuill HTML content
    fullContent: {
      type: String,
      required: true
    },

    // additional uploaded images
    images: {
      type: [String],
      default: []
    },

    // youtube embed / video url
    videoUrl: {
      type: String,
      default: ""
    },

    // article engagement
    likes: {
      type: Number,
      default: 0
    },

    views: {
      type: Number,
      default: 0
    },

    // moderation
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    // admin feedback
    adminRemark: {
      type: String,
      default: ""
    },

    // approval tracking
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "PendingArticle",
  pendingArticleSchema
);