// routes/contentRoutes.js
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const Content = require("../models/Content");

const {
  addContent,
  getContent,
  getSingleContent,
  updateContent,
  deleteContent
} = require("../controllers/contentController");

const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");


/* =====================================================
    ADMIN ROUTES (STATIC ROUTES FIRST)
===================================================== */

// ADD CONTENT
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

// UPDATE CONTENT
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

// DELETE CONTENT
router.delete(
  "/delete/:contentId/:subtopicId",
  verifyToken,
  isAdmin,
  deleteContent
);


/* =====================================================
    PUBLIC STATIC ROUTES (KEEP ABOVE DYNAMIC ROUTES)
===================================================== */

// GET DEFAULT CONTENT BY CATEGORY
router.get("/category/:categoryId", async (req, res) => {
  try {
    const content = await Content.findOne({
      categoryId: req.params.categoryId,
      isDefault: true
    });

    if (!content)
      return res.json({ status: false, message: "No default content" });

    res.json({ status: true, content });
  } catch (err) {
    res.status(500).json({ status: false });
  }
});

// GET CONTENT DETAIL BY CONTENT ID
router.get("/detail/:contentId", async (req, res) => {
  try {
    const c = await Content.findById(req.params.contentId);
    res.json({ status: true, content: c });
  } catch {
    res.status(500).json({ status: false });
  }
});

// ⭐ GET SINGLE CONTENT FOR EDIT PAGE
router.get("/single/:contentId", getSingleContent);


/* =====================================================
    DYNAMIC ROUTE (KEEP LAST)
===================================================== */

// GET ALL CONTENT OF SUBTOPIC (DYNAMIC ROUTE)
router.get("/:subtopicId", getContent);


module.exports = router;
