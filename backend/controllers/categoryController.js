const Category = require("../models/Category");
const Topic = require("../models/Topic");
const Subtopic = require("../models/Subtopic");
const Content = require("../models/Content");

/* ======================================================
   UTILS – SAFE SLUG GENERATOR
====================================================== */
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")   // remove special chars
    .replace(/\s+/g, "-");          // spaces → hyphen
};

/* ======================================================
   ADD CATEGORY (ADMIN)
====================================================== */
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ status: false, message: "Name required" });
    }

    const slug = generateSlug(name);

    const exists = await Category.findOne({ slug });
    if (exists) {
      return res
        .status(400)
        .json({ status: false, message: "Category already exists" });
    }

    await Category.create({ name, slug });

    res.json({
      status: true,
      message: "Category added successfully",
    });
  } catch (err) {
    console.error("Add Category error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ======================================================
   GET ALL CATEGORIES (PUBLIC)
====================================================== */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ status: true, categories });
  } catch (err) {
    console.error("Get Categories error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ======================================================
   GET CATEGORY BY SLUG (PUBLIC – SEO)
====================================================== */
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
    });

    if (!category) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    res.json({ status: true, category });
  } catch (err) {
    console.error("Get Category By Slug error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ======================================================
   UPDATE CATEGORY (ADMIN)
====================================================== */
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ status: false, message: "Name required" });
    }

    const slug = generateSlug(name);

    // prevent duplicate slug
    const exists = await Category.findOne({
      slug,
      _id: { $ne: req.params.id },
    });

    if (exists) {
      return res
        .status(400)
        .json({ status: false, message: "Category slug already exists" });
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true }
    );

    res.json({
      status: true,
      message: "Category updated successfully",
      category: updated,
    });
  } catch (err) {
    console.error("Update Category error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ======================================================
   DELETE CATEGORY + CASCADE (ADMIN)
====================================================== */
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // 1️⃣ Find topics under category
    const topics = await Topic.find({ categoryId });

    for (const topic of topics) {
      const topicId = topic._id;

      // 2️⃣ Find subtopics under topic
      const subtopics = await Subtopic.find({ topicId });

      for (const sub of subtopics) {
        // 3️⃣ Delete content under subtopic
        await Content.deleteMany({ subtopicId: sub._id });
      }

      await Subtopic.deleteMany({ topicId });
    }

    await Topic.deleteMany({ categoryId });

    // 4️⃣ Delete category
    await Category.findByIdAndDelete(categoryId);

    res.json({
      status: true,
      message:
        "Category + Topics + Subtopics + Content deleted successfully",
    });
  } catch (err) {
    console.error("Cascade Delete Error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
