const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

router.post("/editor-image", upload.single("image"), async (req, res) => {
  try {
    return res.json({
      status: true,
      url: req.file.path
    });
  } catch (err) {
    console.error("Editor upload error:", err);
    res.status(500).json({ status: false, message: "Upload failed" });
  }
});

module.exports = router;
