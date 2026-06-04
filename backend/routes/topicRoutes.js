const express = require("express");
const router = express.Router();

const {
  addTopic,
  getTopicsByCategoryId,
  getTopicsByCategorySlug,
  updateTopic,
  deleteTopic
} = require("../controllers/topicController");

const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");

/* =========================
   PUBLIC ROUTES
========================= */

// 🔥 FRONTEND / SEO (slug-based)
router.get("/by-slug/:categorySlug", getTopicsByCategorySlug);

// 🟡 ADMIN / OLD FLOW (id-based – keep as-is)
router.get("/:categoryId", getTopicsByCategoryId);

/* =========================
   ADMIN ROUTES
========================= */
router.post("/add", verifyToken, isAdmin, addTopic);
router.put("/:id", verifyToken, isAdmin, updateTopic);
router.delete("/:id", verifyToken, isAdmin, deleteTopic);

module.exports = router;
