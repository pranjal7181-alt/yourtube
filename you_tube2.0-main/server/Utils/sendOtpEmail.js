import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, name, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "YourTube Login Verification OTP",
    html: `
      <h2>Hello ${name},</h2>

      <p>Your One-Time Password (OTP) for login is:</p>

      <h1 style="letter-spacing:5px;">${otp}</h1>

      <p>This OTP is valid for <b>5 minutes</b>.</p>

      <p>If you did not attempt to log in, please ignore this email.</p>

      <br>

      <p>Regards,</p>
      <h3>YourTube Team</h3>
    `,
  };

  await transporter.sendMail(mailOptions);
};
