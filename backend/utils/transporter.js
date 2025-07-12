import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { emailTemplate } from "./emailTemplate.js";
import handlebars from "handlebars";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async ({ to, subject, templateData }) => {
  const template = handlebars.compile(emailTemplate);
  const compiledHtml = template(templateData);
  const mailOptions = {
    from: `"StackIt Support" <${process.env.MAIL_USERNAME}>`,
    to,
    subject,
    html: compiledHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.response}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
};
