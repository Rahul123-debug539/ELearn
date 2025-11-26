const express = require("express");
const router = express.Router();

const {
  addTopic,
  getTopics,
  deleteTopic
} = require("../controllers/topicController");

const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");

// Admin-only
router.post("/add", verifyToken, isAdmin, addTopic);
router.delete("/:id", verifyToken, isAdmin, deleteTopic);

// Public - topics of a category
router.get("/:categoryId", getTopics);

module.exports = router;
