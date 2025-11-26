const express = require("express");
const router = express.Router();

const {
  addSubtopic,
  getSubtopics,
  deleteSubtopic
} = require("../controllers/subtopicController");

const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");

// Admin-only
router.post("/add", verifyToken, isAdmin, addSubtopic);
router.delete("/:id", verifyToken, isAdmin, deleteSubtopic);

// Public - subtopics of a topic
router.get("/:topicId", getSubtopics);

module.exports = router;
