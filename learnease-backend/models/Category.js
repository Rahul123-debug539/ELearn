const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    }
  },
  { timestamps: true }
);

// ✅ AUTO-GENERATE SEO SAFE SLUG
categorySchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();

  this.slug = slugify(this.name, {
    lower: true,
    strict: true   // removes #, +, special chars
  });

  next();
});

module.exports = mongoose.model("Category", categorySchema);
