const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

const searchRoutes = require("./routes/searchRoutes");
const editorUploadRoutes = require("./routes/editorUploadRoutes");
const sitemapRoutes = require("./routes/sitemapRoutes"); 
const pendingArticleRoutes = require("./routes/pendingArticleRoutes");

dotenv.config();
const app = express();

/* =======================
   DB CONNECT
======================= */
connectDB();

/* =======================
   CORS CONFIG
======================= */
const corsOptions = {
  origin: [
    "https://www.csmentor.in",
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* =======================
   BODY PARSER
======================= */
app.use(express.json({ limit: "10mb" }));

/* =======================
   STATIC FILES
======================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =======================
   SEO HEADERS (IMPORTANT)
======================= */
app.use((req, res, next) => {
  res.setHeader("X-Robots-Tag", "index, follow");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

/* =======================
   ROUTES
======================= */
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const topicRoutes = require("./routes/topicRoutes");
const subtopicRoutes = require("./routes/subtopicRoutes");
const contentRoutes = require("./routes/contentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/subtopics", subtopicRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/upload", editorUploadRoutes);
app.use("/api/pending-article",pendingArticleRoutes);

/* =======================
   🔥 SEO ROUTES
======================= */

// ✅ Dynamic Sitemap
app.use("/", sitemapRoutes);

// ✅ Robots.txt
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(
`User-agent: *
Allow: /

Sitemap: https://www.csmentor.in/sitemap.xml`
  );
});

/* =======================
   🔁 301 REDIRECTS (OLD ID URL → NEW SLUG)
======================= */

// Old category URL
app.get("/category/:id", (req, res) => {
  res.redirect(301, "https://www.csmentor.in");
});

// Old content URL
app.get("/content/:id", (req, res) => {
  res.redirect(301, "https://www.csmentor.in");
});

/* =======================
   HEALTH CHECK
======================= */
app.get("/ping", (req, res) => {
  res.send("pong");
});

/* =======================
   ROOT
======================= */
app.get("/", (req, res) => {
  res.send("CsMentor Backend API is running...");
});

/* =======================
   404 HANDLER
======================= */
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "API Route Not Found",
  });
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  res.status(500).json({
    status: false,
    message: err.message || "Internal Server Error",
  });
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
