const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================================================
//  NORMAL USER REGISTRATION (PUBLIC)
// =======================================================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("🔥 REGISTER API HIT — Body:", req.body);

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ status: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role: "user", // default role
    });

    res.json({ status: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
});


// =======================================================
//  LOGIN (USER + ADMIN)
// =======================================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ status: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: false, message: "Incorrect password" });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      status: true,
      message: "Login successful",
      token,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
});


// =======================================================
//  SECURE ADMIN REGISTRATION (PRIVATE)
// =======================================================
// This route REQUIRE ADMIN SECRET KEY from .env file
// Only person with the key can create admin accounts
// =======================================================
router.post("/admin-register", async (req, res) => {
  try {
    const { key, name, email, password } = req.body;

    // 1) Check secret access key
    if (key !== process.env.ADMIN_SECRET) {
      return res
        .status(403)
        .json({ status: false, message: "Invalid Admin Secret Key!" });
    }

    // 2) Check empty fields
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });

    // 3) Check if email exists
    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ status: false, message: "Admin email already exists!" });

    // 4) Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 5) Create admin
    await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
    });

    res.json({
      status: true,
      message: "Admin created successfully!",
    });
  } catch (err) {
    console.error("Admin Register Error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
});


// =======================================================
module.exports = router;
