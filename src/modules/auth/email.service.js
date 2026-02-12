import nodemailer from "nodemailer";
import { EMAIL_APP_PASS, EMAIL_USER } from "../../../config/config.service.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:EMAIL_USER, 
    pass:EMAIL_APP_PASS, 
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: `"Saraha App By Mokhtar Mohammed" <${EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};
