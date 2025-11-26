const Topic = require("../models/Topic");

// ADD TOPIC (Admin)
exports.addTopic = async (req, res) => {
  try {
    const { categoryId, name } = req.body;

    if (!categoryId || !name) {
      return res
        .status(400)
        .json({ status: false, message: "Category and name required" });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const exists = await Topic.findOne({ slug, categoryId });
    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Topic already exists in this category"
      });
    }

    await Topic.create({ categoryId, name, slug });

    res.json({ status: true, message: "Topic added successfully" });
  } catch (err) {
    console.error("Add Topic error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// GET TOPICS OF CATEGORY (Public)
exports.getTopics = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const topics = await Topic.find({ categoryId }).sort({ name: 1 });
    res.json({ status: true, topics });
  } catch (err) {
    console.error("Get Topics error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// DELETE TOPIC (Admin)
exports.deleteTopic = async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    res.json({ status: true, message: "Topic deleted successfully" });
  } catch (err) {
    console.error("Delete Topic error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
