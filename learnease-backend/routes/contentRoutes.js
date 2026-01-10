// routes/contentRoutes.js
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");

const {
  addContent,
  updateContent,
  deleteContent,
  getContent,
  getSingleContent,
  getRelatedContent
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
   PUBLIC ROUTES
============================= */

// ✅ GET SINGLE CONTENT (FOR VIEW PAGE & EDIT PAGE)
router.get("/single/:contentId", getSingleContent);

// ✅ GET CONTENT LIST BY SUBTOPIC
router.get("/list/:subtopicId", getContent);

// ✅ BACKWARD COMPATIBILITY (IF OLD FRONTEND CALLS EXIST)
router.get("/:subtopicId", getContent);
router.get("/related/:contentId", getRelatedContent);


module.exports = router;
