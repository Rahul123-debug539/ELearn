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
// UPDATE CATEGORY
router.put("/:id", verifyToken, isAdmin, updateCategory);


// DELETE CATEGORY
router.delete("/:id", verifyToken, isAdmin, deleteCategory);

// GET ALL CATEGORIES (PUBLIC)
router.get("/", getCategories);

module.exports = router;
