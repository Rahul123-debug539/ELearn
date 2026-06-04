const Category = require("../models/Category");
const Topic = require("../models/Topic");
const Subtopic = require("../models/Subtopic");

exports.generateSitemap = async (req, res) => {
  try {
    const categories = await Category.find();
    const topics = await Topic.find();
    const subtopics = await Subtopic.find();

    let urls = `
      <url>
        <loc>https://www.csmentor.in/</loc>
      </url>

      <url>
        <loc>https://www.csmentor.in/about</loc>
      </url>

      <url>
        <loc>https://www.csmentor.in/contact</loc>
      </url>

      <url>
        <loc>https://www.csmentor.in/courses</loc>
      </url>
    `;

    for (const subtopic of subtopics) {
      const topic = topics.find(
        (t) => t._id.toString() === subtopic.topicId.toString()
      );

      if (!topic) continue;

      const category = categories.find(
        (c) => c._id.toString() === topic.categoryId.toString()
      );

      if (!category) continue;

      urls += `
        <url>
          <loc>
            https://www.csmentor.in/${category.slug}/${topic.slug}/${subtopic.slug}
          </loc>
        </url>
      `;
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>
    `;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);

  } catch (error) {
    console.error(error);
    res.status(500).send("Sitemap Error");
  }
};