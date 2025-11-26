const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    subtopicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subtopic",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    code: {
      type: String,
      default: ""
    },
    images: [
      {
        type: String // /uploads/... URL
      }
    ],
    notes: {
      type: String,
      default: ""
    },
    examples: {
      type: String,
      default: ""
    },
    adSection: {
      type: String,
      default: "" // future advertisement embed
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
