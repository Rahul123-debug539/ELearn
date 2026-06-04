const Subtopic = require("../models/Subtopic");
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
   ADD SUBTOPIC (ADMIN)
====================================================== */
exports.addSubtopic = async (req, res) => {
  try {
    const { topicId, name } = req.body;

    if (!topicId || !name) {
      return res
        .status(400)
        .json({ status: false, message: "Topic and name required" });
    }

    const slug = generateSlug(name);

    const exists = await Subtopic.findOne({ slug, topicId });
    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Subtopic already exists under this topic",
      });
    }

    await Subtopic.create({ topicId, name, slug });

    res.json({ status: true, message: "Subtopic added successfully" });
  } catch (err) {
    console.error("Add Subtopic error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ======================================================
   GET SUBTOPICS BY TOPIC ID (OLD FLOW)
====================================================== */
exports.getSubtopicsByTopicId = async (req, res) => {
  try {
    const subtopics = await Subtopic.find({
      topicId: req.params.topicId,
    }).sort({ name: 1 });

    res.json({ status: true, subtopics });
  } catch (err) {
    console.error("Get Subtopics error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ======================================================
   GET SUBTOPICS BY SLUG (SEO / FRONTEND)
====================================================== */
exports.getSubtopicsBySlug = async (req, res) => {
  try {
    const { categorySlug, topicSlug } = req.params;

    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    const topic = await Topic.findOne({
      slug: topicSlug,
      categoryId: category._id,
    });

    if (!topic) {
      return res
        .status(404)
        .json({ status: false, message: "Topic not found" });
    }

    const subtopics = await Subtopic.find({
      topicId: topic._id,
    }).sort({ name: 1 });

    res.json({ status: true, subtopics });
  } catch (err) {
    console.error("Get Subtopics By Slug error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* ======================================================
   UPDATE SUBTOPIC (ADMIN)
====================================================== */
exports.updateSubtopic = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ status: false, message: "Name required" });
    }

    const slug = generateSlug(name);

    const exists = await Subtopic.findOne({
      slug,
      _id: { $ne: req.params.id },
    });

    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Subtopic slug already exists",
      });
    }

    const updatedSubtopic = await Subtopic.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true }
    );

    if (!updatedSubtopic) {
      return res.json({
        status: false,
        message: "Subtopic not found",
      });
    }

    res.json({
      status: true,
      message: "Subtopic updated successfully",
      subtopic: updatedSubtopic,
    });
  } catch (err) {
    console.error("Update Subtopic error:", err.message);
    res.status(500).json({
      status: false,
      message: "Error updating subtopic",
    });
  }
};

/* ======================================================
   DELETE SUBTOPIC (ADMIN)
====================================================== */
exports.deleteSubtopic = async (req, res) => {
  try {
    await Subtopic.findByIdAndDelete(req.params.id);
    res.json({ status: true, message: "Subtopic deleted successfully" });
  } catch (err) {
    console.error("Delete Subtopic error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
