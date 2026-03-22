import nodemailer from "nodemailer";
import { EMAIL_APP_PASS, EMAIL_USER } from "../../../../config/config.service.js";

export const sendEmail= async({
  to,
  cc,
  bcc,
  subject,
attachments={},
  html,
}={})=>{

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:EMAIL_USER, 
    pass:EMAIL_APP_PASS, 
  },
});

// Send an email using async/await

  const info = transporter.sendMail({
    from: `"Saraha App By Mokhtar Mohammed" <${EMAIL_USER}>`,
    to,
  cc,
  bcc,
  subject,
attachments,
  html,
  });

  console.log("Message sent:", info.messageId);


}