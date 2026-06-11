const mongoose = require("mongoose");
const PendingArticle = require("../models/PendingArticle");
const Content = require("../models/Content");

exports.createPendingArticle = async (req, res) => {
  try {
    const {
      subtopicId,
      title,
      fullContent,
      videoUrl = ""
    } = req.body;

    if (!subtopicId || !title || !fullContent) {
      return res.status(400).json({
        status: false,
        message: "All fields are required"
      });
    }

    if (!mongoose.isValidObjectId(subtopicId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid Subtopic ID"
      });
    }

    const files = req.files || {};

    const images =
      (files.images || []).map(
        (file) => file.path
      );

    const article =
      await PendingArticle.create({
        userId: req.user.id,

        subtopicId,

        title,

        fullContent,

        images,

        videoUrl
      });

    res.status(201).json({
      status: true,
      message:
        "Article submitted successfully",
      article
    });

  } catch (error) {
    console.error(
      "CREATE ARTICLE ERROR:",
      error
    );

    res.status(500).json({
      status: false,
      message: "Server Error"
    });
  }
};


exports.getMyArticles = async (req, res) => {
  try {
    const articles =
      await PendingArticle.find({
        userId: req.user.id
      })
      .populate("subtopicId", "name")
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      articles
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: false,
      message: "Server Error"
    });
  }
};


exports.getAllPendingArticles = async (req, res) => {
  try {

    const articles =
      await PendingArticle.find({
        status: "pending"
      })
      .populate("userId", "name email")
      .populate("subtopicId", "name")
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      articles
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      status: false,
      message: "Server Error"
    });
  }
};


exports.approveArticle = async (req, res) => {

  try {

    const article =
      await PendingArticle.findById(
        req.params.id
      );

    if (!article) {
      return res.status(404).json({
        status:false,
        message:"Article not found"
      });
    }

    const existingContent =
      await Content.findOne({
        subtopicId:
        article.subtopicId
      });

    if (!existingContent) {

      return res.status(404).json({
        status:false,
        message:
        "Live content not found"
      });
    }

    existingContent.title =
      article.title;

    existingContent.fullContent =
      article.fullContent;

    existingContent.images =
      article.images;

    existingContent.videoUrl =
      article.videoUrl;

    await existingContent.save();

    await PendingArticle
      .findByIdAndDelete(
        article._id
      );

    res.json({
      status:true,
      message:
      "Content updated successfully"
    });

  } catch(error){

    console.error(error);

    res.status(500).json({
      status:false,
      message:"Server Error"
    });
  }
};


exports.getReviewArticle = async (req, res) => {
  try {

    const article =
      await PendingArticle.findById(
        req.params.id
      )
      .populate("userId", "name email")
      .populate("subtopicId", "name");

    if (!article) {
      return res.status(404).json({
        status: false,
        message: "Article not found"
      });
    }

    const existingContent =
      await Content.find({
        subtopicId:
        article.subtopicId._id
      });

    res.json({
      status: true,
      article,
      existingContent
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      status: false,
      message: "Server Error"
    });
  }
};


exports.getRejectedArticles = async (req, res) => {
  try {

    const articles =
      await PendingArticle.find({
        userId: req.user.id,
        status: "rejected"
      })
      .populate("subtopicId", "name")
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      articles
    });

  } catch (error) {

    console.error(
      "GET REJECTED ARTICLES ERROR:",
      error
    );

    res.status(500).json({
      status: false,
      message: "Server Error"
    });
  }
};

exports.rejectArticle = async (req, res) => {
  try {

    const { remark } = req.body;

    const article =
      await PendingArticle.findByIdAndUpdate(
        req.params.id,
        {
          status: "rejected",
          adminRemark:
            remark || "Rejected by admin"
        },
        { new: true }
      );

    if (!article) {
      return res.status(404).json({
        status: false,
        message: "Article not found"
      });
    }

    res.json({
      status: true,
      message: "Article rejected"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      status: false,
      message: "Server Error"
    });
  }
};