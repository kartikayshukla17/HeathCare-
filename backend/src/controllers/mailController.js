import { createTransport } from "nodemailer";
import { config } from "dotenv";
config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("email sent: " + info.response);
  } catch (error) {
    console.log("error sending email:", error);
  }
};

export default sendMail;
