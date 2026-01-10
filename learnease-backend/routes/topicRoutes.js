const express = require("express");
const router = express.Router();

const {
  addTopic,
  getTopics,
  deleteTopic,
  updateTopic
} = require("../controllers/topicController");

const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");
const Topic = require("../models/Topic");

// =======================
// ADMIN ROUTES (UNCHANGED)
// =======================
router.post("/add", verifyToken, isAdmin, addTopic);
router.put("/:id", verifyToken, isAdmin, updateTopic);
router.delete("/:id", verifyToken, isAdmin, deleteTopic);

// =======================
//  NEW: GET TOPIC BY SLUG (SEO SUPPORT)
// =======================
router.get("/slug/:slug", async (req, res) => {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug });

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:categoryId", getTopics);

module.exports = router;
