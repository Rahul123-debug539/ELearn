const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryBySlug
} = require("../controllers/categoryController");

const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");

// PUBLIC ROUTES
router.get("/", getCategories);
router.get("/by-slug/:slug", getCategoryBySlug);

// ADMIN ROUTES
router.post("/add", verifyToken, isAdmin, addCategory);
router.put("/:id", verifyToken, isAdmin, updateCategory);
router.delete("/:id", verifyToken, isAdmin, deleteCategory);

module.exports = router;
