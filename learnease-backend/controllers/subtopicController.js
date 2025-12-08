const Subtopic = require("../models/Subtopic");

// ADD SUBTOPIC (Admin)
exports.addSubtopic = async (req, res) => {
  try {
    const { topicId, name } = req.body;

    if (!topicId || !name) {
      return res
        .status(400)
        .json({ status: false, message: "Topic and name required" });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const exists = await Subtopic.findOne({ slug, topicId });
    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Subtopic already exists under this topic"
      });
    }

    await Subtopic.create({ topicId, name, slug });

    res.json({ status: true, message: "Subtopic added successfully" });
  } catch (err) {
    console.error("Add Subtopic error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// GET SUBTOPICS OF TOPIC (Public)
exports.getSubtopics = async (req, res) => {
  try {
    const { topicId } = req.params;
    const subtopics = await Subtopic.find({ topicId }).sort({ name: 1 });
    res.json({ status: true, subtopics });
  } catch (err) {
    console.error("Get Subtopics error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.addSubtopic = async (req, res) => {
  try {
    const { topicId, name } = req.body;

    const slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const newSubtopic = new Subtopic({
      topicId,
      name,
      slug,
    });

    await newSubtopic.save();

    res.json({
      status: true,
      message: "Subtopic added successfully",
      subtopic: newSubtopic,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error adding subtopic",
    });
  }
};

// ✅ GET SUBTOPICS BY TOPIC
exports.getSubtopics = async (req, res) => {
  try {
    const subtopics = await Subtopic.find({ topicId: req.params.topicId });

    res.json({
      status: true,
      subtopics,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching subtopics",
    });
  }
};

// ✅ UPDATE SUBTOPIC
exports.updateSubtopic = async (req, res) => {
  try {
    const { name } = req.body;

    const slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

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
    res.status(500).json({
      status: false,
      message: "Error updating subtopic",
    });
  }
};

// DELETE SUBTOPIC (Admin)
exports.deleteSubtopic = async (req, res) => {
  try {
    await Subtopic.findByIdAndDelete(req.params.id);
    res.json({ status: true, message: "Subtopic deleted successfully" });
  } catch (err) {
    console.error("Delete Subtopic error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
