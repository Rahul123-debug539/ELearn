const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategories,
  deleteCategory
} = require("../controllers/categoryController");

const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");

// Admin-only
router.post("/add", verifyToken, isAdmin, addCategory);
router.delete("/:id", verifyToken, isAdmin, deleteCategory);

// Public
router.get("/", getCategories);

module.exports = router;
