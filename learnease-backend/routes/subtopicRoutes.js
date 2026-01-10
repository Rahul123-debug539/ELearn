const express = require("express");
const router = express.Router();

const {
  addSubtopic,
  getSubtopics,
  deleteSubtopic,
  updateSubtopic,
} = require("../controllers/subtopicController");

const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");
const Subtopic = require("../models/Subtopic");

// =======================
// ADMIN ROUTES (UNCHANGED)
// =======================
router.post("/add", verifyToken, isAdmin, addSubtopic);
router.put("/:id", verifyToken, isAdmin, updateSubtopic);
router.delete("/:id", verifyToken, isAdmin, deleteSubtopic);

// =======================
//  NEW: GET SUBTOPIC BY SLUG (SEO SUPPORT)
// =======================
router.get("/slug/:slug", async (req, res) => {
  try {
    const subtopic = await Subtopic.findOne({ slug: req.params.slug });

    if (!subtopic) {
      return res.status(404).json({ message: "Subtopic not found" });
    }

    res.json(subtopic);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:topicId", getSubtopics);

module.exports = router;
