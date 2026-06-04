const express = require("express");
const router = express.Router();

const {
  addSubtopic,
  getSubtopicsByTopicId,
  getSubtopicsBySlug,
  updateSubtopic,
  deleteSubtopic,
} = require("../controllers/subtopicController");

const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");

/* =========================
   PUBLIC ROUTES
========================= */

// 🔥 SEO / FRONTEND (slug-based)
router.get(
  "/by-slug/:categorySlug/:topicSlug",
  getSubtopicsBySlug
);

// 🟡 OLD FLOW (id-based – admin & legacy)
router.get("/:topicId", getSubtopicsByTopicId);

/* =========================
   ADMIN ROUTES
========================= */
router.post("/add", verifyToken, isAdmin, addSubtopic);
router.put("/:id", verifyToken, isAdmin, updateSubtopic);
router.delete("/:id", verifyToken, isAdmin, deleteSubtopic);

module.exports = router;
