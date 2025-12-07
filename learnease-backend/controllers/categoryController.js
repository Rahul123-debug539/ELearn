// const Category = require("../models/Category");

// ADD CATEGORY (Admin)
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ status: false, message: "Name required" });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const exists = await Category.findOne({ slug });
    if (exists) {
      return res
        .status(400)
        .json({ status: false, message: "Category already exists" });
    }

    await Category.create({ name, slug });

    res.json({ status: true, message: "Category added successfully" });
  } catch (err) {
    console.error("Add Category error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// GET ALL CATEGORIES (Public - for navbar)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ status: true, categories });
  } catch (err) {
    console.error("Get Categories error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// DELETE CATEGORY (Admin)
const Category = require("../models/Category");
const Topic = require("../models/Topic");
const Subtopic = require("../models/Subtopic");
const Content = require("../models/Content");

// DELETE CATEGORY + RELATED DATA
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // 1️⃣ DELETE TOPICS OF THIS CATEGORY
    const topics = await Topic.find({ categoryId });

    for (const topic of topics) {
      const topicId = topic._id;

      // 2️⃣ DELETE SUBTOPICS OF THIS TOPIC
      const subtopics = await Subtopic.find({ topicId });

      for (const sub of subtopics) {
        const subtopicId = sub._id;

        // 3️⃣ DELETE CONTENT OF THIS SUBTOPIC
        await Content.deleteMany({ subtopicId });
      }

      await Subtopic.deleteMany({ topicId });
    }

    await Topic.deleteMany({ categoryId });

    // 4️⃣ FINALLY DELETE THE CATEGORY
    await Category.findByIdAndDelete(categoryId);

    res.json({
      status: true,
      message: "Category + Topics + Subtopics + Content deleted successfully"
    });
  } catch (err) {
    console.error("Cascade Delete Error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};


// UPDATE CATEGORY (Admin)
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ status: false, message: "Name required" });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

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

