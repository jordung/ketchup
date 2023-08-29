const nodemailer = require("nodemailer");

// create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

module.exports = transporter;
