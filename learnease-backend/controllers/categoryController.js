const Category = require("../models/Category");

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
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ status: true, message: "Category deleted successfully" });
  } catch (err) {
    console.error("Delete Category error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
