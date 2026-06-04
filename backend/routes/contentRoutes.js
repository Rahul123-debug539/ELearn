const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");

const {
  addContent,
  updateContent,
  deleteContent,
  getContentBySubtopicId,
  getSingleContent,
  getRelatedContent,
  getContentBySlug
} = require("../controllers/contentController");

/* =============================
   ADMIN ROUTES
============================= */

router.post(
  "/add",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "adImage", maxCount: 1 }
  ]),
  addContent
);

router.put(
  "/update/:contentId",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "adImage", maxCount: 1 }
  ]),
  updateContent
);

router.delete(
  "/delete/:contentId/:subtopicId",
  verifyToken,
  isAdmin,
  deleteContent
);

/* =============================
   PUBLIC ROUTES (ORDER MATTERS)
============================= */

// ✅ SEO FIRST
router.get("/by-slug/:subtopicSlug", getContentBySlug);

// ✅ RELATED CONTENT
router.get("/related/:contentId", getRelatedContent);

// ✅ SINGLE CONTENT
router.get("/single/:contentId", getSingleContent);

// ✅ OLD ID-BASED CONTENT (LAST)
router.get("/list/:subtopicId", getContentBySubtopicId);
router.get("/:subtopicId", getContentBySubtopicId);

module.exports = router;
