const Topic = require("../models/Topic");
const Category = require("../models/Category");

/* ======================================================
   UTILS – SAFE SLUG GENERATOR
====================================================== */
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
};

/* ======================================================
   ADD TOPIC (ADMIN)
====================================================== */
exports.addTopic = async (req, res) => {
  try {
    const { categoryId, name } = req.body;

    if (!categoryId || !name) {
      return res
        .status(400)
        .json({ status: false, message: "Category and name required" });
    }

    const slug = generateSlug(name);

    const exists = await Topic.findOne({ slug, categoryId });
    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Topic already exists in this category",
      });
    }

    await Topic.create({ categoryId, name, slug });

    res.json({ status: true, message: "Topic added successfully" });
  } catch (err) {
    console.error("Add Topic error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ======================================================
   GET TOPICS BY CATEGORY ID (ADMIN / OLD FLOW)
====================================================== */
exports.getTopicsByCategoryId = async (req, res) => {
  try {
    const topics = await Topic.find({
      categoryId: req.params.categoryId,
    }).sort({ name: 1 });

    res.json({ status: true, topics });
  } catch (err) {
    console.error("Get Topics error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ======================================================
   GET TOPICS BY CATEGORY SLUG (PUBLIC / SEO)
====================================================== */
exports.getTopicsByCategorySlug = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.categorySlug,
    });

    if (!category) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    const topics = await Topic.find({
      categoryId: category._id,
    }).sort({ name: 1 });

    res.json({ status: true, topics });
  } catch (err) {
    console.error("Get Topics By Slug error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ======================================================
   UPDATE TOPIC (ADMIN)
====================================================== */
exports.updateTopic = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ status: false, message: "Name required" });
    }

    const slug = generateSlug(name);

    const exists = await Topic.findOne({
      slug,
      _id: { $ne: req.params.id },
    });

    if (exists) {
      return res
        .status(400)
        .json({ status: false, message: "Topic slug already exists" });
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true }
    );

    if (!updatedTopic) {
      return res.json({
        status: false,
        message: "Topic not found",
      });
    }

    res.json({
      status: true,
      message: "Topic updated successfully",
      topic: updatedTopic,
    });
  } catch (err) {
    console.error("Update Topic error:", err.message);
    res.status(500).json({
      status: false,
      message: "Error updating topic",
    });
  }
};

/* ======================================================
   DELETE TOPIC (ADMIN)
====================================================== */
exports.deleteTopic = async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    res.json({ status: true, message: "Topic deleted successfully" });
  } catch (err) {
    console.error("Delete Topic error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
