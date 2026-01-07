const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateOTP = require("../utils/generateOTP");
const resend = require("../config/mail");

/* ======================================================
   REGISTER
====================================================== */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ status: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({
      status: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Register error:", err);
    next(err);
  }
};

/* ======================================================
   LOGIN
====================================================== */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      status: true,
      message: "Login successful",
      token,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

/* ======================================================
   FORGOT PASSWORD – SEND OTP (REAL EMAIL)
====================================================== */
exports.forgotPassword = async (req, res, next) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email is required",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const otp = generateOTP();

    user.resetOTP = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // 🔥 SEND REAL EMAIL USING RESEND (NO SMTP)
    const response = await resend.emails.send({
      from: "CSMentor <support@csmentor.in>",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}`,
    });

    console.log("RESEND RESPONSE:", response);
    res.json({
      status: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    next(err);
  }
};

/* ======================================================
   RESET PASSWORD
====================================================== */
exports.resetPassword = async (req, res, next) => {
  try {
    let { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({
      email,
      resetOTP: otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid or expired OTP",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = null;
    user.otpExpiry = null;
    await user.save();

    res.json({
      status: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    next(err);
  }
};
