const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.BREVO_SMTP_KEY,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("❌ BREVO SMTP ERROR:", err);
  } else {
    console.log("✅ BREVO SMTP READY");
  }
});


module.exports = transporter;
