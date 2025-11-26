const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const {
  addContent,
  getContent,
  updateContent,
  deleteContent
} = require("../controllers/contentController");

const { verifyToken } = require("../middleware/verifyToken");
const { isAdmin } = require("../middleware/isAdmin");

// Admin-only
router.post("/add", verifyToken, isAdmin, upload.array("images", 10), addContent);
router.put("/:subtopicId", verifyToken, isAdmin, upload.array("images", 10), updateContent);
router.delete("/:subtopicId", verifyToken, isAdmin, deleteContent);

// Public
router.get("/:subtopicId", getContent);

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


module.exports = router;
