const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const Topic = require("../models/Topic");
const Subtopic = require("../models/Subtopic");
const Content = require("../models/Content");

router.get("/", async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) {
      return res.json({
        categories: [],
        topics: [],
        subtopics: [],
        content: []
      });
    }

    const regex = new RegExp(q, "i");

    const [categories, topics, subtopics, content] = await Promise.all([
      Category.find({ name: regex }).limit(5),
      Topic.find({ name: regex }).limit(5),
      Subtopic.find({ name: regex }).limit(5),
      Content.find({ title: regex }).limit(5)
    ]);

    res.json({
      categories,
      topics,
      subtopics,
      content
    });

  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ message: "Search failed" });
  }
});

module.exports = router;
