const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");

// ADD CATEGORY
router.post("/add", verifyToken, isAdmin, addCategory);

// UPDATE CATEGORY
router.put("/:id", verifyToken, isAdmin, updateCategory);

// DELETE CATEGORY
router.delete("/:id", verifyToken, isAdmin, deleteCategory);

// ✅ GET CATEGORY BY SLUG (PUBLIC - SEO)  —— MUST BE BEFORE /:id
router.get("/slug/:slug", async (req, res) => {
  try {
    const Category = require("../models/Category");

    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ REDIRECT OLD ID URL TO SLUG (SEO)
router.get("/:id", async (req, res) => {
  try {
    const Category = require("../models/Category");

    const category = await Category.findById(req.params.id);
    if (!category) return res.sendStatus(404);

    res.redirect(301, `/category/${category.slug}`);
  } catch (error) {
    res.sendStatus(400);
  }
});

// GET ALL CATEGORIES (PUBLIC)
router.get("/", getCategories);

module.exports = router;
