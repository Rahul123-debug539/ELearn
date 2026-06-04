const Category = require("../models/Category");
const Topic = require("../models/Topic");
const Subtopic = require("../models/Subtopic");

exports.generateSitemap = async (req, res) => {
  try {
    const baseUrl = "https://www.csmentor.in";

    let urls = [];

    /* ======================
       STATIC PAGES
    ====================== */
    urls.push(
      `${baseUrl}/`,
      `${baseUrl}/courses`,
      `${baseUrl}/about`,
      `${baseUrl}/contact`
    );

    /* ======================
       CATEGORIES
    ====================== */
    const categories = await Category.find({}, "slug");
    categories.forEach(cat => {
      urls.push(`${baseUrl}/${cat.slug}`);
    });

    /* ======================
       TOPICS
    ====================== */
    const topics = await Topic.find({}, "slug categoryId").populate(
      "categoryId",
      "slug"
    );

    topics.forEach(topic => {
      if (topic.categoryId?.slug) {
        urls.push(
          `${baseUrl}/${topic.categoryId.slug}/${topic.slug}`
        );
      }
    });

    /* ======================
       SUBTOPICS (LESSONS)
    ====================== */
    const subtopics = await Subtopic.find({}, "slug topicId").populate({
      path: "topicId",
      select: "slug categoryId",
      populate: {
        path: "categoryId",
        select: "slug"
      }
    });

    subtopics.forEach(sub => {
      if (
        sub.topicId?.slug &&
        sub.topicId?.categoryId?.slug
      ) {
        urls.push(
          `${baseUrl}/${sub.topicId.categoryId.slug}/${sub.topicId.slug}/${sub.slug}`
        );
      }
    });

    /* ======================
       XML RESPONSE
    ====================== */
    res.setHeader("Content-Type", "application/xml");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    url => `
  <url>
    <loc>${url}</loc>
  </url>`
  )
  .join("")}
</urlset>`;

    res.send(xml);

  } catch (err) {
    console.error("SITEMAP ERROR:", err);
    res.status(500).send("Error generating sitemap");
  }
};
