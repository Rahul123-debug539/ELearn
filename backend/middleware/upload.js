// middleware/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Cloudinary Config (THIS IS THE REAL FIX)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Single storage for all images (content + ad)
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "elearn/content";

    if (file.fieldname === "adImage") {
      folder = "elearn/ads";
    }

    return {
      folder: folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    };
  },
});

// Multer uploader
const upload = multer({ storage });

module.exports = upload;
