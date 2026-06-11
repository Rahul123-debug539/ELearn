const express = require("express");
const router = express.Router();
const { isAdmin } =
require("../middleware/isAdmin");

const upload =
require("../middleware/upload");

const {
  verifyToken
} = require("../middleware/verifyToken");



const {
  createPendingArticle,
  getMyArticles,
  getAllPendingArticles,
  getReviewArticle,
  approveArticle,
  rejectArticle,
  getRejectedArticles
} = require(
 "../controllers/pendingArticleController"
);

router.post(
  "/create",

  verifyToken,

  upload.fields([
    {
      name: "images",
      maxCount: 10
    }
  ]),

  createPendingArticle
);

router.get(
  "/my-articles",
  verifyToken,
  getMyArticles
);


router.get(
  "/all",
  verifyToken,
  isAdmin,
  getAllPendingArticles
);


router.get(
  "/review/:id",
  verifyToken,
  isAdmin,
  getReviewArticle
);

router.patch(
  "/approve/:id",
  verifyToken,
  isAdmin,
  approveArticle
);

router.patch(
  "/reject/:id",
  verifyToken,
  isAdmin,
  rejectArticle
);

router.get(
  "/rejected",
  verifyToken,
  getRejectedArticles
);

module.exports = router;