const Content = require("../models/Content");

// ADD CONTENT (Admin)
exports.addContent = async (req, res) => {
  try {
    const { subtopicId, title, description, code, notes, examples, adSection } =
      req.body;

    if (!subtopicId || !title || !description) {
      return res
        .status(400)
        .json({ status: false, message: "Subtopic, title and description required" });
    }

    const images = req.files ? req.files.map((f) => "/" + f.path) : [];

    await Content.create({
      subtopicId,
      title,
      description,
      code,
      notes,
      examples,
      adSection,
      images
    });

    res.json({ status: true, message: "Content added successfully" });
  } catch (err) {
    console.error("Add Content error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// GET CONTENT (Public)
exports.getContent = async (req, res) => {
  try {
    const { subtopicId } = req.params;
    const content = await Content.findOne({ subtopicId });

    res.json({ status: true, content });
  } catch (err) {
    console.error("Get Content error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// UPDATE CONTENT (Admin)
exports.updateContent = async (req, res) => {
  try {
    const { subtopicId } = req.params;

    const updates = req.body;

    if (req.files && req.files.length > 0) {
      updates.images = req.files.map((f) => "/" + f.path);
    }

    await Content.findOneAndUpdate({ subtopicId }, updates);

    res.json({ status: true, message: "Content updated" });
  } catch (err) {
    console.error("Update Content error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// DELETE CONTENT (Admin)
exports.deleteContent = async (req, res) => {
  try {
    const { subtopicId } = req.params;
    await Content.findOneAndDelete({ subtopicId });
    res.json({ status: true, message: "Content deleted" });
  } catch (err) {
    console.error("Delete Content error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
