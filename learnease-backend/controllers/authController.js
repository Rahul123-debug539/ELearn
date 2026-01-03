const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateOTP = require("../utils/generateOTP");


// REGISTER
exports.register = async (req, res) => {
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

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role: role || "user"
    });

    res.status(201).json({
      status: true,
      message: "User registered successfully"
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ status: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: false, message: "Incorrect password" });

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
      name: user.name
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

/* FORGOT PASSWORD */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = generateOTP();

  user.resetOTP = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save();

  await transporter.sendMail({
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}`,
  });

  res.json({ message: "OTP sent to email" });
};

/* RESET PASSWORD */
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email, resetOTP: otp });
  if (!user || user.otpExpiry < Date.now())
    return res.status(400).json({ message: "Invalid or expired OTP" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOTP = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ message: "Password updated successfully" });
};
