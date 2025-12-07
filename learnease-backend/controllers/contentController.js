// controllers/contentController.js
const mongoose = require("mongoose");
const Content = require("../models/Content");

/* --------------------------------------------------
   Convert YouTube URL → Embed URL
-------------------------------------------------- */
function toYouTubeEmbed(url = "") {
  if (!url) return "";
  try {
    url = url.trim();

    if (url.includes("youtube.com/embed")) return url;

    // youtu.be short link
    const short = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
    if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`;

    // youtube.com/watch?v=
    const long = url.match(/[?&]v=([A-Za-z0-9_-]{11})/);
    if (long?.[1]) return `https://www.youtube.com/embed/${long[1]}`;

    // last segment as ID
    const last = url.split("/").pop();
    if (last?.length === 11) return `https://www.youtube.com/embed/${last}`;

    return "";
  } catch {
    return "";
  }
}


/* --------------------------------------------------
   ADD CONTENT  (ADMIN)
-------------------------------------------------- */
exports.addContent = async (req, res) => {
  try {
    let {
      subtopicId,
      title,
      fullContent,   // WYSIWYG HTML CONTENT
      code = "",
      notes = "",
      examples = "",
      adSection = "",
      videoUrl = ""
    } = req.body;

    // VALIDATION (NEW)
    if (!subtopicId || !title || !fullContent) {
      return res.status(400).json({
        status: false,
        message: "Subtopic, title and full content required"
      });
    }

    if (!mongoose.isValidObjectId(subtopicId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid subtopicId"
      });
    }

    const files = req.files || {};

    const images = (files.images || []).map(f => f.path);
    const adImage = files.adImage?.[0]?.path || "";

    const embedVideo = toYouTubeEmbed(videoUrl);

    const created = await Content.create({
      subtopicId,
      title,
      fullContent, // save HTML
      code,
      notes,
      examples,
      adSection,
      adImage,
      images,
      videoUrl: embedVideo
    });

    const list = await Content.find({ subtopicId }).sort({ createdAt: 1 });

    res.json({
      status: true,
      message: "Content added successfully",
      content: list
    });

  } catch (err) {
    console.error("ADD CONTENT ERROR:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};



/* --------------------------------------------------
   GET ALL CONTENT OF SUBTOPIC  
-------------------------------------------------- */
exports.getContent = async (req, res) => {
  try {
    const { subtopicId } = req.params;

    if (!mongoose.isValidObjectId(subtopicId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid subtopicId"
      });
    }

    const content = await Content.find({ subtopicId })
      .sort({ createdAt: 1 });

    res.json({ status: true, content });

  } catch (err) {
    console.error("GET CONTENT ERROR:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};



/* --------------------------------------------------
   UPDATE CONTENT (ADMIN)
-------------------------------------------------- */
exports.updateContent = async (req, res) => {
  try {
    const { contentId } = req.params;

    if (!mongoose.isValidObjectId(contentId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid contentId"
      });
    }

    let updates = req.body || {};
    const files = req.files || {};

    // update images
    if (files.images?.length > 0) {
      updates.images = files.images.map(f => f.path);
    }

    // update adImage
    if (files.adImage?.[0]) {
      updates.adImage = files.adImage[0].path;
    }

    // convert new YouTube link
    if (updates.videoUrl) {
      updates.videoUrl = toYouTubeEmbed(updates.videoUrl);
    }

    const updated = await Content.findByIdAndUpdate(contentId, updates, {
      new: true
    });

    res.json({
      status: true,
      message: "Content updated",
      content: updated
    });

  } catch (err) {
    console.error("UPDATE CONTENT ERROR:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};



/* --------------------------------------------------
   DELETE CONTENT (ADMIN)
-------------------------------------------------- */
exports.deleteContent = async (req, res) => {
  try {
    const { contentId, subtopicId } = req.params;

    if (!mongoose.isValidObjectId(contentId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid contentId"
      });
    }

    await Content.findByIdAndDelete(contentId);

    const updatedList = await Content.find({ subtopicId })
      .sort({ createdAt: 1 });

    res.json({
      status: true,
      message: "Content deleted",
      content: updatedList
    });

  } catch (err) {
    console.error("DELETE CONTENT ERROR:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* --------------------------------------------------
   GET SINGLE CONTENT (FOR EDIT PAGE)
-------------------------------------------------- */
exports.getSingleContent = async (req, res) => {
  try {
    const { contentId } = req.params;

    if (!mongoose.isValidObjectId(contentId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid contentId"
      });
    }

    const content = await Content.findById(contentId);

    if (!content) {
      return res.status(404).json({
        status: false,
        message: "Content not found"
      });
    }

    res.json({
      status: true,
      content
    });

  } catch (err) {
    console.error("GET SINGLE CONTENT ERROR:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

exports.getSingleContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ status: false, message: "Content not found" });
    }

    res.json({ status: true, content });
  } catch (err) {
    console.log("Single content error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};


