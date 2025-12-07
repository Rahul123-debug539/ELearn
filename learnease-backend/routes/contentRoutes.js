// routes/contentRoutes.js
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");

const Content = require("../models/Content");
const {
  addContent,
  updateContent,
  deleteContent,
  getContent,
  getSingleContent
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

// ⭐ GET CONTENT DETAIL BY ID (for view page)
router.get("/detail/:contentId", async (req, res) => {
  try {
    const content = await Content.findById(req.params.contentId);

    if (!content) {
      return res.status(404).json({ status: false, message: "Content not found" });
    }

    res.json({ status: true, content });
  } catch {
    res.status(500).json({ status: false });
  }
});

// ⭐ GET LIST OF CONTENT BY SUBTOPIC
router.get("/list/:subtopicId", async (req, res) => {
  try {
    const list = await Content.find({ subtopicId: req.params.subtopicId })
      .sort({ order: 1 });

    res.json({ status: true, list });
  } catch {
    res.status(500).json({ status: false });
  }
});

// LAST ROUTE – FOR SAFETY
router.get("/:subtopicId", getContent);

router.get("/single/:id", getSingleContent);


module.exports = router;
