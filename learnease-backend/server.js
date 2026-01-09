const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const searchRoutes = require("./routes/searchRoutes");
const editorUploadRoutes = require("./routes/editorUploadRoutes");

dotenv.config();

const app = express();

// =======================
// DB CONNECT
// =======================
connectDB();

// =======================
// CORS CONFIG (FIRST)
// =======================
const corsOptions = {
  origin: [
    "https://www.csmentor.in",
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// =======================
// BODY PARSER
// =======================
app.use(express.json());

// =======================
// STATIC FILES
// =======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =======================
// ROUTES
// =======================
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

// =======================
// HEALTH CHECK
// =======================
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/", (req, res) => {
  res.send("LearnEase Backend API is running...");
});

// =======================
// 404 HANDLER
// =======================
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: "API Route Not Found",
  });
});

// =======================
// GLOBAL ERROR HANDLER (LAST)
// =======================
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  res.header(
    "Access-Control-Allow-Origin",
    "https://e-learn-mocha.vercel.app"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  res.status(500).json({
    status: false,
    message: err.message || "Internal Server Error",
  });
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
