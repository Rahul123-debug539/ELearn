// models/Content.js
const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    subtopicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subtopic",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    // WYSIWYG HTML CONTENT
    fullContent: {
      type: String,
      required: true
    },

    // old fields optional
    description: { type: String, default: "" },
    code: { type: String, default: "" },
    examples: { type: String, default: "" },
    notes: { type: String, default: "" },

    images: { type: [String], default: [] },
    adSection: { type: String, default: "" },
    adImage: { type: String, default: "" },
    videoUrl: { type: String, default: "" },

    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
